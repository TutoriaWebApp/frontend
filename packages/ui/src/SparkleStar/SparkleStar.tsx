interface SparkleStarProps {
  size?: number;
  colorClass?: string;
  className?: string;
}

export function SparkleStar({
  size = 18,
  colorClass = "text-yellow-300",
  className = "",
}: SparkleStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${colorClass} drop-shadow-sm ${className}`}
    >
      <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
    </svg>
  );
}
