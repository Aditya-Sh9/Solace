import type { ReactNode } from 'react';
import { Icon } from './Icons';

const s = {
  stroke: 'currentColor' as const,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  fill: 'none' as const,
};

export function IllustrationSunMoon({ time = 'evening', size = 56 }: { time?: string; size?: number }) {
  const isMoon = time === 'evening' || time === 'night';
  return isMoon ? (
    <svg width={size} height={size} viewBox="0 0 64 64" {...s} strokeWidth="1.8" style={{ color: 'var(--accent)' }}>
      <path d="M48 38c-1.4.4-3 .6-4.6.6-9.4 0-17-7.6-17-17 0-1.8.2-3.6.8-5.2C19 18.8 13.6 25.6 13.6 33.6 13.6 43.2 21.4 51 31 51c7.8 0 14.4-5 17-13Z" fill="var(--accent-wash)" />
      <circle cx="14" cy="14" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="52" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="22" cy="8" r=".8" fill="currentColor" stroke="none" />
    </svg>
  ) : (
    <svg width={size} height={size} viewBox="0 0 64 64" {...s} strokeWidth="1.8" style={{ color: 'var(--accent)' }}>
      <circle cx="32" cy="32" r="10" fill="var(--accent-wash)" />
      <path d="M32 14v4M32 46v4M14 32h4M46 32h4M19 19l2.8 2.8M42.2 42.2l2.8 2.8M45 19l-2.8 2.8M21.8 42.2 19 45" />
    </svg>
  );
}

export function IllustrationPlant({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" {...s} strokeWidth="1.6" style={{ color: 'var(--accent)' }}>
      <path d="M40 64V36" />
      <path d="M40 44C32 40 24 42 22 48c4 4 12 4 18 0M40 38c8-4 16-2 18 4-4 4-12 4-18 0M40 30c-6-2-12 0-14 6 4 2 10 0 14-2M40 26c6-2 12 2 14 8-4 2-10 0-14-2" fill="var(--accent-wash)" />
      <path d="M28 64h24c.6 0 1 .4 1 1l-1 6c-.1.6-.6 1-1.2 1H29.2c-.6 0-1.1-.4-1.2-1l-1-6c0-.6.4-1 1-1Z" fill="var(--surface-2)" />
    </svg>
  );
}

export function IllustrationCup({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" {...s} strokeWidth="1.6" style={{ color: 'var(--accent)' }}>
      <path d="M20 32h36v22c0 6-5 10-11 10H31c-6 0-11-4-11-10V32Z" fill="var(--accent-wash)" />
      <path d="M56 38h6c4 0 6 3 6 6s-2 6-6 6h-6" />
      <path d="M30 22c0-2 2-4 4-4M42 22c0-2 2-4 4-4M50 22c0-2-2-4-4-4" strokeWidth="1.4" />
    </svg>
  );
}

export function IllustrationLeaves({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" {...s} strokeWidth="1.6" style={{ color: 'var(--accent)' }}>
      <path d="M14 60c2-18 14-30 30-32 4-.4 6 2 4 6-4 10-16 22-32 28-2 .8-3-.4-2-2Z" fill="var(--accent-wash)" />
      <path d="M18 56c8-8 18-18 28-22" strokeWidth="1.2" />
      <path d="M50 18c4-2 8-2 12 0M62 18c2 4 2 8 0 12" />
    </svg>
  );
}

export function IllustrationStamp({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      <div className="hand" style={{
        position: 'absolute', bottom: -8, right: -10, fontSize: 18,
        color: 'var(--accent)', transform: 'rotate(-8deg)',
      }}>
        {label}
      </div>
    </div>
  );
}

export function HandDrawnUnderline({
  width = 200,
  color = 'var(--accent)',
  strokeWidth = 2.2,
}: {
  width?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={width}
      height="8"
      viewBox={`0 0 ${width} 8`}
      fill="none"
      style={{ display: 'block', marginTop: 2, overflow: 'visible' }}
      aria-hidden
    >
      <path
        d={`M 4 4 C ${width * 0.18} 1, ${width * 0.32} 7, ${width * 0.5} 4 S ${width * 0.78} 1, ${width - 4} 4`}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function WavyUnderline({ width = 80, color = 'var(--accent)' }: { width?: number; color?: string }) {
  return (
    <svg width={width} height="6" viewBox={`0 0 ${width} 6`} fill="none" style={{ display: 'block' }}>
      <path
        d={`M2 3 Q ${width * 0.25} -1 ${width * 0.5} 3 T ${width - 2} 3`}
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

type DoodleKind = 'star' | 'heart' | 'leaf' | 'sparkle' | 'dot';

export function MarginDoodle({ kind = 'star' }: { kind?: DoodleKind }) {
  const c: React.CSSProperties = { color: 'var(--accent)', opacity: 0.7 };
  if (kind === 'star') return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={c}>
      <path d="M7 2v10M2 7h10M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
  if (kind === 'heart') return <Icon.Heart size={14} />;
  if (kind === 'leaf')  return <Icon.Leaf size={14} />;
  if (kind === 'sparkle') return <Icon.Sparkle size={12} />;
  if (kind === 'dot') return (
    <svg width="6" height="6" viewBox="0 0 6 6">
      <circle cx="3" cy="3" r="2" fill="currentColor" style={c} />
    </svg>
  );
  return null;
}
