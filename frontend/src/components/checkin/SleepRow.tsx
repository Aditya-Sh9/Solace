'use client'

import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import { Icon } from '@/src/components/ui/Icons'

interface SleepRowProps {
  value:    number
  onChange: (v: number) => void
}

export default function SleepRow({ value, onChange }: SleepRowProps) {
  return (
    <IllustratedSlider
      label="Sleep"
      value={value}
      onChange={onChange}
      min={0}
      max={12}
      unit="h"
      icon={<Icon.Moon size={18} color="var(--ink-muted)" />}
    />
  )
}
