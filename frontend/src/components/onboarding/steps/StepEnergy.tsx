'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import OptionCards from '../OptionCards'
import type { Option } from '../OptionCards'
import { EnergyJar } from '../OptionGlyphs'
import type { StepProps } from '../OnboardingShell'

const OPTIONS: Option<number>[] = [
  { value: 1, label: 'Running on empty',       sub: 'most days feel heavy' },
  { value: 2, label: 'Low-ish',                sub: 'it dips more than it lifts' },
  { value: 3, label: 'Somewhere in the middle', sub: 'good hours and flat ones' },
  { value: 4, label: 'Mostly steady',          sub: 'enough for the day, usually' },
  { value: 5, label: 'Plenty to spare',        sub: 'most days feel bright' },
].map(o => ({ ...o, icon: <EnergyJar level={o.value} /> }))

export default function StepEnergy({ data, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<number | undefined>(data.energyLevel)

  return (
    <StepFrame
      eyebrow="Roughly"
      heading="How's your energy, usually?"
      sub="Think of an ordinary week — not your best day, not your worst."
      onBack={() => onBack({ energyLevel: selected })}
      onNext={() => onNext({ energyLevel: selected })}
      canNext={selected !== undefined}
    >
      <OptionCards label="Usual energy" options={OPTIONS} value={selected} onChange={setSelected} />
    </StepFrame>
  )
}
