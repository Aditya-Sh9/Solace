'use client'

import { MoodFace, MOOD_LABELS } from '@/src/components/ui'
import type { MoodIndex } from '@/src/lib/journal-payload'

const MOODS: readonly MoodIndex[] = [0, 1, 2, 3, 4, 5]

interface JournalMoodPickerProps {
  value:     MoodIndex | null
  onChange:  (mood: MoodIndex) => void
  disabled?: boolean
}

// Small in-page mood row from screens-journal.jsx: lifted face + accent wash on the chosen one.
export default function JournalMoodPicker({ value, onChange, disabled = false }: JournalMoodPickerProps) {
  return (
    <div role="radiogroup" aria-label="How this day felt" className="journal-mood-picker">
      {MOODS.map(i => {
        const isActive = value === i
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={MOOD_LABELS[i]}
            disabled={disabled}
            onClick={() => onChange(i)}
            style={{
              background: 'transparent', border: 'none', padding: 4, position: 'relative',
              cursor: disabled ? 'default' : 'pointer',
              transform: isActive ? 'translateY(-2px)' : 'none',
              transition: 'transform 240ms cubic-bezier(.34,1.4,.64,1)',
              isolation: 'isolate',
            }}
          >
            <MoodFace index={i} size={28} active={isActive} />
            {isActive && <span aria-hidden className="journal-mood-wash" />}
          </button>
        )
      })}
    </div>
  )
}
