import Link from 'next/link';

function Logo() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
      <svg width="22" height="22" viewBox="0 0 32 32" style={{ color: 'var(--accent)', flexShrink: 0 }}>
        <path
          d="M16 5c-3 4-7 6-7 12a7 7 0 0 0 14 0c0-6-4-8-7-12Z"
          fill="var(--accent-wash)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
        />
        <path
          d="M13 16c.5 1 2 2 3 2"
          stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none"
        />
      </svg>
      <span className="serif italic" style={{ fontSize: 18, lineHeight: 1, color: 'var(--ink-soft)' }}>
        Solace
      </span>
    </Link>
  );
}

export default function LandingFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--ink-border)',
      background: 'var(--bg)',
    }}>
      <div className="landing-footer" style={{ maxWidth: 1180, margin: '0 auto', padding: '24px 40px' }}>

        <Logo />

        <nav className="landing-footer-links" aria-label="Footer navigation">
          <a href="#">Why Solace</a>
          <a href="#">Privacy</a>
          <a href="#">Journal</a>
        </nav>

        <p style={{ fontSize: 13, color: 'var(--ink-muted)', fontStyle: 'italic', margin: 0 }}>
          Made with care.
        </p>

      </div>
    </footer>
  );
}
