'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  HandDrawnFrame,
  HandDrawnUnderline,
  InkButton,
  FloatingBackground,
  Icon,
} from '@/src/components/ui'
import InkInput from '@/src/components/ui/InkInput'
import { useAuth } from '@/src/hooks/use-auth'

type AuthMode = 'login' | 'signup'

export default function AuthCard({ initialMode = 'signup' as AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [isNarrow, setIsNarrow] = useState(false)

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden', background: 'var(--bg)', position: 'relative' }}>
      <FloatingBackground density="minimal" />

      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: isNarrow ? '32px 16px' : '40px',
        position: 'relative',
      }}>
        {/* Back to landing */}
        <Link href="/" style={{
          position: 'absolute', top: 20, left: 24,
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: 'var(--ink-muted)', fontSize: 13, textDecoration: 'none',
          fontFamily: 'var(--font-sans), DM Sans, sans-serif',
          padding: '6px 10px', borderRadius: 12,
          background: 'color-mix(in oklab, var(--bg) 70%, transparent)',
          backdropFilter: 'blur(8px)',
          zIndex: 15,
          transition: 'color 200ms ease',
        }}>
          <Icon.ChevronLeft size={14} /> back home
        </Link>

        <SlideAuthCard mode={mode} setMode={setMode} isNarrow={isNarrow} />
      </div>
    </div>
  )
}

// ── Slide variant ────────────────────────────────────────────────────────────

function SlideAuthCard({
  mode,
  setMode,
  isNarrow,
}: {
  mode: AuthMode
  setMode: (m: AuthMode) => void
  isNarrow: boolean
}) {
  const cardW = isNarrow ? '100%' : 'min(880px, calc(100vw - 80px))'
  const cardH = isNarrow ? 'auto' : 700

  // On signup: brand LEFT (translateX 0), form RIGHT (translateX 100%)
  // On login : brand RIGHT (translateX 100%), form LEFT (translateX 0)
  const brandX = mode === 'signup' ? '0%' : '100%'
  const formX  = mode === 'signup' ? '100%' : '0%'

  return (
    <div style={{
      position: 'relative',
      width: cardW, maxWidth: '100%', height: cardH,
      filter: 'drop-shadow(0 30px 40px -22px rgba(0,0,0,0.18))',
    }}>
      {/* Hand-drawn frame behind everything */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <HandDrawnFrame seed={31} jitter={1.7} fill="var(--surface)" stroke="var(--ink-soft)" radius={22} />
      </div>

      {isNarrow ? (
        /* ── Mobile: stacked, fade only ─────────────────────────── */
        <div style={{ position: 'relative', zIndex: 2, padding: 4 }}>
          <div style={{ height: 160, position: 'relative', overflow: 'hidden',
                        borderRadius: '20px 22px 4px 4px' }}>
            <BrandPanel compact mode={mode} onSwitch={setMode} />
          </div>
          <div style={{ position: 'relative', padding: '24px 22px 28px', minHeight: 420 }}>
            <FormSwap mode={mode} setMode={setMode} />
          </div>
        </div>
      ) : (
        /* ── Desktop: sliding panels ─────────────────────────────── */
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          overflow: 'hidden',
          borderRadius: 22,
        }}>
          {/* Brand panel — 50% wide, slides left ↔ right */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
            transform: `translateX(${brandX})`,
            transition: 'transform 0.5s cubic-bezier(.7,.0,.3,1)',
            zIndex: 3,
          }}>
            <BrandPanel mode={mode} onSwitch={setMode} side={mode === 'signup' ? 'left' : 'right'} />
          </div>

          {/* Form panel — 50% wide, slides opposite direction */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
            transform: `translateX(${formX})`,
            transition: 'transform 0.5s cubic-bezier(.7,.0,.3,1)',
            padding: '36px 44px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            overflow: 'hidden',
            zIndex: 2,
          }}>
            <FormSwap mode={mode} setMode={setMode} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Brand panel ──────────────────────────────────────────────────────────────

function BrandPanel({
  mode,
  onSwitch,
  side = 'left',
  compact = false,
}: {
  mode: AuthMode
  onSwitch: (m: AuthMode) => void
  side?: 'left' | 'right'
  compact?: boolean
}) {
  const other = mode === 'signup' ? 'login' : 'signup'
  const copy = mode === 'signup'
    ? {
        heading: (<>Welcome <em style={{ fontStyle: 'italic' }}>back</em>.</>),
        body: 'Already have a quiet place here? Step back inside.',
        cta: 'Sign in',
        helper: 'have an account?',
      }
    : {
        heading: (<>New <em style={{ fontStyle: 'italic' }}>here</em>?</>),
        body: 'Make a small, private notebook for the days that need one.',
        cta: 'Make an account',
        helper: 'new to Solace?',
      }

  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      background: 'color-mix(in oklab, var(--accent-wash) 70%, var(--paper))',
      padding: compact ? '20px 22px' : '44px 36px',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      borderRight: side === 'left' && !compact ? '1px dashed var(--ink-border)' : 'none',
      borderLeft:  side === 'right' && !compact ? '1px dashed var(--ink-border)' : 'none',
    }}>
      {/* Paper grain texture */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        opacity: 0.4, mixBlendMode: 'multiply',
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='12'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundSize: '200px',
      }} />

      {/* Decorative artwork */}
      {!compact && <BrandArtwork />}
      {compact && <BrandArtworkCompact />}

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 2 }}>
        <svg width={compact ? 28 : 34} height={compact ? 28 : 34} viewBox="0 0 32 32"
             style={{ color: 'var(--accent)', flexShrink: 0 }}>
          <path d="M16 5c-3 4-7 6-7 12a7 7 0 0 0 14 0c0-6-4-8-7-12Z"
                fill="var(--accent-wash)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 16c.5 1 2 2 3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <div>
          <div className="serif italic" style={{ fontSize: compact ? 22 : 26, lineHeight: 1, color: 'var(--ink)' }}>
            Solace
          </div>
          {!compact && (
            <div style={{ fontSize: 11, color: 'var(--ink-muted)', marginTop: 4, letterSpacing: '0.06em' }}>
              A QUIET COMPANION
            </div>
          )}
        </div>
      </div>

      {/* Vertically centered content block (heading + body + CTA) */}
      {!compact ? (
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          gap: 28, position: 'relative', zIndex: 2,
        }}>
          {/* Heading + body */}
          <div>
            <h2 className="serif" style={{
              fontSize: 36, fontWeight: 400, lineHeight: 1.1,
              color: 'var(--ink)', letterSpacing: '-0.01em', margin: 0,
            }}>
              {copy.heading}
            </h2>
            <div style={{ marginTop: 10 }}>
              <HandDrawnUnderline width={110} />
            </div>
            <p style={{
              marginTop: 18, fontSize: 15.5, lineHeight: 1.55,
              color: 'var(--ink-soft)', maxWidth: 320, margin: '18px 0 0',
            }}>
              {copy.body}
            </p>
          </div>
          {/* Switch CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="hand" style={{ fontSize: 18, color: 'var(--ink-muted)' }}>
              {copy.helper}
            </div>
            <SwitchButton label={copy.cta} onClick={() => onSwitch(other)} />
          </div>
        </div>
      ) : (
        /* Compact (mobile header): CTA only, centered by parent */
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
          <div className="hand" style={{ fontSize: 17, color: 'var(--ink-muted)' }}>
            {copy.helper}
          </div>
          <SwitchButton label={copy.cta} onClick={() => onSwitch(other)} />
        </div>
      )}
    </div>
  )
}

function SwitchButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        alignSelf: 'flex-start',
        position: 'relative', padding: '11px 22px',
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--ink)', font: '500 14px/1 var(--font-sans, DM Sans, sans-serif)',
        letterSpacing: '0.02em',
        display: 'inline-flex', alignItems: 'center', gap: 8,
        transform: hover ? 'rotate(-0.6deg) translateY(-2px)' : 'rotate(-0.6deg)',
        transition: 'transform 280ms cubic-bezier(.34,1.3,.64,1)',
      }}
    >
      <span aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <HandDrawnFrame seed={912} jitter={1.5} fill="transparent" stroke="var(--ink)" strokeWidth={1.5} radius={22} />
      </span>
      <span style={{ position: 'relative', zIndex: 2 }}>{label}</span>
      <span style={{ position: 'relative', zIndex: 2 }}>
        <Icon.ChevronRight size={14} />
      </span>
    </button>
  )
}

// ── Decorative artwork ───────────────────────────────────────────────────────

function BrandArtwork() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {/* Soft accent blob top-right */}
      <svg viewBox="0 0 200 200" width={220} height={220} style={{
        position: 'absolute', top: -60, right: -50, opacity: 0.35,
      }}>
        <path d="M100 20 C 150 20 180 60 180 110 C 180 160 140 180 100 180 C 60 180 20 150 20 100 C 20 50 50 20 100 20 Z"
              fill="var(--accent)" opacity="0.35" />
      </svg>

      {/* Leaf cluster bottom-right */}
      <svg viewBox="0 0 160 160" width={170} height={170} style={{
        position: 'absolute', bottom: -10, right: 30, opacity: 0.55,
        animation: 'auth-drift 26s ease-in-out infinite',
      }}>
        <g fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M30 130 C 60 70, 100 50, 140 60" />
          <path d="M55 110 C 50 100, 60 92, 72 96" fill="var(--accent-wash)" />
          <path d="M78 92  C 72 80, 86 74, 96 82"  fill="var(--accent-wash)" />
          <path d="M104 78 C 96 68,  112 60, 124 70" fill="var(--accent-wash)" />
          <path d="M126 66 C 124 56, 138 54, 142 64" fill="var(--accent-wash)" />
        </g>
      </svg>

      {/* Floating star accent */}
      <svg viewBox="0 0 24 24" width={22} height={22} style={{
        position: 'absolute', top: 90, right: 70,
        color: 'var(--accent)', opacity: 0.55,
        animation: 'auth-pulse 4s ease-in-out infinite',
      }}>
        <path d="M12 4v6M12 14v6M4 12h6M14 12h6"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </svg>

      {/* Small circle accent */}
      <svg viewBox="0 0 24 24" width={14} height={14} style={{
        position: 'absolute', top: 160, left: 40,
        color: 'var(--accent)', opacity: 0.55,
        animation: 'auth-pulse 5s ease-in-out infinite',
      }}>
        <circle cx="12" cy="12" r="6" fill="currentColor" />
      </svg>

      {/* Doodled rule line */}
      <svg viewBox="0 0 200 8" width={140} height={8} style={{
        position: 'absolute', left: 36, bottom: 110, opacity: 0.45,
      }}>
        <path d="M2 4 Q 25 1, 50 4 T 100 4 T 198 4"
              stroke="var(--accent)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function BrandArtworkCompact() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      <svg viewBox="0 0 200 200" width={160} height={160} style={{
        position: 'absolute', top: -50, right: -30, opacity: 0.3,
      }}>
        <path d="M100 20 C 150 20 180 60 180 110 C 180 160 140 180 100 180 C 60 180 20 150 20 100 C 20 50 50 20 100 20 Z"
              fill="var(--accent)" opacity="0.45" />
      </svg>
    </div>
  )
}

// ── Form swap — crossfades login/signup ──────────────────────────────────────

function FormSwap({ mode, setMode }: { mode: AuthMode; setMode: (m: AuthMode) => void }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 380 }}>
      <div style={{
        position: 'absolute', inset: 0,
        opacity: mode === 'login' ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
        transitionDelay: mode === 'login' ? '0.25s' : '0s',
        pointerEvents: mode === 'login' ? 'auto' : 'none',
      }}>
        <LoginForm setMode={setMode} />
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        opacity: mode === 'signup' ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
        transitionDelay: mode === 'signup' ? '0.25s' : '0s',
        pointerEvents: mode === 'signup' ? 'auto' : 'none',
      }}>
        <SignupForm setMode={setMode} />
      </div>
    </div>
  )
}

// ── Form shell ───────────────────────────────────────────────────────────────

function FormShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ width: '100%' }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>
      <h2 className="serif" style={{
        fontSize: 26, fontWeight: 400, lineHeight: 1.1,
        color: 'var(--ink)', letterSpacing: '-0.01em', margin: 0,
      }}>
        {title}
      </h2>
      <div style={{ marginTop: 6, marginBottom: 14 }}>
        <HandDrawnUnderline width={76} />
      </div>
      {subtitle && (
        <p style={{ fontSize: 13.5, color: 'var(--ink-muted)', marginTop: -8, marginBottom: 18 }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}

// ── Login form ───────────────────────────────────────────────────────────────

function LoginForm({ setMode }: { setMode: (m: AuthMode) => void }) {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await signIn(email, pw)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <FormShell
      eyebrow="SIGN IN"
      title={<>Pick up where you <em style={{ fontStyle: 'italic' }}>left off</em>.</>}
      subtitle="Your notebook is right where you set it down."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <AuthField
          label="EMAIL"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@somewhere.calm"
        />
        <AuthField
          label="PASSWORD"
          type="password"
          autoComplete="current-password"
          value={pw}
          onChange={setPw}
          placeholder="••••••••"
          right={
            <a href="#" style={{
              fontSize: 12, color: 'var(--accent)', textDecoration: 'none',
              borderBottom: '1px dashed var(--accent-soft)',
            }}>forgot it?</a>
          }
        />

        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          margin: '2px 0 14px', cursor: 'pointer',
          fontSize: 13.5, color: 'var(--ink-soft)',
        }}>
          <SketchyCheck on={remember} onClick={() => setRemember(r => !r)} label="Keep me signed in on this device" />
          keep me signed in on this device
        </label>

        {error && (
          <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--ink-soft)' }}>{error}</p>
        )}

        <InkButton
          type="submit"
          variant="primary"
          disabled={loading}
          iconRight={<Icon.ChevronRight size={14} />}
          style={{ width: '100%', justifyContent: 'center', padding: '13px 22px' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </InkButton>
      </form>

      <OAuthRow />
      <MobileSwitch mode="login" setMode={setMode} />
    </FormShell>
  )
}

// ── Signup form ──────────────────────────────────────────────────────────────

function SignupForm({ setMode }: { setMode: (m: AuthMode) => void }) {
  const router = useRouter()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sentEmail, setSentEmail] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (pw.length < 12) { setError('Password needs to be at least 12 characters.'); return }
    setLoading(true)
    const result = await signUp(email, pw, name)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    if (result.needsConfirmation) { setSentEmail(email); return }
    router.refresh()
    router.push('/onboarding')
  }

  if (sentEmail) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>CHECK YOUR INBOX</div>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, lineHeight: 1.1, color: 'var(--ink)', margin: 0 }}>
          One small <em style={{ fontStyle: 'italic' }}>step.</em>
        </h2>
        <div style={{ marginTop: 6, marginBottom: 18 }}>
          <HandDrawnUnderline width={76} />
        </div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 8px' }}>
          We sent a confirmation link to{' '}
          <strong style={{ color: 'var(--ink)' }}>{sentEmail}</strong>.
        </p>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
          Open it when you&apos;re ready — we&apos;ll be here.
        </p>
      </div>
    )
  }

  return (
    <FormShell
      eyebrow="NEW ACCOUNT"
      title={<>Begin something <em style={{ fontStyle: 'italic' }}>small</em>.</>}
      subtitle="A private notebook for the days that need one. Takes a minute."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <AuthField
          label="WHAT SHALL WE CALL YOU"
          autoComplete="given-name"
          value={name}
          onChange={setName}
          placeholder="Mira"
        />
        <AuthField
          label="EMAIL"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="you@somewhere.calm"
        />
        <AuthField
          label="A PASSWORD"
          type="password"
          autoComplete="new-password"
          value={pw}
          onChange={setPw}
          placeholder="something only you would remember"
          hint="we hash it. we never see it."
        />

        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          margin: '2px 0 12px', cursor: 'pointer',
          fontSize: 13.5, color: 'var(--ink-soft)',
        }}>
          <SketchyCheck on={agree} onClick={() => setAgree(a => !a)} label="I've read the quiet promise" />
          I&apos;ve read the{' '}
          <a href="#" style={{
            color: 'var(--accent)',
            borderBottom: '1px dashed var(--accent-soft)',
            textDecoration: 'none', margin: '0 2px',
          }}>quiet promise</a>
        </label>

        {error && (
          <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--ink-soft)' }}>{error}</p>
        )}

        <InkButton
          type="submit"
          variant="primary"
          disabled={loading}
          iconRight={<Icon.ChevronRight size={14} />}
          style={{ width: '100%', justifyContent: 'center', padding: '13px 22px' }}
        >
          {loading ? 'Creating account…' : 'Start my journal'}
        </InkButton>
      </form>

      <OAuthRow />
      <MobileSwitch mode="signup" setMode={setMode} />
    </FormShell>
  )
}

// ── Shared form field ────────────────────────────────────────────────────────

function AuthField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  hint,
  right,
  autoComplete,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  right?: React.ReactNode
  autoComplete?: string
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 6,
      }}>
        <span style={{
          fontSize: 12.5, fontWeight: 500, letterSpacing: '0.04em',
          color: 'var(--ink-soft)', fontFamily: 'var(--font-sans, DM Sans, sans-serif)',
        }}>{label}</span>
        {right}
      </div>
      <input
        className="ink-input"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={{ fontSize: 14.5, padding: '11px 14px', width: '100%' }}
      />
      {hint && (
        <div className="hand" style={{ fontSize: 14, color: 'var(--ink-muted)', marginTop: 4 }}>
          {hint}
        </div>
      )}
    </div>
  )
}

// ── Sketchy checkbox ─────────────────────────────────────────────────────────

function SketchyCheck({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      style={{
        width: 22, height: 22, padding: 0, flexShrink: 0,
        background: on ? 'var(--accent-wash)' : 'var(--paper)',
        border: '1.5px solid var(--ink-faint)',
        borderRadius: '6px 4px 7px 5px / 5px 6px 4px 7px',
        cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
    >
      {on && (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.6 7.4 5.6 10.2 11.6 3.6"
                stroke="var(--accent)" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  )
}

// ── OAuth row ────────────────────────────────────────────────────────────────

function OAuthRow() {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        color: 'var(--ink-muted)', fontSize: 12, margin: '0 0 10px',
      }}>
        <DashedRule />
        <span className="hand" style={{ fontSize: 15 }}>or</span>
        <DashedRule />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="oauth-row">
        <OAuthButton label="Apple"  glyph={<AppleGlyph />} />
        <OAuthButton label="Google" glyph={<GoogleGlyph />} />
      </div>
    </div>
  )
}

function DashedRule() {
  return <span style={{ flex: 1, height: 1, borderTop: '1px dashed var(--ink-border)' }} />
}

function OAuthButton({ label, glyph }: { label: string; glyph: React.ReactNode }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        padding: '10px 12px',
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        color: 'var(--ink)', font: '500 13px/1 var(--font-sans, DM Sans, sans-serif)',
        transform: hover ? 'translateY(-1px)' : 'none',
        transition: 'transform 240ms cubic-bezier(.34,1.3,.64,1)',
        width: '100%',
      }}
    >
      <span aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <HandDrawnFrame seed={label.length * 73} jitter={1.4} fill="var(--paper)" stroke="var(--ink-faint)" strokeWidth={1.2} radius={14} />
      </span>
      <span style={{ position: 'relative', zIndex: 2, display: 'inline-flex' }}>{glyph}</span>
      <span style={{ position: 'relative', zIndex: 2 }}>Continue with {label}</span>
    </button>
  )
}

function AppleGlyph() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor">
      <path d="M11.4 8.5c0-2 1.6-2.9 1.7-3-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.4 0-2.6.8-3.3 2-1.4 2.4-.4 6 1 8 .7 1 1.5 2 2.6 2 1 0 1.4-.7 2.7-.7 1.2 0 1.6.7 2.7.7 1.1 0 1.8-1 2.5-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.5-1-2.5-3.9ZM9.3 2.4C9.9 1.7 10.3.7 10.2-.2c-.8 0-1.8.5-2.4 1.2-.5.6-1 1.5-.9 2.4.9.1 1.8-.4 2.4-1Z" />
    </svg>
  )
}

function GoogleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <path fill="#4285F4" d="M13.7 7.16c0-.47-.04-.92-.12-1.36H7v2.58h3.76a3.21 3.21 0 0 1-1.4 2.1v1.74h2.26c1.32-1.22 2.08-3.02 2.08-5.06Z" />
      <path fill="#34A853" d="M7 14c1.89 0 3.48-.63 4.64-1.7l-2.26-1.74c-.63.42-1.43.67-2.38.67-1.83 0-3.38-1.24-3.93-2.9H.74v1.8A7 7 0 0 0 7 14Z" />
      <path fill="#FBBC05" d="M3.07 8.33A4.2 4.2 0 0 1 2.85 7c0-.47.08-.92.22-1.33V3.87H.74A7 7 0 0 0 0 7c0 1.13.27 2.2.74 3.13l2.33-1.8Z" />
      <path fill="#EA4335" d="M7 2.77c1.03 0 1.96.36 2.69 1.05l2-2A6.95 6.95 0 0 0 7 0 7 7 0 0 0 .74 3.87L3.07 5.67C3.62 4 5.17 2.77 7 2.77Z" />
    </svg>
  )
}

// ── Mobile inline switch ─────────────────────────────────────────────────────

function MobileSwitch({ mode, setMode }: { mode: AuthMode; setMode: (m: AuthMode) => void }) {
  const other = mode === 'login' ? 'signup' : 'login'
  const copy = mode === 'login'
    ? (<>new to Solace?{' '}
        <a href="#" onClick={e => { e.preventDefault(); setMode(other) }}
           style={{ color: 'var(--accent)', borderBottom: '1px dashed var(--accent-soft)', textDecoration: 'none' }}>
          make an account
        </a></>)
    : (<>already have one?{' '}
        <a href="#" onClick={e => { e.preventDefault(); setMode(other) }}
           style={{ color: 'var(--accent)', borderBottom: '1px dashed var(--accent-soft)', textDecoration: 'none' }}>
          sign in
        </a></>)

  return (
    <div className="hand auth-mobile-switch" style={{
      marginTop: 18, fontSize: 16, color: 'var(--ink-muted)',
    }}>
      {copy}
    </div>
  )
}
