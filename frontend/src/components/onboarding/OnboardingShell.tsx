'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ComponentType } from 'react'
import ProgressBar from './ProgressBar'
import type { OnboardingFormData } from '@/src/types/onboarding'
import StepNameAge   from './steps/StepNameAge'
import StepEnergy    from './steps/StepEnergy'
import StepActivity  from './steps/StepActivity'
import StepDiet      from './steps/StepDiet'
import StepSymptoms  from './steps/StepSymptoms'
import StepSleep     from './steps/StepSleep'
import StepStress    from './steps/StepStress'
import StepGoal      from './steps/StepGoal'
import StepGender    from './steps/StepGender'
import StepCycle     from './steps/StepCycle'
import StepComplete  from './steps/StepComplete'
import DashboardError from '@/src/components/dashboard/DashboardError'
import { useOnboardingGate } from '@/src/hooks/use-onboarding-gate'

export interface StepProps {
  data:    OnboardingFormData
  onNext:  (updates: Partial<OnboardingFormData>) => void
  onBack:  () => void
  isFirst?: boolean
}

const ALL_STEPS: ComponentType<StepProps>[] = [
  StepNameAge, StepEnergy, StepActivity, StepDiet, StepSymptoms,
  StepSleep, StepStress, StepGoal, StepGender, StepCycle, StepComplete,
]
// Only "Male" loses the cycle section (backend services/cycle-access.ts), so the cycle
// question is skipped for them. StepGender sits directly before StepCycle, so dropping it
// never shifts the index of a step the person has already seen.
const WITHOUT_CYCLE = ALL_STEPS.filter(s => s !== StepCycle)

const variants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function OnboardingShell() {
  const { gate, retry } = useOnboardingGate()

  if (gate.status === 'checking') return <OnboardingSkeleton />
  if (gate.status === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '40px 24px' }}>
        <DashboardError onRetry={retry} />
      </div>
    )
  }
  return <OnboardingSteps initialData={gate.prefillName ? { name: gate.prefillName } : {}} />
}

// Shown while we check whether this person has already onboarded (returning Google users
// pass through here on the way to the dashboard). Same ink-pulse blocks as the dashboard.
function OnboardingSkeleton() {
  const block = (width: number | string, height: number) => (
    <div className="ink-pulse" style={{
      width, height, borderRadius: 10, background: 'var(--surface-2)',
      animation: 'ink-pulse 1.4s ease infinite',
    }} />
  )
  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px 64px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {block('100%', 6)}
        <div style={{ height: 80 }} />
        {block(260, 32)}
        {block('80%', 18)}
        <div style={{ height: 12 }} />
        {block('100%', 48)}
      </div>
    </div>
  )
}

function OnboardingSteps({ initialData }: { initialData: OnboardingFormData }) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingFormData>(initialData)
  const [dir,  setDir]  = useState(1)
  const steps = data.gender === 'MALE' ? WITHOUT_CYCLE : ALL_STEPS

  function goNext(updates: Partial<OnboardingFormData>) {
    setDir(1)
    setData(prev => ({ ...prev, ...updates }))
    setStep(prev => Math.min(prev + 1, steps.length - 1))
  }

  function goBack() {
    setDir(-1)
    setStep(prev => Math.max(prev - 1, 0))
  }

  const StepComponent = steps[step]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', padding: '40px 24px 64px',
    }}>
      <div style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}>
        <ProgressBar step={step} total={steps.length} />
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginTop: 40, overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ width: '100%', maxWidth: 480 }}
          >
            <StepComponent
              data={data}
              onNext={goNext}
              onBack={goBack}
              isFirst={step === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
