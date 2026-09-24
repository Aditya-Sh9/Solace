import { apiFetch } from '../api-client'
import type { JournalEntryRecord, JournalEntryFormData } from '../../types/journal'

export function getJournalSalt() {
  return apiFetch<{ salt: string }>('/api/journal/salt')
}

export function getJournalEntries(opts?: { limit?: number; before?: string }) {
  const params = new URLSearchParams()
  if (opts?.limit)  params.set('limit',  String(opts.limit))
  if (opts?.before) params.set('before', opts.before)
  const qs = params.toString()
  return apiFetch<JournalEntryRecord[]>(`/api/journal${qs ? `?${qs}` : ''}`)
}

export function saveJournalEntry(data: JournalEntryFormData) {
  return apiFetch<JournalEntryRecord>('/api/journal', { method: 'POST', body: JSON.stringify(data) })
}

export function deleteJournalEntry(id: string) {
  return apiFetch<{ id: string }>(`/api/journal/${id}`, { method: 'DELETE' })
}
