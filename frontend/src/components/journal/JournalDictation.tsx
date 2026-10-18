'use client'

// The reference's "speak instead" button, made real. On-device only (use-speech-dictation):
// in a browser that can't listen locally the button stays, but a tap explains why it can't
// — never a silent dead button. Listening indicator, install prompt and notes have no mock
// (logged in MISSING_REFERENCES.md).

import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/src/components/ui'
import { useSpeechDictation } from '@/src/hooks/use-speech-dictation'

interface JournalDictationProps {
  isEditing:     boolean
  canListen:     boolean            // the editor is mounted and can take words
  autoStart:     boolean            // opened from view mode by tapping the mic
  disabled:      boolean
  onTranscript:  (text: string) => void
  onRequestEdit: () => void         // view mode → open the editor, then listen
}

function InkWave() {
  return (
    <svg aria-hidden width="18" height="16" viewBox="0 0 18 16" className="journal-ink-wave">
      {[2, 6, 10, 14].map((x, i) => (
        <line key={x} x1={x} x2={x} y1="4" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
          style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </svg>
  )
}

export default function JournalDictation({ isEditing, canListen, autoStart, disabled, onTranscript, onRequestEdit }: JournalDictationProps) {
  const dictation = useSpeechDictation({ onTranscript })
  const { state, start, stop } = dictation
  const [isAsking, setIsAsking] = useState(false)
  const hasAutoStarted = useRef(false)

  useEffect(() => {
    if (!autoStart || hasAutoStarted.current || !canListen || state !== 'ready') return
    hasAutoStarted.current = true
    start()
  }, [autoStart, canListen, state, start])

  // Leaving the editor (save, cancel) ends listening.
  useEffect(() => {
    if (!isEditing && state === 'listening') stop()
  }, [isEditing, state, stop])

  const isListening   = state === 'listening'
  const isUnavailable = state === 'unsupported'
  const isWaiting     = state === 'checking' || state === 'installing'

  const handleClick = () => {
    if (state === 'needs-install') { dictation.dismissNote(); setIsAsking(true); return }
    if (state === 'ready' && !isEditing) { onRequestEdit(); return }
    if (state === 'ready' && !canListen) return
    dictation.toggle()
  }

  const label = isListening ? 'stop' : state === 'installing' ? 'getting ready…' : 'speak instead'

  return (
    <div className="journal-dictation">
      <button
        type="button"
        className="ink-btn ink-btn--ghost ink-btn--sm"
        style={{ padding: '8px 14px' }}
        onClick={handleClick}
        disabled={disabled || isWaiting}
        aria-disabled={isUnavailable || undefined}
        aria-pressed={isListening}
        aria-label={isListening ? 'Stop listening' : 'Speak instead of typing'}
      >
        {isListening ? <InkWave /> : <Icon.Mic size={16} />}
        <span className="hand" style={{ fontSize: 17, marginLeft: 2 }}>{label}</span>
      </button>

      {isListening && (
        <span className="hand journal-dictation-interim" aria-live="polite">
          {dictation.interim || 'listening…'}
        </span>
      )}

      {isAsking && state === 'needs-install' && (
        <div className="journal-dictation-note" role="group" aria-label="Set up on-device listening">
          <span>Let this browser listen on your device? It sets up once, and your words never leave here.</span>
          <span className="journal-dictation-actions">
            <button type="button" className="ink-btn ink-btn--primary ink-btn--sm"
              onClick={() => { setIsAsking(false); dictation.install() }}>Set it up</button>
            <button type="button" className="ink-btn ink-btn--ghost ink-btn--sm" onClick={() => setIsAsking(false)}>Not now</button>
          </span>
        </div>
      )}

      {dictation.note && <p className="journal-dictation-note" role="status">{dictation.note}</p>}
    </div>
  )
}
