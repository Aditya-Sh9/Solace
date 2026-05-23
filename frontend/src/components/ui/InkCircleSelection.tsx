interface InkCircleSelectionProps {
  size?: number;
  active?: boolean;
}

export default function InkCircleSelection({ size = 64, active = false }: InkCircleSelectionProps) {
  const path = `M ${size * 0.85} ${size * 0.5}
    C ${size * 0.85} ${size * 0.72}, ${size * 0.72} ${size * 0.88}, ${size * 0.5} ${size * 0.88}
    C ${size * 0.26} ${size * 0.86}, ${size * 0.13} ${size * 0.7}, ${size * 0.15} ${size * 0.48}
    C ${size * 0.17} ${size * 0.26}, ${size * 0.34} ${size * 0.13}, ${size * 0.54} ${size * 0.14}
    C ${size * 0.76} ${size * 0.15}, ${size * 0.88} ${size * 0.32}, ${size * 0.85} ${size * 0.5} Z`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{
          strokeDasharray: 220,
          strokeDashoffset: active ? 0 : 220,
          transition: 'stroke-dashoffset 540ms cubic-bezier(.6,.1,.4,.9)',
        }}
      />
    </svg>
  );
}
