"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const validate_1 = require("../validate");
(0, vitest_1.describe)('validateTone', () => {
    (0, vitest_1.it)('passes clean warm copy', () => {
        const clean = "On days when energy is low and iron-rich foods have been a little scarce, there's a quiet connection worth noticing. It might be worth sitting with that pattern.";
        (0, vitest_1.expect)((0, validate_1.validateTone)(clean).ok).toBe(true);
        (0, vitest_1.expect)((0, validate_1.validateTone)(clean).hits).toHaveLength(0);
    });
    (0, vitest_1.it)('rejects "you should"', () => {
        const { ok, hits } = (0, validate_1.validateTone)("You should take a supplement.");
        (0, vitest_1.expect)(ok).toBe(false);
        (0, vitest_1.expect)(hits).toContain('you should');
    });
    (0, vitest_1.it)('rejects "optimize"', () => {
        const { ok, hits } = (0, validate_1.validateTone)("Try to optimize your sleep schedule.");
        (0, vitest_1.expect)(ok).toBe(false);
        (0, vitest_1.expect)(hits).toContain('optimize');
    });
    (0, vitest_1.it)('rejects "deficiency" (the noun)', () => {
        const { ok, hits } = (0, validate_1.validateTone)("This could indicate an iron deficiency.");
        (0, vitest_1.expect)(ok).toBe(false);
        (0, vitest_1.expect)(hits).toContain('deficiency');
    });
    (0, vitest_1.it)('rejects "research suggests" (Correction D)', () => {
        const { ok, hits } = (0, validate_1.validateTone)("Research suggests magnesium helps with sleep.");
        (0, vitest_1.expect)(ok).toBe(false);
        (0, vitest_1.expect)(hits).toContain('research suggests');
    });
    (0, vitest_1.it)('rejects "clinical"', () => {
        const { ok, hits } = (0, validate_1.validateTone)("From a clinical perspective, this pattern is significant.");
        (0, vitest_1.expect)(ok).toBe(false);
        (0, vitest_1.expect)(hits).toContain('clinical');
    });
    (0, vitest_1.it)('rejects "supplement"', () => {
        const { ok, hits } = (0, validate_1.validateTone)("Consider taking a B12 supplement.");
        (0, vitest_1.expect)(ok).toBe(false);
        (0, vitest_1.expect)(hits).toContain('supplement');
    });
    (0, vitest_1.it)('rejects "unfortunately"', () => {
        const { ok, hits } = (0, validate_1.validateTone)("Unfortunately, your sleep data is concerning.");
        (0, vitest_1.expect)(ok).toBe(false);
        (0, vitest_1.expect)(hits).toContain('unfortunately');
    });
    (0, vitest_1.it)('is case-insensitive', () => {
        const { ok } = (0, validate_1.validateTone)("YOU SHOULD get more sleep.");
        (0, vitest_1.expect)(ok).toBe(false);
    });
    (0, vitest_1.it)('reports multiple hits', () => {
        const { hits } = (0, validate_1.validateTone)("You should take a supplement to cure this deficiency.");
        (0, vitest_1.expect)(hits.length).toBeGreaterThan(1);
    });
});
