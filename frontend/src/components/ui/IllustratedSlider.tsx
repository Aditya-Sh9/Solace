'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';

export interface IllustratedSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  icon?: ReactNode;
  color?: string;
  unit?: string;
}

export default function IllustratedSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  icon,
  color,
  unit = '',
}: IllustratedSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rawPct = ((value - min) / (max - min)) * 100
  const pct = Number.isFinite(rawPct) ? Math.max(0, Math.min(100, rawPct)) : 0;

  const setFromMouse = (e: globalThis.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(Math.round(min + p * (max - min)));
  };

  const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onChange(Math.round(min + p * (max - min)));
    const up = () => {
      window.removeEventListener('mousemove', setFromMouse);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', setFromMouse);
    window.addEventListener('mouseup', up);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)' }}>
          {icon}
          <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
        </div>
        <div className="hand" style={{ fontSize: 22, color: 'var(--accent)' }}>
          {value}{unit}
        </div>
      </div>
      <div
        ref={trackRef}
        onMouseDown={onDown}
        style={{ position: 'relative', height: 22, cursor: 'pointer', padding: '8px 0' }}
      >
        <svg width="100%" height="14" viewBox="0 0 400 14" preserveAspectRatio="none"
          style={{ position: 'absolute', top: 4, left: 0, pointerEvents: 'none' }}>
          <path d="M 4 7 Q 50 4 100 7 T 200 7 T 300 7 T 396 7"
            stroke="var(--ink-faint)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
        {pct > 0 && (
          <svg width={`${pct}%`} height="14" viewBox={`0 0 ${pct * 4} 14`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', top: 4, left: 0, pointerEvents: 'none', overflow: 'visible' }}>
            <path d={`M 4 7 Q ${pct} 3 ${pct * 2} 7 T ${pct * 4} 7`}
              stroke={color || 'var(--accent)'} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </svg>
        )}
        <div style={{
          position: 'absolute', top: '50%', left: `calc(${pct}% - 9px)`,
          width: 18, height: 18, transform: 'translateY(-50%)',
          background: color || 'var(--accent)',
          borderRadius: '60% 50% 55% 65% / 55% 60% 50% 65%',
          boxShadow: '0 2px 6px -1px rgba(0,0,0,0.18)', pointerEvents: 'none',
          transition: 'left 220ms cubic-bezier(.34,1.4,.64,1)',
        }} />
      </div>
    </div>
  );
}
