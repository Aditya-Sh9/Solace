import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'
import { generateFirstInsight } from '../services/insight-service'

const router = Router()

const onboardingSchema = z.object({
  name:           z.string().min(1).max(100).optional(),
  age:            z.number().int().min(13).max(120).optional(),
  activityLevel:  z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE']).optional(),
  dietaryPattern: z.enum(['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'PESCATARIAN', 'OTHER']).optional(),
  symptoms:       z.array(z.string()).optional(),
  sleepHours:     z.number().min(0).max(24).optional(),
  stressLevel:    z.number().int().min(1).max(5).optional(),
  wellnessGoal:   z.string().max(200).optional(),
  cycleTracking:  z.boolean().optional(),
})

router.post('/', requireAuth, async (req, res) => {
  const parsed = onboardingSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const { name, age, activityLevel, dietaryPattern, symptoms,
          sleepHours, stressLevel, wellnessGoal, cycleTracking } = parsed.data
  const { userId, email } = req.user!

  await prisma.user.upsert({
    where:  { id: userId },
    update: { ...(name && { name }) },
    create: { id: userId, email, name },
  })

  const profile = await prisma.userProfile.upsert({
    where:  { userId },
    update: { age, activityLevel, dietaryPattern, wellnessGoal, cycleTracking },
    create: { userId, age, activityLevel, dietaryPattern, wellnessGoal, cycleTracking: cycleTracking ?? false },
  })

  const drafts   = generateFirstInsight({ symptoms, dietaryPattern, stressLevel, sleepHours, activityLevel })
  const insights = await prisma.insight.createManyAndReturn({
    data: drafts.map(d => ({ ...d, userId })),
  })

  res.json({ data: { profile, insights } })
})

export default router
