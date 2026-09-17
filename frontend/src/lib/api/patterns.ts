import { apiFetch } from '../api-client'
import type { PatternsData } from '../../types/pattern'

export function getPatterns() {
  return apiFetch<PatternsData | null>('/api/patterns')
}
