import "../styles/Hero.css";
import sunflowers from "../assets/Sunflowers.jpeg";

export default function Hero() {
  return (
    <div className="cp-hero">
      <div
        className="cp-hero-bg"
        style={{
          backgroundImage: `url(${sunflowers})`
        }}
      />
      <div className="cp-hero-content">
        <div className="cp-logo-row">
          <div className="cp-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0DD97" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69L12 21l2.31-1.31C18.16 18.67 21 15.17 21 11a9 9 0 0 0-9-9z"/>
              <path d="M12 7v7"/>
              <path d="M9 12l3-5 3 5"/>
            </svg>
          </div>
          <div>
            <div className="cp-logo-text">
              Crop<span className="cp-logo-dot">Pulse</span>
            </div>
            <div className="cp-tagline">AI-powered yield intelligence</div>
          </div>
        </div>

        <h1 className="cp-hero-title">
          Predict your harvest,<br />before you sow.
        </h1>
        <p className="cp-hero-sub">
          Enter your field conditions and get an instant yield estimate powered by agronomic models and real-world data.
        </p>

        <div className="cp-stat-pills">
          <div className="cp-pill"><span className="cp-pill-dot" />9 crop types</div>
          <div className="cp-pill"><span className="cp-pill-dot" />Multi-season support</div>
          <div className="cp-pill"><span className="cp-pill-dot" />Instant results</div>
        </div>
      </div>
    </div>
  );
}