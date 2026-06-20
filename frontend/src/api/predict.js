const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchPrediction(formData) {
  const payload = {
    crop: formData.crop,
    season: formData.season,
    soilType: formData.soilType,
    area: parseFloat(formData.area),
    temperature: parseFloat(formData.temperature),
    rainfall: parseFloat(formData.rainfall),
    humidity: parseFloat(formData.humidity),
    fertilizer: formData.fertilizer,
    irrigation: formData.irrigation,
    pesticide: formData.pesticide,
  };

  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Prediction failed. Please try again.";
    try {
      const error = await response.json();
      if (typeof error.detail === "string") {
        message = error.detail;
      } else if (Array.isArray(error.detail)) {
        message = error.detail.map((d) => d.msg).join(", ");
      }
    } catch {
      // keep default message
    }
    throw new Error(message);
  }

  return response.json();
}
