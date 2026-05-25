import InkCard from '@/src/components/ui/InkCard'
import { HandDrawnUnderline } from '@/src/components/ui/Illustrations'

interface StreakCounterProps {
  streak: number
}

function milestoneNote(streak: number): string {
  if (streak >= 30) return 'A full month. That\'s something.'
  if (streak >= 14) return 'Two weeks running.'
  if (streak >= 7)  return 'A whole week.'
  if (streak >= 3)  return 'Three days in a row.'
  return ''
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  const note = milestoneNote(streak)

  return (
    <InkCard variant="soft" className="tilt-r-sm" style={{ padding: '20px 24px', textAlign: 'center' }}>
      <p className="stat-card-label">Check-in streak</p>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <p className="serif" style={{
          fontSize: 48, fontWeight: 500, margin: '4px 0',
          color: streak > 0 ? 'var(--accent)' : 'var(--ink-muted)',
          lineHeight: 1,
        }}>
          {streak}
        </p>
        {streak > 0 && (
          <HandDrawnUnderline width={60} color="var(--accent-soft)" />
        )}
      </div>
      <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-muted)' }}>
        {streak === 1 ? 'day' : 'days'}{note ? ' — ' + note : ''}
      </p>
    </InkCard>
  )
}
