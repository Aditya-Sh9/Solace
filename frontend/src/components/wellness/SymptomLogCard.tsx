'use client'

// "Today, in your own words" from screens-wellness.jsx (6.18). Additions without a mock: the
// gentle 1–3 "how strong" scale (6.19) that appears once anything is tapped, and a quiet save
// note. Chip values are stored as-is by the backend — change wording only via a label map.

import { Chip } from '@/src/components/ui'
import type { LogSaveState } from '@/src/hooks/use-wellness'
import type { SymptomLog } from '@/src/types/wellness'

export const LOG_CHIPS = [
  'heavy cramping', 'mood feels heavy', 'low energy today', 'tender chest',
  'bloated', 'good sleep', 'craving sweet', 'craving salty', 'sharp focus',
  'short fuse', 'foggy head', 'warm and grounded',
]

const INTENSITY: { value: 1 | 2 | 3; label: string }[] = [
  { value: 1, label: 'a little' },
  { value: 2, label: 'noticeable' },
  { value: 3, label: 'a lot' },
]

const SAVE_NOTE: Record<LogSaveState, string> = {
  idle:   '',
  saving: 'keeping it…',
  saved:  'kept.',
  error:  "Couldn't keep that just now — not your fault. Try again?",
}

interface SymptomLogCardProps {
  log:      SymptomLog
  state:    LogSaveState
  onChange: (log: SymptomLog) => void
}

export default function SymptomLogCard({ log, state, onChange }: SymptomLogCardProps) {
  const toggle = (s: string) => {
    const symptoms = log.symptoms.includes(s) ? log.symptoms.filter(x => x !== s) : [...log.symptoms, s]
    onChange({ symptoms, intensity: log.intensity ?? (symptoms.length ? 2 : null) })
  }

  return (
    <div>
      <div className="symptom-log-head">
        <div>
          <div className="eyebrow">Today, in your own words</div>
          <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, marginTop: 4 }}>How does this day actually feel?</h3>
        </div>
        <span className="hand" style={{ fontSize: 18, color: 'var(--ink-muted)' }}>tap anything that&apos;s true</span>
      </div>

      <div className="symptom-log-chips">
        {LOG_CHIPS.map((s, i) => (
          <Chip key={s} active={log.symptoms.includes(s)} onClick={() => toggle(s)} tilt={((i % 3) - 1) * 0.6}>
            {s}
          </Chip>
        ))}
      </div>

      {log.symptoms.length > 0 && (
        <div className="symptom-intensity" role="group" aria-label="How strong, overall">
          <span className="symptom-intensity-label">overall, it feels</span>
          {INTENSITY.map(o => (
            <button
              key={o.value}
              type="button"
              aria-pressed={log.intensity === o.value}
              className="symptom-intensity-opt"
              data-on={log.intensity === o.value || undefined}
              onClick={() => onChange({ ...log, intensity: o.value })}
            >
              <span aria-hidden className="symptom-intensity-dots">
                {[1, 2, 3].map(n => <i key={n} data-filled={n <= o.value || undefined} />)}
              </span>
              {o.label}
            </button>
          ))}
        </div>
      )}

      <p className={`symptom-log-note${state === 'error' ? ' wellness-error' : ' hand'}`} role="status" aria-live="polite">
        {SAVE_NOTE[state]}
      </p>
    </div>
  )
}
