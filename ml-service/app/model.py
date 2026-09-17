from __future__ import annotations

import numpy as np
from scipy.stats import rankdata
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.inspection import permutation_importance as sk_perm_importance

from .features import FEATURE_COLS, prepare_training_data
from .schemas import CheckInPayload, Pattern, Prediction, PredictResponse, Quality

TRAIN_GATE = 14
N_BOOTSTRAP = 25
BOOTSTRAP_MIN_AGREE = 0.60  # direction must hold in 60%+ of resamples
DEGENERATE_STD_FLOOR = 0.10  # combined mood+energy pred std below this = degenerate

GBR_PARAMS = dict(
    n_estimators=150,
    max_depth=2,
    learning_rate=0.05,
    subsample=0.8,
    random_state=42,
)


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _dynamic_threshold(n_checkins: int) -> float:
    """Amendment E: tighter threshold on small N to reduce false patterns."""
    if n_checkins < 20:
        return 0.35
    if n_checkins < 35:
        return 0.30
    return 0.25


def _weighted_spearman(x: np.ndarray, y: np.ndarray, w: np.ndarray) -> float:
    """Weighted Spearman via weighted Pearson on integer ranks."""
    rx = rankdata(x).astype(float)
    ry = rankdata(y).astype(float)
    w_norm = w / w.sum()
    mx = float(np.average(rx, weights=w_norm))
    my = float(np.average(ry, weights=w_norm))
    cov = float(np.sum(w_norm * (rx - mx) * (ry - my)))
    sx = float(np.sqrt(np.sum(w_norm * (rx - mx) ** 2)))
    sy = float(np.sqrt(np.sum(w_norm * (ry - my) ** 2)))
    if sx < 1e-9 or sy < 1e-9:
        return 0.0
    return float(np.clip(cov / (sx * sy), -1.0, 1.0))


def _bootstrap_direction_stable(
    X: np.ndarray,
    y: np.ndarray,
    w: np.ndarray,
    col: int,
    expected_sign: float,
) -> bool:
    """
    Amendment D / sanity gate 3.
    Returns True if the correlation sign is consistent across N_BOOTSTRAP resamples.
    Prevents surfacing patterns that only appear due to a handful of data points.
    """
    rng = np.random.RandomState(42)
    n = len(y)
    agreements = 0
    for _ in range(N_BOOTSTRAP):
        idx = rng.choice(n, size=n, replace=True)
        c = _weighted_spearman(X[idx, col], y[idx], w[idx])
        if np.sign(c) == np.sign(expected_sign):
            agreements += 1
    return (agreements / N_BOOTSTRAP) >= BOOTSTRAP_MIN_AGREE


def _manual_cv_r2(X: np.ndarray, y: np.ndarray, w: np.ndarray) -> float:
    """
    Manual k-fold cross-validated R² with sample weights.
    k = min(3, n//4), floor of 2. Avoids sklearn fit_params deprecation warnings.
    Returns 0 when folds are too small to be meaningful.
    """
    n = len(y)
    k = max(2, min(3, n // 4))
    if k < 2 or n < k * 2:
        return 0.0

    indices = np.arange(n)
    folds = np.array_split(indices, k)
    r2_scores: list[float] = []

    for i in range(k):
        val_idx = folds[i]
        train_idx = np.concatenate([folds[j] for j in range(k) if j != i])
        if len(train_idx) < 3:
            continue

        m = GradientBoostingRegressor(**GBR_PARAMS)
        m.fit(X[train_idx], y[train_idx], sample_weight=w[train_idx])

        y_pred = m.predict(X[val_idx])
        y_true = y[val_idx]
        ss_res = float(np.sum((y_true - y_pred) ** 2))
        ss_tot = float(np.sum((y_true - float(y_true.mean())) ** 2))

        if ss_tot < 1e-10:
            r2_scores.append(0.0)
        else:
            r2_scores.append(1.0 - ss_res / ss_tot)

    return float(np.mean(r2_scores)) if r2_scores else 0.0


def _composite_confidence(
    n_checkins: int,
    cv_r2_mood: float,
    cv_r2_energy: float,
    pred_combined_std: float,
) -> float:
    """
    Amendment B: internal 0–1 float.
    Backend maps to wording: <0.3 hide, 0.3–0.6 'there might be', 0.6–1 'worth noticing'.
    Composed from three signals, each 0–1:
      - sample count   (40%): ramps from 0 at gate to 1 at 50+ check-ins
      - CV stability   (40%): mean of clipped cross-val R² for both targets
      - output quality (20%): 1 if predictions are non-degenerate
    """
    sample_score = min(1.0, max(0.0, (n_checkins - TRAIN_GATE) / 36.0))
    cv_score = min(1.0, max(0.0, (cv_r2_mood + cv_r2_energy) / 2.0))
    var_score = 1.0 if pred_combined_std >= DEGENERATE_STD_FLOOR else 0.0
    raw = 0.4 * sample_score + 0.4 * cv_score + 0.2 * var_score
    return round(float(raw), 4)


def _extract_patterns(
    X: np.ndarray,
    y_mood: np.ndarray,
    y_energy: np.ndarray,
    weights: np.ndarray,
    mood_model: GradientBoostingRegressor,
    energy_model: GradientBoostingRegressor,
    n_checkins: int,
) -> list[Pattern]:
    threshold = _dynamic_threshold(n_checkins)

    # Permutation importance — tells us which features genuinely help the model
    perm_mood = sk_perm_importance(mood_model, X, y_mood, n_repeats=10, random_state=42)
    perm_energy = sk_perm_importance(energy_model, X, y_energy, n_repeats=10, random_state=42)

    patterns: list[Pattern] = []

    for i, feature in enumerate(FEATURE_COLS):
        for target, y_target, perm in [
            ("mood", y_mood, perm_mood),
            ("energy", y_energy, perm_energy),
        ]:
            corr = _weighted_spearman(X[:, i], y_target, weights)

            # Gate 1: correlation below dynamic threshold
            if abs(corr) < threshold:
                continue

            # Gate 2: permutation importance ≤ 0 means feature hurts or is noise
            if perm.importances_mean[i] <= 0:
                continue

            # Gate 3 (sanity gate): direction unstable across bootstrap resamples
            if not _bootstrap_direction_stable(X, y_target, weights, i, corr):
                continue

            patterns.append(Pattern(
                feature=feature,
                target=target,  # type: ignore[arg-type]
                direction="positive" if corr > 0 else "negative",
                strength=round(abs(corr), 4),
            ))

    # Strongest patterns first
    patterns.sort(key=lambda p: p.strength, reverse=True)
    return patterns


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def train_and_predict(checkins: list[CheckInPayload]) -> PredictResponse:
    """
    Full pipeline: feature extraction → training → prediction → patterns.
    Returns a safe PredictResponse at every exit — never raises.
    """
    n_checkins = len(checkins)
    X, y_mood, y_energy, weights = prepare_training_data(checkins)
    n_pairs = len(y_mood)

    # Train gate (Amendment G / plan)
    if n_checkins < TRAIN_GATE or n_pairs < 3:
        return PredictResponse(trained=False, n_samples=n_checkins)

    mood_model = GradientBoostingRegressor(**GBR_PARAMS)
    energy_model = GradientBoostingRegressor(**GBR_PARAMS)
    mood_model.fit(X, y_mood, sample_weight=weights)
    energy_model.fit(X, y_energy, sample_weight=weights)

    cv_r2_mood = _manual_cv_r2(X, y_mood, weights)
    cv_r2_energy = _manual_cv_r2(X, y_energy, weights)

    # Sanity gate 1: CV R² below zero — model worse than predicting the mean
    if cv_r2_mood < 0 or cv_r2_energy < 0:
        return PredictResponse(
            trained=True,
            n_samples=n_checkins,
            prediction=None,
            quality=Quality(
                mood_r2=round(cv_r2_mood, 4),
                energy_r2=round(cv_r2_energy, 4),
            ),
        )

    # Predict using the most recent day's features (→ tomorrow)
    last_features = X[-1:, :]
    pred_mood = float(np.clip(mood_model.predict(last_features)[0], 1.0, 6.0))
    pred_energy = float(np.clip(energy_model.predict(last_features)[0], 1.0, 6.0))

    # Sanity gate 2: degenerate prediction variance (model outputs near-identical values)
    all_mood_preds = mood_model.predict(X)
    all_energy_preds = energy_model.predict(X)
    combined_std = float(np.std(all_mood_preds) + np.std(all_energy_preds))
    if combined_std < DEGENERATE_STD_FLOOR:
        return PredictResponse(
            trained=True,
            n_samples=n_checkins,
            prediction=None,
            quality=Quality(
                mood_r2=round(cv_r2_mood, 4),
                energy_r2=round(cv_r2_energy, 4),
            ),
        )

    confidence = _composite_confidence(n_checkins, cv_r2_mood, cv_r2_energy, combined_std)

    patterns = _extract_patterns(
        X, y_mood, y_energy, weights,
        mood_model, energy_model,
        n_checkins,
    )

    return PredictResponse(
        trained=True,
        n_samples=n_checkins,
        prediction=Prediction(
            mood=round(pred_mood, 4),
            energy=round(pred_energy, 4),
            horizon="next_day",
            confidence=confidence,
        ),
        patterns=patterns,
        quality=Quality(
            mood_r2=round(cv_r2_mood, 4),
            energy_r2=round(cv_r2_energy, 4),
        ),
    )
