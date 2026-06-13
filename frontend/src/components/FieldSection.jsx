import "../styles/Section.css";

const FERTILIZERS = [
  "None",
  "Organic (compost / manure)",
  "Nitrogen (N)",
  "Phosphorus (P)",
  "Potassium (K)",
  "NPK blend",
];

const IRRIGATION = [
  "Rainfed (no irrigation)",
  "Drip irrigation",
  "Sprinkler",
  "Flood / furrow",
  "Canal",
];

const PESTICIDE = ["None", "Low", "Moderate", "High"];

export default function FieldSection({ formData, update }) {
  return (
    <div className="cp-section">
      <div className="cp-section-header cp-section-header--amber">
        <div className="cp-section-icon cp-section-icon--amber">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49"/>
          </svg>
        </div>
        <div>
          <div className="cp-section-title">Field & farming practices</div>
          <div className="cp-section-sub">Inputs that directly impact your yield potential</div>
        </div>
      </div>

      <div className="cp-section-body">
        <div className="cp-grid-3">
          <div className="cp-field">
            <label className="cp-label" htmlFor="fertilizer">Fertilizer used</label>
            <select
              id="fertilizer"
              className="cp-select"
              value={formData.fertilizer}
              onChange={(e) => update("fertilizer", e.target.value)}
            >
              <option value="">Select type</option>
              {FERTILIZERS.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="irrigation">Irrigation method</label>
            <select
              id="irrigation"
              className="cp-select"
              value={formData.irrigation}
              onChange={(e) => update("irrigation", e.target.value)}
            >
              <option value="">Select method</option>
              {IRRIGATION.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="pesticide">Pesticide usage</label>
            <select
              id="pesticide"
              className="cp-select"
              value={formData.pesticide}
              onChange={(e) => update("pesticide", e.target.value)}
            >
              <option value="">Select level</option>
              {PESTICIDE.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}