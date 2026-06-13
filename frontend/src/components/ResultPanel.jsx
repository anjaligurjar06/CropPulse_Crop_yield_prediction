import "../styles/ResultPanel.css";

const METRICS = [
  { key: "waterAdequacy", label: "Water adequacy", color: "#185FA5" },
  { key: "tempSuitability", label: "Temp suitability", color: "#D85A30" },
  { key: "soilScore", label: "Soil quality", color: "#854F0B" },
  { key: "inputEfficiency", label: "Input efficiency", color: "#3B6D11" },
];

function ProgressBar({ value, color }) {
  return (
    <div className="cp-progress-track">
      <div
        className="cp-progress-fill"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}

export default function ResultPanel({ result, crop }) {
  const { totalYield, outlook, metrics, tip } = result;

  const badgeClass =
    outlook === "good" ? "badge-good" : outlook === "avg" ? "badge-avg" : "badge-poor";
  const badgeLabel =
    outlook === "good" ? "Good outlook" : outlook === "avg" ? "Average outlook" : "Poor outlook";

  return (
    <div className="cp-result">
      <div
        className="cp-result-hero"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=900&q=60&auto=format&fit=crop')",
        }}
      >
        <div className="cp-result-overlay" />
        <div className="cp-result-inner">
          <div>
            <div className="cp-result-label">Estimated total yield</div>
            <div className="cp-result-yield">{totalYield}</div>
            <div className="cp-result-unit">tonnes · {crop}</div>
          </div>
          <div className={`cp-result-badge ${badgeClass}`}>{badgeLabel}</div>
        </div>
      </div>

      <div className="cp-metrics">
        {METRICS.map(({ key, label, color }) => (
          <div key={key} className="cp-metric">
            <div className="cp-metric-val" style={{ color }}>
              {metrics[key]}%
            </div>
            <div className="cp-metric-lbl">{label}</div>
            <ProgressBar value={metrics[key]} color={color} />
          </div>
        ))}
      </div>

      <div className="cp-tip">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{tip}</span>
      </div>

      <p className="cp-disclaimer">
        Simulated estimate based on agronomic parameters. Connect your ML model for real predictions.
      </p>
    </div>
  );
}