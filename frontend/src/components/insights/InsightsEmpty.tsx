import InkCard from '@/src/components/ui/InkCard'
import RefreshButton from './RefreshButton'
import type { Insight } from '@/src/types/insight'

interface InsightsEmptyProps {
  hasEnoughData: boolean
  onRefreshed:   (insights: Insight[]) => void
}

export default function InsightsEmpty({ hasEnoughData, onRefreshed }: InsightsEmptyProps) {
  if (!hasEnoughData) {
    return (
      <InkCard variant="soft" style={{ padding: '32px 36px', maxWidth: 560 }}>
        <p style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.3 }}>
          We&apos;re still listening.
        </p>
        <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
          After seven check-ins, patterns will start to surface — the kind that are
          specific to you, not just generic advice. You&apos;re building something real here.
        </p>
      </InkCard>
    )
  }

  return (
    <InkCard variant="soft" style={{ padding: '32px 36px', maxWidth: 560 }}>
      <p style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.3 }}>
        Nothing unusual this week.
      </p>
      <p style={{ margin: '0 0 20px', fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
        No strong patterns jumped out from your recent check-ins — which can be its own
        kind of good news. Try again after a few more days, or check back after your
        next check-in.
      </p>
      <RefreshButton onRefreshed={onRefreshed} />
    </InkCard>
  )
}
