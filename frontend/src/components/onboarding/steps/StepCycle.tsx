'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import OptionCards from '../OptionCards'
import type { Option } from '../OptionCards'
import type { StepProps } from '../OnboardingShell'

// "No thanks" and "Skip for now" both saved false, so they're one option now.
const OPTIONS: Option<boolean>[] = [
  { value: true,  label: 'Yes, add it',   sub: 'your cycle, alongside your patterns' },
  { value: false, label: 'Not right now', sub: 'nothing changes' },
]

export default function StepCycle({ data, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<boolean | undefined>(data.cycleTracking)

  return (
    <StepFrame
      eyebrow="Completely optional"
      heading="One more thing — would you like to track your cycle?"
      sub="We'd only use it to add context to your patterns — some weeks have their own weather."
      onBack={() => onBack({ cycleTracking: selected })}
      onNext={() => onNext({ cycleTracking: selected })}
      canNext={selected !== undefined}
      nextLabel="I'm ready"
    >
      <OptionCards label="Track your cycle" options={OPTIONS} value={selected} onChange={setSelected} />
    </StepFrame>
  )
}
