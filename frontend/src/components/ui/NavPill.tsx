'use client';

import type { ReactNode } from 'react';
import { useId, useMemo, useState } from 'react';
import HandDrawnFrame from './HandDrawnFrame';

function stableHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return (Math.abs(h) % 8999) + 1;
}

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

interface NavPillProps {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  tilt?: number;
}

export default function NavPill({ item, active, onClick, tilt = 0 }: NavPillProps) {
  const [hover, setHover] = useState(false);
  const id   = useId();
  const seed = useMemo(() => stableHash(item.id + id), [item.id, id]);
  const fill   = active ? 'var(--accent-wash)' : hover ? 'var(--surface)' : 'transparent';
  const stroke = active ? 'var(--accent)' : 'var(--ink-soft)';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      type="button"
      style={{
        position: 'relative',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '9px 16px',
        background: 'transparent', border: 'none',
        cursor: 'pointer', color: active ? 'var(--ink)' : 'var(--ink-soft)',
        fontFamily: 'DM Sans, sans-serif', fontSize: 13.5, fontWeight: 500,
        transform: `rotate(${tilt}deg)${hover && !active ? ' translateY(-2px)' : ''}`,
        transition: 'transform 320ms cubic-bezier(.34,1.3,.64,1), color 240ms ease',
        zIndex: 1,
      }}
    >
      <HandDrawnFrame
        seed={seed}
        jitter={1.4}
        fill={fill}
        stroke={stroke}
        strokeWidth={active ? 1.6 : 1.3}
        radius={18}
      />
      <span style={{ display: 'inline-flex', position: 'relative', zIndex: 2, color: active ? 'var(--accent)' : 'inherit' }}>
        {item.icon}
      </span>
      <span style={{ position: 'relative', zIndex: 2 }}>{item.label}</span>
    </button>
  );
}
