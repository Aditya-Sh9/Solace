'use client'

// On-device dictation for the journal. Audio and words must never leave the device
// (security-rules.md), so this only ever runs a recognizer with processLocally = true.
// A browser that can't promise that is "unsupported" — there is no cloud fallback.

import { useCallback, useEffect, useRef, useState } from 'react'
import type { SpeechRecognizer, SpeechRecognizerConstructor, SpeechLocalOptions } from '@/src/types/speech'

export type DictationState = 'checking' | 'unsupported' | 'needs-install' | 'installing' | 'ready' | 'listening'

const INSTALL_TIMEOUT_MS = 30_000

const NOTE_UNSUPPORTED = "Speaking works when this browser can listen on your device — so your words never leave it. This one can't yet."
const NOTE_BLOCKED     = "The microphone seems to be off for this site. It can be turned on in your browser's settings."
const NOTE_INSTALL     = "That didn't quite download — not your fault. Try again in a moment?"
const NOTE_SOFT        = 'Something got in the way of listening — not your fault. Try again?'

function getRecognizerClass(): SpeechRecognizerConstructor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: SpeechRecognizerConstructor; webkitSpeechRecognition?: SpeechRecognizerConstructor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

const localOptions = (lang: string): SpeechLocalOptions => ({ langs: [lang], processLocally: true })

interface UseSpeechDictationOptions {
  onTranscript: (text: string) => void
}

export function useSpeechDictation({ onTranscript }: UseSpeechDictationOptions) {
  const [state,   setState]   = useState<DictationState>('checking')
  const [interim, setInterim] = useState('')
  const [note,    setNote]    = useState<string | null>(null)

  const langRef         = useRef('en-US')
  const recognizerRef   = useRef<SpeechRecognizer | null>(null)
  const onTranscriptRef = useRef(onTranscript)
  useEffect(() => { onTranscriptRef.current = onTranscript }, [onTranscript])

  useEffect(() => {
    let isLive = true
    const Recognizer = getRecognizerClass()

    const check = async () => {
      if (!Recognizer?.available || !Recognizer.install || !('processLocally' in Recognizer.prototype)) {
        setState('unsupported')
        return
      }
      const candidates = Array.from(new Set([navigator.language, 'en-US'].filter(Boolean)))
      for (const lang of candidates) {
        try {
          const availability = await Recognizer.available(localOptions(lang))
          if (!isLive) return
          if (availability === 'unavailable') continue
          langRef.current = lang
          setState(availability === 'available' ? 'ready' : 'needs-install')
          return
        } catch {
          // An unknown language tag can throw — try the next one.
        }
      }
      if (isLive) setState('unsupported')
    }

    check()
    return () => {
      isLive = false
      recognizerRef.current?.abort()
      recognizerRef.current = null
    }
  }, [])

  const stop = useCallback(() => {
    recognizerRef.current?.stop()
  }, [])

  const start = useCallback(() => {
    const Recognizer = getRecognizerClass()
    if (!Recognizer) { setState('unsupported'); return }

    const recognizer = new Recognizer()
    recognizer.processLocally = true
    // Belt and braces: if the flag didn't take, this recognizer could go to the cloud.
    if (recognizer.processLocally !== true) { setState('unsupported'); setNote(NOTE_UNSUPPORTED); return }
    recognizer.lang           = langRef.current
    recognizer.continuous     = true
    recognizer.interimResults = true

    recognizer.onresult = event => {
      let finalText   = ''
      let interimText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) finalText += result[0].transcript
        else interimText += result[0].transcript
      }
      setInterim(interimText)
      if (finalText.trim()) onTranscriptRef.current(finalText.trim())
    }
    recognizer.onerror = event => {
      if (event.error === 'language-not-supported') { setState('unsupported'); setNote(NOTE_UNSUPPORTED) }
      else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') setNote(NOTE_BLOCKED)
      else if (event.error !== 'no-speech' && event.error !== 'aborted') setNote(NOTE_SOFT)
    }
    recognizer.onend = () => {
      recognizerRef.current = null
      setInterim('')
      setState(prev => (prev === 'listening' ? 'ready' : prev))
    }

    try {
      recognizer.start()
      recognizerRef.current = recognizer
      setNote(null)
      setState('listening')
    } catch {
      setNote(NOTE_SOFT)
    }
  }, [])

  const install = useCallback(async () => {
    const Recognizer = getRecognizerClass()
    if (!Recognizer?.install) { setState('unsupported'); return }
    setState('installing')
    setNote(null)
    // install() has been seen to never settle in some browsers — don't wait forever.
    const timeout = new Promise<boolean>(resolve => window.setTimeout(() => resolve(false), INSTALL_TIMEOUT_MS))
    const isInstalled = await Promise.race([Recognizer.install(localOptions(langRef.current)).catch(() => false), timeout])
    if (isInstalled) setState('ready')
    else { setState('needs-install'); setNote(NOTE_INSTALL) }
  }, [])

  /** The mic button: explain, install, start or stop depending on where we are. */
  const toggle = useCallback(() => {
    if (state === 'listening')     { stop(); return }
    if (state === 'ready')         { start(); return }
    if (state === 'unsupported')   { setNote(NOTE_UNSUPPORTED); return }
  }, [state, start, stop])

  return { state, interim, note, toggle, start, stop, install, dismissNote: () => setNote(null) }
}
