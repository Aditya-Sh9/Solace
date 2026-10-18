// Minimal Web Speech API types — TypeScript's lib.dom doesn't ship them. Only what
// use-speech-dictation needs. `available`/`install`/`processLocally` are the on-device
// additions (Chrome 139+); browsers without them are treated as unable to dictate.

export type SpeechAvailability = 'unavailable' | 'downloadable' | 'downloading' | 'available'

export interface SpeechLocalOptions {
  langs:          string[]
  processLocally: boolean
}

export interface SpeechAlternative {
  readonly transcript: string
}

export interface SpeechResult {
  readonly isFinal: boolean
  readonly length:  number
  readonly [index: number]: SpeechAlternative
}

export interface SpeechResultList {
  readonly length: number
  readonly [index: number]: SpeechResult
}

export interface SpeechResultEvent extends Event {
  readonly resultIndex: number
  readonly results:     SpeechResultList
}

export interface SpeechErrorEvent extends Event {
  readonly error: string
}

export interface SpeechRecognizer extends EventTarget {
  lang:            string
  continuous:      boolean
  interimResults:  boolean
  processLocally?: boolean
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror:  ((event: SpeechErrorEvent) => void) | null
  onend:    (() => void) | null
  start(): void
  stop():  void
  abort(): void
}

export interface SpeechRecognizerConstructor {
  new (): SpeechRecognizer
  readonly prototype: SpeechRecognizer
  available?: (options: SpeechLocalOptions) => Promise<SpeechAvailability>
  install?:   (options: SpeechLocalOptions) => Promise<boolean>
}
