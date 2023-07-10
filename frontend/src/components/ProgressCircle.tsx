import "../styles/ProgressBar.css";

const CircleProgressBar = ({
  progress,
  latest,
  type,
}: {
  progress: number;
  latest: string;
  type: string;
}) => {
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      <svg className="circle-progress-bar" width={size} height={size}>
        <defs>
          <linearGradient
            id="progress-gradient"
            x1="10%"
            y1="10%"
            x2="100%"
            y2="40%"
          >
            <stop offset="0%" stopColor="#34CFA3" />
            <stop offset="100%" stopColor="#28A745" />
          </linearGradient>
          <linearGradient
            id="background-gradient"
            x1="40%"
            y1="50%"
            x2="100%"
            y2="30%"
          >
            <stop offset="0%" stopColor="#f0f" />
            <stop offset="100%" stopColor="#0ff" />
          </linearGradient>
        </defs>
        <circle
          className="circle-background"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          stroke={`url(#background-gradient)`}
        />
        <circle
          className="circle-progress"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          stroke={`url(#progress-gradient)`}
        />
        <text
          className="circle-text"
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {latest}
        </text>
        <text
          className="circle-text"
          x="50%"
          y="30%"
          dominantBaseline="middle"
          textAnchor="middle"
        >
          {type}
        </text>
      </svg>
    </>
  );
};

export default CircleProgressBar;
