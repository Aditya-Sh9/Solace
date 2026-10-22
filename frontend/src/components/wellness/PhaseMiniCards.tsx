'use client'

// The four phase mini-cards from screens-wellness.jsx. Each is a real <button> (the mock used a
// clickable card div) so they're the keyboard path into every phase; the wheel is mouse-only.

import { InkCard } from '@/src/components/ui'
import { PHASES, dayRangeLabel, type PhaseId } from '@/src/lib/wellness/phases'
import type { PhaseRange } from '@/src/types/wellness'

interface PhaseMiniCardsProps {
  ranges:   PhaseRange[]
  selected: PhaseId
  current:  PhaseId | null
  onSelect: (phase: PhaseId) => void
}

export default function PhaseMiniCards({ ranges, selected, current, onSelect }: PhaseMiniCardsProps) {
  return (
    <div className="phase-mini-grid" role="group" aria-label="Cycle phases">
      {PHASES.map((p, i) => {
        const isActive = p.id === selected
        const range = ranges.find(r => r.phase === p.id)
        return (
          <button
            key={p.id}
            type="button"
            className="phase-mini"
            aria-pressed={isActive}
            onClick={() => onSelect(p.id)}
          >
            <InkCard
              hand
              handIntensity={2.2}
              hoverable
              tilt={i % 2 === 0 ? -0.6 : 0.6}
              handColor={isActive ? 'var(--accent)' : 'var(--ink-soft)'}
              style={{ padding: 18, background: isActive ? 'var(--accent-wash)' : 'var(--surface)', textAlign: 'left' }}
            >
              <div className="eyebrow" style={{ marginBottom: 4 }}>{range ? dayRangeLabel(range.startDay, range.endDay) : ''}</div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>{p.name}</div>
              <div className="hand" style={{ fontSize: 16, color: 'var(--accent)' }}>
                {p.short}{p.id === current ? ' · now' : ''}
              </div>
            </InkCard>
          </button>
        )
      })}
    </div>
  )
}
