import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'
import { getTodayUTC, calculateStreak, computeWeeklyStats } from '../services/checkin-service'

const router = Router()

// GET /api/dashboard — composite payload for the dashboard page
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req.user!
  const today      = getTodayUTC()

  const [todayEntry, history, allDates] = await Promise.all([
    prisma.checkIn.findFirst({
      where: { userId, date: today, deletedAt: null },
    }),
    prisma.checkIn.findMany({
      where:   { userId, deletedAt: null },
      orderBy: { date: 'desc' },
      take:    30,
    }),
    prisma.checkIn.findMany({
      where:   { userId, deletedAt: null },
      select:  { date: true },
      orderBy: { date: 'desc' },
      take:    400,
    }),
  ])

  const streak = calculateStreak(allDates.map(r => r.date))
  const stats  = computeWeeklyStats(history)

  res.json({ data: { today: todayEntry, history, streak, stats } })
})

export default router
