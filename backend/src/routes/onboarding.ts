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
    res.status(400).json({ error: 'Something looks off with that submission — please check your inputs.' })
    return
  }

  const { name, age, activityLevel, dietaryPattern, symptoms,
          sleepHours, stressLevel, wellnessGoal, cycleTracking } = parsed.data
  const { userId, email } = req.user!

  const { profile, insights } = await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where:  { id: userId },
      update: { ...(name && { name }) },
      create: { id: userId, email, name },
    })

    const savedProfile = await tx.userProfile.upsert({
      where:  { userId },
      update: { age, activityLevel, dietaryPattern, wellnessGoal, cycleTracking },
      create: { userId, age, activityLevel, dietaryPattern, wellnessGoal, cycleTracking: cycleTracking ?? false },
    })

    // Skip insight generation if insights already exist for this user (idempotency)
    const existingCount = await tx.insight.count({ where: { userId } })
    if (existingCount > 0) {
      const existingInsights = await tx.insight.findMany({ where: { userId } })
      return { profile: savedProfile, insights: existingInsights }
    }

    const drafts          = generateFirstInsight({ symptoms, dietaryPattern, stressLevel, sleepHours, activityLevel })
    const createdInsights = await tx.insight.createManyAndReturn({
      data: drafts.map(d => ({ ...d, userId })),
    })

    return { profile: savedProfile, insights: createdInsights }
  })

  res.json({ data: { profile, insights } })
})

export default router
