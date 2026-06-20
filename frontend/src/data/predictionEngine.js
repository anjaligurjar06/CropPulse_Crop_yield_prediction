const BASE_YIELDS = {
  Wheat: 3.2, Rice: 4.5, Maize: 5.1, Soybean: 2.8,
  Cotton: 1.9, Sugarcane: 68, Barley: 2.9, Potato: 22, Tomato: 35,
};

const SOIL_BONUS = {
  Alluvial: 1.15, "Black (regur)": 1.10, "Red & yellow": 0.92,
  Laterite: 0.88, "Sandy loam": 1.05, "Clay loam": 1.08, Sandy: 0.80,
};

const IRRIG_BONUS = {
  "Rainfed (no irrigation)": 0.85, "Drip irrigation": 1.20,
  Sprinkler: 1.10, "Flood / furrow": 1.0, Canal: 1.05,
};

const FERT_BONUS = {
  None: 0.75, "Organic (compost / manure)": 1.0, "Nitrogen (N)": 1.10,
  "Phosphorus (P)": 1.08, "Potassium (K)": 1.06, "NPK blend": 1.25,
};

const PEST_BONUS = { None: 0.90, Low: 1.0, Moderate: 1.08, High: 1.10 };

const TIPS = {
  good: "Your conditions look excellent! Consider drip irrigation if not already in use to maximize water efficiency and reduce runoff.",
  avg: "Moderate conditions detected. Switching to an NPK blend fertilizer could significantly boost your final yield by up to 15%.",
  poor: "Challenging conditions ahead. Focus on soil health — consider organic compost and mulching to retain moisture and improve structure.",
};

export function computePrediction(formData) {
  const { crop, soilType, area, temperature, rainfall, humidity, fertilizer, irrigation, pesticide } = formData;

  const base  = BASE_YIELDS[crop]      ?? 3.0;
  const sb    = SOIL_BONUS[soilType]   ?? 1.0;
  const ib    = IRRIG_BONUS[irrigation] ?? 1.0;
  const fb    = FERT_BONUS[fertilizer] ?? 1.0;
  const pb    = PEST_BONUS[pesticide]  ?? 1.0;

  const temp = parseFloat(temperature);
  const rain = parseFloat(rainfall);
  const hum  = parseFloat(humidity);
  const ha   = parseFloat(area);

  const tempScore = temp >= 15 && temp <= 35 ? 1.0 : (temp < 10 || temp > 45 ? 0.80 : 0.92);
  const rainScore = rain >= 500 && rain <= 1500 ? 1.0 : (rain < 200 || rain > 2500 ? 0.82 : 0.93);
  const humScore  = hum >= 40 && hum <= 80 ? 1.0 : (hum < 20 || hum > 95 ? 0.88 : 0.95);

  const yieldPerHa = base * sb * ib * fb * pb * tempScore * rainScore * humScore;
  const totalYield = (yieldPerHa * ha).toFixed(2);

  const waterAdequacy  = Math.min(100, Math.round(rainScore * ib * 85));
  const tempSuitability = Math.round(tempScore * 100);
  const soilScore      = Math.max(0, Math.min(100, Math.round((sb - 0.7) / (1.25 - 0.7) * 100)));
  const inputEfficiency = Math.max(0, Math.min(100, Math.round(((fb + pb) / 2 - 0.7) / (1.25 - 0.7) * 100)));

  const overall = (waterAdequacy + tempSuitability + soilScore + inputEfficiency) / 4;
  const outlook = overall >= 70 ? "good" : overall >= 50 ? "avg" : "poor";

  return {
    totalYield,
    outlook,
    metrics: { waterAdequacy, tempSuitability, soilScore, inputEfficiency },
    tip: TIPS[outlook],
    factors: {
      rainfall: Math.round(rainScore * 100),
      temperature: Math.round(tempScore * 100),
      pesticide: Math.round(pb * 100),
      humidity: Math.round(humScore * 100),
    },
  };
}

