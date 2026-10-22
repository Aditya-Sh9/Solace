'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getOnboardingStatus } from '@/src/lib/api/profile'

export type CycleAccess = 'loading' | boolean

// Whether this person sees the cycle-aware Wellness section. The rule itself lives in the
// backend (services/cycle-access.ts); this just carries the answer through the app shell.
export const CycleAccessContext = createContext<CycleAccess>('loading')

// The name typed in onboarding (null until known, or if they never gave one).
export const ProfileNameContext = createContext<string | null>(null)

export function useCycleAccess(): CycleAccess {
  return useContext(CycleAccessContext)
}

// Onboarding name first, then the provider's name, then the email prefix.
export function getDisplayName(user: User | null, onboardingName: string | null): string {
  const metaName = user?.user_metadata?.full_name ?? user?.user_metadata?.name
  const name = onboardingName || metaName || user?.email?.split('@')[0] || ''
  return typeof name === 'string' ? name : ''
}

// For components inside AppShell's provider (AppShell itself calls getDisplayName).
export function useDisplayName(user: User | null): string {
  return getDisplayName(user, useContext(ProfileNameContext))
}

interface ShellStatus {
  cycleAccess: CycleAccess
  name:        string | null
}

// Fetched once by AppShell, which provides both values to the tree and passes them to the navs.
export function useShellStatusFetch(): ShellStatus {
  const hasFetched = useRef(false)
  const [status, setStatus] = useState<ShellStatus>({ cycleAccess: 'loading', name: null })

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    getOnboardingStatus().then(({ data, error }) => {
      // Fail open: hiding a tab over a network blip is worse than showing a placeholder page.
      if (error || !data) console.error('[cycle-access] status check failed:', error)
      setStatus({ cycleAccess: data ? data.cycleAccess : true, name: data?.name?.trim() || null })
    })
  }, [])

  return status
}
