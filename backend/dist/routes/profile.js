"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../middleware/auth");
const prisma_1 = require("../services/prisma");
const router = (0, express_1.Router)();
const patchSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    age: zod_1.z.number().int().min(13).max(120).optional(),
    activityLevel: zod_1.z.enum(['SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE']).optional(),
    dietaryPattern: zod_1.z.enum(['OMNIVORE', 'VEGETARIAN', 'VEGAN', 'PESCATARIAN', 'OTHER']).optional(),
    wellnessGoal: zod_1.z.string().max(200).optional(),
    cycleTracking: zod_1.z.boolean().optional(),
});
router.get('/', auth_1.requireAuth, async (req, res) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { profile: true },
    });
    if (!user) {
        res.status(404).json({ error: 'Profile not found' });
        return;
    }
    res.json({ data: user });
});
router.patch('/', auth_1.requireAuth, async (req, res) => {
    const parsed = patchSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: 'Something looks off with that update — please check your inputs.' });
        return;
    }
    const { name, ...profileFields } = parsed.data;
    const userId = req.user.userId;
    const [user, profile] = await Promise.all([
        name ? prisma_1.prisma.user.update({ where: { id: userId }, data: { name } }) : null,
        Object.keys(profileFields).length
            ? prisma_1.prisma.userProfile.upsert({
                where: { userId },
                update: profileFields,
                create: { userId, ...profileFields },
            })
            : null,
    ]);
    res.json({ data: { user, profile } });
});
exports.default = router;
