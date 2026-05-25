import InkButton from '@/src/components/ui/InkButton'
import InkCard from '@/src/components/ui/InkCard'

interface DashboardErrorProps {
  onRetry: () => void
}

export default function DashboardError({ onRetry }: DashboardErrorProps) {
  return (
    <div className="dashboard-grid">
      <InkCard variant="soft" style={{ padding: '28px 32px', maxWidth: 480 }}>
        <p style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 500, color: 'var(--ink)' }}>
          Something got in the way.
        </p>
        <p style={{ margin: '0 0 20px', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
          Not your fault — try again in a moment?
        </p>
        <InkButton variant="ghost" onClick={onRetry}>Try again</InkButton>
      </InkCard>
    </div>
  )
}
