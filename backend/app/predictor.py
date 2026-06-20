from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd

from app.agronomy import TIPS, compute_baseline_yield_per_ha, compute_metrics, compute_outlook
from app.config import MODEL_PATH
from app.schemas import Metrics, PredictionRequest, PredictionResponse


class YieldPredictor:
    def __init__(self, model_path: Path | None = None) -> None:
        path = model_path or MODEL_PATH
        if not path.exists():
            raise FileNotFoundError(
                f"Model not found at {path}. Run: python -m ml.train_model"
            )
        self._pipeline = joblib.load(path)

    def predict(self, request: PredictionRequest) -> PredictionResponse:
        features = pd.DataFrame(
            [
                {
                    "crop": request.crop,
                    "season": request.season,
                    "soilType": request.soilType,
                    "temperature": request.temperature,
                    "rainfall": request.rainfall,
                    "humidity": request.humidity,
                    "fertilizer": request.fertilizer,
                    "irrigation": request.irrigation,
                    "pesticide": request.pesticide,
                }
            ]
        )

        yield_per_ha = float(self._pipeline.predict(features)[0])
        yield_per_ha = max(0.1, round(yield_per_ha, 3))
        total_yield = round(yield_per_ha * request.area, 2)

        metrics_dict = compute_metrics(
            request.soilType,
            request.temperature,
            request.rainfall,
            request.humidity,
            request.fertilizer,
            request.irrigation,
            request.pesticide,
        )
        outlook = compute_outlook(metrics_dict)

        return PredictionResponse(
            totalYield=f"{total_yield:.2f}",
            outlook=outlook,
            metrics=Metrics(**metrics_dict),
            tip=TIPS[outlook],
            yieldPerHa=yield_per_ha,
        )


def fallback_predict(request: PredictionRequest) -> PredictionResponse:
    """Rule-based fallback when the ML model file is missing."""
    yield_per_ha = compute_baseline_yield_per_ha(
        request.crop,
        request.season,
        request.soilType,
        request.temperature,
        request.rainfall,
        request.humidity,
        request.fertilizer,
        request.irrigation,
        request.pesticide,
    )
    total_yield = round(yield_per_ha * request.area, 2)
    metrics_dict = compute_metrics(
        request.soilType,
        request.temperature,
        request.rainfall,
        request.humidity,
        request.fertilizer,
        request.irrigation,
        request.pesticide,
    )
    outlook = compute_outlook(metrics_dict)

    return PredictionResponse(
        totalYield=f"{total_yield:.2f}",
        outlook=outlook,
        metrics=Metrics(**metrics_dict),
        tip=TIPS[outlook],
        yieldPerHa=round(yield_per_ha, 3),
    )
