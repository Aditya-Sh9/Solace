'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'
import type { DietaryPattern } from '@/src/types/onboarding'

const OPTIONS: { value: DietaryPattern; label: string; tilt: number }[] = [
  { value: 'OMNIVORE',    label: 'Everything',  tilt: -0.5 },
  { value: 'VEGETARIAN',  label: 'Vegetarian',  tilt:  0.4 },
  { value: 'VEGAN',       label: 'Vegan',       tilt: -0.3 },
  { value: 'PESCATARIAN', label: 'Pescatarian', tilt:  0.5 },
  { value: 'OTHER',       label: 'Other',       tilt: -0.4 },
]

export default function StepDiet({ data, onNext, onBack, isFirst }: StepProps) {
  const [selected, setSelected] = useState<DietaryPattern | undefined>(data.dietaryPattern)

  return (
    <StepFrame heading="How would you describe your eating?" onBack={onBack} isFirst={isFirst}>
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
        onClick={() => onNext({ dietaryPattern: selected })}
        disabled={selected === undefined}
      >
        Next
      </InkButton>
    </StepFrame>
  )
}
