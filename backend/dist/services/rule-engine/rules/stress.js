"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sustainedStressRule = sustainedStressRule;
function sustainedStressRule(_profile, checkIns) {
    const stressValues = checkIns
        .map(c => c.stressLevel)
        .filter((s) => s !== null);
    if (stressValues.length < 5)
        return null;
    const highStressDays = stressValues.filter(s => s >= 4).length;
    if (highStressDays < 5)
        return null;
    return {
        id: 'SUSTAINED_STRESS',
        evidence: [
            `High stress (level ≥4) on ${highStressDays} of ${stressValues.length} logged days`,
        ],
        confidence: Math.min(0.9, 0.5 + highStressDays * 0.08),
    };
}
