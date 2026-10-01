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
    res.json({ data: { salt: user.journalSalt, keyKind: user.journalKeyKind } })
    return
  }

  const salt = randomBytes(16).toString('base64')
  const updated = await prisma.user.update({
    where: { id: userId },
    data:  { journalSalt: salt },
  })

  res.json({ data: { salt: updated.journalSalt, keyKind: updated.journalKeyKind } })
})

const keyKindSchema = z.object({ kind: z.enum(['PASSWORD', 'PASSPHRASE']) })

// PUT /api/journal/key-kind — record which secret the journal key comes from. Write-once:
// the first value sticks (its pages are locked with that secret), later calls just read it
// back. Not secret. Registered before PUT /:id so "key-kind" is never taken for a page id.
router.put('/key-kind', requireAuth, async (req, res) => {
  const parsed = keyKindSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: 'Something looks off — try again in a moment?' })
    return
  }

  const { userId, email } = req.user!
  await prisma.user.upsert({
    where:  { id: userId },
    update: {},
    create: { id: userId, email },
  })
  await prisma.user.updateMany({
    where: { id: userId, journalKeyKind: null },
    data:  { journalKeyKind: parsed.data.kind },
  })
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { journalKeyKind: true } })

  res.json({ data: { keyKind: user?.journalKeyKind ?? null } })
})

const sealedSchema = z.object({
  ciphertext: z.string().min(1).max(200_000),
  iv:         z.string().min(1).max(64),
})
const createSchema = sealedSchema.extend({ date: z.string().date() })

// POST /api/journal — always a new page. A journal holds as many pages a day as someone
// needs (unlike check-ins, which are one daily form). The server never sees plaintext.
router.post('/', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body)
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

  const entry = await prisma.journalEntry.create({
    data: { userId, date: new Date(date), ciphertext, iv },
  })

  res.status(201).json({ data: entry })
})

// PUT /api/journal/:id — replace one page's sealed content. Ownership-scoped; the page
// keeps its date.
router.put('/:id', requireAuth, async (req, res) => {
  const parsed = sealedSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: 'Something looks off with that entry — try saving again.' })
    return
  }

  const { userId } = req.user!
  const id = String(req.params.id)

  const { count } = await prisma.journalEntry.updateMany({
    where: { id, userId, deletedAt: null },
    data:  { ciphertext: parsed.data.ciphertext, iv: parsed.data.iv },
  })

  if (count === 0) {
    res.status(404).json({ data: null, error: 'That page could not be found.' })
    return
  }

  const entry = await prisma.journalEntry.findUnique({ where: { id } })
  res.json({ data: entry })
})

const listQuerySchema = z.object({
  limit:  z.coerce.number().int().min(1).max(100).default(30),
  cursor: z.string().min(1).max(64).optional(),
})

// GET /api/journal — paginated list, newest first. Cursor is the id of the last page
// already shown (a date cursor would skip other pages from the same day). Returns
// ciphertext+iv only; the client decrypts locally. Server never decrypts.
router.get('/', requireAuth, async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    res.status(400).json({ data: null, error: 'Invalid query parameters.' })
    return
  }

  const { userId } = req.user!
  const { limit, cursor } = parsed.data

  // A cursor must point at one of this user's own live pages, or it's ignored.
  const cursorRow = cursor
    ? await prisma.journalEntry.findFirst({ where: { id: cursor, userId, deletedAt: null }, select: { id: true } })
    : null

  const entries = await prisma.journalEntry.findMany({
    where:   { userId, deletedAt: null },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    take:    limit,
    ...(cursorRow && { cursor: { id: cursorRow.id }, skip: 1 }),
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
