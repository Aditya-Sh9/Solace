'use client'

// "Where you are" card from screens-wellness.jsx: the wheel plus the day stepper. The stepper
// here *peeks* at other days (it never changes what's saved) and comes back to today. Additions
// without a mock: days-until-next line (6.10), "it started today", the projected-day note, and
// the setup/edit form in place of the wheel (MISSING_REFERENCES.md).

import { useState } from 'react'
import { InkCard, InkButton, Icon } from '@/src/components/ui'
import CycleWheel from './CycleWheel'
import CycleSetup from './CycleSetup'
import { PHASE_BY_ID, type PhaseId } from '@/src/lib/wellness/phases'
import type { CycleOverview, CycleSettings } from '@/src/types/wellness'

interface CycleWhereYouAreProps {
  overview:      CycleOverview
  selected:      PhaseId
  onSelect:      (phase: PhaseId | null) => void   // null = back to following today
  onSaveSettings: (s: CycleSettings) => Promise<string | null>
  onStarted:     () => Promise<string | null>
  onStop:        () => Promise<string | null>
}

function untilCopy(days: number, next: PhaseId): string {
  const name = PHASE_BY_ID[next].name.toLowerCase()
  if (days <= 1) return `Your ${name} days are probably close — maybe tomorrow.`
  return `About ${days} days until your ${name} days, give or take.`
}

export default function CycleWhereYouAre({ overview, selected, onSelect, onSaveSettings, onStarted, onStop }: CycleWhereYouAreProps) {
  const { settings, today, ranges } = overview
  const [peekDay,   setPeekDay]   = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isBusy,    setIsBusy]    = useState(false)
  const [note,      setNote]      = useState<string | null>(null)

  const cycleLength = settings?.cycleLength ?? 28
  const shownDay = peekDay ?? today?.day ?? null
  const phaseOfDay = (d: number) => (ranges.find(r => d >= r.startDay && d <= r.endDay) ?? ranges[ranges.length - 1]).phase

  const peek = (delta: number) => {
    if (shownDay === null) return
    const next = ((shownDay - 1 + delta + cycleLength) % cycleLength) + 1
    const isToday = next === today?.day
    setPeekDay(isToday ? null : next)
    onSelect(isToday ? null : phaseOfDay(next))
  }

  const started = async () => {
    setIsBusy(true)
    const err = await onStarted()
    setIsBusy(false)
    setNote(err ?? 'Noted — the wheel starts again from today.')
    setPeekDay(null)
    onSelect(null)
  }

  if (!settings || isEditing) {
    return (
      <InkCard hand handIntensity={2.4} style={{ padding: 28, position: 'relative' }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>Where you are</div>
        <CycleSetup
          today={overview.date}
          initial={settings}
          onSave={async s => {
            const err = await onSaveSettings(s)
            if (!err) { setIsEditing(false); setPeekDay(null); onSelect(null) }
            return err
          }}
          onCancel={settings ? () => setIsEditing(false) : undefined}
          onStop={settings ? async () => {
            const err = await onStop()
            if (!err) { setIsEditing(false); setPeekDay(null); onSelect(null) }
            return err
          } : undefined}
        />
      </InkCard>
    )
  }

  return (
    <InkCard hand handIntensity={2.4} style={{ padding: 28, position: 'relative' }}>
      <div className="cycle-where-head">
        <div className="eyebrow">Where you are</div>
        <button type="button" className="wellness-text-btn" onClick={() => setIsEditing(true)}>adjust</button>
      </div>

      <CycleWheel
        ranges={ranges}
        cycleLength={cycleLength}
        day={shownDay}
        currentPhase={shownDay !== null ? phaseOfDay(shownDay) : null}
        selected={selected}
        onSelect={p => onSelect(p)}
      />

      <div className="cycle-stepper">
        <InkButton size="sm" variant="ghost" onClick={() => peek(-1)} aria-label="Peek at the day before">
          <Icon.ChevronLeft size={14} />
        </InkButton>
        <div className="hand cycle-stepper-day" aria-live="polite">
          day {shownDay}
          {peekDay !== null && <span className="cycle-stepper-peek">peeking</span>}
        </div>
        <InkButton size="sm" variant="ghost" onClick={() => peek(1)} aria-label="Peek at the next day">
          <Icon.ChevronRight size={14} />
        </InkButton>
      </div>

      {peekDay !== null ? (
        <p className="cycle-where-line">
          <button type="button" className="wellness-text-btn" onClick={() => { setPeekDay(null); onSelect(null) }}>back to today</button>
        </p>
      ) : today && (
        <p className="cycle-where-line">
          {today.projected
            ? 'Counting on from your last logged start — if it has arrived since, tell us below.'
            : untilCopy(today.daysUntilNext, today.nextPhase)}
        </p>
      )}

      <div className="cycle-where-actions">
        <InkButton size="sm" variant="ghost" icon={<Icon.Drop size={14} />} onClick={started} disabled={isBusy}>
          {isBusy ? 'Noting…' : 'It started today'}
        </InkButton>
      </div>
      {note && <p role="status" className="cycle-where-note hand">{note}</p>}
    </InkCard>
  )
}
