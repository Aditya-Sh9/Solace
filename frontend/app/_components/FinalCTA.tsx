import Link from 'next/link';
import { Icon } from '@/src/components/ui';

export default function FinalCTA() {
  return (
    <section
      className="section-surface"
      style={{
        padding: 'clamp(72px, 8vw, 96px) 40px',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        <h2
          className="serif"
          style={{
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          Ready to notice more?
        </h2>

        <p style={{
          fontSize: 17,
          color: 'var(--ink-soft)',
          marginTop: 14,
        }}>
          No streaks. No pressure. Just you.
        </p>

        <div style={{ marginTop: 44 }}>
          <Link href="/app" className="ink-btn ink-btn--primary">
            Begin a quiet practice
            <Icon.ChevronRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
