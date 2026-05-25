'use client'

import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import { Icon } from '@/src/components/ui/Icons'

interface WaterRowProps {
  value:    number
  onChange: (v: number) => void
}

export default function WaterRow({ value, onChange }: WaterRowProps) {
  return (
    <IllustratedSlider
      label="Water"
      value={value}
      onChange={onChange}
      min={0}
      max={12}
      unit=" glasses"
      icon={<Icon.Drop size={18} color="var(--ink-muted)" />}
    />
  )
}
