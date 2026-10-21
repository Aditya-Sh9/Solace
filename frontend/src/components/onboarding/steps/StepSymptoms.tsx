'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import Chip from '@/src/components/ui/Chip'
import type { StepProps } from '../OnboardingShell'

// Labels are sent as-is to the backend rule engine — change the wording there too, never only here.
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

export default function StepSymptoms({ data, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(data.symptoms ?? []))

  function toggle(label: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(label)) { next.delete(label) } else { next.add(label) }
      return next
    })
  }

  return (
    <StepFrame
      eyebrow="No wrong answers"
      heading="What does 'off' feel like for you?"
      sub="Choose as many as feel true — or none, if none quite fit."
      onBack={() => onBack({ symptoms: [...selected] })}
      onNext={() => onNext({ symptoms: [...selected] })}
      nextLabel={selected.size === 0 ? 'none quite fit' : 'next'}
    >
      <div role="group" aria-label="What feels off" className="onb-chips">
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
      <p className="hand onb-count" aria-live="polite">
        {selected.size === 0 ? 'nothing picked — that counts too.'
          : selected.size === 1 ? 'one feels true.'
          : `${selected.size} feel true.`}
      </p>
    </StepFrame>
  )
}
