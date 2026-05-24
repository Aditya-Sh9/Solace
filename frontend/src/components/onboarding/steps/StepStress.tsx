'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'

export default function StepStress({ data, onNext, onBack, isFirst }: StepProps) {
  const [level, setLevel] = useState(data.stressLevel ?? 3)

  return (
    <StepFrame
      heading="How would you describe your stress lately?"
      onBack={onBack}
      isFirst={isFirst}
    >
      <div style={{ marginBottom: 32 }}>
        <IllustratedSlider
          label="Stress level"
          value={level}
          onChange={setLevel}
          min={1}
          max={5}
        />
      </div>
      <InkButton variant="primary" onClick={() => onNext({ stressLevel: level })}>
        Next
      </InkButton>
    </StepFrame>
  )
}
