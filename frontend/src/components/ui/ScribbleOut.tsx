interface ScribbleOutProps {
  width?: number;
  height?: number;
}

export default function ScribbleOut({ width = 200, height = 24 }: ScribbleOutProps) {
  const path = `M 4 ${height * 0.6}
    C ${width * 0.2} ${height * 0.2}, ${width * 0.4} ${height * 0.9}, ${width * 0.6} ${height * 0.3}
    S ${width * 0.85} ${height * 0.8}, ${width - 4} ${height * 0.5}
    M ${width - 4} ${height * 0.5}
    C ${width * 0.7} ${height * 0.2}, ${width * 0.5} ${height * 0.85}, ${width * 0.25} ${height * 0.4}
    S ${width * 0.1} ${height * 0.7}, 4 ${height * 0.55}`;

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <path
        d={path}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.6"
        strokeLinecap="round"
        style={{
          strokeDasharray: 1200,
          strokeDashoffset: 1200,
          animation: 'scribble-draw 700ms ease-out forwards',
        }}
      />
      <style>{`@keyframes scribble-draw { to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}
