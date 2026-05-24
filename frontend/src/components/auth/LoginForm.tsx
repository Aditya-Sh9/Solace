'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import InkCard from '@/src/components/ui/InkCard'
import InkButton from '@/src/components/ui/InkButton'
import InkInput from '@/src/components/ui/InkInput'
import { useAuth } from '@/src/hooks/use-auth'

export default function LoginForm() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
      return
    }
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <InkCard style={{ padding: 32 }}>
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <h1 className="serif" style={{ fontSize: 28, fontWeight: 500, margin: '0 0 8px' }}>
          Welcome back.
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15, margin: 0 }}>
          Your patterns are still here.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InkInput id="email" label="Email" type="email" value={email}
          onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
          required autoComplete="email" />
        <InkInput id="password" label="Password" type="password" value={password}
          onChange={e => setPassword(e.target.value)} placeholder="••••••••••••"
          required autoComplete="current-password" />

        {error && <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)' }}>{error}</p>}

        <InkButton type="submit" variant="primary" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? 'Signing in…' : 'Sign in'}
        </InkButton>
      </form>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-soft)' }}>
        New here?{' '}
        <Link href="/signup" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          Create an account
        </Link>
      </p>
    </InkCard>
  )
}
