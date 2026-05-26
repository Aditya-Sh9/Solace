"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../services/prisma");
const checkin_service_1 = require("../services/checkin-service");
const router = (0, express_1.Router)();
const checkInSchema = zod_1.z.object({
    moodScore: zod_1.z.number().int().min(1).max(6),
    energyScore: zod_1.z.number().int().min(1).max(6),
    sleepHours: zod_1.z.number().min(0).max(24).nullable().optional(),
    waterGlasses: zod_1.z.number().int().min(0).max(30).nullable().optional(),
    sunlightMinutes: zod_1.z.number().int().min(0).max(720).nullable().optional(),
    stressLevel: zod_1.z.number().int().min(1).max(5).nullable().optional(),
    symptoms: zod_1.z.array(zod_1.z.string()).max(30).optional().default([]),
    foodGroups: zod_1.z.array(zod_1.z.string()).max(15).optional().default([]),
    notes: zod_1.z.string().max(2000).nullable().optional(),
});
// POST /api/checkin — create or update today's entry
router.post('/', auth_1.requireAuth, async (req, res) => {
    const parsed = checkInSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Something looks off with that entry — check your inputs and try again.' });
        return;
    }
    const { userId, email } = req.user;
    const today = (0, checkin_service_1.getTodayUTC)();
    const data = parsed.data;
    // Ensure the public.users row exists — Supabase auth.users ≠ public.users.
    // This is a no-op when onboarding has run; it's a safety net when it hasn't.
    await prisma_1.prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId, email },
    });
    const checkIn = await prisma_1.prisma.checkIn.upsert({
        where: { userId_date: { userId, date: today } },
        update: {
            moodScore: data.moodScore,
            energyScore: data.energyScore,
            sleepHours: data.sleepHours ?? null,
            waterGlasses: data.waterGlasses ?? null,
            sunlightMinutes: data.sunlightMinutes ?? null,
            stressLevel: data.stressLevel ?? null,
            symptoms: data.symptoms,
            foodGroups: data.foodGroups,
            notes: data.notes ?? null,
        },
        create: {
            userId,
            date: today,
            moodScore: data.moodScore,
            energyScore: data.energyScore,
            sleepHours: data.sleepHours ?? null,
            waterGlasses: data.waterGlasses ?? null,
            sunlightMinutes: data.sunlightMinutes ?? null,
            stressLevel: data.stressLevel ?? null,
            symptoms: data.symptoms,
            foodGroups: data.foodGroups,
            notes: data.notes ?? null,
        },
    });
    res.json({ data: checkIn });
});
// GET /api/checkin/today — today's row or null (used to detect edit mode)
router.get('/today', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.user;
    const today = (0, checkin_service_1.getTodayUTC)();
    const checkIn = await prisma_1.prisma.checkIn.findFirst({
        where: { userId, date: today, deletedAt: null },
    });
    res.json({ data: checkIn });
});
// GET /api/checkin/history?days=30 — recent check-ins for graphing
router.get('/history', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.user;
    const days = Math.min(Number(req.query.days) || 30, 365);
    const checkIns = await prisma_1.prisma.checkIn.findMany({
        where: { userId, deletedAt: null },
        orderBy: { date: 'desc' },
        take: days,
    });
    res.json({ data: checkIns });
});
// GET /api/checkin/streak
router.get('/streak', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.user;
    const rows = await prisma_1.prisma.checkIn.findMany({
        where: { userId, deletedAt: null },
        select: { date: true },
        orderBy: { date: 'desc' },
        take: 400, // more than a year — practical ceiling
    });
    const streak = (0, checkin_service_1.calculateStreak)(rows.map(r => r.date));
    res.json({ data: { streak } });
});
exports.default = router;
