import { apiFetch } from '../api-client'
import type { CycleOverview, CycleSettings, CyclePatterns, SymptomLog, SymptomLogEntry } from '../../types/wellness'

export function getCycle() {
  return apiFetch<CycleOverview>('/api/wellness/cycle')
}

export function saveCycleSettings(settings: CycleSettings) {
  return apiFetch<{ ok: true }>('/api/wellness/cycle', { method: 'PUT', body: JSON.stringify(settings) })
}

export function markPeriodStarted() {
  return apiFetch<{ ok: true; cycleLength: number }>('/api/wellness/cycle/started', { method: 'POST' })
}

export function stopCycleTracking() {
  return apiFetch<{ ok: true }>('/api/wellness/cycle', { method: 'DELETE' })
}

export function saveSymptomLog(log: SymptomLog) {
  return apiFetch<SymptomLog>('/api/wellness/log', { method: 'PUT', body: JSON.stringify(log) })
}

export function getSymptomHistory(days = 90) {
  return apiFetch<SymptomLogEntry[]>(`/api/wellness/log?days=${days}`)
}

export function getCyclePatterns() {
  return apiFetch<CyclePatterns>('/api/wellness/patterns')
}
