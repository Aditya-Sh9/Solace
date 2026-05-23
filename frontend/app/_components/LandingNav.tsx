'use client';

import Link from 'next/link';
import { ThemePicker, Icon } from '@/src/components/ui';
import { useTheme } from '@/src/hooks/use-theme';

export default function LandingNav() {
  const { theme, mode, setTheme, setMode } = useTheme();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 64,
      background: 'color-mix(in oklab, var(--bg) 82%, transparent)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--ink-border)',
      transition: 'background-color 520ms ease, border-color 520ms ease',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <svg width="28" height="28" viewBox="0 0 32 32" style={{ color: 'var(--accent)', flexShrink: 0 }}>
          <path d="M16 5c-3 4-7 6-7 12a7 7 0 0 0 14 0c0-6-4-8-7-12Z"
            fill="var(--accent-wash)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 16c.5 1 2 2 3 2"
            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <span className="serif italic" style={{ fontSize: 20, lineHeight: 1, color: 'var(--ink)' }}>
          Solace
        </span>
      </Link>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ThemePicker theme={theme} mode={mode} setTheme={setTheme} setMode={setMode} />
        <Link href="/app" className="ink-btn ink-btn--primary ink-btn--sm">
          Begin
          <Icon.ChevronRight size={13} />
        </Link>
      </div>
    </header>
  );
}
