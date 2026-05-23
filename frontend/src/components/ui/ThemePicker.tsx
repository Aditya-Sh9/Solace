'use client';

import { useState } from 'react';
import InkCard from './InkCard';
import { Icon } from './Icons';
import { type ThemeId, type ColorMode, THEME_DEFINITIONS } from '@/src/config/themes';

export type { ThemeId, ColorMode };

export const THEMES = THEME_DEFINITIONS.map(({ id, label, swatch }) => ({ id, label, swatch }));

export interface ThemePickerProps {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
}

export default function ThemePicker({ theme, setTheme, mode, setMode }: ThemePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <button
        className="ink-btn ink-btn--ghost ink-btn--sm"
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        aria-label="Toggle light/dark"
        type="button"
        style={{ padding: 8, borderRadius: '60% 50% 65% 55% / 55% 65% 50% 60%' }}
      >
        {mode === 'light' ? <Icon.Sun size={18} /> : <Icon.Moon size={18} />}
      </button>

      <button
        className="ink-btn ink-btn--ghost ink-btn--sm"
        onClick={() => setOpen(!open)}
        aria-label="Choose theme"
        type="button"
        style={{ padding: 8, borderRadius: '55% 65% 50% 60% / 60% 55% 65% 50%' }}
      >
        <Icon.Palette size={18} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
          />
          <InkCard style={{
            position: 'absolute', top: 'calc(100% + 10px)', right: 0,
            padding: 16, zIndex: 50, minWidth: 200,
            animation: 'ink-fade-in 240ms cubic-bezier(.34,1.4,.64,1) both',
          }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Theme</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'transparent', border: '1px solid var(--ink-border)',
                    borderRadius: '14px 10px 16px 12px / 10px 14px 12px 16px',
                    padding: '8px 10px', cursor: 'pointer', color: 'var(--ink)',
                    fontFamily: 'DM Sans', fontSize: 13,
                    transform: theme === t.id ? 'rotate(-1deg)' : 'none',
                    boxShadow: theme === t.id ? '0 0 0 2px var(--accent-wash)' : 'none',
                    transition: 'all 240ms cubic-bezier(.34,1.4,.64,1)',
                  }}
                >
                  <span style={{
                    width: 22, height: 22, display: 'inline-block',
                    background: `linear-gradient(135deg, ${t.swatch[0]} 50%, ${t.swatch[1]} 50%)`,
                    borderRadius: '60% 50% 55% 65% / 55% 60% 50% 65%',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }} />
                  {t.label}
                </button>
              ))}
            </div>
          </InkCard>
        </>
      )}
    </div>
  );
}
