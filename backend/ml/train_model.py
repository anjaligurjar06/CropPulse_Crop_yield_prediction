"""Train a Random Forest regressor for crop yield prediction."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from ml.generate_data import generate_training_data  # noqa: E402

CATEGORICAL_FEATURES = [
    "crop",
    "season",
    "soilType",
    "fertilizer",
    "irrigation",
    "pesticide",
]
NUMERIC_FEATURES = ["temperature", "rainfall", "humidity"]
FEATURE_COLUMNS = CATEGORICAL_FEATURES + NUMERIC_FEATURES


def build_pipeline() -> Pipeline:
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore"),
                CATEGORICAL_FEATURES,
            ),
            ("num", "passthrough", NUMERIC_FEATURES),
        ]
    )

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=16,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", model),
        ]
    )


def train(n_samples: int = 8000) -> dict:
    df = generate_training_data(n_samples=n_samples)
    x = df[FEATURE_COLUMNS]
    y = df["yieldPerHa"]

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42
    )

    pipeline = build_pipeline()
    pipeline.fit(x_train, y_train)

    predictions = pipeline.predict(x_test)
    metrics = {
        "r2": round(float(r2_score(y_test, predictions)), 4),
        "mae": round(float(mean_absolute_error(y_test, predictions)), 4),
        "samples": n_samples,
    }

    models_dir = BACKEND_DIR / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    model_path = models_dir / "crop_yield_model.joblib"
    joblib.dump(pipeline, model_path)

    print(f"Model saved to {model_path}")
    print(f"R² score: {metrics['r2']}")
    print(f"MAE (t/ha): {metrics['mae']}")

    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train CropPlus yield model")
    parser.add_argument("--samples", type=int, default=8000, help="Training sample count")
    args = parser.parse_args()
    train(n_samples=args.samples)
