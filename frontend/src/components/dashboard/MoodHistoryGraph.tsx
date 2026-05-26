import InkCard from '@/src/components/ui/InkCard'
import MoodGraph from '@/src/components/ui/MoodGraph'
import { HandDrawnUnderline } from '@/src/components/ui/Illustrations'
import type { CheckInRecord } from '@/src/types/checkin'

interface MoodHistoryGraphProps {
  history: CheckInRecord[]
}

function trendCopy(moodData: number[]): string {
  if (moodData.length < 3) return 'Your first few days — patterns will start to show.'
  const avg = moodData.reduce((a, b) => a + b, 0) / moodData.length
  const last = moodData.slice(-3).reduce((a, b) => a + b, 0) / 3
  if (last > avg + 0.5) return 'Things have been lifting a little lately. Worth noticing.'
  if (last < avg - 0.5) return 'A heavier patch recently. It will not stay this way.'
  return 'Mostly steady. A little up and down — that is normal.'
}

export default function MoodHistoryGraph({ history }: MoodHistoryGraphProps) {
  const reversed   = [...history].reverse()
  const moodData   = reversed.map(c => c.moodScore - 1)
  const energyData = reversed.map(c => c.energyScore - 1)
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const dateLabels = reversed.map(r => {
    const d = new Date(r.date + 'T00:00:00')
    return `${MONTHS[d.getMonth()]} ${d.getDate()}`
  })

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
    <div style={{ position: 'relative' }}>
      {/* Section heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, padding: '0 4px' }}>
        <div>
          <h3 className="serif" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.1, margin: 0 }}>
            Recent days
          </h3>
          <HandDrawnUnderline width={140} />
          <div style={{ marginTop: 8, color: 'var(--ink-muted)', fontSize: 13.5 }}>
            {trendCopy(moodData)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-muted)', fontSize: 12 }}>
          <span style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: '60% 50% 55% 65%', display: 'inline-block' }} />
          Mood
        </div>
      </div>

      {/* Graph in hand-drawn card */}
      <InkCard hand handIntensity={1.8} style={{ padding: '60px 24px 18px', overflow: 'visible' }}>
        <div style={{ overflow: 'visible' }}>
          <MoodGraph data={moodData} energy={energyData} height={260} wobble={0.18} />
        </div>
        {/* X-axis date labels */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 28,
          padding: '0 28px', color: 'var(--ink-muted)', fontSize: 11, letterSpacing: '0.08em',
        }}>
          {dateLabels.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </InkCard>
    </div>
  )
}
