'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import InkInput from '@/src/components/ui/InkInput'
import { IllustrationLeaves } from '@/src/components/ui/Illustrations'
import type { StepProps } from '../OnboardingShell'

export default function StepNameAge({ data, onNext, onBack }: StepProps) {
  const [name, setName] = useState(data.name ?? '')
  const [age,  setAge]  = useState(data.age?.toString() ?? '')
  const [ageTouched, setAgeTouched] = useState(false)
  // Mirrors the backend's z.number().int().min(13).max(120) — otherwise the final save fails
  // and "Try again" can never succeed.
  const ageNum   = Number(age)
  const ageValid = age === '' || (Number.isInteger(ageNum) && ageNum >= 13 && ageNum <= 120)
  const canNext  = name.trim().length > 0 && ageValid

  function handleNext() {
    if (!canNext) { setAgeTouched(true); return }
    onNext({ name: name.trim(), age: age ? parseInt(age, 10) : undefined })
  }

  return (
    <StepFrame
      eyebrow="A small introduction"
      heading="What should we call you?"
      sub="A first name or a nickname is plenty — whatever feels like you."
      note="you can change this any time"
      art={<IllustrationLeaves size={72} />}
      onBack={() => onBack({ name: name.trim() || undefined, age: ageValid && age ? ageNum : undefined })}
      onNext={handleNext}
      canNext={canNext}
      focusHeading={false}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <InkInput
          id="onb-name"
          label="Name"
          type="text"
          autoComplete="given-name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="a name"
          className="onb-name-input"
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleNext()}
        />
        <div style={{ maxWidth: 200 }}>
          <InkInput
            id="onb-age"
            label="Age (optional)"
            type="number"
            inputMode="numeric"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="—"
            min={13}
            max={120}
            onBlur={() => setAgeTouched(true)}
            error={ageTouched && !ageValid ? 'Somewhere between 13 and 120 — or leave it blank.' : undefined}
            aria-invalid={ageTouched && !ageValid}
            onKeyDown={e => e.key === 'Enter' && handleNext()}
          />
        </div>
      </div>
    </StepFrame>
  )
}
