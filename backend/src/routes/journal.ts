import { randomBytes } from 'crypto'
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth'
import { prisma } from '../services/prisma'

const router = Router()

// GET /api/journal/salt — the PBKDF2 salt the client derives the encryption key with.
// Not secret; generated once per user and persisted so the same key can be re-derived
// on any device/session. Idempotent.
router.get('/salt', requireAuth, async (req, res) => {
  const { userId, email } = req.user!

  const user = await prisma.user.upsert({
    where:  { id: userId },
    update: {},
    create: { id: userId, email },
  })

  if (user.journalSalt) {
    res.json({ data: { salt: user.journalSalt } })
    return
  }

  const salt = randomBytes(16).toString('base64')
  const updated = await prisma.user.update({
    where: { id: userId },
    data:  { journalSalt: salt },
  })

  res.json({ data: { salt: updated.journalSalt } })
})

const journalSchema = z.object({
  date:       z.string().date(),
  ciphertext: z.string().min(1).max(200_000),
  iv:         z.string().min(1).max(64),
})

// POST /api/journal — create or update the entry for a given date (upsert-by-date,
// same shape as check-ins — one entry per calendar day). The server never sees plaintext.
router.post('/', requireAuth, async (req, res) => {
  const parsed = journalSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: 'Something looks off with that entry — try saving again.' })
    return
  }

  const { userId, email } = req.user!
  const { date, ciphertext, iv } = parsed.data

  await prisma.user.upsert({
    where:  { id: userId },
    update: {},
    create: { id: userId, email },
  })

  const entry = await prisma.journalEntry.upsert({
    where:  { userId_date: { userId, date: new Date(date) } },
    update: { ciphertext, iv, deletedAt: null },
    create: { userId, date: new Date(date), ciphertext, iv },
  })

  res.json({ data: entry })
})

const listQuerySchema = z.object({
  limit:  z.coerce.number().int().min(1).max(100).default(30),
  before: z.string().date().optional(),
})

// GET /api/journal — paginated list, most recent first. Returns ciphertext+iv for every
// row; the client decrypts locally to build previews. Server never decrypts.
router.get('/', requireAuth, async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: 'Invalid query parameters.' })
    return
  }

  const { userId } = req.user!
  const { limit, before } = parsed.data

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(before && { date: { lt: new Date(before) } }),
    },
    orderBy: { date: 'desc' },
    take:    limit,
  })

  res.json({ data: entries })
})

// DELETE /api/journal/:id — soft delete, ownership-scoped.
router.delete('/:id', requireAuth, async (req, res) => {
  const { userId } = req.user!
  const id = String(req.params.id)

  const entry = await prisma.journalEntry.findFirst({
    where: { id, userId, deletedAt: null },
  })

  if (!entry) {
    res.status(404).json({ data: null, error: 'That page could not be found.' })
    return
  }

  await prisma.journalEntry.update({
    where: { id },
    data:  { deletedAt: new Date() },
  })

  res.json({ data: { id } })
})

export default router
