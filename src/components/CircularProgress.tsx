interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isWork: boolean;
}

export const CircularProgress = ({
  progress,
  size = 280,
  strokeWidth = 8,
  isWork,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const workColor = '#f97316';
  const breakColor = '#0ea5a4';
  const strokeColor = isWork ? workColor : breakColor;

  return (
    <svg
      width={size}
      height={size}
      className="circular-progress"
      style={{
        transform: 'rotate(-90deg)',
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        filter="url(#glow)"
        style={{
          transition: 'stroke-dashoffset 1s linear',
        }}
      />
    </svg>
  );
};
