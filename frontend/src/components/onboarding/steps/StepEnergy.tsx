'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'

const OPTIONS = [
  { value: 1, label: 'Very low', tilt: -0.5 },
  { value: 2, label: 'Low',      tilt:  0.4 },
  { value: 3, label: 'Okay',     tilt: -0.3 },
  { value: 4, label: 'Good',     tilt:  0.5 },
  { value: 5, label: 'Great',    tilt: -0.4 },
]

export default function StepEnergy({ data, onNext, onBack, isFirst }: StepProps) {
  const [selected, setSelected] = useState<number | undefined>(data.energyLevel)

  return (
    <StepFrame heading="How's your energy, usually?" onBack={onBack} isFirst={isFirst}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        {OPTIONS.map(opt => (
          <Chip
            key={opt.value}
            active={selected === opt.value}
            onClick={() => setSelected(opt.value)}
            tilt={opt.tilt}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
      <InkButton
        variant="primary"
        onClick={() => onNext({ energyLevel: selected })}
        disabled={selected === undefined}
      >
        Next
      </InkButton>
    </StepFrame>
  )
}
