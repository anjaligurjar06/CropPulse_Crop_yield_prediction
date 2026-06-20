import { useState } from "react";
import Hero from "./components/Hero";
import StepIndicator from "./components/StepIndicator";
import CropSection from "./components/CropSection";
import WeatherSection from "./components/WeatherSection";
import FieldSection from "./components/FieldSection";
import ResultPanel from "./components/ResultPanel";
import FactorChart from "./components/FactorChart";
import { computeFactors } from "./utils/computeFactors";
import { fetchPrediction } from "./api/predict";
import "./styles/global.css";

export default function App() {
  const [formData, setFormData] = useState({
    crop: "",
    season: "",
    soilType: "",
    area: "",
    temperature: "",
    rainfall: "",
    humidity: "",
    fertilizer: "",
    irrigation: "",
    pesticide: "",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handlePredict = async () => {
    const required = Object.values(formData);
    if (required.some((v) => v === "" || v === null || v === undefined)) {
      setError("Please fill in all fields before predicting.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const prediction = await fetchPrediction(formData);
      setResult({ ...prediction, factors: computeFactors(formData) });
    } catch (err) {
      setResult(null);
      setError(err.message || "Could not reach the prediction server.");
    } finally {
      setLoading(false);
    }
  };

  const activeStep = result ? 4 : formData.area ? 3 : formData.temperature ? 2 : 1;

  return (
    <div className="cp-app">
      <Hero />
      <StepIndicator activeStep={activeStep} />
      <CropSection formData={formData} update={update} />
      <WeatherSection formData={formData} update={update} />
      <FieldSection formData={formData} update={update} />
      {error && <p className="cp-error">{error}</p>}
      <button className="cp-submit" onClick={handlePredict} disabled={loading}>
        <span className="cp-submit-icon">&#9881;</span>
        {loading ? "Analysing…" : "Analyse & predict yield"}
      </button>
      {result && <ResultPanel result={result} crop={formData.crop} />}
      {result && <FactorChart factors={result.factors} />}
    </div>
  );
}
