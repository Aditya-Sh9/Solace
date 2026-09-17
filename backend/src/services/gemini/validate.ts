// Banned phrases — case-insensitive. Any hit rejects that insight body.
// Covers: prescriptive language, clinical register, soft-clinical phrasing, causation language (Phase 4).
const BANNED_PHRASES = [
  'optimize',
  'you should',
  'you must',
  'you need to',
  'you are deficient',
  'diagnose',
  'treatment',
  'cure',
  'condition',
  'disorder',
  'prescribe',
  'medication',
  'unfortunately',
  'research suggests',
  'studies show',
  'evidence indicates',
  'clinical',
  'supplement',
  'deficiency',
  // causation language — patterns suggest correlation, never causation
  'improves',
  'causes',
  'leads to',
  'because of',
]

export interface ToneResult {
  ok:   boolean
  hits: string[]
}

export function validateTone(text: string): ToneResult {
  const lower = text.toLowerCase()
  const hits = BANNED_PHRASES.filter(phrase => lower.includes(phrase))
  return { ok: hits.length === 0, hits }
}
