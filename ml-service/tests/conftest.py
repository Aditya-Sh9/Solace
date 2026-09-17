from __future__ import annotations

import os
import sys

# Make ml-service/ root importable so 'from app.X import ...' works
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from datetime import date, timedelta

from app.schemas import CheckInPayload


def make_checkin(date_str: str, mood: float = 3.0, energy: float = 3.0, **kwargs) -> CheckInPayload:
    return CheckInPayload(
        date=date_str,
        mood_score=mood,
        energy_level=energy,
        sleep_hours=kwargs.get("sleep_hours", 7.0),
        water_glasses=kwargs.get("water_glasses", 6.0),
        sunlight_minutes=kwargs.get("sunlight_minutes", 30.0),
        stress_level=kwargs.get("stress_level", 2.0),
        food_group_count=kwargs.get("food_group_count", 4),
        symptom_count=kwargs.get("symptom_count", 0),
    )


def consecutive_checkins(n: int, start: str = "2024-01-01", **kwargs) -> list[CheckInPayload]:
    start_date = date.fromisoformat(start)
    return [
        make_checkin((start_date + timedelta(days=i)).isoformat(), **kwargs)
        for i in range(n)
    ]


def synthetic_checkins(
    n: int,
    start: str = "2024-01-01",
    mood_fn=None,
    energy_fn=None,
) -> list[CheckInPayload]:
    """N consecutive checkins with varying features and optionally custom mood/energy."""
    start_date = date.fromisoformat(start)
    result = []
    for i in range(n):
        d = (start_date + timedelta(days=i)).isoformat()
        mood = mood_fn(i) if mood_fn else float(2 + (i % 3))      # 2, 3, 4, 2, 3, ...
        energy = energy_fn(i) if energy_fn else float(3 + (i % 2))  # 3, 4, 3, 4, ...
        sleep = 5.0 + (i % 4)                                       # 5, 6, 7, 8, 5, ...
        result.append(make_checkin(d, mood=mood, energy=energy, sleep_hours=sleep))
    return result
