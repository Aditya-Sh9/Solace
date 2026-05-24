import { InkCard, MarginDoodle } from '@/src/components/ui';

export default function JournalMoment() {
  return (
    <section className="section-surface section-pad" style={{ textAlign: 'center' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px' }}>

        <h2
          className="serif"
          style={{
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: 400, lineHeight: 1.1,
            marginBottom: 18, letterSpacing: '-0.01em',
          }}
        >
          Yours alone. Always.
        </h2>

        <p style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          maxWidth: 480,
          margin: '0 auto 44px',
          lineHeight: 1.6,
        }}>
          Your journal is encrypted on your device.
          We literally cannot read it, and we don&apos;t want to.
        </p>

        {/* Journal card */}
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <InkCard
            hand
            handIntensity={2.2}
            className="paper-bg"
            style={{
              padding: '32px 40px 36px 64px',
              position: 'relative',
              textAlign: 'left',
              minHeight: 200,
            }}
          >
            {/* Left margin line */}
            <div style={{
              position: 'absolute', left: 44, top: 0, bottom: 0, width: 1,
              background: 'color-mix(in oklab, var(--accent) 35%, transparent)',
              opacity: 0.5,
            }} />

            {/* Star doodle */}
            <div style={{
              position: 'absolute', left: 14, top: 32,
              color: 'var(--accent)', opacity: 0.65,
            }}>
              <MarginDoodle kind="star" />
            </div>

            {/* Heart doodle */}
            <div style={{
              position: 'absolute', left: 14, bottom: 36,
              color: 'var(--accent)', opacity: 0.65,
            }}>
              <MarginDoodle kind="heart" />
            </div>

            {/* Date */}
            <div
              className="serif italic"
              style={{
                fontSize: 15,
                color: 'var(--ink-soft)',
                marginBottom: 16,
                letterSpacing: '0.01em',
              }}
            >
              Friday, May 23
            </div>

            {/* Body */}
            <div
              className="hand"
              style={{
                fontSize: 18,
                color: 'var(--ink)',
                lineHeight: 1.7,
              }}
            >
              Sat outside with coffee for fifteen minutes before opening
              anything. The morning felt like it was holding still on purpose.
              I think I needed that.
            </div>
          </InkCard>
        </div>

      </div>
    </section>
  );
}
