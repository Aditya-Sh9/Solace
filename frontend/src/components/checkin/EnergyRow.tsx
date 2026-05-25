'use client'

import IllustratedSlider from '@/src/components/ui/IllustratedSlider'

interface EnergyRowProps {
  value:    number   // 1–6
  onChange: (v: number) => void
}

export default function EnergyRow({ value, onChange }: EnergyRowProps) {
  return (
    <IllustratedSlider
      label="Energy"
      value={value}
      onChange={onChange}
      min={1}
      max={6}
      icon={
        <svg width={18} height={18} viewBox="0 0 24 24"
          stroke="var(--ink-muted)" strokeWidth={1.6} strokeLinecap="round"
          strokeLinejoin="round" fill="none">
          <path d="M13.2 4.8 7 13.2h6l-2.2 6 7-9H12l1.2-5.4Z" />
        </svg>
      }
    />
  )
}
