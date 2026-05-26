"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFirstInsight = generateFirstInsight;
function generateFirstInsight(profile) {
    const insights = [];
    insights.push({
        type: 'ENCOURAGEMENT',
        title: "We're listening.",
        body: "You've shared something real. We're not here to diagnose or fix — just to notice patterns alongside you, gently, as they emerge.",
        flags: [],
    });
    const symptoms = (profile.symptoms ?? []).map(s => s.toLowerCase());
    const hasFatigue = symptoms.some(s => s.includes('fatigue') || s.includes('tired') || s.includes('energy'));
    const plantBased = profile.dietaryPattern === 'VEGETARIAN' || profile.dietaryPattern === 'VEGAN';
    const highStress = (profile.stressLevel ?? 0) >= 4;
    const poorSleep = (profile.sleepHours ?? 8) < 6;
    const lowActivity = profile.activityLevel === 'SEDENTARY' || profile.activityLevel === 'LIGHTLY_ACTIVE';
    if (hasFatigue && plantBased) {
        insights.push({
            type: 'RECOMMENDATION',
            title: "Something worth keeping an eye on.",
            body: "On a plant-based diet, B12 can quietly dip without obvious signs at first. Fatigue is one of the things it's connected to — though there are plenty of other explanations too. It might be worth noticing.",
            flags: ['B12'],
        });
    }
    else if (highStress && poorSleep) {
        insights.push({
            type: 'RECOMMENDATION',
            title: "There might be a pattern here.",
            body: "Stress and sleep have a way of pulling at each other. When both are strained at once, magnesium is sometimes part of that — it's involved in how the nervous system quiets down. Something to hold loosely, not a conclusion.",
            flags: ['MAGNESIUM'],
        });
    }
    else if (hasFatigue && lowActivity) {
        insights.push({
            type: 'RECOMMENDATION',
            title: "A quiet thing to notice.",
            body: "Low energy and limited time outdoors sometimes travel together. Vitamin D is one piece of that puzzle — especially if sunlight has been scarce lately. Worth keeping in mind as we learn more.",
            flags: ['VITAMIN_D'],
        });
    }
    else {
        insights.push({
            type: 'RECOMMENDATION',
            title: "We're just getting started.",
            body: "There's nothing jumping out just yet — which is fine. Patterns tend to show themselves over time. The more you check in, the clearer the picture becomes.",
            flags: [],
        });
    }
    return insights;
}
