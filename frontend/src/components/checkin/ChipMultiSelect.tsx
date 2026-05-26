'use client'

import InkCard from '@/src/components/ui/InkCard'
import Chip from '@/src/components/ui/Chip'

interface ChipMultiSelectProps {
  label:     string
  subtitle?: string
  options:   readonly string[]
  selected:  string[]
  onChange:  (selected: string[]) => void
}

export default function ChipMultiSelect({ label, subtitle, options, selected, onChange }: ChipMultiSelectProps) {
  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter(s => s !== option)
        : [...selected, option]
    )
  }

  return (
    <InkCard hand handIntensity={2.4} style={{ padding: 28 }}>
      <div className="eyebrow" style={{ marginBottom: subtitle ? 4 : 16 }}>{label}</div>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--ink-muted)', margin: '0 0 16px', lineHeight: 1.55 }}>
          {subtitle}
        </p>
      )}
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
    </InkCard>
  )
}
