"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const deficiency_1 = require("../rules/deficiency");
const BASE_PROFILE = { dietaryPattern: 'OMNIVORE', activityLevel: 'MODERATELY_ACTIVE' };
const VEGAN_PROFILE = { dietaryPattern: 'VEGAN', activityLevel: 'MODERATELY_ACTIVE' };
function makeCheckIn(overrides = {}) {
    return {
        moodScore: 4,
        energyScore: 4,
        sleepHours: 7,
        waterGlasses: 7,
        sunlightMinutes: 30,
        stressLevel: 2,
        symptoms: [],
        foodGroups: ['meat', 'vegetables', 'fruits'],
        ...overrides,
    };
}
// ─── ironRule ───────────────────────────────────────────────────────────────
(0, vitest_1.describe)('ironRule', () => {
    (0, vitest_1.it)('returns null when no fatigue', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn());
        (0, vitest_1.expect)((0, deficiency_1.ironRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('returns null when fatigue present but iron-rich foods adequate', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ symptoms: ['fatigue'], foodGroups: ['meat'] }));
        (0, vitest_1.expect)((0, deficiency_1.ironRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires when fatigue ≥3 days + low iron foods ≥4 days + cognitive symptom', () => {
        const checkIns = [
            ...Array.from({ length: 4 }, () => makeCheckIn({ symptoms: ['fatigue', 'brain fog'], foodGroups: [] })),
            ...Array.from({ length: 3 }, () => makeCheckIn({ symptoms: ['tired'], foodGroups: [] })),
        ];
        const result = (0, deficiency_1.ironRule)(BASE_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('IRON');
        (0, vitest_1.expect)(result.evidence.length).toBeGreaterThanOrEqual(2);
    });
    (0, vitest_1.it)('requires cognitive symptom to fire', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ symptoms: ['fatigue'], foodGroups: [] }));
        (0, vitest_1.expect)((0, deficiency_1.ironRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
});
// ─── vitaminDRule ────────────────────────────────────────────────────────────
(0, vitest_1.describe)('vitaminDRule', () => {
    (0, vitest_1.it)('returns null on healthy data', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn());
        (0, vitest_1.expect)((0, deficiency_1.vitaminDRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires when low mood ≥4 days and low sunlight ≥5 days', () => {
        const checkIns = [
            ...Array.from({ length: 5 }, () => makeCheckIn({ moodScore: 2, sunlightMinutes: 5 })),
            ...Array.from({ length: 2 }, () => makeCheckIn({ moodScore: 3, sunlightMinutes: 10 })),
        ];
        const result = (0, deficiency_1.vitaminDRule)(BASE_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('VITAMIN_D');
    });
    (0, vitest_1.it)('requires low sunlight threshold (≤15 min)', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ moodScore: 2, sunlightMinutes: 20 }));
        (0, vitest_1.expect)((0, deficiency_1.vitaminDRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
});
// ─── magnesiumRule ───────────────────────────────────────────────────────────
(0, vitest_1.describe)('magnesiumRule', () => {
    (0, vitest_1.it)('returns null on healthy data', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn());
        (0, vitest_1.expect)((0, deficiency_1.magnesiumRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires when poor sleep + high stress + anxiety symptom', () => {
        const checkIns = [
            ...Array.from({ length: 4 }, () => makeCheckIn({ sleepHours: 5, stressLevel: 4, symptoms: ['anxiety'] })),
            ...Array.from({ length: 3 }, () => makeCheckIn({ sleepHours: 5.5, stressLevel: 5 })),
        ];
        const result = (0, deficiency_1.magnesiumRule)(BASE_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('MAGNESIUM');
    });
    (0, vitest_1.it)('requires anxiety symptom to fire', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ sleepHours: 5, stressLevel: 5 }));
        (0, vitest_1.expect)((0, deficiency_1.magnesiumRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
});
// ─── b12Rule ─────────────────────────────────────────────────────────────────
(0, vitest_1.describe)('b12Rule', () => {
    (0, vitest_1.it)('returns null for omnivore regardless of symptoms', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ symptoms: ['brain fog', 'fatigue'] }));
        (0, vitest_1.expect)((0, deficiency_1.b12Rule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires for vegan with brain fog ≥3 days and fatigue ≥2 days', () => {
        const checkIns = [
            ...Array.from({ length: 4 }, () => makeCheckIn({ symptoms: ['brain fog', 'fatigue'] })),
            ...Array.from({ length: 3 }, () => makeCheckIn({ symptoms: ['tired'] })),
        ];
        const result = (0, deficiency_1.b12Rule)(VEGAN_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('B12');
    });
    (0, vitest_1.it)('requires fatigue in addition to brain fog', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn({ symptoms: ['brain fog'] }));
        (0, vitest_1.expect)((0, deficiency_1.b12Rule)(VEGAN_PROFILE, checkIns)).toBeNull();
    });
});
// ─── vitaminCRule ─────────────────────────────────────────────────────────────
(0, vitest_1.describe)('vitaminCRule', () => {
    (0, vitest_1.it)('returns null on healthy data', () => {
        const checkIns = Array.from({ length: 7 }, () => makeCheckIn());
        (0, vitest_1.expect)((0, deficiency_1.vitaminCRule)(BASE_PROFILE, checkIns)).toBeNull();
    });
    (0, vitest_1.it)('fires when low energy ≥4 days and low fruit/veg ≥4 days', () => {
        const checkIns = [
            ...Array.from({ length: 5 }, () => makeCheckIn({ energyScore: 2, foodGroups: ['grains'] })),
            ...Array.from({ length: 2 }, () => makeCheckIn({ energyScore: 3, foodGroups: [] })),
        ];
        const result = (0, deficiency_1.vitaminCRule)(BASE_PROFILE, checkIns);
        (0, vitest_1.expect)(result).not.toBeNull();
        (0, vitest_1.expect)(result.id).toBe('VITAMIN_C');
    });
});
