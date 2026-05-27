"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const stress_1 = require("../rules/stress");
const PROFILE = { dietaryPattern: 'OMNIVORE', activityLevel: 'MODERATELY_ACTIVE' };
function makeCheckIn(stressLevel) {
    return {
        moodScore: 4, energyScore: 4, sleepHours: 7, waterGlasses: 7,
        sunlightMinutes: 30, stressLevel, symptoms: [], foodGroups: [],
    };
}
(0, vitest_1.describe)('sustainedStressRule', () => {
    (0, vitest_1.it)('returns null when stress logged on fewer than 5 days', () => {
        const checkIns = [
            ...Array.from({ length: 4 }, () => makeCheckIn(5)),
            makeCheckIn(null),
            makeCheckIn(null),
            makeCheckIn(null),
        ];
        (0, vitest_1.expect)((0, stress_1.sustainedStressRule)(PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('returns null when high stress on fewer than 5 days', () => {
        const checkIns = [
            ...Array.from({ length: 4 }, () => makeCheckIn(4)),
            ...Array.from({ length: 3 }, () => makeCheckIn(2)),
        ];
        (0, vitest_1.expect)((0, stress_1.sustainedStressRule)(PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires when stress ≥4 on ≥5 days', () => {
        const checkIns = [
            ...Array.from({ length: 5 }, () => makeCheckIn(4)),
            ...Array.from({ length: 2 }, () => makeCheckIn(5)),
        ];
        const result = (0, stress_1.sustainedStressRule)(PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('SUSTAINED_STRESS');
        (0, vitest_1.expect)(result.evidence.length).toBeGreaterThanOrEqual(1);
    });
    (0, vitest_1.it)('stress=3 does not count as high stress', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn(3));
        (0, vitest_1.expect)((0, stress_1.sustainedStressRule)(PROFILE, checkIns)).toBeNull();
    });
});
