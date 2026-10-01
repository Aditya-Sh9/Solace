import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'
import { hasCycleAccess } from '../services/cycle-access'

const router = Router()

const patchSchema = z.object({
  name:           z.string().min(1).max(100).optional(),
  age:            z.number().int().min(13).max(120).optional(),
  activityLevel:  z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE']).optional(),
  dietaryPattern: z.enum(['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'PESCATARIAN', 'OTHER']).optional(),
  wellnessGoal:   z.string().max(200).optional(),
  cycleTracking:  z.boolean().optional(),
  gender:         z.enum(['FEMALE', 'MALE', 'UNDISCLOSED']).optional(),
})

// Always 200 so the client can tell "hasn't onboarded yet" apart from a failed request —
// GET / returns 404 when the public.users row is missing, which looks like an error to apiFetch.
router.get('/status', requireAuth, async (req, res) => {
  const profile = await prisma.userProfile.findUnique({
    where:  { userId: req.user!.userId },
    select: { gender: true },
  })
  res.json({ data: { onboarded: profile !== null, cycleAccess: hasCycleAccess(profile?.gender) } })
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
    res.status(400).json({ error: 'Something looks off with that update — please check your inputs.' })
    return
  }

  const { name, ...profileFields } = parsed.data
  if (profileFields.gender && !hasCycleAccess(profileFields.gender)) profileFields.cycleTracking = false
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
