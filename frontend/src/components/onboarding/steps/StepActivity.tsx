'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'
import type { ActivityLevel } from '@/src/types/onboarding'

const OPTIONS: { value: ActivityLevel; label: string; tilt: number }[] = [
  { value: 'SEDENTARY',          label: 'Mostly sitting', tilt: -0.5 },
  { value: 'LIGHTLY_ACTIVE',     label: 'Light movement', tilt:  0.4 },
  { value: 'MODERATELY_ACTIVE',  label: 'Fairly active',  tilt: -0.3 },
  { value: 'VERY_ACTIVE',        label: 'Very active',    tilt:  0.5 },
]

export default function StepActivity({ data, onNext, onBack, isFirst }: StepProps) {
  const [selected, setSelected] = useState<ActivityLevel | undefined>(data.activityLevel)

  return (
    <StepFrame heading="How active are you, day to day?" onBack={onBack} isFirst={isFirst}>
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
        onClick={() => onNext({ activityLevel: selected })}
        disabled={selected === undefined}
      >
        Next
      </InkButton>
    </StepFrame>
  )
}
