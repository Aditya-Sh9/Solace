'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'

export default function SaveSuccess() {
  const router      = useRouter()
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const timer = setTimeout(() => router.push('/dashboard'), 1400)
    return () => clearTimeout(timer)
  }, [router])

  const dur = shouldReduce ? 0.01 : 0.55

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 24px', gap: 16,
    }}>
      {/* Ink stamp checkmark */}
      <svg width={72} height={72} viewBox="0 0 72 72" fill="none">
        <motion.circle
          cx={36} cy={36} r={28}
          stroke="var(--accent)" strokeWidth={2.2} strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: dur, ease: 'easeOut' }}
        />
        <motion.path
          d="M24 36.4 32.4 44.8 49 27.6"
          stroke="var(--accent)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: dur * 0.7, delay: dur * 0.7, ease: 'easeOut' }}
        />
      </svg>

      {/* "Noted." */}
      <motion.p
        className="serif"
        style={{ fontSize: 28, fontWeight: 500, color: 'var(--ink)', margin: 0 }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduce ? 0 : 0.55, duration: 0.35, ease: 'easeOut' }}
      >
        Noted.
      </motion.p>

      {/* Sub-line — 200ms after "Noted." */}
      <motion.p
        style={{ fontSize: 15, color: 'var(--ink-soft)', margin: 0, fontFamily: 'var(--font-sans)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: shouldReduce ? 0 : 0.75, duration: 0.35, ease: 'easeOut' }}
      >
        We&apos;ll keep an eye on it with you.
      </motion.p>
    </div>
  )
}
