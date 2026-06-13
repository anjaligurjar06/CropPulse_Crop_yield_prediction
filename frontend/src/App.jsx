import { useState } from "react";
import Hero from "./components/Hero";
import StepIndicator from "./components/StepIndicator";
import CropSection from "./components/CropSection";
import WeatherSection from "./components/WeatherSection";
import FieldSection from "./components/FieldSection";
import ResultPanel from "./components/ResultPanel";
import { computePrediction } from "./data/predictionEngine";
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

  const update = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handlePredict = () => {
    const required = Object.values(formData);
    if (required.some((v) => v === "" || v === null || v === undefined)) {
      setError("Please fill in all fields before predicting.");
      return;
    }
    const prediction = computePrediction(formData);
    setResult(prediction);
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
      <button className="cp-submit" onClick={handlePredict}>
        <span className="cp-submit-icon">&#9881;</span>
        Analyse &amp; predict yield
      </button>
      {result && <ResultPanel result={result} crop={formData.crop} />}
    </div>
  );
}
