'use client'

import { useState } from 'react'
import StepFrame from '../StepFrame'
import OptionCards from '../OptionCards'
import type { Option } from '../OptionCards'
import { Icon } from '@/src/components/ui/Icons'
import type { StepProps } from '../OnboardingShell'

const ink = 'var(--accent)'

// `value` is stored as-is in UserProfile.wellnessGoal — keep these strings stable.
const OPTIONS: Option<string>[] = [
  { value: 'More energy',      sub: 'lighter afternoons',        icon: <Icon.Sun size={20} color={ink} /> },
  { value: 'Better sleep',     sub: 'nights that actually rest', icon: <Icon.Moon size={20} color={ink} /> },
  { value: 'Clearer thinking', sub: 'less fog',                  icon: <Icon.Sparkle size={20} color={ink} /> },
  { value: 'Improve mood',     sub: 'more like yourself',        icon: <Icon.Heart size={20} color={ink} /> },
  { value: 'Less stress',      sub: 'a little more room',        icon: <Icon.Leaf size={20} color={ink} /> },
  { value: 'Overall balance',  sub: 'a bit of everything',       icon: <Icon.Flower size={20} color={ink} /> },
].map(o => ({ ...o, label: o.value }))

export default function StepGoal({ data, onNext, onBack }: StepProps) {
  const [selected, setSelected] = useState<string | undefined>(data.wellnessGoal)

  return (
    <StepFrame
      eyebrow="Just one, for now"
      heading="What matters most to you right now?"
      sub="We'll lean towards it in what we notice for you."
      note="you can change your mind later"
      onBack={() => onBack({ wellnessGoal: selected })}
      onNext={() => onNext({ wellnessGoal: selected })}
      canNext={selected !== undefined}
    >
      <OptionCards label="What matters most" options={OPTIONS} value={selected} onChange={setSelected} columns={2} />
    </StepFrame>
  )
}
