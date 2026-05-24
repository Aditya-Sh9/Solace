'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/src/lib/supabase/client'

export interface UseAuthReturn {
  user:    User | null
  session: Session | null
  loading: boolean
  signIn:  (email: string, password: string) => Promise<{ error: string | null }>
  signUp:  (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signOut: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user,    setUser]    = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await createClient().auth.signUp({
      email, password,
      options: { data: { name } },
    })
    return {
      error: error?.message ?? null,
      needsConfirmation: !error && !data.session,
    }
  }, [])

  const signOut = useCallback(async () => {
    await createClient().auth.signOut()
  }, [])

  return { user, session, loading, signIn, signUp, signOut }
}
