'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'

export default function StepSleep({ data, onNext, onBack, isFirst }: StepProps) {
  const [hours, setHours] = useState(data.sleepHours ?? 7)

  return (
    <StepFrame
      heading="How many hours do you usually sleep?"
      onBack={onBack}
      isFirst={isFirst}
    >
      <div style={{ marginBottom: 32 }}>
        <IllustratedSlider
          label="Sleep"
          value={hours}
          onChange={setHours}
          min={0}
          max={12}
          unit="h"
        />
      </div>
      <InkButton variant="primary" onClick={() => onNext({ sleepHours: hours })}>
        Next
      </InkButton>
    </StepFrame>
  )
}
