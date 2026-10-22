import { Router, type Request, type Response, type NextFunction } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'
import { hasCycleAccess } from '../services/cycle-access'
import { getTodayUTC } from '../services/checkin-service'
import { getCycleSettings, toISODate } from '../services/cycle-service'
import {
  cycleToday, phaseOn, phaseRanges, learnCycleLength, toDayNumber,
  CYCLE_LENGTH_MIN, CYCLE_LENGTH_MAX, PERIOD_LENGTH_MIN, PERIOD_LENGTH_MAX,
} from '../services/cycle-phase'
import { summarisePhases } from '../services/cycle-patterns'

// Cycle-aware Wellness (Phase 6). Every route needs cycle access (services/cycle-access.ts);
// the frontend hides the section too, but the rule is enforced here as well.

const router = Router()

const NO_ACCESS = "This part of Solace isn't switched on for your account."
const OFF = 'Something looks off — try again in a moment?'

async function requireCycleAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  const profile = await prisma.userProfile.findUnique({ where: { userId: req.user!.userId }, select: { gender: true } })
  if (!hasCycleAccess(profile?.gender)) {
    res.status(403).json({ data: null, error: NO_ACCESS })
    return
  }
  next()
}

router.use(requireAuth, requireCycleAccess)

// The gentle-log chips. Stored as these exact strings, so copy changes go in the frontend label map.
export const LOG_SYMPTOMS = [
  'heavy cramping', 'mood feels heavy', 'low energy today', 'tender chest',
  'bloated', 'good sleep', 'craving sweet', 'craving salty', 'sharp focus',
  'short fuse', 'foggy head', 'warm and grounded',
] as const

// GET /api/wellness/cycle — settings, where today sits, the phase map, and today's log.
router.get('/cycle', async (req, res) => {
  const { userId } = req.user!
  const today = getTodayUTC()
  const [settings, log] = await Promise.all([
    getCycleSettings(userId),
    prisma.cycleEntry.findUnique({ where: { userId_date: { userId, date: today } }, select: { symptoms: true, intensity: true } }),
  ])

  res.json({
    data: {
      settings,
      today:  settings ? cycleToday(settings, today) : null,
      ranges: settings ? phaseRanges(settings.cycleLength, settings.periodLength) : phaseRanges(28, 5),
      log:    log ?? { symptoms: [], intensity: null },
      date:   toISODate(today),
    },
  })
})

const settingsSchema = z.object({
  lastPeriodStart: z.string().date(),
  cycleLength:     z.number().int().min(CYCLE_LENGTH_MIN).max(CYCLE_LENGTH_MAX),
  periodLength:    z.number().int().min(PERIOD_LENGTH_MIN).max(PERIOD_LENGTH_MAX),
})

// Upper bound on how far back a start date can be: older than ~3 cycles says little about now.
const MAX_START_AGE_DAYS = 120

// PUT /api/wellness/cycle — set or edit the anchor date and averages. Turns tracking on.
router.put('/cycle', async (req, res) => {
  const parsed = settingsSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: OFF })
    return
  }
  const age = toDayNumber(getTodayUTC()) - toDayNumber(parsed.data.lastPeriodStart)
  if (age < 0) {
    res.status(400).json({ data: null, error: "That date hasn't happened yet — pick the day it last started?" })
    return
  }
  if (age > MAX_START_AGE_DAYS) {
    res.status(400).json({ data: null, error: 'That was a while ago. A rough guess at the most recent start works better.' })
    return
  }
  if (parsed.data.periodLength >= parsed.data.cycleLength - 3) {
    res.status(400).json({ data: null, error: 'The period length looks longer than the cycle allows — mind checking both?' })
    return
  }

  const { userId } = req.user!
  const { lastPeriodStart, cycleLength, periodLength } = parsed.data
  await prisma.userProfile.upsert({
    where:  { userId },
    update: { cycleTracking: true, lastPeriodStart: new Date(lastPeriodStart), cycleLength, periodLength },
    create: { userId, cycleTracking: true, lastPeriodStart: new Date(lastPeriodStart), cycleLength, periodLength },
  })
  await restampRecentPhases(userId)
  res.json({ data: { ok: true } })
})

// POST /api/wellness/cycle/started — "My period started today": re-anchor and let the average learn a little.
router.post('/cycle/started', async (req, res) => {
  const { userId } = req.user!
  const profile = await prisma.userProfile.findUnique({ where: { userId }, select: { lastPeriodStart: true, cycleLength: true, cycleTracking: true } })
  if (!profile?.cycleTracking || !profile.lastPeriodStart) {
    res.status(400).json({ data: null, error: 'Set up your cycle first, then this will keep it in step.' })
    return
  }
  const today = getTodayUTC()
  if (toDayNumber(today) === toDayNumber(profile.lastPeriodStart)) {
    res.json({ data: { ok: true, cycleLength: profile.cycleLength } })
    return
  }
  const cycleLength = learnCycleLength(profile.lastPeriodStart, today, profile.cycleLength)
  await prisma.userProfile.update({ where: { userId }, data: { lastPeriodStart: today, cycleLength } })
  await restampRecentPhases(userId)
  res.json({ data: { ok: true, cycleLength } })
})

// DELETE /api/wellness/cycle — stop tracking. Phases already stamped on past days stay: they're
// the person's own history and still read true for those days.
router.delete('/cycle', async (req, res) => {
  const { userId } = req.user!
  await prisma.userProfile.updateMany({ where: { userId }, data: { cycleTracking: false, lastPeriodStart: null } })
  res.json({ data: { ok: true } })
})

const logSchema = z.object({
  symptoms:  z.array(z.enum(LOG_SYMPTOMS)).max(LOG_SYMPTOMS.length),
  intensity: z.number().int().min(1).max(3).nullable(),
})

// PUT /api/wellness/log — today's gentle log. One daily form like the check-in: the page always
// loads today's log first, so this edits what the person is looking at.
router.put('/log', async (req, res) => {
  const parsed = logSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: OFF })
    return
  }
  const { userId, email } = req.user!
  const today = getTodayUTC()
  const settings = await getCycleSettings(userId)
  const phase = settings ? phaseOn(settings, today) : null
  const symptoms = [...new Set(parsed.data.symptoms)]
  const intensity = symptoms.length ? parsed.data.intensity : null

  await prisma.user.upsert({ where: { id: userId }, update: {}, create: { id: userId, email } })
  const entry = await prisma.cycleEntry.upsert({
    where:  { userId_date: { userId, date: today } },
    update: { symptoms, intensity, phase },
    create: { userId, date: today, symptoms, intensity, phase },
    select: { symptoms: true, intensity: true },
  })
  res.json({ data: entry })
})

const historyQuery = z.object({ days: z.coerce.number().int().min(7).max(365).default(90) })

// GET /api/wellness/log?days=90 — the gentle log over time, for the symptom pattern chart.
router.get('/log', async (req, res) => {
  const parsed = historyQuery.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: OFF })
    return
  }
  const since = new Date(getTodayUTC().getTime() - parsed.data.days * 86_400_000)
  const entries = await prisma.cycleEntry.findMany({
    where:   { userId: req.user!.userId, date: { gte: since } },
    orderBy: { date: 'asc' },
    select:  { date: true, phase: true, symptoms: true, intensity: true },
  })
  res.json({ data: entries.map(e => ({ ...e, date: toISODate(e.date) })) })
})

// GET /api/wellness/patterns — mood and energy across phases, banded, with one hedged line.
router.get('/patterns', async (req, res) => {
  const checkIns = await prisma.checkIn.findMany({
    where:   { userId: req.user!.userId, deletedAt: null, cyclePhase: { not: null } },
    orderBy: { date: 'desc' },
    take:    365,
    select:  { cyclePhase: true, moodScore: true, energyScore: true },
  })
  res.json({ data: summarisePhases(checkIns) })
})

// After the anchor changes, re-stamp the days the new anchor can speak for (on or after it).
// Older days keep the phase they were given at the time.
async function restampRecentPhases(userId: string): Promise<void> {
  const settings = await getCycleSettings(userId)
  if (!settings) return
  const from = new Date(`${settings.lastPeriodStart}T00:00:00Z`)
  const [checkIns, logs] = await Promise.all([
    prisma.checkIn.findMany({ where: { userId, date: { gte: from } }, select: { id: true, date: true } }),
    prisma.cycleEntry.findMany({ where: { userId, date: { gte: from } }, select: { id: true, date: true } }),
  ])
  await prisma.$transaction([
    ...checkIns.map(c => prisma.checkIn.update({ where: { id: c.id }, data: { cyclePhase: phaseOn(settings, c.date) } })),
    ...logs.map(l => prisma.cycleEntry.update({ where: { id: l.id }, data: { phase: phaseOn(settings, l.date) } })),
  ])
}

export default router
