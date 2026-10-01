import { InkCard, MarginDoodle } from '@/src/components/ui';

// Static visuals for the landing page's feature walk-through rows.
// Moved out of app/page.tsx to keep it under the 300-line limit.

export function FeatureJournal() {
  return (
    <InkCard hand handIntensity={2.2} className="paper-bg" style={{ padding: '28px 32px 28px 56px', position: 'relative', minHeight: 220 }}>
      <div style={{ position: 'absolute', left: 36, top: 0, bottom: 0, width: 1, background: 'color-mix(in oklab, var(--accent) 35%, transparent)', opacity: 0.45 }} />
      <div style={{ position: 'absolute', left: 14, top: 30, color: 'var(--accent)', opacity: 0.7 }}>
        <MarginDoodle kind="star" />
      </div>
      <div style={{ position: 'absolute', left: 14, bottom: 28, color: 'var(--accent)', opacity: 0.7 }}>
        <MarginDoodle kind="heart" />
      </div>
      <div className="hand" style={{ fontSize: 22, color: 'var(--ink)', lineHeight: 1.4, transform: 'rotate(-0.6deg)' }}>
        Friday, May 23
      </div>
      <div className="hand" style={{ fontSize: 21, color: 'var(--ink)', lineHeight: 1.5, marginTop: 12 }}>
        Sat outside with coffee for fifteen minutes before opening anything. The morning felt like it was holding still on purpose. I think I needed that.
      </div>
    </InkCard>
  );
}

export function FeatureWellness() {
  return (
    <InkCard hand handIntensity={2.2} style={{ padding: 28, position: 'relative', minHeight: 220 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ flex: '0 0 auto' }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="44" fill="none" stroke="var(--ink-border)" strokeWidth="20" />
            <path data-draw d="M 60 16 A 44 44 0 0 1 96 80" stroke="var(--accent)" strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.7" />
            <text x="60" y="58" textAnchor="middle" fontFamily="Fraunces" fontStyle="italic" fontSize="16" fill="var(--ink)">luteal</text>
            <text x="60" y="74" textAnchor="middle" fontFamily="DM Sans" fontSize="9" fill="var(--ink-muted)" letterSpacing="2">phase</text>
          </svg>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Days 17 – 28</div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Tending</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, maxWidth: 220 }}>
            Inward, careful, sometimes prickly. Shorter to-do lists are kindness here.
          </p>
        </div>
      </div>
    </InkCard>
  );
}
