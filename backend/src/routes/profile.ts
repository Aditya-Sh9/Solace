import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'

const router = Router()

const patchSchema = z.object({
  name:           z.string().min(1).max(100).optional(),
  age:            z.number().int().min(13).max(120).optional(),
  activityLevel:  z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE']).optional(),
  dietaryPattern: z.enum(['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'PESCATARIAN', 'OTHER']).optional(),
  wellnessGoal:   z.string().max(200).optional(),
  cycleTracking:  z.boolean().optional(),
})

router.get('/', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({
    where:   { id: req.user!.userId },
    include: { profile: true },
  })
  if (!user) {
    res.status(404).json({ error: 'Profile not found' })
    return
  }
  res.json({ data: user })
})

router.patch('/', requireAuth, async (req, res) => {
  const parsed = patchSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() })
    return
  }

  const { name, ...profileFields } = parsed.data
  const userId = req.user!.userId

  const [user, profile] = await Promise.all([
    name ? prisma.user.update({ where: { id: userId }, data: { name } }) : null,
    Object.keys(profileFields).length
      ? prisma.userProfile.upsert({
          where:  { userId },
          update: profileFields,
          create: { userId, ...profileFields },
        })
      : null,
  ])

  res.json({ data: { user, profile } })
})

export default router
