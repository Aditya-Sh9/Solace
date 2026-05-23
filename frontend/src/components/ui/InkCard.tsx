'use client';

import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { useMemo } from 'react';
import HandDrawnFrame from './HandDrawnFrame';

function PaperTextureLayer() {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 'inherit',
      pointerEvents: 'none', opacity: 0.5, mixBlendMode: 'multiply',
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      backgroundSize: '200px',
    }} />
  );
}

export type CardVariant = 'default' | 'paper' | 'soft' | 'note' | 'torn';

export interface InkCardProps {
  children?: ReactNode;
  className?: string;
  variant?: CardVariant;
  tilt?: number;
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLDivElement>;
  hoverable?: boolean;
  paperTexture?: boolean;
  hand?: boolean;
  handIntensity?: number;
  handColor?: string;
  handFill?: string;
  handRadius?: number;
  handDashed?: boolean;
}

export default function InkCard({
  children,
  className = '',
  variant = 'default',
  tilt = 0,
  style = {},
  onClick,
  hoverable = false,
  paperTexture = false,
  hand = false,
  handIntensity = 1.6,
  handColor,
  handFill,
  handRadius,
  handDashed = false,
}: InkCardProps) {
  const seed = useMemo(() => Math.floor(Math.random() * 9999), []);

  let resolvedFill = handFill;
  if (hand && !resolvedFill) {
    if (style.background) resolvedFill = style.background as string;
    else if (variant === 'paper') resolvedFill = 'var(--paper)';
    else if (variant === 'soft')  resolvedFill = 'color-mix(in oklab, var(--surface) 50%, var(--bg))';
    else if (variant === 'note')  resolvedFill = 'var(--paper)';
    else resolvedFill = 'var(--surface)';
  }

  const cls = [
    'ink-card',
    hand             && 'ink-card--hand',
    variant === 'paper' && 'ink-card--paper',
    variant === 'soft'  && 'ink-card--soft',
    variant === 'note'  && 'ink-card--note',
    variant === 'torn'  && 'ink-card--torn',
    className,
  ].filter(Boolean).join(' ');

  const baseTransform = tilt ? `rotate(${tilt}deg)` : '';

  const mergedStyle: CSSProperties = {
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 360ms cubic-bezier(.34,1.3,.64,1), filter 320ms ease, background-color 520ms ease',
    position: 'relative',
    ...style,
    ...(hand ? { background: 'transparent', border: 'none' } : {}),
    ...(baseTransform ? { transform: baseTransform } : {}),
  };

  const onEnter = hoverable ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `${baseTransform} translateY(-3px) scale(1.012)`.trim();
    e.currentTarget.style.filter = 'drop-shadow(0 14px 18px rgba(0,0,0,0.08))';
  } : undefined;

  const onLeave = hoverable ? (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = baseTransform;
    e.currentTarget.style.filter = '';
  } : undefined;

  return (
    <div
      className={cls}
      onClick={onClick}
      style={mergedStyle}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {hand && (
        <HandDrawnFrame
          seed={seed}
          jitter={handIntensity}
          radius={handRadius}
          fill={resolvedFill}
          stroke={handColor || 'var(--ink-soft)'}
          dashed={handDashed}
        />
      )}
      {paperTexture && <PaperTextureLayer />}
      {children}
    </div>
  );
}
