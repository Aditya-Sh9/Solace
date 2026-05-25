'use client'

import Chip from '@/src/components/ui/Chip'

interface ChipMultiSelectProps {
  label:     string
  options:   readonly string[]
  selected:  string[]
  onChange:  (selected: string[]) => void
}

export default function ChipMultiSelect({ label, options, selected, onChange }: ChipMultiSelectProps) {
  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter(s => s !== option)
        : [...selected, option]
    )
  }

  return (
    <div>
      <p style={{
        fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 12px',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((option, i) => (
          <Chip
            key={option}
            active={selected.includes(option)}
            onClick={() => toggle(option)}
            tilt={(i % 3 === 0 ? -0.8 : i % 3 === 2 ? 0.6 : 0)}
          >
            {option}
          </Chip>
        ))}
      </div>
    </div>
  )
}
