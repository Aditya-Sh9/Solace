// ─── Wobbly circle ────────────────────────────────────────────────────────────

function WobblyCircle({ d, number }: { d: string; number: string }) {
  return (
    <div style={{ width: 44, height: 44, position: 'relative', marginBottom: 20 }}>
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <path
          d={d}
          stroke="var(--accent)"
          strokeWidth="1.8"
          fill="color-mix(in oklab, var(--accent-wash) 70%, transparent)"
        />
      </svg>
      <span
        className="serif"
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 500, color: 'var(--accent)', lineHeight: 1,
        }}
      >
        {number}
      </span>
    </div>
  );
}

// ─── Step ─────────────────────────────────────────────────────────────────────

interface StepProps {
  circleD: string;
  number: string;
  title: string;
  copy: string;
  note?: string;
}

function Step({ circleD, number, title, copy, note }: StepProps) {
  return (
    <div className="how-it-works-step">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <WobblyCircle d={circleD} number={number} />
      </div>
      <h3
        className="serif"
        style={{ fontSize: 22, fontWeight: 500, marginBottom: 10, color: 'var(--ink)' }}
      >
        {title}
      </h3>
      <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 240, margin: '0 auto' }}>
        {copy}
      </p>
      {note && (
        <p style={{
          marginTop: 14, fontSize: 13, color: 'var(--ink-muted)',
          fontStyle: 'italic', lineHeight: 1.55, maxWidth: 220, margin: '14px auto 0',
        }}>
          {note}
        </p>
      )}
    </div>
  );
}

// ─── Arrow ────────────────────────────────────────────────────────────────────

function Arrow() {
  return (
    <div className="how-it-works-arrow" aria-hidden="true">
      <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
        <path
          d="M 0,8 L 26,8"
          stroke="var(--ink-muted)" strokeWidth="1.4" strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <path
          d="M 22,4 L 30,8 L 22,12"
          stroke="var(--ink-muted)" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  return (
    <section className="section-surface section-pad">
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 40px' }}>
        <h2
          className="serif"
          style={{
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 400, lineHeight: 1.1,
            marginBottom: 56, textAlign: 'center',
            letterSpacing: '-0.01em',
          }}
        >
          A quiet kind of progress
        </h2>

        <div className="how-it-works-steps">
          <Step
            circleD="M 22,6 C 30.8,5.2 38,13 37,22 C 36,31 29,38.5 22,38 C 15,38 6,31 6,22 C 6,13 13.5,6.8 22,6 Z"
            number="1"
            title="Notice"
            copy="You log how you feel. Takes two minutes. No right answers — just what's true today."
          />
          <Arrow />
          <Step
            circleD="M 22,5 C 31,5 38,12.5 38,22 C 38,31.5 31,38.5 22,38 C 13,38.5 5.5,31 6,22 C 6.5,13 13,5.5 22,5 Z"
            number="2"
            title="Connect"
            copy="We look for patterns across your days. Quietly, without judgment."
            note="The longer you use it, the more personal it becomes. It learns your patterns, not everyone else's."
          />
          <Arrow />
          <Step
            circleD="M 22,6 C 30,5 38,13 37,22 C 36,31 30,39 22,38 C 14,38 6,31 7,22 C 8,13 14,7 22,6 Z"
            number="3"
            title="Understand"
            copy="Gently, something starts to make sense. Not all at once — just enough."
          />
        </div>
      </div>
    </section>
  );
}
