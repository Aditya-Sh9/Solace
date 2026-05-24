export default function HumanQuote() {
  return (
    <section
      className="section-bg"
      style={{
        padding: 'clamp(64px, 7vw, 80px) 40px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative quotation mark — purely visual, never read aloud */}
        <span
          aria-hidden="true"
          className="serif italic"
          style={{
            position: 'absolute',
            top: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 200,
            lineHeight: 1,
            color: 'var(--accent)',
            opacity: 0.09,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        >
          &ldquo;
        </span>

        <p
          className="serif italic"
          style={{
            fontSize: 'clamp(22px, 2.4vw, 32px)',
            fontWeight: 400,
            color: 'var(--ink)',
            lineHeight: 1.4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          I didn&apos;t realise how much my sleep was affecting my mood until I
          saw it here.
        </p>

        <p
          style={{
            fontSize: 14,
            color: 'var(--ink-muted)',
            marginTop: 20,
            position: 'relative',
            zIndex: 1,
          }}
        >
          — Someone who needed this
        </p>
      </div>
    </section>
  );
}
