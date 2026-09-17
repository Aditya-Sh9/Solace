from __future__ import annotations

from datetime import date, timedelta
from unittest.mock import patch

import numpy as np
import pytest

from app.model import (
    DEGENERATE_STD_FLOOR,
    TRAIN_GATE,
    _bootstrap_direction_stable,
    _composite_confidence,
    _dynamic_threshold,
    _weighted_spearman,
    train_and_predict,
)
from app.schemas import CheckInPayload, PredictResponse

from .conftest import make_checkin, synthetic_checkins


class TestDynamicThreshold:
    def test_below_20(self):
        assert _dynamic_threshold(TRAIN_GATE) == pytest.approx(0.35)
        assert _dynamic_threshold(19) == pytest.approx(0.35)

    def test_exactly_20(self):
        # 20 is not < 20, but is < 35 → 0.30
        assert _dynamic_threshold(20) == pytest.approx(0.30)

    def test_between_20_and_35(self):
        assert _dynamic_threshold(25) == pytest.approx(0.30)

    def test_exactly_35(self):
        # 35 is not < 35 → 0.25
        assert _dynamic_threshold(35) == pytest.approx(0.25)

    def test_above_35(self):
        assert _dynamic_threshold(100) == pytest.approx(0.25)


class TestTrainGate:
    def test_below_14_checkins_returns_not_trained(self):
        checkins = synthetic_checkins(5)
        response = train_and_predict(checkins)
        assert response.trained is False
        assert response.prediction is None
        assert response.n_samples == 5

    def test_zero_checkins_returns_not_trained(self):
        response = train_and_predict([])
        assert response.trained is False

    def test_exactly_14_consecutive_does_not_raise(self):
        checkins = synthetic_checkins(TRAIN_GATE)
        response = train_and_predict(checkins)
        assert isinstance(response, PredictResponse)
        assert response.n_samples == TRAIN_GATE

    def test_14_checkins_with_gaps_returns_not_trained(self):
        # Every other day — zero consecutive pairs → n_pairs = 0 < 3
        start = date.fromisoformat("2024-01-01")
        checkins = [
            make_checkin((start + timedelta(days=i * 2)).isoformat())
            for i in range(15)
        ]
        response = train_and_predict(checkins)
        assert response.trained is False

    def test_20_consecutive_trained_true(self):
        checkins = synthetic_checkins(20)
        response = train_and_predict(checkins)
        assert response.trained is True
        assert response.n_samples == 20


class TestSanityGates:
    def test_gate1_negative_r2_prediction_is_none(self):
        # Patch _manual_cv_r2 to return -0.5 → gate 1 fires
        checkins = synthetic_checkins(20)
        with patch("app.model._manual_cv_r2", return_value=-0.5):
            response = train_and_predict(checkins)
        assert response.trained is True
        assert response.prediction is None
        assert response.quality is not None
        assert response.quality.mood_r2 == pytest.approx(-0.5)
        assert response.quality.energy_r2 == pytest.approx(-0.5)

    def test_gate2_constant_targets_prediction_is_none(self):
        # All mood=3.0, energy=3.0 → GBR predicts constant → std=0 < DEGENERATE_STD_FLOOR
        checkins = synthetic_checkins(
            20,
            mood_fn=lambda _: 3.0,
            energy_fn=lambda _: 3.0,
        )
        response = train_and_predict(checkins)
        assert response.trained is True
        assert response.prediction is None

    def test_gate3_bootstrap_unstable_patterns_excluded(self):
        # Random noise: any surviving patterns must still be schema-valid
        rng = np.random.RandomState(99)
        n = 30
        start = date.fromisoformat("2024-01-01")
        checkins = [
            CheckInPayload(
                date=(start + timedelta(days=i)).isoformat(),
                mood_score=float(rng.uniform(1, 6)),
                energy_level=float(rng.uniform(1, 6)),
                sleep_hours=float(rng.uniform(4, 10)),
                water_glasses=float(rng.uniform(2, 10)),
                sunlight_minutes=float(rng.uniform(0, 120)),
                stress_level=float(rng.uniform(1, 5)),
                food_group_count=int(rng.randint(1, 8)),
                symptom_count=int(rng.randint(0, 5)),
            )
            for i in range(n)
        ]
        response = train_and_predict(checkins)
        for p in response.patterns:
            assert p.direction in ("positive", "negative")
            assert 0.0 <= p.strength <= 1.0


class TestWeightedSpearman:
    def test_perfect_positive_correlation(self):
        x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
        corr = _weighted_spearman(x, x.copy(), np.ones(5))
        assert corr == pytest.approx(1.0, abs=1e-6)

    def test_perfect_negative_correlation(self):
        x = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
        y = np.array([5.0, 4.0, 3.0, 2.0, 1.0])
        corr = _weighted_spearman(x, y, np.ones(5))
        assert corr == pytest.approx(-1.0, abs=1e-6)

    def test_constant_x_returns_zero(self):
        x = np.full(5, 3.0)
        y = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
        corr = _weighted_spearman(x, y, np.ones(5))
        assert corr == pytest.approx(0.0)

    def test_output_bounded_minus1_to_1(self):
        rng = np.random.RandomState(7)
        x = rng.randn(20)
        y = rng.randn(20)
        w = np.abs(rng.randn(20)) + 0.1
        corr = _weighted_spearman(x, y, w)
        assert -1.0 <= corr <= 1.0


class TestBootstrapDirectionStable:
    def test_strong_positive_signal_is_stable(self):
        rng = np.random.RandomState(0)
        n = 40
        X = rng.randn(n, 6)
        # Very strong correlation: feature 0 → y
        y = X[:, 0] * 5 + rng.randn(n) * 0.1
        w = np.ones(n)
        assert _bootstrap_direction_stable(X, y, w, col=0, expected_sign=1.0) is True

    def test_strong_negative_signal_is_stable(self):
        rng = np.random.RandomState(1)
        n = 40
        X = rng.randn(n, 6)
        y = -X[:, 0] * 5 + rng.randn(n) * 0.1
        w = np.ones(n)
        assert _bootstrap_direction_stable(X, y, w, col=0, expected_sign=-1.0) is True

    def test_returns_bool(self):
        rng = np.random.RandomState(42)
        X = rng.randn(20, 6)
        y = rng.randn(20)
        w = np.ones(20)
        result = _bootstrap_direction_stable(X, y, w, col=0, expected_sign=1.0)
        assert isinstance(result, bool)

    def test_wrong_expected_sign_on_positive_signal_returns_false(self):
        rng = np.random.RandomState(0)
        n = 40
        X = rng.randn(n, 6)
        y = X[:, 0] * 5 + rng.randn(n) * 0.01
        w = np.ones(n)
        # Signal is positive, but we claim it's negative → unstable
        assert _bootstrap_direction_stable(X, y, w, col=0, expected_sign=-1.0) is False


class TestCompositeConfidence:
    def test_output_always_between_0_and_1(self):
        for n in [14, 20, 35, 50, 100]:
            for cv in [0.0, 0.3, 0.7, 1.0]:
                for std in [0.05, 0.15, 0.5]:
                    conf = _composite_confidence(n, cv, cv, std)
                    assert 0.0 <= conf <= 1.0, f"n={n} cv={cv} std={std} → {conf}"

    def test_more_samples_increases_confidence(self):
        c14 = _composite_confidence(14, 0.5, 0.5, 0.5)
        c50 = _composite_confidence(50, 0.5, 0.5, 0.5)
        assert c50 > c14

    def test_degenerate_std_reduces_confidence(self):
        c_good = _composite_confidence(30, 0.5, 0.5, 0.5)
        c_degen = _composite_confidence(30, 0.5, 0.5, DEGENERATE_STD_FLOOR - 0.01)
        assert c_degen < c_good

    def test_at_train_gate_sample_score_is_zero(self):
        # At exactly TRAIN_GATE, sample_score = 0 → confidence comes only from cv+variance
        conf = _composite_confidence(TRAIN_GATE, 0.0, 0.0, 0.0)
        assert conf == pytest.approx(0.0)


class TestPredictResponseSchema:
    def test_response_is_predict_response_instance(self):
        checkins = synthetic_checkins(20)
        response = train_and_predict(checkins)
        assert isinstance(response, PredictResponse)

    def test_prediction_mood_energy_bounded_1_to_6(self):
        checkins = synthetic_checkins(25)
        response = train_and_predict(checkins)
        if response.prediction is not None:
            assert 1.0 <= response.prediction.mood <= 6.0
            assert 1.0 <= response.prediction.energy <= 6.0

    def test_prediction_horizon_is_next_day(self):
        checkins = synthetic_checkins(25)
        response = train_and_predict(checkins)
        if response.prediction is not None:
            assert response.prediction.horizon == "next_day"

    def test_confidence_between_0_and_1(self):
        checkins = synthetic_checkins(25)
        response = train_and_predict(checkins)
        if response.prediction is not None:
            assert 0.0 <= response.prediction.confidence <= 1.0

    def test_patterns_sorted_by_strength_descending(self):
        checkins = synthetic_checkins(30)
        response = train_and_predict(checkins)
        strengths = [p.strength for p in response.patterns]
        assert strengths == sorted(strengths, reverse=True)

    def test_pattern_fields_valid(self):
        checkins = synthetic_checkins(30)
        response = train_and_predict(checkins)
        for p in response.patterns:
            assert p.feature in (
                "sleep_hours", "water_glasses", "sunlight_minutes",
                "stress_level", "food_group_count", "symptom_count",
            )
            assert p.target in ("mood", "energy")
            assert p.direction in ("positive", "negative")
            assert 0.0 <= p.strength <= 1.0

    def test_quality_r2_values_present_when_trained(self):
        checkins = synthetic_checkins(20)
        response = train_and_predict(checkins)
        # When trained, quality should always be populated (gate 1 or normal path)
        assert response.quality is not None
