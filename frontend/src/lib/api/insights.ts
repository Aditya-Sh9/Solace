import { apiFetch } from '../api-client'
import type { Insight, RefreshResponse } from '../../types/insight'

export function getInsights(opts?: { limit?: number; before?: string }) {
  const params = new URLSearchParams()
  if (opts?.limit)  params.set('limit',  String(opts.limit))
  if (opts?.before) params.set('before', opts.before)
  const qs = params.toString()
  return apiFetch<Insight[]>(`/api/insights${qs ? `?${qs}` : ''}`)
}

export function getInsight(id: string) {
  return apiFetch<Insight>(`/api/insights/${id}`)
}

export function refreshInsights() {
  return apiFetch<RefreshResponse>('/api/insights/refresh', { method: 'POST' })
}
