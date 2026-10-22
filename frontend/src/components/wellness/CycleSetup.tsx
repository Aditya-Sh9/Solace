'use client'

// Setting up (or editing) the cycle anchor — roadmap 6.1. No mock: built from the check-in's
// slider rows and the onboarding paper-page language (MISSING_REFERENCES.md). A rough guess is
// welcome; the wheel says it's an estimate wherever it shows one.

import { useState } from 'react'
import { InkButton, IllustratedSlider, Icon } from '@/src/components/ui'
import type { CycleSettings } from '@/src/types/wellness'

const MAX_AGE_DAYS = 120

function isoDaysAgo(today: string, days: number): string {
  const d = new Date(`${today}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

interface CycleSetupProps {
  today:     string                 // server's YYYY-MM-DD
  initial:   CycleSettings | null
  onSave:    (s: CycleSettings) => Promise<string | null>
  onCancel?: () => void             // editing only
  onStop?:   () => Promise<string | null>
}

export default function CycleSetup({ today, initial, onSave, onCancel, onStop }: CycleSetupProps) {
  const [start,        setStart]        = useState(initial?.lastPeriodStart ?? '')
  const [cycleLength,  setCycleLength]  = useState(initial?.cycleLength ?? 28)
  const [periodLength, setPeriodLength] = useState(initial?.periodLength ?? 5)
  const [isBusy,       setIsBusy]       = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [isConfirmingStop, setIsConfirmingStop] = useState(false)

  const canSave = !!start && !isBusy
  const isEditing = !!initial

  const run = async (action: () => Promise<string | null>) => {
    setIsBusy(true)
    setError(null)
    const err = await action()
    setIsBusy(false)
    if (err) setError(err)
  }

  return (
    <div className="cycle-setup">
      <h3 className="serif italic cycle-setup-title">
        {isEditing ? 'Adjust your rhythm' : 'When did your last period start?'}
      </h3>
      <p className="cycle-setup-sub">
        A rough guess is fine. We only use it to place your days on the wheel and to add context to
        your patterns — you can change it any time.
      </p>

      <label className="cycle-setup-field">
        <span className="eyebrow">Last period started</span>
        <input
          type="date"
          className="ink-input"
          value={start}
          min={isoDaysAgo(today, MAX_AGE_DAYS)}
          max={today}
          onChange={e => setStart(e.target.value)}
          required
        />
      </label>

      <IllustratedSlider
        label="Days from one start to the next"
        value={cycleLength}
        onChange={setCycleLength}
        min={21}
        max={45}
        valueText={`about ${cycleLength} days`}
        icon={<Icon.Drop size={18} color="var(--ink-muted)" />}
      />
      <IllustratedSlider
        label="A period usually lasts"
        value={periodLength}
        onChange={v => setPeriodLength(Math.min(v, cycleLength - 4))}
        min={2}
        max={10}
        unit=" days"
        valueText={`${periodLength} days`}
        icon={<Icon.Flower size={18} color="var(--ink-muted)" />}
      />
      <p className="hand cycle-setup-note">not sure? 28 and 5 are a fine place to begin.</p>

      {error && <p role="alert" className="wellness-error">{error}</p>}

      <div className="cycle-setup-actions">
        {onCancel && <InkButton size="sm" variant="ghost" onClick={onCancel} disabled={isBusy}>Cancel</InkButton>}
        <InkButton
          size="sm"
          variant="primary"
          icon={<Icon.Check size={14} />}
          disabled={!canSave}
          onClick={() => run(() => onSave({ lastPeriodStart: start, cycleLength, periodLength }))}
        >
          {isBusy ? 'Saving…' : isEditing ? 'Save' : 'Start the wheel'}
        </InkButton>
      </div>

      {onStop && (
        <div className="cycle-setup-stop">
          {isConfirmingStop ? (
            <>
              <span>Stop tracking? Past days keep what they knew.</span>
              <InkButton size="sm" variant="ghost" onClick={() => setIsConfirmingStop(false)} disabled={isBusy}>Keep it</InkButton>
              <InkButton size="sm" variant="ghost" onClick={() => run(onStop)} disabled={isBusy}>Stop tracking</InkButton>
            </>
          ) : (
            <button type="button" className="wellness-text-btn" onClick={() => setIsConfirmingStop(true)}>
              stop tracking my cycle
            </button>
          )}
        </div>
      )}
    </div>
  )
}
