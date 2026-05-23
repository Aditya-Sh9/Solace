export const MOOD_LABELS = ['heavy', 'low', 'okay', 'gentle', 'bright', 'glowing'] as const;
export type MoodLabel = (typeof MOOD_LABELS)[number];

interface MoodFaceProps {
  index?: 0 | 1 | 2 | 3 | 4 | 5;
  size?: number;
  active?: boolean;
}

const sw = 1.7;
const s = {
  stroke: 'currentColor' as const,
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
};

const eyes = (
  <>
    <circle cx="8.4" cy="10" r=".9" fill="currentColor" stroke="none" />
    <circle cx="15.6" cy="10" r=".9" fill="currentColor" stroke="none" />
  </>
);

const closedEyes = (
  <>
    <path d="M7.4 10.4c.4-.7 1.6-.7 2 0M14.6 10.4c.4-.7 1.6-.7 2 0" {...s} strokeWidth={sw} />
  </>
);

const mouths = [
  <path key="m0" d="M7.6 16c1.6-1.6 7.2-1.6 8.8 0" />,
  <path key="m1" d="M7.6 15.2c1.6-.4 7.2-.4 8.8 0" />,
  <path key="m2" d="M8 14.6h8" />,
  <path key="m3" d="M8 13.6c1.4 1.4 6.6 1.4 8 0" />,
  <path key="m4" d="M7.6 12.8c1.6 2.2 7.2 2.2 8.8 0" />,
  <path key="m5" d="M7.4 12.4c1.6 2.6 7.6 2.6 9.2 0" />,
];

export default function MoodFace({ index = 3, size = 48, active = false }: MoodFaceProps) {
  const eyeContent = index === 0 || index === 5 ? closedEyes : eyes;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...s}
      strokeWidth={sw}
      style={{ color: active ? 'var(--ink)' : 'var(--ink-soft)' }}
    >
      <path d="M3.8 12c0-4.6 3.5-8 8.2-8 4.6 0 8.2 3.4 8.2 8.2 0 4.4-3.5 8-8.2 7.8-4.7-.2-8.2-3.6-8.2-8Z" />
      {eyeContent}
      {mouths[index]}
    </svg>
  );
}
