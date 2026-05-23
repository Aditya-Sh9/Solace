// Hand-drawn SVG icon set for Solace.
// Every icon accepts size (px) and color (any CSS color or variable).
// Default color is currentColor — wrap in a colored element to tint.

export interface IconProps {
  size?: number;
  color?: string;
}

// Returns SVG base attributes driven by the color prop
const b = (color: string) => ({
  stroke: color,
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
});

export const Icon = {
  Home: ({ size = 22, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M3.5 11.2 12 4l8.5 7.2" />
      <path d="M5.2 10.4v8.8c0 .5.4.9.9.9h11.7c.5 0 .9-.4.9-.9v-8.8" />
      <path d="M10 20v-5.2c0-.4.3-.8.8-.8h2.4c.4 0 .8.4.8.8V20" />
    </svg>
  ),
  Check: ({ size = 22, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M8.5 12.4 11 14.8l4.6-5.2" />
    </svg>
  ),
  Journal: ({ size = 22, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M5.4 4.6h11c.6 0 1.1.5 1.1 1.1v13c0 .6-.5 1.1-1.1 1.1h-11c-.6 0-1.1-.5-1.1-1.1V5.7c0-.6.5-1.1 1.1-1.1Z" />
      <path d="M7.8 8.5h7.2M7.8 12h6M7.8 15.4h4.6" />
      <path d="M5.4 4.6c-.6 0-1.1.5-1.1 1.1v13" />
    </svg>
  ),
  Flower: ({ size = 22, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.6V5.4M12 14.4v4.2M9.6 12H5.4M14.4 12h4.2M10.3 10.3 7.3 7.3M13.7 13.7l3 3M13.7 10.3l3-3M10.3 13.7l-3 3" />
    </svg>
  ),
  Settings: ({ size = 22, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 4.2v2.4M12 17.4v2.4M4.2 12h2.4M17.4 12h2.4M6.6 6.6l1.7 1.7M15.7 15.7l1.7 1.7M17.4 6.6l-1.7 1.7M8.3 15.7l-1.7 1.7" />
    </svg>
  ),
  Plus: ({ size = 18, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  ),
  Mic: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <rect x="9.4" y="3.8" width="5.4" height="10.2" rx="2.6" />
      <path d="M6 11.4c0 3.5 2.7 6.2 6 6.2s6-2.7 6-6.2M12 17.6v2.6M9.4 20.2h5.4" />
    </svg>
  ),
  Lock: ({ size = 16, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <rect x="5.2" y="11" width="13.4" height="8.6" rx="2" />
      <path d="M8.4 11V8.2a3.6 3.6 0 0 1 7.2 0V11" />
    </svg>
  ),
  ChevronRight: ({ size = 18, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M9.6 6 16 12l-6.4 6" />
    </svg>
  ),
  ChevronLeft: ({ size = 18, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M14.4 6 8 12l6.4 6" />
    </svg>
  ),
  Edit: ({ size = 16, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M4.6 19.4 5.4 16l9.6-9.6c.4-.4 1-.4 1.4 0L18 7.8c.4.4.4 1 0 1.4L8.4 18.8l-3.4.8c-.3.1-.5-.1-.4-.4Z" />
      <path d="M13.6 8 16 10.4" />
    </svg>
  ),
  Trash: ({ size = 16, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M5 7.4h14M9.4 7.4V5.6c0-.6.5-1 1-1h3.2c.5 0 1 .4 1 1v1.8M7 7.4 8 19.6c.1.6.6 1 1.2 1h5.6c.6 0 1.1-.4 1.2-1L17 7.4" />
    </svg>
  ),
  Palette: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M12 4.2c-4.6 0-8 3.2-8 7.6 0 4.4 3.4 7.4 7.4 7.4 1 0 1.4-.6 1.4-1.4 0-.6-.4-1-.4-1.6 0-.8.6-1.4 1.4-1.4h1.8c2.4 0 4-1.6 4-4 0-3.6-3.4-6.6-7.6-6.6Z" />
      <circle cx="8.4" cy="10.4" r=".8" fill={color} stroke="none" />
      <circle cx="11.6" cy="7.6" r=".8" fill={color} stroke="none" />
      <circle cx="15.4" cy="9.8" r=".8" fill={color} stroke="none" />
    </svg>
  ),
  Sun: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M5.8 5.8l1.6 1.6M16.6 16.6l1.6 1.6M18.2 5.8l-1.6 1.6M7.4 16.6 5.8 18.2" />
    </svg>
  ),
  Moon: ({ size = 20, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M19.2 14.6c-.6.2-1.2.2-1.8.2-4.4 0-7.8-3.4-7.8-7.8 0-.8.2-1.6.4-2.4-3.4.8-5.8 3.8-5.8 7.4 0 4.2 3.4 7.6 7.6 7.6 3.2 0 5.8-1.8 7.4-5Z" />
    </svg>
  ),
  Sparkle: ({ size = 14, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M12 4v5M12 15v5M4 12h5M15 12h5" />
    </svg>
  ),
  Heart: ({ size = 14, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M12 19s-7-4-7-9.4C5 7 7 5.4 9.2 5.4c1.6 0 2.4 1 2.8 1.8.4-.8 1.2-1.8 2.8-1.8 2.2 0 4.2 1.6 4.2 4.2 0 5.4-7 9.4-7 9.4Z" />
    </svg>
  ),
  Star: ({ size = 14, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="m12 4.6 2.4 4.8 5.4.8-3.8 3.7.9 5.3-4.9-2.6-4.9 2.6.9-5.3L4 10.2l5.4-.8L12 4.6Z" />
    </svg>
  ),
  Leaf: ({ size = 14, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M5 19s.5-9 6-12c4-2 8 0 8 0s-1 5-4 8-9 5-10 4Z" />
      <path d="M5 19 12 12" />
    </svg>
  ),
  Drop: ({ size = 16, color = 'currentColor' }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" {...b(color)}>
      <path d="M12 3.6S5.4 11 5.4 15.2A6.6 6.6 0 0 0 12 21.8 6.6 6.6 0 0 0 18.6 15.2C18.6 11 12 3.6 12 3.6Z" />
    </svg>
  ),
};

// ── Mood faces (0 = heavy … 5 = glowing) ──────────────────────────────────

export const MOOD_LABELS = ['heavy', 'low', 'okay', 'gentle', 'bright', 'glowing'] as const;
export type MoodLabel = (typeof MOOD_LABELS)[number];

export interface MoodFaceProps {
  index?: 0 | 1 | 2 | 3 | 4 | 5;
  size?: number;
  color?: string;
  active?: boolean;
}

const SW = 1.7;

const mouths = [
  <path key="m0" d="M7.6 16c1.6-1.6 7.2-1.6 8.8 0" />,
  <path key="m1" d="M7.6 15.2c1.6-.4 7.2-.4 8.8 0" />,
  <path key="m2" d="M8 14.6h8" />,
  <path key="m3" d="M8 13.6c1.4 1.4 6.6 1.4 8 0" />,
  <path key="m4" d="M7.6 12.8c1.6 2.2 7.2 2.2 8.8 0" />,
  <path key="m5" d="M7.4 12.4c1.6 2.6 7.6 2.6 9.2 0" />,
];

function openEyes(c: string) {
  return (
    <>
      <circle cx="8.4" cy="10" r=".9" fill={c} stroke="none" />
      <circle cx="15.6" cy="10" r=".9" fill={c} stroke="none" />
    </>
  );
}

function closedEyes(c: string) {
  return (
    <>
      <path d="M7.4 10.4c.4-.7 1.6-.7 2 0M14.6 10.4c.4-.7 1.6-.7 2 0"
        stroke={c} strokeWidth={SW} strokeLinecap="round" fill="none" />
    </>
  );
}

export function MoodFace({ index = 3, size = 48, color, active = false }: MoodFaceProps) {
  const c = color ?? (active ? 'var(--ink)' : 'var(--ink-soft)');
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      stroke={c} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M3.8 12c0-4.6 3.5-8 8.2-8 4.6 0 8.2 3.4 8.2 8.2 0 4.4-3.5 8-8.2 7.8-4.7-.2-8.2-3.6-8.2-8Z" />
      {index === 0 || index === 5 ? closedEyes(c) : openEyes(c)}
      {mouths[index]}
    </svg>
  );
}
