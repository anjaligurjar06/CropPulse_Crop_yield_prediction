function scoreInRange(value, min, max, hardMin, hardMax) {
  if (isNaN(value)) return 70;
  if (value >= min && value <= max) return 100;
  if (value < hardMin || value > hardMax) return 55;
  return 78;
}

export function computeFactors(formData) {
  const temp = parseFloat(formData.temperature);
  const rain = parseFloat(formData.rainfall);
  const hum = parseFloat(formData.humidity);

  const pesticideScoreMap = {
    None: 60,
    Low: 78,
    Moderate: 92,
    High: 100,
  };

  return {
    rainfall: scoreInRange(rain, 500, 1500, 200, 2500),
    temperature: scoreInRange(temp, 15, 35, 10, 45),
    pesticide: pesticideScoreMap[formData.pesticide] ?? 70,
    humidity: scoreInRange(hum, 40, 80, 20, 95),
  };
}