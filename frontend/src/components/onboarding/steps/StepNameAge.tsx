'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import InkInput from '@/src/components/ui/InkInput'
import InkButton from '@/src/components/ui/InkButton'
import type { StepProps } from '../OnboardingShell'

export default function StepNameAge({ data, onNext, onBack, isFirst }: StepProps) {
  const [name, setName] = useState(data.name ?? '')
  const [age,  setAge]  = useState(data.age?.toString() ?? '')

  function handleNext() {
    if (!name.trim()) return
    onNext({ name: name.trim(), age: age ? parseInt(age, 10) : undefined })
  }

  return (
    <StepFrame
      heading="What should we call you?"
      sub="And roughly how old are you? Just to give context to what you share."
      onBack={onBack}
      isFirst={isFirst}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InkInput
          id="onb-name"
          label="First name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="..."
          autoFocus
          onKeyDown={e => e.key === 'Enter' && handleNext()}
        />
        <InkInput
          id="onb-age"
          label="Age"
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="..."
          min={13}
          max={120}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
        />
        <InkButton
          variant="primary"
          onClick={handleNext}
          disabled={!name.trim()}
          style={{ marginTop: 8 }}
        >
          Next
        </InkButton>
      </div>
    </StepFrame>
  )
}
