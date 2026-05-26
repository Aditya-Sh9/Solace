import InkCard from '@/src/components/ui/InkCard'

export default function WellnessPage() {
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
            <path d="M24 38 C 18 32 8 28 8 20 a 8 8 0 0 1 16-2 8 8 0 0 1 16 2 c 0 8-10 12-16 18Z"
              stroke="var(--accent)" strokeWidth="1.6" fill="var(--accent-wash)" strokeLinejoin="round" />
            <path d="M24 20 v10M20 24 h8"
              stroke="var(--accent-soft)" strokeWidth="1.3" strokeLinecap="round" />
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
          Something gentle is coming.
        </h2>

        <p style={{
          margin: '0 0 10px',
          color: 'var(--ink-soft)',
          fontSize: 16,
          lineHeight: 1.6,
          maxWidth: 360,
          marginInline: 'auto',
        }}>
          Cycle-aware insights, phase-by-phase guidance, and the research behind
          how your body moves through the month.
        </p>

        <p style={{
          margin: 0,
          color: 'var(--ink-muted)',
          fontSize: 14,
          lineHeight: 1.5,
        }}>
          Worth the wait. Check back soon.
        </p>
      </InkCard>
    </div>
  )
}
