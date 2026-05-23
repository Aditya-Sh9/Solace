'use client';

import { Icon } from './Icons';

export interface SidebarProps {
  screen: string;
  setScreen: (id: string) => void;
  profileName?: string;
}

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Today',    icon: <Icon.Home /> },
  { id: 'checkin',    label: 'Check-in', icon: <Icon.Check /> },
  { id: 'journal',    label: 'Journal',  icon: <Icon.Journal /> },
  { id: 'wellness',   label: 'Wellness', icon: <Icon.Flower /> },
  { id: 'onboarding', label: 'Welcome',  icon: <Icon.Sparkle size={18} /> },
];

export default function Sidebar({ screen, setScreen, profileName }: SidebarProps) {
  return (
    <nav style={{
      width: 232, flex: '0 0 232px', padding: '28px 18px',
      borderRight: '1px solid var(--ink-border)',
      display: 'flex', flexDirection: 'column', gap: 6,
      background: 'color-mix(in oklab, var(--bg) 85%, var(--surface))',
      transition: 'background-color 520ms ease, border-color 520ms ease',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px 24px' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" style={{ color: 'var(--accent)' }}>
          <path d="M16 5c-3 4-7 6-7 12a7 7 0 0 0 14 0c0-6-4-8-7-12Z"
            fill="var(--accent-wash)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 16c.5 1 2 2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <div>
          <div className="serif italic" style={{ fontSize: 22, lineHeight: 1, color: 'var(--ink)' }}>Solace</div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 2, letterSpacing: '0.04em' }}>a quiet companion</div>
        </div>
      </div>

      {NAV_ITEMS.map((it) => {
        const active = screen === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => setScreen(it.id)}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'color-mix(in oklab, var(--surface) 50%, transparent)'; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              background: active ? 'var(--surface)' : 'transparent',
              border: '1px solid', borderColor: active ? 'var(--ink-border)' : 'transparent',
              borderRadius: active ? '14px 10px 16px 12px / 10px 14px 12px 16px' : 12,
              color: active ? 'var(--ink)' : 'var(--ink-soft)',
              cursor: 'pointer', font: '14px/1 DM Sans, sans-serif', fontWeight: 500,
              textAlign: 'left', position: 'relative',
              transform: active ? 'rotate(-0.4deg)' : 'none',
              transition: 'all 260ms cubic-bezier(.34,1.4,.64,1), background-color 520ms ease, border-color 520ms ease',
            }}
          >
            <span style={{ display: 'inline-flex', color: active ? 'var(--accent)' : 'var(--ink-soft)' }}>
              {it.icon}
            </span>
            <span>{it.label}</span>
            {active && (
              <svg width="16" height="6" viewBox="0 0 16 6" style={{ position: 'absolute', right: 14, opacity: 0.6 }}>
                <path d="M1 3 Q 5 0 8 3 T 15 3" stroke="var(--accent)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </button>
        );
      })}

      <div style={{
        marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 10px', borderTop: '1px dashed var(--ink-border)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '60% 50% 55% 65% / 55% 60% 50% 65%',
          background: 'var(--accent-wash)', display: 'grid', placeItems: 'center',
          color: 'var(--accent)', fontFamily: 'Fraunces', fontSize: 16,
          border: '1px solid var(--ink-border)',
        }}>
          {(profileName || 'M').slice(0, 1)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {profileName || 'You'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icon.Lock size={10} /> Private space
          </div>
        </div>
      </div>
    </nav>
  );
}
