'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useCycleAccess } from '@/src/hooks/use-cycle-access'

// The Wellness tab is hidden for people without cycle access; this covers the direct-URL case.
export default function WellnessGate({ children }: { children: ReactNode }) {
  const access = useCycleAccess()
  const router = useRouter()

  useEffect(() => {
    if (access === false) router.replace('/dashboard')
  }, [access, router])

  if (access !== true) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '48px 24px' }}>
        <div className="ink-pulse" style={{
          width: 'min(480px, 100%)', height: 260, borderRadius: 18,
          background: 'var(--surface-2)', animation: 'ink-pulse 1.4s ease infinite',
        }} />
      </div>
    )
  }
  return <>{children}</>
}
