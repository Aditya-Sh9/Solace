'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import InkInput from '@/src/components/ui/InkInput'
import { useAuth } from '@/src/hooks/use-auth'

export default function SignupForm() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [sentEmail, setSentEmail] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 12) {
      setError("Password needs to be at least 12 characters.")
      return
    }
    setLoading(true)
    const { error, needsConfirmation } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    if (needsConfirmation) {
      setSentEmail(email)
      return
    }
    router.refresh()
    router.push('/onboarding')
  }

  if (sentEmail) {
    return (
      <InkCard style={{ padding: 32 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="serif" style={{ fontSize: 26, fontWeight: 500, margin: '0 0 12px' }}>
            One small step.
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, margin: '0 0 8px' }}>
            We sent a confirmation link to <strong style={{ color: 'var(--ink)' }}>{sentEmail}</strong>.
          </p>
          <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.55, margin: 0 }}>
            Open it when you're ready — we'll be here.
          </p>
        </div>
      </InkCard>
    )
  }

  return (
    <InkCard style={{ padding: 32 }}>
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h1 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 8px' }}>
          Let's begin.
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, margin: 0 }}>
          Just a few things to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InkInput id="name" label="Your first name" type="text" value={name}
          onChange={e => setName(e.target.value)} placeholder="What should we call you?"
          required autoComplete="given-name" />
        <InkInput id="email" label="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
          required autoComplete="email" />
        <InkInput id="password" label="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)} placeholder="12+ characters"
          required autoComplete="new-password" />

        {error && <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>{error}</p>}

        <InkButton type="submit" variant="primary" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Creating account…' : 'Create account'}
        </InkButton>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
        Already here?{' '}
        <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </InkCard>
  )
}
