'use client'

// Deviation from `design-reference/screens-dashboard.jsx`: that mock's mood-graph
// section is just a heading + static graph + date labels. This component adds a
// time-range filter (Week/Month/3 Months/All time), a legend entry for the energy
// line (previously missing entirely — see defects.md 2026-09-24), and a collapsible
// "How we read this" explainer. No mock exists for these additions; built from the
// project's general design tokens instead. Logged in
// `design-reference/MISSING_REFERENCES.md`.

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import InkCard from '@/src/components/ui/InkCard'
import Chip from '@/src/components/ui/Chip'
import MoodGraph from '@/src/components/ui/MoodGraph'
import { HandDrawnUnderline } from '@/src/components/ui/Illustrations'
import { getCheckinHistory } from '@/src/lib/api/checkin'
import type { CheckInRecord } from '@/src/types/checkin'

interface MoodHistoryGraphProps {
  history: CheckInRecord[] // last 30 days, from the dashboard composite fetch
}

interface GraphPoint {
  date:        string
  moodScore:   number
  energyScore: number
}

const RANGES = [
  { id: 'week',    label: 'Week',      days: 7 },
  { id: 'month',   label: 'Month',     days: 30 },
  { id: '3months', label: '3 Months',  days: 90 },
  { id: 'all',     label: 'All time',  days: 365 },
] as const
type RangeId = (typeof RANGES)[number]['id']

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function trendCopy(moodData: number[]): string {
  if (moodData.length < 3) return 'Your first few days — patterns will start to show.'
  const avg = moodData.reduce((a, b) => a + b, 0) / moodData.length
  const last = moodData.slice(-3).reduce((a, b) => a + b, 0) / 3
  if (last > avg + 0.5) return 'Things have been lifting a little lately. Worth noticing.'
  if (last < avg - 0.5) return 'A heavier patch recently. It will not stay this way.'
  return 'Mostly steady. A little up and down — that is normal.'
}

// Beyond ~45 daily points a hand-drawn line gets too cramped to read (and the axis
// labels overlap). Wider ranges are shown as weekly (3 months) or monthly (all time)
// averages instead — still an honest picture of the trend, just at a readable zoom level.
function daysSinceEpoch(d: Date): number {
  return Math.floor(d.getTime() / 86_400_000)
}

function aggregate(records: CheckInRecord[], keyFn: (d: Date) => string): GraphPoint[] {
  const buckets = new Map<string, CheckInRecord[]>()
  for (const r of records) {
    const key = keyFn(new Date(r.date))
    const bucket = buckets.get(key)
    if (bucket) bucket.push(r)
    else buckets.set(key, [r])
  }
  return Array.from(buckets.values()).map(group => ({
    date:        group[group.length - 1].date, // most recent day in the bucket labels it
    moodScore:   group.reduce((a, r) => a + r.moodScore, 0) / group.length,
    energyScore: group.reduce((a, r) => a + r.energyScore, 0) / group.length,
  }))
}

function toGraphPoints(ascending: CheckInRecord[], rangeId: RangeId): GraphPoint[] {
  if (ascending.length <= 45 || rangeId === 'week' || rangeId === 'month') {
    return ascending.map(r => ({ date: r.date, moodScore: r.moodScore, energyScore: r.energyScore }))
  }
  if (rangeId === '3months') {
    return aggregate(ascending, d => String(Math.floor(daysSinceEpoch(d) / 7)))
  }
  return aggregate(ascending, d => `${d.getUTCFullYear()}-${d.getUTCMonth()}`)
}

export default function MoodHistoryGraph({ history }: MoodHistoryGraphProps) {
  const [range, setRange]       = useState<RangeId>('month')
  const [extended, setExtended] = useState<Partial<Record<RangeId, CheckInRecord[]>>>({})
  const [explainerOpen, setExplainerOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  // Derived, not stored: loading is simply "wider range selected, not yet cached" —
  // avoids a redundant state variable and a setState-in-effect race.
  const loadingRange = (range === '3months' || range === 'all') && !extended[range]

  useEffect(() => {
    if (range === 'week' || range === 'month') return
    if (extended[range]) return
    let cancelled = false
    const rangeDef = RANGES.find(r => r.id === range)!
    getCheckinHistory(rangeDef.days).then(({ data }) => {
      if (cancelled) return
      if (data) setExtended(prev => ({ ...prev, [range]: data }))
    })
    return () => { cancelled = true }
  }, [range, extended])

  const activeHistory = useMemo((): CheckInRecord[] => {
    if (range === 'week')  return history.slice(0, 7)
    if (range === 'month') return history
    return extended[range] ?? history // show the 30-day view while the wider range loads
  }, [range, history, extended])

  const ascending  = useMemo(() => [...activeHistory].reverse(), [activeHistory])
  const points     = useMemo(() => toGraphPoints(ascending, range), [ascending, range])
  const moodData   = points.map(p => p.moodScore - 1)
  const energyData = points.map(p => p.energyScore - 1)
  const isAggregated = points.length !== ascending.length

  // Cap displayed labels at ~8 even for longer, aggregated ranges so they never overlap.
  const labelEvery = Math.max(1, Math.ceil(points.length / 8))
  const dateLabels = points.map((p, i) => {
    if (points.length > 8 && i % labelEvery !== 0 && i !== points.length - 1) return ''
    const d = new Date(p.date)
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, padding: '0 4px', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 className="serif" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.1, margin: 0 }}>
            Recent days
          </h3>
          <HandDrawnUnderline width={140} />
          <div style={{ marginTop: 8, color: 'var(--ink-muted)', fontSize: 13.5 }}>
            {trendCopy(moodData)}
          </div>
        </div>

        {/* Legend — solid = mood, dashed = energy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--ink-muted)', fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: '60% 50% 55% 65%', display: 'inline-block' }} />
            Mood
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 14, height: 0, borderTop: '2px dashed var(--accent-soft)', display: 'inline-block' }} />
            Energy
          </span>
        </div>
      </div>

      {/* Time-range filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: '0 4px', marginBottom: 16 }}>
        {RANGES.map((r, i) => (
          <Chip
            key={r.id}
            active={range === r.id}
            tilt={i % 2 === 0 ? -0.6 : 0.6}
            onClick={() => setRange(r.id)}
          >
            {r.label}
          </Chip>
        ))}
      </div>

      {/* Graph in hand-drawn card */}
      <InkCard hand handIntensity={1.8} style={{ padding: '60px 24px 18px', overflow: 'visible', opacity: loadingRange ? 0.6 : 1, transition: 'opacity 320ms ease' }}>
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

      {/* Compact, collapsible explainer — never a raw "scoring" description */}
      <div style={{ marginTop: 12, padding: '0 4px' }}>
        <button
          type="button"
          onClick={() => setExplainerOpen(o => !o)}
          className="hand"
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: 'var(--ink-muted)', fontSize: 17, display: 'flex', alignItems: 'center', gap: 6,
          }}
          aria-expanded={explainerOpen}
        >
          How we read this
          <span style={{
            display: 'inline-block', transition: shouldReduceMotion ? 'none' : 'transform 220ms ease',
            transform: explainerOpen ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: 12,
          }}>
            ⌄
          </span>
        </button>
        <AnimatePresence initial={false}>
          {explainerOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.6, maxWidth: 480 }}>
                Each check-in asks how your mood and energy felt that day — anywhere from a
                quiet low to something brighter. This line is just those answers, connected,
                so shifts are easier to notice than numbers alone would show. Solid is mood.
                Dotted is energy.
                {isAggregated && ' Over longer stretches we average by week or month so the shape stays easy to read.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
