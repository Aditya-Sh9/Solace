'use client';

import type { ReactNode } from 'react';
import { Icon } from './Icons';
import NavPill from './NavPill';

export interface TopNavProps {
  screen: string;
  setScreen: (id: string) => void;
  profileName?: string;
  themePicker?: ReactNode;
}

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Today',    icon: <Icon.Home size={18} />,    tilt: -1.2 },
  { id: 'checkin',    label: 'Check-in', icon: <Icon.Check size={18} />,   tilt:  0.8 },
  { id: 'journal',    label: 'Journal',  icon: <Icon.Journal size={18} />, tilt: -0.6 },
  { id: 'wellness',   label: 'Wellness', icon: <Icon.Flower size={18} />,  tilt:  1.0 },
  { id: 'onboarding', label: 'Welcome',  icon: <Icon.Sparkle size={16} />, tilt: -0.9 },
];

const SolaceLogo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ color: 'var(--accent)' }}>
      <path d="M16 5c-3 4-7 6-7 12a7 7 0 0 0 14 0c0-6-4-8-7-12Z"
        fill="var(--accent-wash)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 16c.5 1 2 2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
    <div className="serif italic" style={{ fontSize: 24, lineHeight: 1, color: 'var(--ink)' }}>Solace</div>
  </div>
);

export default function TopNav({ screen, setScreen, profileName, themePicker }: TopNavProps) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 18,
      padding: '20px 40px',
      position: 'relative', zIndex: 10,
    }}>
      <SolaceLogo />

      <nav style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-muted)', fontSize: 12 }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--accent-wash)', display: 'grid', placeItems: 'center',
            color: 'var(--accent)', fontFamily: 'Fraunces', fontSize: 14,
            borderRadius: '60% 50% 55% 65% / 55% 60% 50% 65%',
            border: '1px solid var(--ink-border)',
          }}>
            {(profileName || 'M').slice(0, 1)}
          </div>
          <span>{profileName || 'You'}</span>
        </div>
        {themePicker}
      </div>
    </header>
  );
}
