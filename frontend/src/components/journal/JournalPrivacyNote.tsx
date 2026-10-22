'use client'

// The spine's privacy note (screens-journal.jsx) plus roadmap 5.34: a plain-language "how?"
// explainer of the encryption. Built as a toggletip — a button that opens the note inline —
// rather than a hover tooltip, so it works by touch and keyboard. No mock for the explainer
// (MISSING_REFERENCES.md).

import { useId, useState } from 'react'
import { Icon } from '@/src/components/ui'

interface JournalPrivacyNoteProps {
  usesPassphrase: boolean
}

export default function JournalPrivacyNote({ usesPassphrase }: JournalPrivacyNoteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const explainerId = useId()
  const secret = usesPassphrase ? 'your journal passphrase' : 'your password'

  return (
    <div className="journal-privacy-note">
      <Icon.Lock size={14} />
      <div>
        <span>This journal is yours alone. We can&apos;t read it, and we don&apos;t want to.</span>{' '}
        <button
          type="button"
          className="journal-privacy-how"
          aria-expanded={isOpen}
          aria-controls={explainerId}
          onClick={() => setIsOpen(o => !o)}
          onKeyDown={e => { if (e.key === 'Escape') setIsOpen(false) }}
        >
          {isOpen ? 'close' : 'how?'}
        </button>
        <div id={explainerId} hidden={!isOpen} className="journal-privacy-explainer">
          <p>
            Before a page leaves this device, it&apos;s locked with a key made from {secret}.
            The key stays here with you — it&apos;s never sent to us.
          </p>
          <p>
            We only ever keep the locked version. Without your key it&apos;s just noise, even to us,
            and nothing we run — insights, patterns, anything — ever reads it.
          </p>
          <p>
            The honest catch: if {secret} is forgotten, we can&apos;t open these pages for you either.
          </p>
        </div>
      </div>
    </div>
  )
}
