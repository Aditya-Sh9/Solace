'use client'

import InkCard from '@/src/components/ui/InkCard'
import { MoodFace } from '@/src/components/ui/Icons'
import InkCircleSelection from '@/src/components/ui/InkCircleSelection'
import { MOOD_LABELS } from '@/src/constants/checkin'

interface MoodPickerRowProps {
  value:    number        // 1–6 (moodScore)
  onChange: (score: number) => void
}

export default function MoodPickerRow({ value, onChange }: MoodPickerRowProps) {
  const activeIndex = value > 0 ? value - 1 : null

  return (
    <InkCard hand handIntensity={2.4} style={{ padding: 30 }}>
      {/* Header row: eyebrow left, active label right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <div className="eyebrow">A feeling, roughly</div>
        {activeIndex !== null && (
          <div className="hand" style={{ fontSize: 22, color: 'var(--accent)' }}>
            feeling {MOOD_LABELS[activeIndex]}
          </div>
        )}
      </div>

      {/* Faces row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 8 }}>
        {([0, 1, 2, 3, 4, 5] as const).map(index => {
          const score    = index + 1
          const isActive = value === score
          return (
            <button
              key={index}
              onClick={() => onChange(score)}
              aria-label={MOOD_LABELS[index]}
              aria-pressed={isActive}
              style={{
                position: 'relative', background: 'transparent', border: 'none',
                cursor: 'pointer', padding: 12, color: 'inherit',
                transition: 'transform 280ms cubic-bezier(.34,1.4,.64,1)',
                transform: isActive ? 'translateY(-3px) scale(1.05)' : 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.transform = 'none' }}
            >
              <MoodFace index={index} size={56} active={isActive} />
              <InkCircleSelection size={76} active={isActive} />
            </button>
          )
        })}
      </div>
    </InkCard>
  )
}
