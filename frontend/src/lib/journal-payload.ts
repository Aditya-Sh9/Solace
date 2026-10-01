// What actually gets encrypted for one journal page. Mood lives inside the ciphertext on
// purpose: a journal mood is as private as the words, and the server learns nothing new.
// Shape is versioned so a later format change can still read older pages.

import { generateText, type JSONContent } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

export type MoodIndex = 0 | 1 | 2 | 3 | 4 | 5

export interface JournalPayload {
  mood: MoodIndex | null   // 0–5, matches MoodFace's index; null = not picked
  doc:  JSONContent     // Tiptap document
}

interface StoredPayloadV1 extends JournalPayload { v: 1 }

const EXTENSIONS = [StarterKit]

export const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

export function encodePayload(payload: JournalPayload): string {
  const stored: StoredPayloadV1 = { v: 1, mood: payload.mood, doc: payload.doc }
  return JSON.stringify(stored)
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
      return { mood, doc: p.doc ?? EMPTY_DOC }
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
