import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'
import { predictPatterns } from '../services/ml-client/client'
import { MlUnavailable, MlTimeout, MlSchemaError } from '../services/ml-client/errors'
import { patternToCopy, bandPrediction, confidenceToWording } from '../services/ml-client/translate'
import type { CheckInPayload } from '../services/ml-client/schema'

const router = Router()

// GET /api/patterns — personal ML patterns (decoupled from /api/dashboard)
// On any ML error or timeout: returns { data: null } silently — frontend hides the card.
// On trained:false (< 14 check-ins): returns the "still learning" state so the card can show it.
router.get('/', requireAuth, async (req, res) => {
  const { userId } = req.user!

  // Fetch full check-in history — ML trains on all available data
  const rows = await prisma.checkIn.findMany({
    where:   { userId, deletedAt: null },
    orderBy: { date: 'asc' },
  })

  if (rows.length === 0) {
    res.json({ data: null })
    return
  }

  const checkins: CheckInPayload[] = rows.map(r => ({
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

  try {
    const result = await predictPatterns(checkins)

    if (!result.trained) {
      res.json({
        data: {
          trained:    false,
          confidence: 'still learning',
          n_samples:  result.n_samples,
          prediction: null,
          patterns:   [],
        },
      })
      return
    }

    const confidence = result.prediction?.confidence ?? 0
    const wording    = confidenceToWording(confidence)

    // If model confidence is below threshold, hide the card
    if (confidence < 0.3) {
      res.json({ data: null })
      return
    }

    const patterns = result.patterns
      .map(p => {
        const copy = patternToCopy(p)
        if (!copy) return null
        return { feature: p.feature, target: p.target, direction: p.direction, copy }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)

    const prediction = result.prediction
      ? {
          mood:   bandPrediction(result.prediction.mood),
          energy: bandPrediction(result.prediction.energy),
        }
      : null

    res.json({
      data: {
        trained:    true,
        confidence: wording,
        n_samples:  result.n_samples,
        prediction,
        patterns,
      },
    })
  } catch (err) {
    if (
      err instanceof MlUnavailable ||
      err instanceof MlTimeout ||
      err instanceof MlSchemaError
    ) {
      // Silent fail — ML being unavailable is never surfaced as a user error
      res.json({ data: null })
      return
    }
    throw err
  }
})

export default router
