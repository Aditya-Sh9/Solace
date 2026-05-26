import InkCard from '@/src/components/ui/InkCard'

export default function JournalPage() {
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
        <div style={{
          fontSize: 48,
          marginBottom: 20,
          opacity: 0.7,
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
            <path d="M14 8h20a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z"
              stroke="var(--accent)" strokeWidth="1.6" fill="var(--accent-wash)" />
            <path d="M18 17h12M18 23h12M18 29h8"
              stroke="var(--accent-soft)" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M10 12 Q 12 11 14 13" stroke="var(--accent)" strokeWidth="1" fill="none" strokeLinecap="round" />
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
          Your journal is coming.
        </h2>

        <p style={{
          margin: '0 0 10px',
          color: 'var(--ink-soft)',
          fontSize: 16,
          lineHeight: 1.6,
          maxWidth: 360,
          marginInline: 'auto',
        }}>
          This is your page. Leave it blank as long as you like.
        </p>

        <p style={{
          margin: 0,
          color: 'var(--ink-muted)',
          fontSize: 14,
          lineHeight: 1.5,
        }}>
          We&apos;re still crafting this space — encrypted, private, yours alone.
        </p>
      </InkCard>
    </div>
  )
}
