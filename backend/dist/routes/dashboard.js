"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../services/prisma");
const checkin_service_1 = require("../services/checkin-service");
const router = (0, express_1.Router)();
// GET /api/dashboard — composite payload for the dashboard page
router.get('/', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.user;
    const today = (0, checkin_service_1.getTodayUTC)();
    const [todayEntry, history, allDates, recentInsights] = await Promise.all([
        prisma_1.prisma.checkIn.findFirst({
            where: { userId, date: today, deletedAt: null },
        }),
        prisma_1.prisma.checkIn.findMany({
            where: { userId, deletedAt: null },
            orderBy: { date: 'desc' },
            take: 30,
        }),
        prisma_1.prisma.checkIn.findMany({
            where: { userId, deletedAt: null },
            select: { date: true },
            orderBy: { date: 'desc' },
            take: 400,
        }),
        prisma_1.prisma.insight.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 3,
        }),
    ]);
    const streak = (0, checkin_service_1.calculateStreak)(allDates.map(r => r.date));
    const stats = (0, checkin_service_1.computeWeeklyStats)(history);
    res.json({ data: { today: todayEntry, history, streak, stats, insights: recentInsights } });
});
exports.default = router;
