export function SparkleStarOutline({
  size = 24,
  stroke = "#c9c9c9",
  className = "",
}: {
  size?: number;
  stroke?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
