'use client'

// No design-reference screen asks this (see MISSING_REFERENCES.md) — built on the reference's
// "single" option cards like the other one-answer steps.
import { useState } from 'react'
import StepFrame from '../StepFrame'
import OptionCards from '../OptionCards'
import type { Option } from '../OptionCards'
import type { StepProps } from '../OnboardingShell'
import type { Gender } from '@/src/types/onboarding'

const OPTIONS: Option<Gender>[] = [
  { value: 'FEMALE',      label: 'Female' },
  { value: 'MALE',        label: 'Male' },
  { value: 'UNDISCLOSED', label: 'Rather not say', sub: 'completely fine' },
]

export default function StepGender({ data, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<Gender | undefined>(data.gender)

  return (
    <StepFrame
      eyebrow="A quiet question"
      heading="Which of these fits you best?"
      sub="We only ask so we know whether to offer cycle-aware guidance. Nothing else changes."
      note="we never share it with anyone"
      onBack={() => onBack({ gender: selected })}
      onNext={() => onNext({ gender: selected })}
      canNext={selected !== undefined}
      // Male skips the cycle question, so this is their last one.
      nextLabel={selected === 'MALE' ? "I'm ready" : 'next'}
    >
      <OptionCards label="Gender" options={OPTIONS} value={selected} onChange={setSelected} />
    </StepFrame>
  )
}
