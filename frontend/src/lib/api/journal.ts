import { apiFetch } from '../api-client'
import type { JournalEntryRecord, JournalEntryCreate, JournalEntrySealed, JournalKeyKind } from '../../types/journal'

/** Salt (not secret) + which secret the key is derived from, once recorded. */
export function getJournalSalt() {
  return apiFetch<{ salt: string; keyKind: JournalKeyKind | null }>('/api/journal/salt')
}

/** Write-once on the server: returns the kind that is actually stored. */
export function setJournalKeyKind(kind: JournalKeyKind) {
  return apiFetch<{ keyKind: JournalKeyKind | null }>('/api/journal/key-kind', { method: 'PUT', body: JSON.stringify({ kind }) })
}

/** Newest first. `cursor` = id of the last page already loaded. */
export function getJournalEntries(opts?: { limit?: number; cursor?: string }) {
  const params = new URLSearchParams()
  if (opts?.limit)  params.set('limit',  String(opts.limit))
  if (opts?.cursor) params.set('cursor', opts.cursor)
  const qs = params.toString()
  return apiFetch<JournalEntryRecord[]>(`/api/journal${qs ? `?${qs}` : ''}`)
}

export function createJournalEntry(data: JournalEntryCreate) {
  return apiFetch<JournalEntryRecord>('/api/journal', { method: 'POST', body: JSON.stringify(data) })
}

export function updateJournalEntry(id: string, data: JournalEntrySealed) {
  return apiFetch<JournalEntryRecord>(`/api/journal/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteJournalEntry(id: string) {
  return apiFetch<{ id: string }>(`/api/journal/${id}`, { method: 'DELETE' })
}
