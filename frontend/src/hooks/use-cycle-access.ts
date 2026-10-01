'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { getOnboardingStatus } from '@/src/lib/api/profile'

export type CycleAccess = 'loading' | boolean

// Whether this person sees the cycle-aware Wellness section. The rule itself lives in the
// backend (services/cycle-access.ts); this just carries the answer through the app shell.
export const CycleAccessContext = createContext<CycleAccess>('loading')

export function useCycleAccess(): CycleAccess {
  return useContext(CycleAccessContext)
}

// Fetched once by AppShell, which provides it to the tree and passes it to the navs.
export function useCycleAccessFetch(): CycleAccess {
  const hasFetched = useRef(false)
  const [access, setAccess] = useState<CycleAccess>('loading')

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    getOnboardingStatus().then(({ data, error }) => {
      // Fail open: hiding a tab over a network blip is worse than showing a placeholder page.
      if (error || !data) console.error('[cycle-access] status check failed:', error)
      setAccess(data ? data.cycleAccess : true)
    })
  }, [])

  return access
}
