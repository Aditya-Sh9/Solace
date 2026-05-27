'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Icon } from './Icons';
import NavPill from './NavPill';

export interface TopNavProps {
  screen: string;
  setScreen: (id: string) => void;
  profileName?: string;
  themePicker?: ReactNode;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Today',    icon: <Icon.Home    size={18} />, tilt: -1.2 },
  { id: 'checkin',   label: 'Check-in', icon: <Icon.Check   size={18} />, tilt:  0.8 },
  { id: 'journal',   label: 'Journal',  icon: <Icon.Journal size={18} />, tilt: -0.6 },
  { id: 'insights',  label: 'Insights', icon: <Icon.Sparkle size={18} />, tilt: -0.5 },
  { id: 'wellness',  label: 'Wellness', icon: <Icon.Flower  size={18} />, tilt:  1.0 },
];

export default function TopNav({ screen, setScreen, profileName, themePicker }: TopNavProps) {
  return (
    <header style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
      padding: '0 40px',
      height: 64,
      background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--ink-border)',
      transition: 'background-color 520ms ease, border-color 520ms ease',
    }}>

      {/* Column 1 — Logo, left-aligned */}
      <Link
        href="/dashboard"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
          justifySelf: 'start',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 32 32" style={{ color: 'var(--accent)', flexShrink: 0 }}>
          <path d="M16 5c-3 4-7 6-7 12a7 7 0 0 0 14 0c0-6-4-8-7-12Z"
            fill="var(--accent-wash)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 16c.5 1 2 2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <span className="serif italic" style={{ fontSize: 22, lineHeight: 1, color: 'var(--ink)' }}>
          Solace
        </span>
      </Link>

      {/* Column 2 — Nav pills, truly centered */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}>
        {NAV_ITEMS.map((it) => (
          <NavPill
            key={it.id}
            item={it}
            active={screen === it.id}
            onClick={() => setScreen(it.id)}
            tilt={it.tilt}
          />
        ))}
      </nav>

      {/* Column 3 — Profile + theme picker, right-aligned */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        justifySelf: 'end',
      }}>
        {/* Profile initial blob */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          color: 'var(--ink-muted)',
          fontSize: 13,
        }}>
          <div style={{
            width: 30,
            height: 30,
            background: 'var(--accent-wash)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--accent)',
            fontFamily: 'var(--font-serif)',
            fontSize: 14,
            borderRadius: '60% 50% 55% 65% / 55% 60% 50% 65%',
            border: '1px solid var(--ink-border)',
            flexShrink: 0,
          }}>
            {(profileName || 'Y').slice(0, 1)}
          </div>
          <span style={{ whiteSpace: 'nowrap' }}>{profileName || 'You'}</span>
        </div>

        {/* Theme / mode picker injected from AppShell */}
        {themePicker}
      </div>
    </header>
  );
}
