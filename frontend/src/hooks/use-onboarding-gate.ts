'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/src/lib/supabase/client'
import { getOnboardingStatus } from '@/src/lib/api/profile'

export type OnboardingGateState =
  | { status: 'checking' }
  | { status: 'error' }
  | { status: 'ready'; prefillName: string | undefined }

// Every Google sign-in lands on /onboarding (see app/auth/callback/route.ts). People who've
// already onboarded are sent straight on to the dashboard; everyone else starts at step 1,
// with their first name pre-filled from whatever the auth provider gave us.
export function useOnboardingGate(): { gate: OnboardingGateState; retry: () => void } {
  const router = useRouter()
  const hasFetched = useRef(false)
  const [gate, setGate] = useState<OnboardingGateState>({ status: 'checking' })

  const check = useCallback(async () => {
    setGate({ status: 'checking' })
    const [{ data, error }, { data: { user } }] = await Promise.all([
      getOnboardingStatus(),
      createClient().auth.getUser(),
    ])
    if (error || !data) { setGate({ status: 'error' }); return }
    if (data.onboarded) { router.replace('/dashboard'); return }

    // Google sets full_name (and name) to the whole name; email signup sets name to what
    // the person typed. The step asks for a first name, so keep only the first word.
    const meta = user?.user_metadata ?? {}
    const raw: unknown = meta.full_name ?? meta.name
    const prefillName = typeof raw === 'string' ? raw.trim().split(/\s+/)[0] || undefined : undefined
    setGate({ status: 'ready', prefillName })
  }, [router])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    check()
  }, [check])

  return { gate, retry: check }
}
