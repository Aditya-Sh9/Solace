'use client'

import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import type { StepProps } from '../OnboardingShell'

const OPTIONS = [
  { label: 'Yes, track it', value: true,  tilt: -0.5 },
  { label: 'No thanks',     value: false, tilt:  0.4 },
  { label: 'Skip for now',  value: false, tilt: -0.3 },
]

export default function StepCycle({ data: _data, onNext, onBack, isFirst }: StepProps) {
  return (
    <StepFrame
      heading="One more thing — do you track your cycle?"
      sub="Completely optional. We'll only use it to add context to your patterns."
      onBack={onBack}
      isFirst={isFirst}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {OPTIONS.map(opt => (
          <Chip
            key={opt.label}
            onClick={() => onNext({ cycleTracking: opt.value })}
            tilt={opt.tilt}
          >
            {opt.label}
          </Chip>
        ))}
      </div>
    </StepFrame>
  )
}
