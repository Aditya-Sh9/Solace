// DB-facing glue around the pure cycle-phase rules: loads someone's settings and decides
// whether they track at all. Everything that stamps a phase (check-ins, symptom logs) goes
// through here, so "tracking" means one thing everywhere.

import { prisma } from './prisma'
import { hasCycleAccess } from './cycle-access'
import { phaseOn, type CycleSettings, type CyclePhaseId } from './cycle-phase'

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

// Null unless the person has access, has tracking on, and has told us when their last period began.
export async function getCycleSettings(userId: string): Promise<CycleSettings | null> {
  const profile = await prisma.userProfile.findUnique({
    where:  { userId },
    select: { gender: true, cycleTracking: true, lastPeriodStart: true, cycleLength: true, periodLength: true },
  })
  if (!profile || !hasCycleAccess(profile.gender) || !profile.cycleTracking || !profile.lastPeriodStart) return null
  return {
    lastPeriodStart: toISODate(profile.lastPeriodStart),
    cycleLength:     profile.cycleLength,
    periodLength:    profile.periodLength,
  }
}

export async function phaseForUserOn(userId: string, date: Date): Promise<CyclePhaseId | null> {
  const settings = await getCycleSettings(userId)
  return settings ? phaseOn(settings, date) : null
}
