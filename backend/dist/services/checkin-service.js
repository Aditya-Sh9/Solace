"use strict";
// Pure functions for check-in domain logic — no Express coupling
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodayUTC = getTodayUTC;
exports.calculateStreak = calculateStreak;
exports.computeWeeklyStats = computeWeeklyStats;
const MS_PER_DAY = 86_400_000;
function getTodayUTC() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
/**
 * Count consecutive days ending at today or yesterday.
 * One-day grace period: if today has no entry yet, streak counts from yesterday.
 */
function calculateStreak(checkInDates) {
    if (checkInDates.length === 0)
        return 0;
    const normalized = checkInDates
        .map(d => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())))
        .sort((a, b) => b.getTime() - a.getTime());
    const today = getTodayUTC();
    const yesterday = new Date(today.getTime() - MS_PER_DAY);
    const mostRecent = normalized[0];
    if (mostRecent.getTime() !== today.getTime() && mostRecent.getTime() !== yesterday.getTime()) {
        return 0;
    }
    let streak = 1;
    let current = mostRecent;
    for (let i = 1; i < normalized.length; i++) {
        const expectedPrev = new Date(current.getTime() - MS_PER_DAY);
        if (normalized[i].getTime() === expectedPrev.getTime()) {
            streak++;
            current = normalized[i];
        }
        else {
            break;
        }
    }
    return streak;
}
function computeWeeklyStats(checkIns) {
    const today = getTodayUTC();
    const sevenAgo = new Date(today.getTime() - 7 * MS_PER_DAY);
    const recent = checkIns.filter(c => {
        const d = new Date(Date.UTC(c.date.getUTCFullYear(), c.date.getUTCMonth(), c.date.getUTCDate()));
        return d.getTime() > sevenAgo.getTime();
    });
    if (recent.length === 0)
        return { avgMood: null, avgEnergy: null, avgSleep: null, daysLogged: 0 };
    const avgMood = recent.reduce((s, c) => s + c.moodScore, 0) / recent.length;
    const avgEnergy = recent.reduce((s, c) => s + c.energyScore, 0) / recent.length;
    const withSleep = recent.filter(c => c.sleepHours !== null);
    const avgSleep = withSleep.length > 0
        ? withSleep.reduce((s, c) => s + c.sleepHours, 0) / withSleep.length
        : null;
    const round1 = (n) => Math.round(n * 10) / 10;
    return {
        avgMood: round1(avgMood),
        avgEnergy: round1(avgEnergy),
        avgSleep: avgSleep !== null ? round1(avgSleep) : null,
        daysLogged: recent.length,
    };
}
