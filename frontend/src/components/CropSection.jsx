import "../styles/Section.css";
import "../styles/CropSection.css";

const CROPS = [
  { name: "Wheat", emoji: "🌾" },
  { name: "Rice", emoji: "🍚" },
  { name: "Maize", emoji: "🌽" },
  { name: "Soybean", emoji: "🫘" },
  { name: "Cotton", emoji: "🪴" },
  { name: "Sugarcane", emoji: "🎋" },
  { name: "Barley", emoji: "🌿" },
  { name: "Potato", emoji: "🥔" },
  { name: "Tomato", emoji: "🍅" },
];

const SEASONS = ["Kharif (Jun–Oct)", "Rabi (Nov–Apr)", "Zaid (Apr–Jun)", "Summer", "Winter"];

const SOIL_TYPES = [
  "Alluvial",
  "Black (regur)",
  "Red & yellow",
  "Laterite",
  "Sandy loam",
  "Clay loam",
  "Sandy",
];

export default function CropSection({ formData, update }) {
  return (
    <div className="cp-section">
      <div className="cp-section-header cp-section-header--green">
        <div className="cp-section-icon cp-section-icon--green">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22V12M12 12C12 7 7 4 3 6M12 12C12 7 17 4 21 6"/>
          </svg>
        </div>
        <div>
          <div className="cp-section-title">Crop details</div>
          <div className="cp-section-sub">Select your crop, season, soil type and field area</div>
        </div>
      </div>

      <div className="cp-section-body">
        <div className="cp-field-label">Select crop type</div>
        <div className="cp-crop-picker">
          {CROPS.map((c) => (
            <button
              key={c.name}
              className={`cp-crop-btn${formData.crop === c.name ? " selected" : ""}`}
              onClick={() => update("crop", c.name)}
              type="button"
            >
              <span className="cp-crop-emoji">{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        <div className="cp-grid-2" style={{ marginTop: "18px" }}>
          <div className="cp-field">
            <label className="cp-label" htmlFor="season">Season</label>
            <select
              id="season"
              className="cp-select"
              value={formData.season}
              onChange={(e) => update("season", e.target.value)}
            >
              <option value="">Select season</option>
              {SEASONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="soil-type">Soil type</label>
            <select
              id="soil-type"
              className="cp-select"
              value={formData.soilType}
              onChange={(e) => update("soilType", e.target.value)}
            >
              <option value="">Select soil</option>
              {SOIL_TYPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="area">Area under cultivation</label>
            <input
              id="area"
              className="cp-input"
              type="number"
              placeholder="e.g. 5.0"
              min="0"
              step="0.1"
              value={formData.area}
              onChange={(e) => update("area", e.target.value)}
            />
            <span className="cp-hint">in hectares</span>
          </div>
        </div>
      </div>
    </div>
  );
}