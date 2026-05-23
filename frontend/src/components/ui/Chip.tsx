'use client';

import type { MouseEventHandler, ReactNode } from 'react';

export interface ChipProps {
  children?: ReactNode;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tilt?: number;
  className?: string;
}

export default function Chip({ children, active = false, onClick, tilt = 0, className = '' }: ChipProps) {
  return (
    <button
      className={`chip${active ? ' chip--on' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClick}
      type="button"
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </button>
  );
}
