'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'

const OPTIONS = [
  { label: 'More energy',      tilt: -0.5 },
  { label: 'Better sleep',     tilt:  0.4 },
  { label: 'Clearer thinking', tilt: -0.3 },
  { label: 'Improve mood',     tilt:  0.5 },
  { label: 'Less stress',      tilt: -0.4 },
  { label: 'Overall balance',  tilt:  0.3 },
]

export default function StepGoal({ data, onNext, onBack, isFirst }: StepProps) {
  const [selected, setSelected] = useState<string | undefined>(data.wellnessGoal)

  return (
    <StepFrame
      heading="What matters most to you right now?"
      sub="Just one thing."
      onBack={onBack}
      isFirst={isFirst}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        {OPTIONS.map(opt => (
          <Chip
            key={opt.label}
            active={selected === opt.label}
            onClick={() => setSelected(opt.label)}
            tilt={opt.tilt}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
      <InkButton
        variant="primary"
        onClick={() => onNext({ wellnessGoal: selected })}
        disabled={selected === undefined}
      >
        Next
      </InkButton>
    </StepFrame>
  )
}
