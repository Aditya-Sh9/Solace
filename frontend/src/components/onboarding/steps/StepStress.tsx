'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import { IllustrationLeaves } from '@/src/components/ui/Illustrations'
import { STRESS_LABELS } from '@/src/constants/checkin'
import type { StepProps } from '../OnboardingShell'

export default function StepStress({ data, onNext, onBack }: StepProps) {
  const [level, setLevel] = useState(data.stressLevel ?? 3)
  const word = STRESS_LABELS[level - 1]

  return (
    <StepFrame
      eyebrow="Lately"
      heading="How would you describe your stress?"
      sub="The last couple of weeks, give or take."
      note="there's no wrong number here"
      art={<IllustrationLeaves size={64} />}
      onBack={() => onBack({ stressLevel: level })}
      onNext={() => onNext({ stressLevel: level })}
    >
      <div className="onb-slider">
        <IllustratedSlider
          label="Stress"
          value={level}
          onChange={setLevel}
          min={1}
          max={5}
          valueText={word}
        />
        <p className="hand onb-slider-read">{word}</p>
      </div>
    </StepFrame>
  )
}
