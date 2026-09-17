from __future__ import annotations
from typing import Literal, Optional
from pydantic import BaseModel


class CheckInPayload(BaseModel):
    date: str  # ISO date YYYY-MM-DD — used to build consecutive-day pairs
    sleep_hours: Optional[float] = None
    water_glasses: Optional[float] = None
    sunlight_minutes: Optional[float] = None
    stress_level: Optional[float] = None
    symptom_count: Optional[int] = None
    food_group_count: Optional[int] = None
    mood_score: Optional[float] = None    # 1–6; target variable
    energy_level: Optional[float] = None  # 1–6; target variable


class PredictRequest(BaseModel):
    checkins: list[CheckInPayload]


class Prediction(BaseModel):
    mood: float      # native 1–6 float; backend bands to "lower/steady/brighter"
    energy: float    # native 1–6 float; backend bands to "lower/steady/brighter"
    horizon: Literal["next_day"] = "next_day"
    confidence: float  # 0–1 internal float; backend maps to wording


class Pattern(BaseModel):
    feature: str
    target: Literal["mood", "energy"]
    direction: Literal["positive", "negative"]
    strength: float  # absolute Spearman correlation value


class Quality(BaseModel):
    mood_r2: Optional[float] = None
    energy_r2: Optional[float] = None


class PredictResponse(BaseModel):
    trained: bool
    n_samples: int
    prediction: Optional[Prediction] = None  # null when trained=false or sanity gate fails
    patterns: list[Pattern] = []
    quality: Optional[Quality] = None
