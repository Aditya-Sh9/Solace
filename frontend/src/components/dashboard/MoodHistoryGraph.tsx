import MoodGraph from '@/src/components/ui/MoodGraph'
import type { CheckInRecord } from '@/src/types/checkin'

interface MoodHistoryGraphProps {
  history: CheckInRecord[]
}

export default function MoodHistoryGraph({ history }: MoodHistoryGraphProps) {
  // Reverse so oldest-first (left → right on graph). Normalize 1-6 → 0-5 for MoodGraph scale.
  const reversed = [...history].reverse()
  const moodData   = reversed.map(c => c.moodScore - 1)
  const energyData = reversed.map(c => c.energyScore - 1)

  if (history.length === 0) {
    return (
      <div style={{
        height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--surface-2)', borderRadius: '16px 14px 18px 15px / 15px 16px 14px 17px',
      }}>
        <p style={{ color: 'var(--ink-faint)', fontSize: 14 }}>
          Check in a few times to see your pattern here.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
        <p className="stat-card-label" style={{ margin: 0 }}>Mood & energy</p>
        <div style={{ display: 'flex', gap: 12, marginLeft: 'auto' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-muted)' }}>
            <span style={{ width: 20, height: 2, background: 'var(--accent)', display: 'inline-block', borderRadius: 2 }} />
            mood
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--ink-muted)' }}>
            <span style={{ width: 20, height: 2, background: 'var(--accent-soft)', display: 'inline-block', borderRadius: 2, opacity: 0.75 }} />
            energy
          </span>
        </div>
      </div>
      <MoodGraph data={moodData} energy={energyData} height={160} wobble={0.18} />
    </div>
  )
}
