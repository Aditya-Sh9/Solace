import InkCard from '@/src/components/ui/InkCard'

export default function InsightsPage() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <InkCard
        hand
        handIntensity={2.0}
        style={{
          maxWidth: 480,
          width: '100%',
          padding: '40px 36px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
            <circle cx="24" cy="24" r="14"
              stroke="var(--accent)" strokeWidth="1.6" fill="var(--accent-wash)" />
            <path d="M24 16v8l5 3"
              stroke="var(--accent-soft)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 24 Q 8 22 10 20" stroke="var(--accent)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M38 24 Q 40 26 38 28" stroke="var(--accent)" strokeWidth="1" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <h2
          className="serif"
          style={{
            fontSize: 32,
            fontWeight: 400,
            fontStyle: 'italic',
            margin: '0 0 14px',
            color: 'var(--ink)',
            lineHeight: 1.1,
          }}
        >
          We&apos;re still listening.
        </h2>

        <p style={{
          margin: '0 0 10px',
          color: 'var(--ink-soft)',
          fontSize: 16,
          lineHeight: 1.6,
          maxWidth: 360,
          marginInline: 'auto',
        }}>
          A full insights view is on its way — patterns, connections, and quiet
          observations about how you&apos;ve been feeling.
        </p>

        <p style={{
          margin: 0,
          color: 'var(--ink-muted)',
          fontSize: 14,
          lineHeight: 1.5,
        }}>
          For now, your dashboard shows what we&apos;ve noticed so far.
        </p>
      </InkCard>
    </div>
  )
}
