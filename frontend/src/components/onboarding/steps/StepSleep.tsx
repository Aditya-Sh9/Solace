'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import IllustratedSlider from '@/src/components/ui/IllustratedSlider'
import { Icon } from '@/src/components/ui/Icons'
import { IllustrationSunMoon } from '@/src/components/ui/Illustrations'
import type { StepProps } from '../OnboardingShell'

// Describes the night, never grades it (motto-and-voice.md: no "get 8 hours").
function describeNight(hours: number): string {
  if (hours <= 4) return 'short nights, lately'
  if (hours <= 6) return 'on the lighter side'
  if (hours <= 8) return 'a fairly full night'
  return 'a long, slow rest'
}

export default function StepSleep({ data, onNext, onBack }: StepProps) {
  const [hours, setHours] = useState(data.sleepHours ?? 7)

  return (
    <StepFrame
      eyebrow="On a typical night"
      heading="How many hours do you usually sleep?"
      sub="A rough guess is fine — the check-ins will fill in the rest."
      art={<IllustrationSunMoon time="night" size={64} />}
      onBack={() => onBack({ sleepHours: hours })}
      onNext={() => onNext({ sleepHours: hours })}
    >
      <div className="onb-slider">
        <IllustratedSlider
          label="Sleep"
          value={hours}
          onChange={setHours}
          min={0}
          max={12}
          unit="h"
          valueText={`${hours} hours`}
          icon={<Icon.Moon size={18} color="var(--ink-muted)" />}
        />
        <p className="hand onb-slider-read">{describeNight(hours)}</p>
      </div>
    </StepFrame>
  )
}
