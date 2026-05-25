'use client'

import { MoodFace } from '@/src/components/ui/Icons'
import InkCircleSelection from '@/src/components/ui/InkCircleSelection'
import { MOOD_LABELS } from '@/src/constants/checkin'

interface MoodPickerRowProps {
  value: number        // 1–6 (moodScore)
  onChange: (score: number) => void
}

export default function MoodPickerRow({ value, onChange }: MoodPickerRowProps) {
  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 14px',
      }}>
        How are you feeling?
      </p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
        {([0, 1, 2, 3, 4, 5] as const).map(index => {
          const score   = index + 1
          const isActive = value === score
          return (
            <button
              key={index}
              onClick={() => onChange(score)}
              aria-label={MOOD_LABELS[index]}
              aria-pressed={isActive}
              style={{
                position: 'relative', width: 52, height: 52,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 220ms cubic-bezier(.34,1.4,.64,1)',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <MoodFace index={index} size={42} active={isActive} />
              <InkCircleSelection size={52} active={isActive} />
            </button>
          )
        })}
      </div>
      {value > 0 && (
        <p className="hand" style={{
          textAlign: 'center', marginTop: 8, fontSize: 16,
          color: 'var(--accent)', letterSpacing: '0.02em',
        }}>
          {MOOD_LABELS[value - 1]}
        </p>
      )}
    </div>
  )
}
