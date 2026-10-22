// Who may see the "was this written by Gemini?" line under the insight refresh button. Only the
// demo account (the owner's own test login): regular people shouldn't see how the sausage is made,
// and the fallback copy is designed to read like Gemini's. This gates *display only* — the flag is
// not sensitive and the API returns it to everyone. Override per environment if the demo email
// ever changes: NEXT_PUBLIC_AI_STATUS_EMAIL.
export const AI_STATUS_EMAIL = (process.env.NEXT_PUBLIC_AI_STATUS_EMAIL ?? 'demo@solace.dev').toLowerCase()

export function canSeeAiStatus(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase() === AI_STATUS_EMAIL
}

export type AiSource = 'gemini' | 'fallback'

export interface AiStatus {
  source: AiSource
  at:     number   // ms since epoch
}

const STORAGE_KEY = 'solace-ai-status'

// Kept per tab so the line survives moving between Today and Insights, but never lives past it.
export function readAiStatus(): AiStatus | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    const p = parsed as Partial<AiStatus>
    if ((p.source === 'gemini' || p.source === 'fallback') && typeof p.at === 'number') return { source: p.source, at: p.at }
    return null
  } catch {
    return null
  }
}

export function writeAiStatus(status: AiStatus): void {
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(status)) } catch { /* private mode: the line just won't persist */ }
}
