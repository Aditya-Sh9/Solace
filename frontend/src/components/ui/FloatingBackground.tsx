'use client';

import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { Icon } from './Icons';
import { IllustrationPlant } from './Illustrations';

export type FloatingDensity = 'minimal' | 'medium' | 'lots';

type FloatingKind = 'leaf' | 'plant' | 'dots' | 'star' | 'cloud' | 'circle' | 'sparkle';

interface FloatingItem {
  kind: FloatingKind;
  top: string;
  left: string;
  size: number;
  dur: number;
  delay: number;
  rot: number;
}

const ALL_ITEMS: FloatingItem[] = [
  { kind: 'leaf',    top: '8%',  left: '4%',  size: 60,  dur: 22, delay: 0,   rot: -12 },
  { kind: 'leaf',    top: '70%', left: '88%', size: 80,  dur: 28, delay: -8,  rot:  20 },
  { kind: 'plant',   top: '22%', left: '92%', size: 64,  dur: 26, delay: -4,  rot:   8 },
  { kind: 'plant',   top: '78%', left: '3%',  size: 70,  dur: 24, delay: -14, rot:  -6 },
  { kind: 'dots',    top: '45%', left: '50%', size: 200, dur: 40, delay: 0,   rot:   0 },
  { kind: 'star',    top: '12%', left: '60%', size: 28,  dur: 18, delay: -3,  rot:   0 },
  { kind: 'star',    top: '55%', left: '12%', size: 22,  dur: 20, delay: -10, rot:   0 },
  { kind: 'cloud',   top: '35%', left: '78%', size: 70,  dur: 32, delay: -6,  rot:   0 },
  { kind: 'circle',  top: '88%', left: '45%', size: 16,  dur: 16, delay: -2,  rot:   0 },
  { kind: 'circle',  top: '5%',  left: '38%', size: 12,  dur: 14, delay: -7,  rot:   0 },
  { kind: 'sparkle', top: '50%', left: '70%', size: 18,  dur: 12, delay: -5,  rot:   0 },
  { kind: 'sparkle', top: '20%', left: '20%', size: 14,  dur: 14, delay: -9,  rot:   0 },
];

function FloatingThing({ kind, top, left, size, dur, delay, rot = 0 }: FloatingItem) {
  const animMap: Record<FloatingKind, string> = {
    leaf:    `drift-1 ${dur}s ease-in-out ${delay}s infinite`,
    plant:   `drift-2 ${dur}s ease-in-out ${delay}s infinite`,
    star:    `pulse-soft ${dur}s ease-in-out ${delay}s infinite`,
    cloud:   `drift-1 ${dur}s ease-in-out ${delay}s infinite`,
    circle:  `pulse-soft ${dur}s ease-in-out ${delay}s infinite`,
    sparkle: `pulse-soft ${dur}s ease-in-out ${delay}s infinite`,
    dots:    `spin-slow ${dur}s linear infinite`,
  };

  const baseStyle = {
    position: 'absolute' as const, top, left,
    width: size, height: size,
    color: 'var(--accent)',
    opacity: kind === 'dots' ? 0.08 : 0.22,
    animation: animMap[kind],
    ['--rot']: `${rot}deg`,
    transform: `rotate(${rot}deg)`,
  } as CSSProperties;

  const content: Record<FloatingKind, React.ReactNode> = {
    leaf: <Icon.Leaf size={size} />,
    plant: <IllustrationPlant size={size} />,
    star: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M12 3v18M3 12h18M5 5l14 14M19 5 5 19" />
      </svg>
    ),
    cloud: (
      <svg viewBox="0 0 64 40" width={size} height={size * 0.625} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 28c-5 0-9-3-9-8s4-8 9-8c1-5 6-9 12-9s11 4 12 9c5 0 9 3 9 8s-4 8-9 8H14Z" fill="var(--accent-wash)" />
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <circle cx="12" cy="12" r="6" fill="currentColor" opacity="0.5" />
      </svg>
    ),
    sparkle: (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
      </svg>
    ),
    dots: (
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        {Array.from({ length: 9 }, (_, r) =>
          Array.from({ length: 9 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={10 + c * 10} cy={10 + r * 10} r="1"
              fill="currentColor" opacity={(r + c) % 3 === 0 ? 0.7 : 0.35} />
          ))
        ).flat()}
      </svg>
    ),
  };

  return <div style={baseStyle}>{content[kind]}</div>;
}

export interface FloatingBackgroundProps {
  density?: FloatingDensity;
}

export default function FloatingBackground({ density = 'medium' }: FloatingBackgroundProps) {
  const items = useMemo(() => {
    if (density === 'minimal') return ALL_ITEMS.slice(0, 4);
    if (density === 'lots')    return ALL_ITEMS;
    return ALL_ITEMS.slice(0, 8);
  }, [density]);

  return (
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {items.map((it, i) => <FloatingThing key={i} {...it} />)}
      <style>{`
        @keyframes drift-1 {
          0%,100% { transform: translate(0,0) rotate(var(--rot, 0deg)); }
          50%     { transform: translate(8px,-14px) rotate(calc(var(--rot, 0deg) + 6deg)); }
        }
        @keyframes drift-2 {
          0%,100% { transform: translate(0,0) rotate(var(--rot, 0deg)); }
          50%     { transform: translate(-10px,12px) rotate(calc(var(--rot, 0deg) - 5deg)); }
        }
        @keyframes spin-slow  { to { transform: rotate(360deg); } }
        @keyframes pulse-soft {
          0%,100% { opacity: .35; transform: scale(1); }
          50%     { opacity: .65; transform: scale(1.18); }
        }
      `}</style>
    </div>
  );
}
