import "../styles/StepIndicator.css";

const steps = ["Crop", "Weather", "Field", "Result"];

export default function StepIndicator({ activeStep }) {
  return (
    <div className="cp-steps">
      {steps.map((label, i) => {
        const num = i + 1;
        const isActive = num <= activeStep;
        return (
          <div key={label} className={`cp-step${isActive ? " active" : ""}`}>
            <div className="cp-step-num">{num}</div>
            <div className="cp-step-label">{label}</div>
          </div>
        );
      })}
    </div>
  );
}