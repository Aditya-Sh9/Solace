'use client'

// screens-onboarding.jsx DoneStep (plant, "Hello, name.", "Your space is ready."), plus the
// first insights from POST /api/onboarding, which the mock doesn't have.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import InsightCard from '@/src/components/ui/InsightCard'
import { Icon } from '@/src/components/ui/Icons'
import { IllustrationPlant } from '@/src/components/ui/Illustrations'
import { apiFetch } from '@/src/lib/api-client'
import type { StepProps } from '../OnboardingShell'
import type { InsightCard as InsightCardData } from '@/src/types/onboarding'

interface OnboardingResponse {
  profile:  unknown
  insights: InsightCardData[]
}

type Status = 'saving' | 'error' | 'ready'

export default function StepComplete({ data }: StepProps) {
  const router   = useRouter()
  const hasFired = useRef(false)
  const [insights, setInsights] = useState<InsightCardData[]>([])
  const [status,   setStatus]   = useState<Status>('saving')

  const submit = useCallback(() => {
    setStatus('saving')
    const body = {
      name:           data.name,
      age:            data.age,
      activityLevel:  data.activityLevel,
      dietaryPattern: data.dietaryPattern,
      symptoms:       data.symptoms,
      sleepHours:     data.sleepHours,
      stressLevel:    data.stressLevel,
      wellnessGoal:   data.wellnessGoal,
      cycleTracking:  data.cycleTracking,
      gender:         data.gender,
    }
    apiFetch<OnboardingResponse>('/api/onboarding', {
      method: 'POST',
      body:   JSON.stringify(body),
    }).then(({ data: res, error }) => {
      if (error || !res) { setStatus('error'); return }
      setInsights(res.insights)
      setStatus('ready')
    })
  }, [data])

  // StrictMode mounts twice in dev; the profile should only be posted once.
  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true
    submit()
  }, [submit])

  const first = data.name?.split(' ')[0]

  return (
    <InkCard hand handIntensity={2.4} className="onb-page onb-done">
      <div style={{ textAlign: 'center' }}>
        {/* flex, not text-align: Tailwind's preflight makes svg display:block */}
        <div aria-hidden="true" style={{ display: 'flex', justifyContent: 'center' }}>
          <IllustrationPlant size={80} />
        </div>
        <h2 className="serif italic onb-title" style={{ marginTop: 14 }}>
          {first ? `Hello, ${first}.` : 'Hello, friend.'}
        </h2>
        <p className="onb-sub" style={{ margin: '0 auto 28px' }}>
          Your space is ready. Some days you&apos;ll feel like writing, some days a tap on a face is
          enough — both count.
        </p>
      </div>

      {status === 'saving' && (
        <div aria-busy="true" aria-label="Putting it together" className="onb-done-skeleton">
          <div className="ink-pulse onb-skel" style={{ height: 96 }} />
          <div className="ink-pulse onb-skel" style={{ height: 96, width: '88%' }} />
        </div>
      )}

      {status === 'error' && (
        <div role="alert" style={{ textAlign: 'center' }}>
          <p className="serif" style={{ fontSize: 18, margin: '0 0 4px' }}>Something got in the way.</p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, margin: '0 0 18px' }}>
            Not your fault — try again in a moment?
          </p>
          <div className="onb-done-actions">
            <InkButton variant="primary" onClick={submit}>Try again</InkButton>
            <InkButton variant="ghost" onClick={() => router.push('/dashboard')}>
              Go to dashboard anyway
            </InkButton>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {insights.length > 0 && (
            <div className="eyebrow">Something worth noticing</div>
          )}
          {insights.map((insight, i) => (
            <InsightCard key={insight.id} {...insight} delay={i * 0.15} />
          ))}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: insights.length * 0.15 + 0.2 }}
            style={{ textAlign: 'center', marginTop: 8 }}
          >
            <InkButton
              variant="primary"
              onClick={() => router.push('/dashboard')}
              iconRight={<Icon.ChevronRight size={14} />}
            >
              Take me in
            </InkButton>
          </motion.div>
        </div>
      )}
    </InkCard>
  )
}
