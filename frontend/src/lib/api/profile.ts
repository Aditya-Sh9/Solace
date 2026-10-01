import { apiFetch } from '../api-client'
import type { OnboardingStatus } from '@/src/types/onboarding'

export function getOnboardingStatus() {
  return apiFetch<OnboardingStatus>('/api/profile/status')
}
