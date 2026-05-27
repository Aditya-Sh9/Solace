"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../services/prisma");
const insight_pipeline_1 = require("../services/insight-pipeline");
const router = (0, express_1.Router)();
// POST /api/insights/refresh — trigger insight generation
router.post('/refresh', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.user;
    const result = await (0, insight_pipeline_1.runInsightPipeline)(userId);
    if (result.status === 'insufficient_data') {
        res.status(412).json({
            data: null,
            error: "We're still getting to know you — a few more check-ins and patterns will start to surface.",
        });
        return;
    }
    if (result.status === 'cooldown') {
        const hoursLeft = Math.ceil((result.nextRefreshAt.getTime() - Date.now()) / (60 * 60 * 1000));
        res.status(429).json({
            data: null,
            error: `You're checking in too quickly — try again in about ${hoursLeft} hour${hoursLeft === 1 ? '' : 's'}.`,
        });
        return;
    }
    if (result.status === 'no_flags') {
        res.json({
            data: { insights: [], generated: 'fallback' },
        });
        return;
    }
    res.json({
        data: { insights: result.insights, generated: result.generated },
    });
});
// GET /api/insights — list user insights (paginated)
const listQuerySchema = zod_1.z.object({
    limit: zod_1.z.coerce.number().int().min(1).max(50).default(20),
    before: zod_1.z.string().datetime().optional(),
});
router.get('/', auth_1.requireAuth, async (req, res) => {
    const parsed = listQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        res.status(400).json({ data: null, error: 'Invalid query parameters.' });
        return;
    }
    const { userId } = req.user;
    const { limit, before } = parsed.data;
    const insights = await prisma_1.prisma.insight.findMany({
        where: {
            userId,
            ...(before && { createdAt: { lt: new Date(before) } }),
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
    });
    res.json({ data: insights });
});
// GET /api/insights/:id — single insight detail
router.get('/:id', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.user;
    const id = String(req.params.id);
    const insight = await prisma_1.prisma.insight.findFirst({
        where: { id, userId },
    });
    if (!insight) {
        res.status(404).json({ data: null, error: 'That insight could not be found.' });
        return;
    }
    res.json({ data: insight });
});
exports.default = router;
