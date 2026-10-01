'use client'

// No design-reference screen asks this (see MISSING_REFERENCES.md) — built on StepCycle's
// pattern: one tap answers and moves on.
import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import type { StepProps } from '../OnboardingShell'
import type { Gender } from '@/src/types/onboarding'

const OPTIONS: { label: string; value: Gender; tilt: number }[] = [
  { label: 'Female',         value: 'FEMALE',      tilt: -0.5 },
  { label: 'Male',           value: 'MALE',        tilt:  0.4 },
  { label: 'Rather not say', value: 'UNDISCLOSED', tilt: -0.3 },
]

export default function StepGender({ data, onNext, onBack, isFirst }: StepProps) {
  return (
    <StepFrame
      heading="Which of these fits you best?"
      sub="We only ask so we know whether to offer cycle-aware guidance. Nothing else changes."
      onBack={onBack}
      isFirst={isFirst}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {OPTIONS.map(opt => (
          <Chip
            key={opt.value}
            active={data.gender === opt.value}
            onClick={() => onNext({ gender: opt.value })}
            tilt={opt.tilt}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
    </StepFrame>
  )
}
