'use client'

import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import { Icon } from '@/src/components/ui/Icons'

interface SunlightRowProps {
  value:    number
  onChange: (v: number) => void
}

export default function SunlightRow({ value, onChange }: SunlightRowProps) {
  return (
    <IllustratedSlider
      label="Sunlight"
      value={value}
      onChange={onChange}
      min={0}
      max={120}
      unit=" min"
      icon={<Icon.Sun size={18} color="var(--ink-muted)" />}
    />
  )
}
