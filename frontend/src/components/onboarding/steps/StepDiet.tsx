'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import OptionCards from '../OptionCards'
import type { Option } from '../OptionCards'
import type { StepProps } from '../OnboardingShell'
import type { DietaryPattern } from '@/src/types/onboarding'

const OPTIONS: Option<DietaryPattern>[] = [
  { value: 'OMNIVORE',    label: 'A bit of everything', sub: 'no lines drawn' },
  { value: 'VEGETARIAN',  label: 'Vegetarian',          sub: 'no meat or fish' },
  { value: 'VEGAN',       label: 'Vegan',               sub: 'plants only' },
  { value: 'PESCATARIAN', label: 'Pescatarian',         sub: 'fish, but no meat' },
  { value: 'OTHER',       label: 'Something else',      sub: 'it has its own shape' },
]

export default function StepDiet({ data, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<DietaryPattern | undefined>(data.dietaryPattern)

  return (
    <StepFrame
      eyebrow="No wrong answers"
      heading="How would you describe your eating?"
      sub="Just the broad shape of it."
      note="it helps us read your check-ins later"
      onBack={() => onBack({ dietaryPattern: selected })}
      onNext={() => onNext({ dietaryPattern: selected })}
      canNext={selected !== undefined}
    >
      <OptionCards label="Eating" options={OPTIONS} value={selected} onChange={setSelected} columns={2} />
    </StepFrame>
  )
}
