'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/src/lib/supabase/client'
import { getJournalSalt } from '@/src/lib/api/journal'
import { deriveKey, cacheKey, clearCachedKey } from '@/src/lib/journal-crypto'

export interface UseAuthReturn {
  user:    User | null
  session: Session | null
  loading: boolean
  signIn:  (email: string, password: string) => Promise<{ error: string | null }>
  signUp:  (email: string, password: string, name: string) => Promise<{ error: string | null; needsConfirmation: boolean }>
  signInWithGoogle: () => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

// SSO-only accounts never type a password, so the journal can't derive its key from one —
// those users set a separate journal passphrase instead (security-rules.md). This is the switch.
export function hasPasswordIdentity(user: User): boolean {
  return user.identities?.some(i => i.provider === 'email') ?? false
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
    if (!error) {
      // Password is only ever in scope here, inside this closure — derive and cache
      // the journal key now, before it falls out of scope. Best-effort: a failure here
      // (e.g. backend unreachable) just means the journal's "unlock" prompt handles it
      // later — it must never block login.
      try {
        const { data: saltData } = await getJournalSalt()
        if (saltData) {
          const key = await deriveKey(password, saltData.salt)
          await cacheKey(key)
        }
      } catch { /* journal key derivation is best-effort — never blocks sign-in */ }
    }
    return { error: error?.message ?? null }
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await createClient().auth.signUp({
      email, password,
      options: { data: { name } },
    })
    if (!error && data.session) {
      // Only possible when email confirmation is off / already satisfied — otherwise
      // there's no session yet to call the backend with, and the key derives on the
      // eventual first real sign-in instead.
      try {
        const { data: saltData } = await getJournalSalt()
        if (saltData) {
          const key = await deriveKey(password, saltData.salt)
          await cacheKey(key)
        }
      } catch { /* journal key derivation is best-effort — never blocks sign-up */ }
    }
    return {
      error: error?.message ?? null,
      needsConfirmation: !error && !data.session,
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    // On success the browser leaves for Google, so this only ever resolves with an error.
    // No journal key here — there is no password in scope (see hasPasswordIdentity).
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options:  { redirectTo: `${window.location.origin}/auth/callback` },
    })
    return { error: error?.message ?? null }
  }, [])

  const signOut = useCallback(async () => {
    await createClient().auth.signOut()
    clearCachedKey()
  }, [])

  return { user, session, loading, signIn, signUp, signInWithGoogle, signOut }
}
