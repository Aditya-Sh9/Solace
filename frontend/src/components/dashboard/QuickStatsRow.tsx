import InkCard from '@/src/components/ui/InkCard'
import { MoodFace } from '@/src/components/ui/Icons'
import type { QuickStats } from '@/src/types/checkin'

interface QuickStatsRowProps {
  stats: QuickStats
}

function StatCard({
  label, value, sub, tilt = 0,
}: { label: string; value: React.ReactNode; sub: string; tilt?: number }) {
  const cls = tilt < 0 ? 'tilt-l-sm' : tilt > 0 ? 'tilt-r-sm' : ''
  return (
    <InkCard variant="soft" className={`stat-card ${cls}`}>
      <p className="stat-card-label">{label}</p>
      <div style={{ margin: '6px 0 2px' }}>{value}</div>
      <p className="stat-card-sub">{sub}</p>
    </InkCard>
  )
}

export default function QuickStatsRow({ stats }: QuickStatsRowProps) {
  const { avgMood, avgEnergy, avgSleep, daysLogged } = stats

  const moodDisplay = avgMood !== null
    ? <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MoodFace index={Math.round(avgMood - 1) as 0|1|2|3|4|5} size={28} active />
        <span className="stat-card-value">{avgMood.toFixed(1)}</span>
      </div>
    : <span className="stat-card-value" style={{ color: 'var(--ink-muted)' }}>—</span>

  return (
    <div className="dashboard-stats-row">
      <StatCard
        label="Avg mood"
        value={moodDisplay}
        sub="last 7 days"
        tilt={-1}
      />
      <StatCard
        label="Avg energy"
        value={
          avgEnergy !== null
            ? <p className="stat-card-value">{avgEnergy.toFixed(1)} <span style={{ fontSize: 14, color: 'var(--ink-muted)' }}>/ 6</span></p>
            : <p className="stat-card-value" style={{ color: 'var(--ink-muted)' }}>—</p>
        }
        sub="last 7 days"
        tilt={0}
      />
      <StatCard
        label="Avg sleep"
        value={
          avgSleep !== null
            ? <p className="stat-card-value">{avgSleep.toFixed(1)}<span style={{ fontSize: 16, color: 'var(--ink-soft)' }}>h</span></p>
            : <p className="stat-card-value" style={{ color: 'var(--ink-muted)' }}>—</p>
        }
        sub="last 7 days"
        tilt={1}
      />
      <StatCard
        label="Days logged"
        value={<p className="stat-card-value">{daysLogged}</p>}
        sub="this week"
        tilt={-1}
      />
    </div>
  )
}
