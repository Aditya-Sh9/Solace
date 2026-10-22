'use client'

// Symptom pattern over time (roadmap 6.21). No mock (MISSING_REFERENCES.md): a dot grid of the
// last five weeks — one row per symptom you've logged most, one column per day, dot size by how
// strong it felt, columns tinted by phase. Each row notes which phase it most often fell in,
// which is the pattern worth noticing. Independent fetch; refetches when today's log is kept.

import { useEffect, useMemo, useState } from 'react'
import { InkButton } from '@/src/components/ui'
import { getSymptomHistory } from '@/src/lib/api/wellness'
import { PHASE_BY_ID, PHASES, type PhaseId } from '@/src/lib/wellness/phases'
import type { SymptomLogEntry } from '@/src/types/wellness'

const DAYS = 35
const MAX_ROWS = 5
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function dayList(today: string): string[] {
  const end = Date.parse(`${today}T00:00:00Z`)
  return Array.from({ length: DAYS }, (_, i) => new Date(end - (DAYS - 1 - i) * 86_400_000).toISOString().slice(0, 10))
}

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

interface SymptomHistoryProps {
  today:   string
  version: number   // bumps when today's log is kept, to refetch
}

export default function SymptomHistory({ today, version }: SymptomHistoryProps) {
  const [entries, setEntries] = useState<SymptomLogEntry[] | null>(null)
  const [isError, setIsError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    getSymptomHistory(DAYS).then(({ data, error }) => {
      if (cancelled) return
      if (error || !data) { console.error('[wellness] history failed:', error); setIsError(true); return }
      setIsError(false)
      setEntries(data)
    })
    return () => { cancelled = true }
  }, [version, attempt])

  const days = useMemo(() => dayList(today), [today])
  const byDate = useMemo(() => new Map((entries ?? []).map(e => [e.date, e])), [entries])

  const rows = useMemo(() => {
    const counts = new Map<string, { n: number; phases: Partial<Record<PhaseId, number>> }>()
    for (const e of entries ?? []) {
      for (const s of e.symptoms) {
        const c = counts.get(s) ?? { n: 0, phases: {} }
        c.n++
        if (e.phase) c.phases[e.phase] = (c.phases[e.phase] ?? 0) + 1
        counts.set(s, c)
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, MAX_ROWS)
      .map(([symptom, c]) => {
        const top = (Object.entries(c.phases) as [PhaseId, number][]).sort((a, b) => b[1] - a[1])[0]
        // Only call it "mostly" when that phase holds at least half of the days.
        const mostly = top && c.n >= 2 && top[1] / c.n >= 0.5 ? top[0] : null
        return { symptom, n: c.n, mostly }
      })
  }, [entries])

  if (isError) {
    return (
      <div className="symptom-history-state">
        <p>Your log didn&apos;t load just now — not your fault.</p>
        <InkButton size="sm" variant="ghost" onClick={() => setAttempt(a => a + 1)}>Try again</InkButton>
      </div>
    )
  }
  if (!entries) return <div className="symptom-history-skeleton ink-pulse" aria-hidden />
  if (rows.length === 0) {
    return (
      <p className="symptom-history-state hand">
        Nothing logged yet. Tap a few true things on a few days, and a shape starts to show here.
      </p>
    )
  }

  return (
    <div className="symptom-history">
      <ul className="sr-only">
        {rows.map(r => (
          <li key={r.symptom}>
            {r.symptom}: {r.n} {r.n === 1 ? 'day' : 'days'} in the last five weeks
            {r.mostly ? `, mostly in your ${PHASE_BY_ID[r.mostly].name.toLowerCase()} days` : ''}
          </li>
        ))}
      </ul>

      <div className="symptom-history-grid" aria-hidden style={{ gridTemplateColumns: `minmax(96px, 150px) repeat(${DAYS}, minmax(0, 1fr))` }}>
        <span />
        {days.map(d => (
          <span key={d} className="symptom-history-phase" data-phase={byDate.get(d)?.phase ?? undefined} />
        ))}
        {rows.map(r => (
          <Row key={r.symptom} label={r.symptom} mostly={r.mostly} days={days} byDate={byDate} />
        ))}
        <span />
        {days.map((d, i) => (
          <span key={`l-${d}`} className="symptom-history-date">{i % 7 === 0 || i === DAYS - 1 ? shortDate(d) : ''}</span>
        ))}
      </div>

      <div className="phase-legend" aria-hidden>
        {PHASES.map(p => (
          <span key={p.id}><i data-phase={p.id} />{p.name.toLowerCase()}</span>
        ))}
      </div>
    </div>
  )
}

function Row({ label, mostly, days, byDate }: { label: string; mostly: PhaseId | null; days: string[]; byDate: Map<string, SymptomLogEntry> }) {
  return (
    <>
      <span className="symptom-history-label">
        {label}
        {mostly && <span className="hand symptom-history-mostly">mostly {PHASE_BY_ID[mostly].name.toLowerCase()}</span>}
      </span>
      {days.map(d => {
        const e = byDate.get(d)
        const isOn = !!e?.symptoms.includes(label)
        return (
          <span key={d} className="symptom-history-cell">
            {isOn && <i data-strength={e?.intensity ?? 2} />}
          </span>
        )
      })}
    </>
  )
}
