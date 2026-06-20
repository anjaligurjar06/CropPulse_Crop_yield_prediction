"""Generate synthetic agronomic training data for the yield prediction model."""

from __future__ import annotations

import random

import numpy as np
import pandas as pd

from app.agronomy import (
    CROPS,
    FERTILIZERS,
    IRRIGATION,
    PESTICIDE,
    SEASONS,
    SOIL_TYPES,
    compute_baseline_yield_per_ha,
)


def generate_training_data(n_samples: int = 8000, seed: int = 42) -> pd.DataFrame:
    rng = random.Random(seed)
    np_rng = np.random.default_rng(seed)

    rows: list[dict] = []

    for _ in range(n_samples):
        crop = rng.choice(CROPS)
        season = rng.choice(SEASONS)
        soil_type = rng.choice(SOIL_TYPES)
        fertilizer = rng.choice(FERTILIZERS)
        irrigation = rng.choice(IRRIGATION)
        pesticide = rng.choice(PESTICIDE)

        temperature = round(float(np_rng.uniform(8, 42)), 1)
        rainfall = round(float(np_rng.uniform(150, 2200)), 0)
        humidity = round(float(np_rng.uniform(15, 95)), 0)

        baseline = compute_baseline_yield_per_ha(
            crop, season, soil_type, temperature, rainfall, humidity, fertilizer, irrigation, pesticide
        )
        noise = float(np_rng.normal(0, baseline * 0.08))
        yield_per_ha = max(0.1, baseline + noise)

        rows.append(
            {
                "crop": crop,
                "season": season,
                "soilType": soil_type,
                "temperature": temperature,
                "rainfall": rainfall,
                "humidity": humidity,
                "fertilizer": fertilizer,
                "irrigation": irrigation,
                "pesticide": pesticide,
                "yieldPerHa": round(yield_per_ha, 3),
            }
        )

    return pd.DataFrame(rows)
