'use client'

import { useRef, useState } from 'react'
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
import StepCycle     from './steps/StepCycle'
import StepComplete  from './steps/StepComplete'

export interface StepProps {
  data:    OnboardingFormData
  onNext:  (updates: Partial<OnboardingFormData>) => void
  onBack:  () => void
  isFirst?: boolean
}

const STEPS: ComponentType<StepProps>[] = [
  StepNameAge, StepEnergy, StepActivity, StepDiet, StepSymptoms,
  StepSleep, StepStress, StepGoal, StepCycle, StepComplete,
]

const variants = {
  enter:  (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function OnboardingShell() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingFormData>({})
  const dir = useRef(1)

  function goNext(updates: Partial<OnboardingFormData>) {
    dir.current = 1
    setData(prev => ({ ...prev, ...updates }))
    setStep(prev => Math.min(prev + 1, STEPS.length - 1))
  }

  function goBack() {
    dir.current = -1
    setStep(prev => Math.max(prev - 1, 0))
  }

  const StepComponent = STEPS[step]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', padding: '40px 24px 64px',
    }}>
      <div style={{ maxWidth: 480, width: '100%', margin: '0 auto' }}>
        <ProgressBar step={step} total={STEPS.length} />
      </div>

      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginTop: 40, overflow: 'hidden',
      }}>
        <AnimatePresence mode="wait" custom={dir.current}>
          <motion.div
            key={step}
            custom={dir.current}
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
