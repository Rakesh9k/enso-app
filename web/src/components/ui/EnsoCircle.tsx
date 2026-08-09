interface EnsoCircleProps {
  size?: number;
  className?: string;
}

export default function EnsoCircle({ size = 48, className = '' }: EnsoCircleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="220"
        strokeDashoffset="20"
        opacity="0.6"
      />
    </svg>
  );
}
