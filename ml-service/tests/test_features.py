from __future__ import annotations

from datetime import date, timedelta

import numpy as np
import pandas as pd
import pytest

from app.features import (
    FEATURE_COLS,
    build_pairs,
    compute_recency_weights,
    impute_features,
    prepare_training_data,
)
from app.schemas import CheckInPayload

from .conftest import consecutive_checkins, make_checkin


class TestBuildPairs:
    def test_empty_input_returns_empty(self):
        assert build_pairs([]).empty

    def test_single_checkin_returns_empty(self):
        assert build_pairs([make_checkin("2024-01-01")]).empty

    def test_two_consecutive_days_produces_one_pair(self):
        checkins = [make_checkin("2024-01-01"), make_checkin("2024-01-02")]
        result = build_pairs(checkins)
        assert len(result) == 1

    def test_non_consecutive_days_skipped(self):
        # Jan 1 → Jan 3: gap of 2 days, not 1
        checkins = [make_checkin("2024-01-01"), make_checkin("2024-01-03")]
        assert build_pairs(checkins).empty

    def test_mixed_consecutive_and_gap(self):
        # Jan 1–2 (pair), Jan 3–4 skipped via gap to Jan 8, Jan 8–9 (pair)
        checkins = [
            make_checkin("2024-01-01"),
            make_checkin("2024-01-02"),
            make_checkin("2024-01-08"),
            make_checkin("2024-01-09"),
        ]
        result = build_pairs(checkins)
        assert len(result) == 2

    def test_features_come_from_day_t(self):
        checkins = [
            make_checkin("2024-01-01", sleep_hours=6.0),
            make_checkin("2024-01-02", sleep_hours=9.0),
        ]
        result = build_pairs(checkins)
        # Feature row = day t (Jan 1), not day t+1
        assert result["sleep_hours"].iloc[0] == pytest.approx(6.0)

    def test_targets_come_from_day_t1(self):
        checkins = [
            make_checkin("2024-01-01", mood=1.0, energy=1.0),
            make_checkin("2024-01-02", mood=5.0, energy=4.0),
        ]
        result = build_pairs(checkins)
        assert result["mood_target"].iloc[0] == pytest.approx(5.0)
        assert result["energy_target"].iloc[0] == pytest.approx(4.0)

    def test_null_target_on_day_t1_skips_pair(self):
        c1 = make_checkin("2024-01-01")
        c2 = CheckInPayload(date="2024-01-02", mood_score=None, energy_level=None)
        assert build_pairs([c1, c2]).empty

    def test_n_consecutive_produces_n_minus_1_pairs(self):
        checkins = consecutive_checkins(10)
        assert len(build_pairs(checkins)) == 9

    def test_result_columns_contain_feature_cols_and_targets(self):
        checkins = consecutive_checkins(3)
        result = build_pairs(checkins)
        for col in FEATURE_COLS:
            assert col in result.columns
        assert "mood_target" in result.columns
        assert "energy_target" in result.columns
        assert "date_t" in result.columns

    def test_unsorted_input_is_sorted_by_date(self):
        checkins = [
            make_checkin("2024-01-03", mood=4.0),
            make_checkin("2024-01-01", mood=2.0),
            make_checkin("2024-01-02", mood=3.0),
        ]
        result = build_pairs(checkins)
        # Jan 1→2: target mood = 3.0; Jan 2→3: target mood = 4.0
        assert len(result) == 2
        assert result["mood_target"].iloc[0] == pytest.approx(3.0)
        assert result["mood_target"].iloc[1] == pytest.approx(4.0)


class TestImputeFeatures:
    def test_null_filled_with_median(self):
        df = pd.DataFrame({
            "sleep_hours": [6.0, None, 8.0],
            "water_glasses": [4.0, 6.0, None],
            "sunlight_minutes": [30.0, 60.0, 90.0],
            "stress_level": [2.0, 3.0, 1.0],
            "food_group_count": [3.0, 5.0, 4.0],
            "symptom_count": [1.0, 0.0, 2.0],
        })
        result = impute_features(df)
        # sleep median of [6, 8] = 7.0
        assert result["sleep_hours"].iloc[1] == pytest.approx(7.0)
        # water median of [4, 6] = 5.0
        assert result["water_glasses"].iloc[2] == pytest.approx(5.0)

    def test_all_null_column_filled_with_zero(self):
        df = pd.DataFrame({col: [None, None, None] for col in FEATURE_COLS})
        result = impute_features(df)
        for col in FEATURE_COLS:
            assert (result[col] == 0.0).all()

    def test_does_not_mutate_input(self):
        df = pd.DataFrame({
            "sleep_hours": [None, 7.0],
            "water_glasses": [6.0, None],
            "sunlight_minutes": [30.0, 60.0],
            "stress_level": [2.0, 3.0],
            "food_group_count": [4.0, 5.0],
            "symptom_count": [0.0, 1.0],
        })
        original_sleep = df["sleep_hours"].copy()
        impute_features(df)
        pd.testing.assert_series_equal(df["sleep_hours"], original_sleep)

    def test_no_nulls_unchanged(self):
        df = pd.DataFrame({col: [1.0, 2.0, 3.0] for col in FEATURE_COLS})
        original = df.copy()
        result = impute_features(df)
        pd.testing.assert_frame_equal(result, original)

    def test_missing_column_ignored(self):
        df = pd.DataFrame({"sleep_hours": [None, 7.0]})
        result = impute_features(df)
        # Only sleep_hours present — other FEATURE_COLS absent but no error
        assert result["sleep_hours"].iloc[0] == pytest.approx(7.0)


class TestComputeRecencyWeights:
    def test_normalized_mean_is_one(self):
        dates = pd.Series(pd.to_datetime(["2024-01-01", "2024-01-02", "2024-01-03"]))
        weights = compute_recency_weights(dates)
        assert weights.mean() == pytest.approx(1.0, abs=1e-9)

    def test_most_recent_has_highest_weight(self):
        dates = pd.Series(pd.to_datetime(["2024-01-01", "2024-01-10", "2024-01-20"]))
        weights = compute_recency_weights(dates)
        assert weights[2] > weights[1] > weights[0]

    def test_single_sample_weight_is_one(self):
        dates = pd.Series(pd.to_datetime(["2024-01-01"]))
        weights = compute_recency_weights(dates)
        assert weights[0] == pytest.approx(1.0)

    def test_45_day_gap_gives_ratio_of_two(self):
        # 45-day half-life: sample 45 days older has half the raw weight
        # Before normalizing: [2^(-45/45), 2^0] = [0.5, 1.0]
        # After normalizing by mean(0.75): [2/3, 4/3]
        # Ratio newest/oldest = (4/3) / (2/3) = 2.0
        dates = pd.Series(pd.to_datetime(["2024-01-01", "2024-02-15"]))
        weights = compute_recency_weights(dates)
        assert weights[1] / weights[0] == pytest.approx(2.0, rel=1e-3)

    def test_all_same_day_weights_are_one(self):
        dates = pd.Series(pd.to_datetime(["2024-01-01", "2024-01-01", "2024-01-01"]))
        weights = compute_recency_weights(dates)
        np.testing.assert_allclose(weights, 1.0, atol=1e-9)

    def test_returns_numpy_array(self):
        dates = pd.Series(pd.to_datetime(["2024-01-01", "2024-01-02"]))
        weights = compute_recency_weights(dates)
        assert isinstance(weights, np.ndarray)


class TestPrepareTrainingData:
    def test_empty_checkins_returns_empty_arrays(self):
        X, y_mood, y_energy, w = prepare_training_data([])
        assert len(X) == 0 and len(y_mood) == 0 and len(y_energy) == 0 and len(w) == 0

    def test_single_checkin_returns_empty_arrays(self):
        X, y_mood, y_energy, w = prepare_training_data([make_checkin("2024-01-01")])
        assert len(X) == 0

    def test_shapes_correct_for_consecutive_checkins(self):
        checkins = consecutive_checkins(10)
        X, y_mood, y_energy, w = prepare_training_data(checkins)
        n_pairs = 9
        assert X.shape == (n_pairs, len(FEATURE_COLS))
        assert y_mood.shape == (n_pairs,)
        assert y_energy.shape == (n_pairs,)
        assert w.shape == (n_pairs,)

    def test_gaps_reduce_pair_count(self):
        # 5 consecutive from Jan 1 → 4 pairs; 5 consecutive from Jan 10 → 4 pairs; total = 8
        c1 = consecutive_checkins(5, start="2024-01-01")
        c2 = consecutive_checkins(5, start="2024-01-10")
        X, y_mood, _, _ = prepare_training_data(c1 + c2)
        assert X.shape[0] == 8

    def test_no_nulls_after_imputation(self):
        # Checkins with all-null optional fields
        checkins = [
            CheckInPayload(date=f"2024-01-0{i+1}", mood_score=3.0, energy_level=3.0)
            for i in range(5)
        ]
        X, y_mood, y_energy, w = prepare_training_data(checkins)
        if len(X) > 0:
            assert not np.isnan(X).any()

    def test_weights_normalized_mean_one(self):
        checkins = consecutive_checkins(10)
        _, _, _, w = prepare_training_data(checkins)
        assert w.mean() == pytest.approx(1.0, abs=1e-9)
