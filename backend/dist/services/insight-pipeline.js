"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInsightPipeline = runInsightPipeline;
const prisma_1 = require("./prisma");
const index_1 = require("./rule-engine/index");
const fallback_copy_1 = require("./rule-engine/fallback-copy");
const synthesize_1 = require("./gemini/synthesize");
const validate_1 = require("./gemini/validate");
const errors_1 = require("./gemini/errors");
const MIN_CHECKINS = 7;
const REFRESH_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6h
async function runInsightPipeline(userId) {
    // 1. Eligibility check
    const checkInCount = await prisma_1.prisma.checkIn.count({ where: { userId, deletedAt: null } });
    if (checkInCount < MIN_CHECKINS)
        return { status: 'insufficient_data' };
    // 2. Rate-limit check (check-and-set pattern per Correction F)
    const currentProfile = await prisma_1.prisma.userProfile.findUnique({ where: { userId } });
    const lastRefresh = currentProfile?.lastInsightRefreshAt;
    if (lastRefresh) {
        const elapsed = Date.now() - lastRefresh.getTime();
        if (elapsed < REFRESH_COOLDOWN_MS) {
            return { status: 'cooldown', nextRefreshAt: new Date(lastRefresh.getTime() + REFRESH_COOLDOWN_MS) };
        }
    }
    // 3. Fetch last 7 days of check-ins + profile
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);
    const [recentCheckIns, profile] = await Promise.all([
        prisma_1.prisma.checkIn.findMany({
            where: { userId, deletedAt: null, date: { gte: sevenDaysAgo } },
            orderBy: { date: 'desc' },
            take: 7,
        }),
        prisma_1.prisma.userProfile.findUnique({ where: { userId } }),
    ]);
    const snapshots = recentCheckIns.map(c => ({
        moodScore: c.moodScore,
        energyScore: c.energyScore,
        sleepHours: c.sleepHours,
        waterGlasses: c.waterGlasses,
        sunlightMinutes: c.sunlightMinutes,
        stressLevel: c.stressLevel,
        symptoms: c.symptoms,
        foodGroups: c.foodGroups,
    }));
    const profileSnap = {
        dietaryPattern: profile?.dietaryPattern ?? null,
        activityLevel: profile?.activityLevel ?? null,
    };
    // 4. Run rule engine
    const ruleResult = (0, index_1.runRuleEngine)(profileSnap, snapshots);
    if (ruleResult.flags.length === 0)
        return { status: 'no_flags' };
    // 5. Try Gemini, fall back gracefully
    let insightDrafts;
    let generated = 'fallback';
    try {
        const geminiResult = await (0, synthesize_1.synthesizeInsights)(ruleResult);
        // 6. Validate tone per insight — swap bad ones with fallback copy
        insightDrafts = geminiResult.insights.map((insight, i) => {
            const toneCheck = (0, validate_1.validateTone)(insight.body);
            if (!toneCheck.ok) {
                const flag = ruleResult.flags[i];
                if (flag && fallback_copy_1.FALLBACK_COPY[flag.id]) {
                    return { ...fallback_copy_1.FALLBACK_COPY[flag.id], flags: [flag.id] };
                }
            }
            return insight;
        });
        generated = 'gemini';
    }
    catch (err) {
        if (err instanceof errors_1.GeminiUnavailable ||
            err instanceof errors_1.GeminiTimeout ||
            err instanceof errors_1.GeminiSchemaError ||
            err instanceof Error) {
            // Fall back to rule-engine copy for top N flags (max 4)
            insightDrafts = ruleResult.flags.slice(0, 4).map((flag) => ({
                ...fallback_copy_1.FALLBACK_COPY[flag.id],
                flags: [flag.id],
            }));
        }
        else {
            throw err;
        }
    }
    // 7. Persist all insights + update rate-limit timestamp in a transaction
    // Check-and-set: update only if lastInsightRefreshAt matches what we read (Correction F)
    const now = new Date();
    const updated = await prisma_1.prisma.userProfile.updateMany({
        where: {
            userId,
            lastInsightRefreshAt: lastRefresh ?? null,
        },
        data: { lastInsightRefreshAt: now },
    });
    // If count === 0, another concurrent request won the race
    if (updated.count === 0) {
        const freshProfile = await prisma_1.prisma.userProfile.findUnique({ where: { userId } });
        const nextRefreshAt = new Date((freshProfile?.lastInsightRefreshAt?.getTime() ?? Date.now()) + REFRESH_COOLDOWN_MS);
        return { status: 'cooldown', nextRefreshAt };
    }
    const created = await prisma_1.prisma.insight.createManyAndReturn({
        data: insightDrafts.map(d => ({
            userId,
            type: d.type,
            title: d.title,
            body: d.body,
            flags: d.flags ?? [],
        })),
    });
    return { status: 'ok', insights: created, generated };
}
