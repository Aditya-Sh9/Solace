import type { Gender } from '@prisma/client'

// The one place that decides who sees the cycle-aware Wellness section. Only people who told
// us they're male are left out — "rather not say" and anyone who onboarded before we asked
// (null) keep it, because declining to answer shouldn't cost someone a feature.
export function hasCycleAccess(gender: Gender | null | undefined): boolean {
  return gender !== 'MALE'
}
