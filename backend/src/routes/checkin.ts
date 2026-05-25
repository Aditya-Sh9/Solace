import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'
import { getTodayUTC, calculateStreak } from '../services/checkin-service'

const router = Router()

const checkInSchema = z.object({
  moodScore:       z.number().int().min(1).max(6),
  energyScore:     z.number().int().min(1).max(6),
  sleepHours:      z.number().min(0).max(24).nullable().optional(),
  waterGlasses:    z.number().int().min(0).max(30).nullable().optional(),
  sunlightMinutes: z.number().int().min(0).max(720).nullable().optional(),
  stressLevel:     z.number().int().min(1).max(5).nullable().optional(),
  symptoms:        z.array(z.string()).max(30).optional().default([]),
  foodGroups:      z.array(z.string()).max(15).optional().default([]),
  notes:           z.string().max(2000).nullable().optional(),
})

// POST /api/checkin — create or update today's entry
router.post('/', requireAuth, async (req, res) => {
  const parsed = checkInSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const { userId } = req.user!
  const today      = getTodayUTC()
  const data       = parsed.data

  const checkIn = await prisma.checkIn.upsert({
    where:  { userId_date: { userId, date: today } },
    update: {
      moodScore:       data.moodScore,
      energyScore:     data.energyScore,
      sleepHours:      data.sleepHours ?? null,
      waterGlasses:    data.waterGlasses ?? null,
      sunlightMinutes: data.sunlightMinutes ?? null,
      stressLevel:     data.stressLevel ?? null,
      symptoms:        data.symptoms,
      foodGroups:      data.foodGroups,
      notes:           data.notes ?? null,
    },
    create: {
      userId,
      date:            today,
      moodScore:       data.moodScore,
      energyScore:     data.energyScore,
      sleepHours:      data.sleepHours ?? null,
      waterGlasses:    data.waterGlasses ?? null,
      sunlightMinutes: data.sunlightMinutes ?? null,
      stressLevel:     data.stressLevel ?? null,
      symptoms:        data.symptoms,
      foodGroups:      data.foodGroups,
      notes:           data.notes ?? null,
    },
  })

  res.json({ data: checkIn })
})

// GET /api/checkin/today — today's row or null (used to detect edit mode)
router.get('/today', requireAuth, async (req, res) => {
  const { userId } = req.user!
  const today      = getTodayUTC()

  const checkIn = await prisma.checkIn.findFirst({
    where: { userId, date: today, deletedAt: null },
  })

  res.json({ data: checkIn })
})

// GET /api/checkin/history?days=30 — recent check-ins for graphing
router.get('/history', requireAuth, async (req, res) => {
  const { userId } = req.user!
  const days = Math.min(Number(req.query.days) || 30, 365)

  const checkIns = await prisma.checkIn.findMany({
    where:   { userId, deletedAt: null },
    orderBy: { date: 'desc' },
    take:    days,
  })

  res.json({ data: checkIns })
})

// GET /api/checkin/streak
router.get('/streak', requireAuth, async (req, res) => {
  const { userId } = req.user!

  const rows = await prisma.checkIn.findMany({
    where:   { userId, deletedAt: null },
    select:  { date: true },
    orderBy: { date: 'desc' },
    take:    400, // more than a year — practical ceiling
  })

  const streak = calculateStreak(rows.map(r => r.date))
  res.json({ data: { streak } })
})

export default router
