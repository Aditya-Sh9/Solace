'use client'

// No design reference for these prompts — built in the journal's paper language and logged in
// MISSING_REFERENCES.md. Three cases share one card:
//   unlock   + password    → email users in a tab without the cached key
//   unlock   + passphrase  → Google-only users returning to existing pages
//   choose   (passphrase)  → Google-only users opening the journal for the first time

import { useState, type FormEvent } from 'react'
import { InkCard, InkButton, Icon } from '@/src/components/ui'

const MIN_PASSPHRASE = 12

interface JournalUnlockProps {
  mode:            'unlock' | 'choose'
  usesPassphrase:  boolean
  onSubmit:        (secret: string) => Promise<string | null>
}

export default function JournalUnlock({ mode, usesPassphrase, onSubmit }: JournalUnlockProps) {
  const [secret,  setSecret]  = useState('')
  const [confirm, setConfirm] = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const [isBusy,  setIsBusy]  = useState(false)

  const isChoosing = mode === 'choose'
  const secretName = usesPassphrase ? 'journal passphrase' : 'password'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isBusy) return
    if (isChoosing && secret.length < MIN_PASSPHRASE) {
      setError(`A little longer, please — at least ${MIN_PASSPHRASE} characters.`)
      return
    }
    if (isChoosing && secret !== confirm) {
      setError("Those two don't quite match yet.")
      return
    }
    setIsBusy(true)
    setError(null)
    const err = await onSubmit(secret)
    setIsBusy(false)
    if (err) setError(err)
  }

  return (
    <InkCard
      hand
      handIntensity={2.4}
      handSeed={5512}
      className="paper-bg"
      style={{ padding: '48px 28px', minHeight: 420, display: 'grid', placeItems: 'center' }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
        <div style={{ color: 'var(--accent)', display: 'inline-flex', marginBottom: 12 }}>
          <Icon.Lock size={28} />
        </div>
        <h3 className="serif" style={{ fontSize: 26, fontWeight: 400, fontStyle: 'italic', margin: '0 0 8px' }}>
          {isChoosing ? 'A key only you hold.' : 'Your journal is closed.'}
        </h3>
        <p style={{ color: 'var(--ink-soft)', margin: '0 0 22px', lineHeight: 1.55 }}>
          {isChoosing
            ? "Choose a passphrase to lock these pages. We never see it, so we can't reset it — if it's forgotten, the pages stay shut. Pick something you'll remember."
            : `It locks itself whenever you open a new window. Your ${secretName} opens it again — only on this device, only for you.`}
        </p>

        <label htmlFor="journal-secret" className="sr-only">{isChoosing ? 'Journal passphrase' : `Your ${secretName}`}</label>
        <input
          id="journal-secret"
          className="ink-input"
          type="password"
          autoComplete={isChoosing ? 'new-password' : usesPassphrase ? 'off' : 'current-password'}
          placeholder={isChoosing ? 'Journal passphrase' : `Your ${secretName}`}
          value={secret}
          onChange={e => setSecret(e.target.value)}
          autoFocus
          style={{ width: '100%', marginBottom: 10 }}
        />
        {isChoosing && (
          <>
            <label htmlFor="journal-secret-confirm" className="sr-only">Passphrase again</label>
            <input
              id="journal-secret-confirm"
              className="ink-input"
              type="password"
              autoComplete="new-password"
              placeholder="Once more, to be sure"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              style={{ width: '100%', marginBottom: 10 }}
            />
          </>
        )}

        {error && <p role="alert" style={{ margin: '4px 0 12px', fontSize: 13, color: 'var(--ink-soft)' }}>{error}</p>}

        <InkButton type="submit" variant="primary" disabled={isBusy || !secret} style={{ marginTop: 8 }}>
          {isBusy ? 'Opening…' : isChoosing ? 'Lock my journal' : 'Open my journal'}
        </InkButton>
      </form>
    </InkCard>
  )
}
