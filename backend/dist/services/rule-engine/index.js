"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runRuleEngine = runRuleEngine;
const deficiency_1 = require("./rules/deficiency");
const lifestyle_1 = require("./rules/lifestyle");
const stress_1 = require("./rules/stress");
function runRuleEngine(profile, checkIns) {
    if (checkIns.length === 0) {
        return { flags: [], profile, summary: 'No check-in data available.' };
    }
    const rules = [
        deficiency_1.ironRule,
        deficiency_1.vitaminDRule,
        deficiency_1.magnesiumRule,
        deficiency_1.b12Rule,
        deficiency_1.vitaminCRule,
        lifestyle_1.sleepDebtRule,
        lifestyle_1.dehydrationRule,
        lifestyle_1.sedentaryRule,
        stress_1.sustainedStressRule,
    ];
    const flags = rules
        .map(rule => rule(profile, checkIns))
        .filter((f) => f !== null)
        // Confidence gate: require at least 2 pieces of evidence
        .filter(f => f.evidence.length >= 2);
    const summary = flags.length === 0
        ? `No strong patterns detected across ${checkIns.length} check-ins.`
        : `Detected ${flags.length} pattern(s): ${flags.map(f => f.id).join(', ')} across ${checkIns.length} check-ins.`;
    return { flags, profile, summary };
}
