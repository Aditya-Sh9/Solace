'use client';

import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export type ButtonVariant = 'default' | 'primary' | 'ghost';
export type ButtonSize = 'md' | 'sm';

export interface InkButtonProps {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

export default function InkButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  icon,
  iconRight,
  disabled,
  className = '',
  style,
  type = 'button',
}: InkButtonProps) {
  const cls = [
    'ink-btn',
    variant === 'primary' && 'ink-btn--primary',
    variant === 'ghost'   && 'ink-btn--ghost',
    size === 'sm'         && 'ink-btn--sm',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style} type={type}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
