'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import { apiFetch } from '@/src/lib/api-client'
import type { StepProps } from '../OnboardingShell'
import type { InsightCard } from '@/src/types/onboarding'

interface OnboardingResponse {
  profile:  unknown
  insights: InsightCard[]
}

export default function StepComplete({ data }: StepProps) {
  const router   = useRouter()
  const hasFired = useRef(false)
  const [insights, setInsights] = useState<InsightCard[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

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
    }

    apiFetch<OnboardingResponse>('/api/onboarding', {
      method: 'POST',
      body:   JSON.stringify(body),
    }).then(({ data: res, error }) => {
      if (error || !res) {
        setError("Something got in the way — not your fault. Try again in a moment?")
      } else {
        setInsights(res.insights)
      }
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <h2 className="serif" style={{
        fontSize: 32, fontWeight: 500, letterSpacing: '-0.01em',
        lineHeight: 1.2, margin: '0 0 10px', color: 'var(--ink)',
      }}>
        We're ready.
      </h2>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15, margin: '0 0 32px', lineHeight: 1.55 }}>
        Based on what you've shared, there might be something worth noticing.
      </p>

      {loading && (
        <p style={{ color: 'var(--ink-muted)', fontSize: 15 }}>
          Putting it together…
        </p>
      )}

      {error && (
        <div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, marginBottom: 16 }}>{error}</p>
          <InkButton variant="ghost" onClick={() => router.push('/dashboard')}>
            Go to dashboard anyway
          </InkButton>
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
          {insights.map((insight, i) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.4, ease: 'easeOut' }}
            >
              <InkCard variant="note" style={{ padding: 24 }}>
                <p style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
                  textTransform: 'uppercase', color: 'var(--accent)', margin: '0 0 8px',
                }}>
                  {insight.type === 'ENCOURAGEMENT' ? 'A note' : 'Worth noticing'}
                </p>
                <h3 className="serif" style={{
                  fontSize: 19, fontWeight: 500, margin: '0 0 10px', color: 'var(--ink)',
                }}>
                  {insight.title}
                </h3>
                <p style={{ margin: 0, fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                  {insight.body}
                </p>
              </InkCard>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: insights.length * 0.15 + 0.2 }}
          >
            <InkButton
              variant="primary"
              onClick={() => router.push('/dashboard')}
              style={{ marginTop: 8, width: '100%' }}
            >
              Take me to my space
            </InkButton>
          </motion.div>
        </div>
      )}
    </div>
  )
}
