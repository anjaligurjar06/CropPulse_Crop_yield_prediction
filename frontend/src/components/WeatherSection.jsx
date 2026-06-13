import "../styles/Section.css";

export default function WeatherSection({ formData, update }) {
  return (
    <div className="cp-section">
      <div className="cp-section-header cp-section-header--blue">
        <div className="cp-section-icon cp-section-icon--blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/>
            <line x1="8" y1="16" x2="8" y2="21"/>
            <line x1="8" y1="21" x2="12" y2="17"/>
            <line x1="16" y1="16" x2="16" y2="21"/>
            <line x1="16" y1="21" x2="20" y2="17"/>
          </svg>
        </div>
        <div>
          <div className="cp-section-title">Weather & environment</div>
          <div className="cp-section-sub">Temperature, rainfall and humidity for your region</div>
        </div>
      </div>

      <div className="cp-section-body">
        <div className="cp-grid-3">
          <div className="cp-field">
            <label className="cp-label" htmlFor="temperature">Avg temperature</label>
            <input
              id="temperature"
              className="cp-input"
              type="number"
              placeholder="e.g. 28"
              min="-10"
              max="60"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => update("temperature", e.target.value)}
            />
            <span className="cp-hint">°C</span>
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="rainfall">Annual rainfall</label>
            <input
              id="rainfall"
              className="cp-input"
              type="number"
              placeholder="e.g. 850"
              min="0"
              step="1"
              value={formData.rainfall}
              onChange={(e) => update("rainfall", e.target.value)}
            />
            <span className="cp-hint">mm</span>
          </div>

          <div className="cp-field">
            <label className="cp-label" htmlFor="humidity">Relative humidity</label>
            <input
              id="humidity"
              className="cp-input"
              type="number"
              placeholder="e.g. 65"
              min="0"
              max="100"
              step="1"
              value={formData.humidity}
              onChange={(e) => update("humidity", e.target.value)}
            />
            <span className="cp-hint">%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
