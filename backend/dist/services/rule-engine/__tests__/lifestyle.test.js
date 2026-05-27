"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const lifestyle_1 = require("../rules/lifestyle");
const BASE_PROFILE = { dietaryPattern: 'OMNIVORE', activityLevel: 'MODERATELY_ACTIVE' };
const SEDENTARY_PROFILE = { dietaryPattern: 'OMNIVORE', activityLevel: 'SEDENTARY' };
function makeCheckIn(overrides = {}) {
    return {
        moodScore: 4, energyScore: 4, sleepHours: 7.5, waterGlasses: 8,
        sunlightMinutes: 30, stressLevel: 2, symptoms: [], foodGroups: ['vegetables', 'fruits'],
        ...overrides,
    };
}
// ─── sleepDebtRule ────────────────────────────────────────────────────────────
(0, vitest_1.describe)('sleepDebtRule', () => {
    (0, vitest_1.it)('returns null on adequate sleep', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ sleepHours: 7.5 }));
        (0, vitest_1.expect)((0, lifestyle_1.sleepDebtRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires when avg < 6.5h and ≥3 nights < 6h', () => {
        const checkIns = [
            ...Array.from({ length: 4 }, () => makeCheckIn({ sleepHours: 5 })),
            ...Array.from({ length: 3 }, () => makeCheckIn({ sleepHours: 5.5 })),
        ];
        const result = (0, lifestyle_1.sleepDebtRule)(BASE_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('SLEEP_DEBT');
    });
    (0, vitest_1.it)('requires at least 3 nights below 6h', () => {
        const checkIns = [
            ...Array.from({ length: 2 }, () => makeCheckIn({ sleepHours: 5 })),
            ...Array.from({ length: 5 }, () => makeCheckIn({ sleepHours: 6 })),
        ];
        // avg = (10 + 30) / 7 = 5.71 but shortNights = 2
        (0, vitest_1.expect)((0, lifestyle_1.sleepDebtRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
});
// ─── dehydrationRule ──────────────────────────────────────────────────────────
(0, vitest_1.describe)('dehydrationRule', () => {
    (0, vitest_1.it)('returns null on adequate hydration', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ waterGlasses: 8 }));
        (0, vitest_1.expect)((0, lifestyle_1.dehydrationRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires when avg < 5 glasses and ≥4 days with ≤4 glasses', () => {
        const checkIns = [
            ...Array.from({ length: 5 }, () => makeCheckIn({ waterGlasses: 3 })),
            ...Array.from({ length: 2 }, () => makeCheckIn({ waterGlasses: 4 })),
        ];
        const result = (0, lifestyle_1.dehydrationRule)(BASE_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('DEHYDRATION');
    });
});
// ─── sedentaryRule ────────────────────────────────────────────────────────────
(0, vitest_1.describe)('sedentaryRule', () => {
    (0, vitest_1.it)('returns null for moderately active users', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ sunlightMinutes: 5 }));
        (0, vitest_1.expect)((0, lifestyle_1.sedentaryRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires for sedentary profile with low sunlight ≥5 days', () => {
        const checkIns = [
            ...Array.from({ length: 5 }, () => makeCheckIn({ sunlightMinutes: 5 })),
            ...Array.from({ length: 2 }, () => makeCheckIn({ sunlightMinutes: 10 })),
        ];
        const result = (0, lifestyle_1.sedentaryRule)(SEDENTARY_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('SEDENTARY');
    });
    (0, vitest_1.it)('requires ≥5 days with ≤10 min sunlight', () => {
        const checkIns = [
            ...Array.from({ length: 3 }, () => makeCheckIn({ sunlightMinutes: 5 })),
            ...Array.from({ length: 4 }, () => makeCheckIn({ sunlightMinutes: 60 })),
        ];
        (0, vitest_1.expect)((0, lifestyle_1.sedentaryRule)(SEDENTARY_PROFILE, checkIns)).toBeNull();
    });
});
