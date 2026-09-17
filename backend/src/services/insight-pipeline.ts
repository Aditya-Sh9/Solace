import { prisma } from './prisma'
import { runRuleEngine } from './rule-engine/index'
import { FALLBACK_COPY } from './rule-engine/fallback-copy'
import { synthesizeInsights } from './gemini/synthesize'
import { validateTone } from './gemini/validate'
import { GeminiUnavailable, GeminiTimeout, GeminiSchemaError } from './gemini/errors'
import { predictPatterns } from './ml-client/client'
import { patternToCopy } from './ml-client/translate'
import type { CheckInPayload } from './ml-client/schema'
import type { CheckInSnapshot, ProfileSnapshot, Flag } from './rule-engine/types'
import type { InsightType } from '@prisma/client'
import type { GeminiInsight } from './gemini/schema'

const MIN_CHECKINS = 7
const REFRESH_COOLDOWN_MS = 6 * 60 * 60 * 1000 // 6h

export type PipelineResult =
  | { status: 'insufficient_data' }
  | { status: 'cooldown';         nextRefreshAt: Date }
  | { status: 'no_flags' }
  | { status: 'ok';               insights: InsightRow[]; generated: 'gemini' | 'fallback' }

export interface InsightRow {
  id:        string
  userId:    string
  type:      InsightType
  title:     string
  body:      string
  flags:     string[]
  createdAt: Date
}

export async function runInsightPipeline(userId: string): Promise<PipelineResult> {
  // 1. Eligibility check
  const checkInCount = await prisma.checkIn.count({ where: { userId, deletedAt: null } })
  if (checkInCount < MIN_CHECKINS) return { status: 'insufficient_data' }

  // 2. Rate-limit check (check-and-set pattern per Correction F)
  const currentProfile = await prisma.userProfile.findUnique({ where: { userId } })
  const lastRefresh = currentProfile?.lastInsightRefreshAt
  if (lastRefresh) {
    const elapsed = Date.now() - lastRefresh.getTime()
    if (elapsed < REFRESH_COOLDOWN_MS) {
      return { status: 'cooldown', nextRefreshAt: new Date(lastRefresh.getTime() + REFRESH_COOLDOWN_MS) }
    }
  }

  // 3. Fetch last 7 days of check-ins + full history (for ML) + profile
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7)

  const [recentCheckIns, allCheckIns, profile] = await Promise.all([
    prisma.checkIn.findMany({
      where:   { userId, deletedAt: null, date: { gte: sevenDaysAgo } },
      orderBy: { date: 'desc' },
      take:    7,
    }),
    prisma.checkIn.findMany({
      where:   { userId, deletedAt: null },
      orderBy: { date: 'asc' },
    }),
    prisma.userProfile.findUnique({ where: { userId } }),
  ])

  const snapshots: CheckInSnapshot[] = recentCheckIns.map(c => ({
    moodScore:       c.moodScore,
    energyScore:     c.energyScore,
    sleepHours:      c.sleepHours,
    waterGlasses:    c.waterGlasses,
    sunlightMinutes: c.sunlightMinutes,
    stressLevel:     c.stressLevel,
    symptoms:        c.symptoms,
    foodGroups:      c.foodGroups,
  }))

  const profileSnap: ProfileSnapshot = {
    dietaryPattern: profile?.dietaryPattern ?? null,
    activityLevel:  profile?.activityLevel  ?? null,
  }

  // 4. Run rule engine
  const ruleResult = runRuleEngine(profileSnap, snapshots)
  if (ruleResult.flags.length === 0) return { status: 'no_flags' }

  // 4b. Try ML patterns (additive context for Gemini — never blocks if ML is down)
  let mlPatterns: string[] | undefined
  try {
    const mlPayload: CheckInPayload[] = allCheckIns.map(r => ({
      date:             r.date.toISOString().slice(0, 10),
      sleep_hours:      r.sleepHours,
      water_glasses:    r.waterGlasses,
      sunlight_minutes: r.sunlightMinutes,
      stress_level:     r.stressLevel,
      symptom_count:    r.symptoms.length,
      food_group_count:  r.foodGroups.length,
      mood_score:       r.moodScore,
      energy_level:     r.energyScore,
    }))
    const mlResult = await predictPatterns(mlPayload)
    if (mlResult.trained && mlResult.patterns.length > 0) {
      mlPatterns = mlResult.patterns
        .map(p => patternToCopy(p))
        .filter((s): s is string => s !== null)
        .slice(0, 3) // top 3 patterns only — keep prompt focused
    }
  } catch {
    // ML unavailable — proceed without pattern context
  }

  // 5. Try Gemini, fall back gracefully
  let insightDrafts: GeminiInsight[]
  let generated: 'gemini' | 'fallback' = 'fallback'

  try {
    const geminiResult = await synthesizeInsights(ruleResult, mlPatterns)
    // 6. Validate tone per insight — swap bad ones with fallback copy
    insightDrafts = geminiResult.insights.map((insight, i) => {
      const toneCheck = validateTone(insight.body)
      if (!toneCheck.ok) {
        const flag = ruleResult.flags[i]
        if (flag && FALLBACK_COPY[flag.id]) {
          return { ...FALLBACK_COPY[flag.id], flags: [flag.id] }
        }
      }
      return insight
    })
    generated = 'gemini'
  } catch (err) {
    if (
      err instanceof GeminiUnavailable ||
      err instanceof GeminiTimeout ||
      err instanceof GeminiSchemaError ||
      err instanceof Error
    ) {
      // Fall back to rule-engine copy for top N flags (max 4)
      insightDrafts = ruleResult.flags.slice(0, 4).map((flag: Flag) => ({
        ...FALLBACK_COPY[flag.id],
        flags: [flag.id],
      }))
    } else {
      throw err
    }
  }

  // 7. Persist all insights + update rate-limit timestamp in a transaction
  // Check-and-set: update only if lastInsightRefreshAt matches what we read (Correction F)
  const now = new Date()
  const updated = await prisma.userProfile.updateMany({
    where: {
      userId,
      lastInsightRefreshAt: lastRefresh ?? null,
    },
    data: { lastInsightRefreshAt: now },
  })

  // If count === 0, another concurrent request won the race
  if (updated.count === 0) {
    const freshProfile = await prisma.userProfile.findUnique({ where: { userId } })
    const nextRefreshAt = new Date((freshProfile?.lastInsightRefreshAt?.getTime() ?? Date.now()) + REFRESH_COOLDOWN_MS)
    return { status: 'cooldown', nextRefreshAt }
  }

  const created = await prisma.insight.createManyAndReturn({
    data: insightDrafts.map(d => ({
      userId,
      type:  d.type as InsightType,
      title: d.title,
      body:  d.body,
      flags: d.flags ?? [],
    })),
  })

  return { status: 'ok', insights: created, generated }
}
