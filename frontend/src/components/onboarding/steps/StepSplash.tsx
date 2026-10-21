'use client'

// screens-onboarding.jsx SplashStep. Copy change: "your cycle" → "your energy" (not everyone gets
// the cycle section), plus a line saying how long this takes.
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import { Icon } from '@/src/components/ui/Icons'
import { IllustrationCup } from '@/src/components/ui/Illustrations'
import type { StepProps } from '../OnboardingShell'

export default function StepSplash({ data, onNext }: StepProps) {
  const first = data.name?.split(' ')[0]
  return (
    <InkCard hand handIntensity={2.6} className="onb-page onb-splash">
      <div style={{ marginBottom: 20 }} aria-hidden="true">
        <IllustrationCup size={100} />
      </div>
      <div className="eyebrow" style={{ marginBottom: 14 }}>
        {first ? `Welcome, ${first}` : 'Welcome to Solace'}
      </div>
      <h1 className="serif italic onb-splash-title">
        Let&apos;s figure out how you actually feel.
      </h1>
      <p className="onb-splash-sub">
        A quiet companion for your moods, your energy, and the small notes you&apos;d write to
        yourself on a Tuesday afternoon.
      </p>
      <InkButton variant="primary" onClick={() => onNext({})} iconRight={<Icon.ChevronRight size={14} />}>
        Begin
      </InkButton>
      <p className="hand onb-splash-hint">a few small questions — about two minutes.</p>
    </InkCard>
  )
}
