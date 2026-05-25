import Link from 'next/link'
import InkCard from '@/src/components/ui/InkCard'

export default function CheckInTodayCTA() {
  return (
    <Link href="/checkin" style={{ textDecoration: 'none' }}>
      <InkCard variant="default" hoverable className="tilt-l-sm" style={{ padding: '22px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{
              fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 6px',
            }}>
              Today
            </p>
            <h2 style={{
              fontSize: 18, fontWeight: 500, margin: 0,
              color: 'var(--ink)', letterSpacing: '-0.01em',
            }}>
              How are you feeling?
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              Whenever you're ready, we're here.
            </p>
          </div>
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
            stroke="var(--accent-soft)" strokeWidth={1.6} strokeLinecap="round">
            <path d="M9.6 6 16 12l-6.4 6" />
          </svg>
        </div>
      </InkCard>
    </Link>
  )
}
