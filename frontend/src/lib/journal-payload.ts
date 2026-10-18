// What actually gets encrypted for one journal page. Mood lives inside the ciphertext on
// purpose: a journal mood is as private as the words, and the server learns nothing new.
// Shape is versioned so a later format change can still read older pages.

import { generateText, type JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

export type MoodIndex = 0 | 1 | 2 | 3 | 4 | 5

// The words a page held before its latest edit. One level only — each edit replaces it.
// Encrypted with the page, so keeping it tells the server nothing new.
export interface PreviousVersion {
  doc:     JSONContent
  savedAt: string   // ISO — when that version was saved
}

export interface JournalPayload {
  mood:      MoodIndex | null   // 0–5, matches MoodFace's index; null = not picked
  doc:       JSONContent     // Tiptap document
  previous?: PreviousVersion
}

interface StoredPayloadV1 extends JournalPayload { v: 1 }

const EXTENSIONS = [StarterKit]

export const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

// The server caps ciphertext at 200k base64 chars (~150k plaintext). Past this, the previous
// version is left out rather than the save failing.
const PAYLOAD_MAX_CHARS = 140_000

export function encodePayload(payload: JournalPayload): string {
  const stored: StoredPayloadV1 = { v: 1, mood: payload.mood, doc: payload.doc }
  if (payload.previous) {
    const withPrevious = JSON.stringify({ ...stored, previous: payload.previous })
    if (withPrevious.length <= PAYLOAD_MAX_CHARS) return withPrevious
  }
  return JSON.stringify(stored)
}

function readPrevious(value: unknown): PreviousVersion | undefined {
  if (!value || typeof value !== 'object') return undefined
  const p = value as { doc?: unknown; savedAt?: unknown }
  if (!p.doc || typeof p.doc !== 'object' || typeof p.savedAt !== 'string') return undefined
  return { doc: p.doc as JSONContent, savedAt: p.savedAt }
}

function textToDoc(text: string): JSONContent {
  return {
    type: 'doc',
    content: text.split('\n').map(line =>
      line ? { type: 'paragraph', content: [{ type: 'text', text: line }] } : { type: 'paragraph' }
    ),
  }
}

// Anything that isn't a v1 payload (e.g. raw text from early 5a testing) is shown as plain
// text rather than dropped — a page someone wrote must never silently vanish.
export function decodePayload(plaintext: string): JournalPayload {
  try {
    const parsed: unknown = JSON.parse(plaintext)
    if (parsed && typeof parsed === 'object' && (parsed as { v?: unknown }).v === 1) {
      const p = parsed as StoredPayloadV1
      const mood = typeof p.mood === 'number' && Number.isInteger(p.mood) && p.mood >= 0 && p.mood <= 5
        ? (p.mood as MoodIndex)
        : null
      const previous = readPrevious(p.previous)
      return { mood, doc: p.doc ?? EMPTY_DOC, ...(previous && { previous }) }
    }
  } catch { /* not JSON — fall through to plain text */ }
  return { mood: null, doc: textToDoc(plaintext) }
}

export function docToText(doc: JSONContent): string {
  try {
    return generateText(doc, EXTENSIONS, { blockSeparator: '\n' }).trim()
  } catch {
    return ''
  }
}

export function payloadPreview(doc: JSONContent, max = 60): string {
  const firstLine = docToText(doc).split('\n').find(l => l.trim()) ?? ''
  return firstLine.length > max ? `${firstLine.slice(0, max - 1).trimEnd()}…` : firstLine
}
