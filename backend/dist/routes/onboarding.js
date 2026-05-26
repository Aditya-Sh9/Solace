"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../services/prisma");
const insight_service_1 = require("../services/insight-service");
const router = (0, express_1.Router)();
const onboardingSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    age: zod_1.z.number().int().min(13).max(120).optional(),
    activityLevel: zod_1.z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE']).optional(),
    dietaryPattern: zod_1.z.enum(['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'PESCATARIAN', 'OTHER']).optional(),
    symptoms: zod_1.z.array(zod_1.z.string()).optional(),
    sleepHours: zod_1.z.number().min(0).max(24).optional(),
    stressLevel: zod_1.z.number().int().min(1).max(5).optional(),
    wellnessGoal: zod_1.z.string().max(200).optional(),
    cycleTracking: zod_1.z.boolean().optional(),
});
router.post('/', auth_1.requireAuth, async (req, res) => {
    const parsed = onboardingSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Something looks off with that submission — please check your inputs.' });
        return;
    }
    const { name, age, activityLevel, dietaryPattern, symptoms, sleepHours, stressLevel, wellnessGoal, cycleTracking } = parsed.data;
    const { userId, email } = req.user;
    const { profile, insights } = await prisma_1.prisma.$transaction(async (tx) => {
        await tx.user.upsert({
            where: { id: userId },
            update: { ...(name && { name }) },
            create: { id: userId, email, name },
        });
        const savedProfile = await tx.userProfile.upsert({
            where: { userId },
            update: { age, activityLevel, dietaryPattern, wellnessGoal, cycleTracking },
            create: { userId, age, activityLevel, dietaryPattern, wellnessGoal, cycleTracking: cycleTracking ?? false },
        });
        // Skip insight generation if insights already exist for this user (idempotency)
        const existingCount = await tx.insight.count({ where: { userId } });
        if (existingCount > 0) {
            const existingInsights = await tx.insight.findMany({ where: { userId } });
            return { profile: savedProfile, insights: existingInsights };
        }
        const drafts = (0, insight_service_1.generateFirstInsight)({ symptoms, dietaryPattern, stressLevel, sleepHours, activityLevel });
        const createdInsights = await tx.insight.createManyAndReturn({
            data: drafts.map(d => ({ ...d, userId })),
        });
        return { profile: savedProfile, insights: createdInsights };
    });
    res.json({ data: { profile, insights } });
});
exports.default = router;
