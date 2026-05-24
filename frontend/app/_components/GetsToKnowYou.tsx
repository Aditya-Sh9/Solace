import { InkCard } from '@/src/components/ui';

// ─── Inline hand-drawn icons ──────────────────────────────────────────────────

function SparkIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 3 L15.3 12.7 L25 14 L15.3 15.3 L14 25 L12.7 15.3 L3 14 L12.7 12.7 Z"
        stroke="var(--accent)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="color-mix(in oklab, var(--accent-wash) 70%, transparent)"
      />
    </svg>
  );
}

function PlantIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* stem */}
      <path
        d="M14 25 C13.6 20 13.8 15.5 14 11"
        stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round"
      />
      {/* left leaf */}
      <path
        d="M14 17 C12 15 8 14 7 11 C10 11 13.5 14 14 17"
        stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        fill="color-mix(in oklab, var(--accent-wash) 80%, transparent)"
      />
      {/* right leaf */}
      <path
        d="M14 13 C16 11 20 9.5 21 7 C18 8 14.5 11 14 13"
        stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        fill="color-mix(in oklab, var(--accent-wash) 80%, transparent)"
      />
    </svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function GetsToKnowYou() {
  return (
    <section className="section-bg section-pad" style={{ textAlign: 'center' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px' }}>

        <h2
          className="serif italic"
          style={{
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: 400, lineHeight: 1.1,
            marginBottom: 20, letterSpacing: '-0.01em',
          }}
        >
          After a while, it stops guessing.
        </h2>

        <p style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          maxWidth: 560,
          margin: '0 auto 44px',
          lineHeight: 1.6,
        }}>
          Most apps give everyone the same advice. Solace learns from your specific
          patterns — your sleep, your energy, your days. Over time, the observations
          stop being general. They start being yours.
        </p>

        <div className="knows-you-cards" style={{ maxWidth: 640, margin: '0 auto' }}>
          <InkCard hand handIntensity={2.0} style={{ padding: 28, textAlign: 'left' }}>
            <div style={{ marginBottom: 14 }}>
              <SparkIcon />
            </div>
            <h3 style={{
              fontSize: 16, fontWeight: 500,
              marginBottom: 8, color: 'var(--ink)',
              fontFamily: 'var(--font-sans)',
            }}>
              Starts simple
            </h3>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              In the beginning, we use research-backed patterns to surface what might be connected.
            </p>
          </InkCard>

          <InkCard hand handIntensity={2.0} style={{ padding: 28, textAlign: 'left' }}>
            <div style={{ marginBottom: 14 }}>
              <PlantIcon />
            </div>
            <h3 style={{
              fontSize: 16, fontWeight: 500,
              marginBottom: 8, color: 'var(--ink)',
              fontFamily: 'var(--font-sans)',
            }}>
              Grows with you
            </h3>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
              After a few weeks of check-ins, the observations become specific to you — not a general user.
            </p>
          </InkCard>
        </div>

        <p style={{
          marginTop: 28,
          fontSize: 13,
          color: 'var(--ink-muted)',
          fontStyle: 'italic',
          lineHeight: 1.55,
        }}>
          Your journal is encrypted and unreadable to us.
          Patterns are found on your data, never shared.
        </p>

      </div>
    </section>
  );
}
