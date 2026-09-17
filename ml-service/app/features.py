from __future__ import annotations

import numpy as np
import pandas as pd

from .schemas import CheckInPayload

FEATURE_COLS = [
    "sleep_hours",
    "water_glasses",
    "sunlight_minutes",
    "stress_level",
    "food_group_count",
    "symptom_count",
]

TARGET_MOOD = "mood_score"
TARGET_ENERGY = "energy_level"

# Recency decay: sample 45 days old has half the weight of today's sample.
# 45-day half-life keeps ~3 months of history meaningfully weighted without
# hard-cutting older data that may still carry signal on small N.
RECENCY_HALF_LIFE_DAYS = 45


def build_pairs(checkins: list[CheckInPayload]) -> pd.DataFrame:
    """
    Supervised pairs: features(day t) → targets(day t+1).
    Only consecutive calendar days are paired — gaps are skipped so a
    missed check-in never creates a misleading feature→target link.
    Returns DataFrame with FEATURE_COLS + mood_target, energy_target, date_t.
    """
    if len(checkins) < 2:
        return pd.DataFrame()

    rows = [c.model_dump() for c in checkins]
    df = pd.DataFrame(rows)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date").reset_index(drop=True)

    pairs: list[dict] = []
    for i in range(len(df) - 1):
        t = df.iloc[i]
        t1 = df.iloc[i + 1]

        # Require strictly consecutive calendar days
        if (t1["date"] - t["date"]).days != 1:
            continue

        # Require both targets present on day t+1
        if pd.isna(t1[TARGET_MOOD]) or pd.isna(t1[TARGET_ENERGY]):
            continue

        pair: dict = {col: t[col] for col in FEATURE_COLS}
        pair["mood_target"] = float(t1[TARGET_MOOD])
        pair["energy_target"] = float(t1[TARGET_ENERGY])
        pair["date_t"] = t["date"]
        pairs.append(pair)

    return pd.DataFrame(pairs)


def impute_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Median imputation per feature column.
    Falls back to 0 when the entire column is null (can't compute median).
    Operates on a copy — does not mutate the input.
    """
    df = df.copy()
    for col in FEATURE_COLS:
        if col not in df.columns:
            continue
        non_null = df[col].dropna()
        fill = float(non_null.median()) if len(non_null) > 0 else 0.0
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(fill)
    return df


def compute_recency_weights(dates: pd.Series) -> np.ndarray:
    """
    Exponential decay: weight = 2^(-age_days / HALF_LIFE).
    Normalized so weights.mean() == 1 — keeps the GBR loss scale stable
    regardless of how many samples exist.
    """
    most_recent = dates.max()
    age_days = (most_recent - dates).dt.days.astype(float)
    weights = np.power(2.0, -age_days / RECENCY_HALF_LIFE_DAYS)
    weights = weights / weights.mean()
    return weights.to_numpy()


def prepare_training_data(
    checkins: list[CheckInPayload],
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """
    Full pipeline: build pairs → impute → extract arrays.
    Returns (X, y_mood, y_energy, sample_weights).
    Returns four empty arrays when there are too few consecutive pairs.
    """
    pairs = build_pairs(checkins)
    if pairs.empty:
        empty: np.ndarray = np.array([])
        return empty, empty, empty, empty

    pairs = impute_features(pairs)

    X = pairs[FEATURE_COLS].to_numpy(dtype=float)
    y_mood = pairs["mood_target"].to_numpy(dtype=float)
    y_energy = pairs["energy_target"].to_numpy(dtype=float)
    weights = compute_recency_weights(pairs["date_t"])

    return X, y_mood, y_energy, weights
