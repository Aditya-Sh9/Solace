'use client';

import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from './Icons';
import { IllustrationPlant } from './Illustrations';

export type FloatingDensity = 'minimal' | 'medium' | 'lots';

type FloatingKind = 'leaf' | 'plant' | 'dots' | 'star' | 'cloud' | 'circle' | 'sparkle';

interface FloatingItem {
  kind:   FloatingKind;
  top:    string;
  left:   string;
  size:   number;
  dur:    number;
  delay:  number;
  rot:    number;
  dx:     number;  // horizontal drift in px
  dy:     number;  // vertical drift in px
}

const ALL_ITEMS: FloatingItem[] = [
  // corners — leaves and plants anchor the edges
  { kind: 'leaf',    top: '8%',  left: '4%',  size: 60,  dur: 22, delay: 0,   rot: -12, dx:  6,  dy: -14 },
  { kind: 'leaf',    top: '70%', left: '88%', size: 80,  dur: 28, delay: 2,   rot:  20, dx: -8,  dy: -10 },
  { kind: 'plant',   top: '22%', left: '92%', size: 64,  dur: 26, delay: 1,   rot:   8, dx: -6,  dy:  12 },
  { kind: 'plant',   top: '78%', left: '3%',  size: 70,  dur: 24, delay: 3,   rot:  -6, dx:  8,  dy:  -8 },
  // mid — stars and sparkles, tiny
  { kind: 'star',    top: '12%', left: '60%', size: 28,  dur: 18, delay: 0.5, rot:   0, dx:  4,  dy:  -8 },
  { kind: 'star',    top: '55%', left: '12%', size: 22,  dur: 20, delay: 4,   rot:   0, dx: -4,  dy:   6 },
  { kind: 'sparkle', top: '50%', left: '70%', size: 18,  dur: 12, delay: 3,   rot:   0, dx:  3,  dy:  -6 },
  { kind: 'sparkle', top: '20%', left: '20%', size: 14,  dur: 14, delay: 0.8, rot:   0, dx: -3,  dy:   5 },
  // cloud and circle for texture
  { kind: 'cloud',   top: '35%', left: '78%', size: 70,  dur: 32, delay: 1.5, rot:   0, dx: -10, dy:  -6 },
  { kind: 'circle',  top: '88%', left: '45%', size: 16,  dur: 16, delay: 2.5, rot:   0, dx:  6,  dy: -10 },
  { kind: 'circle',  top: '5%',  left: '38%', size: 12,  dur: 14, delay: 1,   rot:   0, dx: -4,  dy:   8 },
  // dots grid — slow spin in center, very faint
  { kind: 'dots',    top: '45%', left: '50%', size: 200, dur: 60, delay: 0,   rot:   0, dx:   0, dy:   0 },
  // two extra items (added for slightly richer density)
  { kind: 'leaf',    top: '40%', left: '96%', size: 44,  dur: 30, delay: 5,   rot:  15, dx: -5,  dy: -10 },
  { kind: 'sparkle', top: '90%', left: '22%', size: 16,  dur: 16, delay: 2,   rot:   0, dx:  4,  dy:  -7 },
];

// minimal: 6 items (was 4)
// medium:  10 items (was 8)
// lots:    all 14
const COUNTS: Record<FloatingDensity, number> = { minimal: 6, medium: 10, lots: 14 };

// ─── Individual element ───────────────────────────────────────────────────────

function FloatingThing({ kind, top, left, size, dur, delay, rot, dx, dy, reduce }: FloatingItem & { reduce: boolean }) {
  const base: CSSProperties = {
    position: 'absolute',
    top, left,
    width: size,
    height: size,
    color: 'var(--accent)',
    opacity: kind === 'dots' ? 0.07 : 0.2,
  };

  // dots spin continuously; everything else drifts back and forth
  const animateProps = reduce
    ? {}
    : kind === 'dots'
      ? { rotate: 360 }
      : { x: [0, dx, 0], y: [0, dy, 0], rotate: [rot, rot + 5, rot] };

  const transitionProps = reduce
    ? {}
    : kind === 'dots'
      ? { duration: dur, ease: 'linear' as const, repeat: Infinity }
      : { duration: dur, ease: 'easeInOut' as const, repeat: Infinity, delay, times: [0, 0.5, 1] };

  const content: Record<FloatingKind, React.ReactNode> = {
    leaf: <Icon.Leaf size={size} />,
    plant: <IllustrationPlant size={size} />,
    star: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M12 3v18M3 12h18M5 5l14 14M19 5 5 19" />
      </svg>
    ),
    cloud: (
      <svg viewBox="0 0 64 40" width={size} height={size * 0.625} fill="none"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 28c-5 0-9-3-9-8s4-8 9-8c1-5 6-9 12-9s11 4 12 9c5 0 9 3 9 8s-4 8-9 8H14Z"
          fill="var(--accent-wash)" />
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    sparkle: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      </svg>
    ),
    dots: (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        {Array.from({ length: 9 }, (_, r) =>
          Array.from({ length: 9 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={10 + c * 10} cy={10 + r * 10} r="1"
              fill="currentColor" opacity={(r + c) % 3 === 0 ? 0.7 : 0.35} />
          ))
        ).flat()}
      </svg>
    ),
  };

  return (
    <motion.div
      style={base}
      animate={animateProps}
      transition={transitionProps}
    >
      {content[kind]}
    </motion.div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

export interface FloatingBackgroundProps {
  density?: FloatingDensity;
}

export default function FloatingBackground({ density = 'medium' }: FloatingBackgroundProps) {
  const reduce = useReducedMotion() ?? false;
  const items = ALL_ITEMS.slice(0, COUNTS[density]);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
    >
      {items.map((it, i) => (
        <FloatingThing key={i} {...it} reduce={reduce} />
      ))}
    </div>
  );
}
