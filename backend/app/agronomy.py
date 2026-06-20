"""Agronomic constants and scoring helpers used for metrics and synthetic training data."""

BASE_YIELDS = {
    "Wheat": 3.2,
    "Rice": 4.5,
    "Maize": 5.1,
    "Soybean": 2.8,
    "Cotton": 1.9,
    "Sugarcane": 68.0,
    "Barley": 2.9,
    "Potato": 22.0,
    "Tomato": 35.0,
}

SOIL_BONUS = {
    "Alluvial": 1.15,
    "Black (regur)": 1.10,
    "Red & yellow": 0.92,
    "Laterite": 0.88,
    "Sandy loam": 1.05,
    "Clay loam": 1.08,
    "Sandy": 0.80,
}

IRRIG_BONUS = {
    "Rainfed (no irrigation)": 0.85,
    "Drip irrigation": 1.20,
    "Sprinkler": 1.10,
    "Flood / furrow": 1.0,
    "Canal": 1.05,
}

FERT_BONUS = {
    "None": 0.75,
    "Organic (compost / manure)": 1.0,
    "Nitrogen (N)": 1.10,
    "Phosphorus (P)": 1.08,
    "Potassium (K)": 1.06,
    "NPK blend": 1.25,
}

PEST_BONUS = {
    "None": 0.90,
    "Low": 1.0,
    "Moderate": 1.08,
    "High": 1.10,
}

SEASON_BONUS = {
    "Kharif (Jun–Oct)": 1.05,
    "Rabi (Nov–Apr)": 1.0,
    "Zaid (Apr–Jun)": 0.95,
    "Summer": 0.92,
    "Winter": 1.02,
}

TIPS = {
    "good": (
        "Your conditions look excellent! Consider drip irrigation if not already "
        "in use to maximize water efficiency and reduce runoff."
    ),
    "avg": (
        "Moderate conditions detected. Switching to an NPK blend fertilizer could "
        "significantly boost your final yield by up to 15%."
    ),
    "poor": (
        "Challenging conditions ahead. Focus on soil health — consider organic "
        "compost and mulching to retain moisture and improve structure."
    ),
}

CROPS = list(BASE_YIELDS.keys())
SEASONS = list(SEASON_BONUS.keys())
SOIL_TYPES = list(SOIL_BONUS.keys())
FERTILIZERS = list(FERT_BONUS.keys())
IRRIGATION = list(IRRIG_BONUS.keys())
PESTICIDE = list(PEST_BONUS.keys())


def weather_scores(temperature: float, rainfall: float, humidity: float) -> tuple[float, float, float]:
    temp_score = 1.0 if 15 <= temperature <= 35 else (0.80 if temperature < 10 or temperature > 45 else 0.92)
    rain_score = 1.0 if 500 <= rainfall <= 1500 else (0.82 if rainfall < 200 or rainfall > 2500 else 0.93)
    hum_score = 1.0 if 40 <= humidity <= 80 else (0.88 if humidity < 20 or humidity > 95 else 0.95)
    return temp_score, rain_score, hum_score


def compute_baseline_yield_per_ha(
    crop: str,
    season: str,
    soil_type: str,
    temperature: float,
    rainfall: float,
    humidity: float,
    fertilizer: str,
    irrigation: str,
    pesticide: str,
) -> float:
    base = BASE_YIELDS.get(crop, 3.0)
    sb = SOIL_BONUS.get(soil_type, 1.0)
    ib = IRRIG_BONUS.get(irrigation, 1.0)
    fb = FERT_BONUS.get(fertilizer, 1.0)
    pb = PEST_BONUS.get(pesticide, 1.0)
    seb = SEASON_BONUS.get(season, 1.0)
    temp_score, rain_score, hum_score = weather_scores(temperature, rainfall, humidity)
    return base * sb * ib * fb * pb * seb * temp_score * rain_score * hum_score


def compute_metrics(
    soil_type: str,
    temperature: float,
    rainfall: float,
    humidity: float,
    fertilizer: str,
    irrigation: str,
    pesticide: str,
) -> dict[str, int]:
    sb = SOIL_BONUS.get(soil_type, 1.0)
    ib = IRRIG_BONUS.get(irrigation, 1.0)
    fb = FERT_BONUS.get(fertilizer, 1.0)
    pb = PEST_BONUS.get(pesticide, 1.0)
    temp_score, rain_score, _ = weather_scores(temperature, rainfall, humidity)

    water_adequacy = min(100, round(rain_score * ib * 85))
    temp_suitability = round(temp_score * 100)
    soil_score = max(0, min(100, round((sb - 0.7) / (1.25 - 0.7) * 100)))
    input_efficiency = max(0, min(100, round(((fb + pb) / 2 - 0.7) / (1.25 - 0.7) * 100)))

    return {
        "waterAdequacy": water_adequacy,
        "tempSuitability": temp_suitability,
        "soilScore": soil_score,
        "inputEfficiency": input_efficiency,
    }


def compute_outlook(metrics: dict[str, int]) -> str:
    overall = sum(metrics.values()) / len(metrics)
    if overall >= 70:
        return "good"
    if overall >= 50:
        return "avg"
    return "poor"
