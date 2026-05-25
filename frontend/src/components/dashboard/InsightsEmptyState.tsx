import InkCard from '@/src/components/ui/InkCard'
import { MarginDoodle } from '@/src/components/ui/Illustrations'

export default function InsightsEmptyState() {
  return (
    <div>
      <p className="stat-card-label" style={{ marginBottom: 12 }}>Recent insights</p>
      <InkCard variant="soft" style={{ padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ flexShrink: 0, marginTop: 2 }}>
            <MarginDoodle kind="sparkle" />
          </div>
          <div>
            <p style={{
              margin: '0 0 6px', fontSize: 15, fontWeight: 500,
              color: 'var(--ink)', lineHeight: 1.4,
            }}>
              We're still listening.
            </p>
            <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
              A few more check-ins and patterns will start to surface.
            </p>
          </div>
        </div>
      </InkCard>
    </div>
  )
}
