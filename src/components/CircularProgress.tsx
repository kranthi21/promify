interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  isWork: boolean;
}

export const CircularProgress = ({
  progress,
  size = 240,
  strokeWidth = 8,
  isWork,
}: CircularProgressProps) => {
  const workColor = '#f97316';
  const breakColor = '#0ea5a4';
  const strokeColor = isWork ? workColor : breakColor;

  const radius = (size - strokeWidth) / 2;
  const centerX = size / 2;
  const centerY = size;

  const arcLength = Math.PI * radius;
  const offset = arcLength - (progress / 100) * arcLength;

  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;

  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);

  const endX = centerX + radius * Math.cos(endAngle);
  const endY = centerY + radius * Math.sin(endAngle);

  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  return (
    <svg
      width={size}
      height={size / 2 + strokeWidth}
      className="circular-progress"
      viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
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

      <path
        d={arcPath}
        fill="none"
        stroke="rgba(255, 255, 255, 0.1)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      <path
        d={arcPath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={arcLength}
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
