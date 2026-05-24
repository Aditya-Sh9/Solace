'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'

const SYMPTOMS = [
  { label: 'Fatigue',                  tilt: -0.5 },
  { label: 'Brain fog',                tilt:  0.4 },
  { label: 'Low mood',                 tilt: -0.3 },
  { label: 'Anxiety',                  tilt:  0.5 },
  { label: 'Irritability',             tilt: -0.4 },
  { label: 'Poor sleep',               tilt:  0.3 },
  { label: 'Muscle tension',           tilt: -0.5 },
  { label: 'Headaches',                tilt:  0.4 },
  { label: 'Bloating',                 tilt: -0.3 },
  { label: 'Low energy',               tilt:  0.5 },
  { label: 'Difficulty concentrating', tilt: -0.4 },
  { label: 'Skin issues',              tilt:  0.3 },
]

export default function StepSymptoms({ data, onNext, onBack, isFirst }: StepProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(data.symptoms ?? []))

  function toggle(label: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(label) ? next.delete(label) : next.add(label)
      return next
    })
  }

  return (
    <StepFrame
      heading="What does 'off' feel like for you?"
      sub="Choose as many as feel true — or none, if none quite fit."
      onBack={onBack}
      isFirst={isFirst}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        {SYMPTOMS.map(s => (
          <Chip
            key={s.label}
            active={selected.has(s.label)}
            onClick={() => toggle(s.label)}
            tilt={s.tilt}
          >
            {s.label}
          </Chip>
        ))}
      </div>
      <InkButton variant="primary" onClick={() => onNext({ symptoms: [...selected] })}>
        Next
      </InkButton>
    </StepFrame>
  )
}
