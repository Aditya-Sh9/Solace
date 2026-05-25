import { apiFetch } from '../api-client'
import type { CheckInFormData, CheckInRecord, DashboardData } from '../../types/checkin'

export function saveCheckIn(data: CheckInFormData) {
  return apiFetch<CheckInRecord>('/api/checkin', {
    method: 'POST',
    body:   JSON.stringify(data),
  })
}

export function getTodayCheckIn() {
  return apiFetch<CheckInRecord | null>('/api/checkin/today')
}

export function getDashboard() {
  return apiFetch<DashboardData>('/api/dashboard')
}
