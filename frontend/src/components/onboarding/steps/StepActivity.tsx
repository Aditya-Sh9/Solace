'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import OptionCards from '../OptionCards'
import type { Option } from '../OptionCards'
import type { StepProps } from '../OnboardingShell'
import type { ActivityLevel } from '@/src/types/onboarding'

const OPTIONS: Option<ActivityLevel>[] = [
  { value: 'SEDENTARY',         label: 'Mostly sitting', sub: 'desk, couch, commute' },
  { value: 'LIGHTLY_ACTIVE',    label: 'Light movement', sub: 'walks, errands, the odd stairwell' },
  { value: 'MODERATELY_ACTIVE', label: 'Fairly active',  sub: 'something that moves you, most days' },
  { value: 'VERY_ACTIVE',       label: 'Very active',    sub: 'training, or on your feet all day' },
]

export default function StepActivity({ data, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<ActivityLevel | undefined>(data.activityLevel)

  return (
    <StepFrame
      eyebrow="On an ordinary day"
      heading="How much do you move, day to day?"
      sub="Whatever's true right now. Nothing here is a grade."
      onBack={() => onBack({ activityLevel: selected })}
      onNext={() => onNext({ activityLevel: selected })}
      canNext={selected !== undefined}
    >
      <OptionCards label="Daily movement" options={OPTIONS} value={selected} onChange={setSelected} />
    </StepFrame>
  )
}
