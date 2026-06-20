import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "../styles/FactorChart.css";

const FACTOR_META = {
  rainfall: { label: "Rainfall", color: "#185FA5" },
  temperature: { label: "Temperature", color: "#D85A30" },
  pesticide: { label: "Pesticide use", color: "#854F0B" },
  humidity: { label: "Humidity", color: "#3B6D11" },
};

function impactLabel(score) {
  if (score >= 95) return "Strong positive";
  if (score >= 80) return "Favorable";
  if (score >= 60) return "Moderate";
  return "Limiting factor";
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="cp-factor-tooltip">
      <div className="cp-factor-tooltip-name">{name}</div>
      <div className="cp-factor-tooltip-value">{value}% impact score</div>
      <div className="cp-factor-tooltip-tag">{impactLabel(value)}</div>
    </div>
  );
}

export default function FactorChart({ factors }) {
  if (!factors) return null;

  const data = Object.entries(factors).map(([key, value]) => ({
    key,
    name: FACTOR_META[key]?.label ?? key,
    value,
    color: FACTOR_META[key]?.color ?? "#888",
  }));

  const weakest = [...data].sort((a, b) => a.value - b.value)[0];

  return (
    <div className="cp-factor-card">
      <div className="cp-factor-header">
        <div>
          <div className="cp-factor-title">What's driving this prediction</div>
          <div className="cp-factor-sub">
            Relative impact of each environmental input on your estimated yield
          </div>
        </div>
      </div>

      <div className="cp-factor-chart-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
            <CartesianGrid horizontal={false} stroke="var(--color-border-tertiary, #e8ead8)" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#888" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 13, fill: "#1a1a1a" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={22}>
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {weakest && weakest.value < 95 && (
        <div className="cp-factor-callout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#854F0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
          <span>
            <strong>{FACTOR_META[weakest.key]?.label}</strong> is currently your biggest limiting
            factor — improving it could raise your yield the most.
          </span>
        </div>
      )}
    </div>
  );
}