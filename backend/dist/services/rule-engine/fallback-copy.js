"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FALLBACK_COPY = void 0;
// Pre-written warm copy per flag — used when Gemini is unavailable.
// Every line passes the motto-and-voice filter: hedging language, patterns not diagnoses.
exports.FALLBACK_COPY = {
    IRON: {
        type: 'DEFICIENCY_FLAG',
        title: "Something worth keeping an eye on.",
        body: "On days when energy is low and iron-rich foods have been a little scarce, there's a quiet connection worth noticing. Iron plays a gentle but important role in how the body keeps going. It might be worth sitting with that pattern for a bit.",
    },
    VITAMIN_D: {
        type: 'DEFICIENCY_FLAG',
        title: "A pattern around sunlight.",
        body: "Low mood and limited time outdoors seem to have overlapped quite a bit lately. There's a relationship between sunlight and how we feel that's easy to underestimate — especially when you're mostly indoors. Worth noticing.",
    },
    MAGNESIUM: {
        type: 'DEFICIENCY_FLAG',
        title: "Sleep and stress seem to be pulling at each other.",
        body: "When stress runs high and sleep comes up short over several days, the body carries that. There's a quiet connection between these two things and how the nervous system settles at night. Something to hold gently, not a conclusion.",
    },
    B12: {
        type: 'DEFICIENCY_FLAG',
        title: "Something to keep in mind on a plant-based diet.",
        body: "Brain fog and tiredness on a plant-based diet can sometimes be connected to B12, which is harder to get from plant foods alone. It's one of those things that shifts slowly and quietly. Worth keeping an eye on.",
    },
    VITAMIN_C: {
        type: 'DEFICIENCY_FLAG',
        title: "Low energy and light on fruit and vegetables.",
        body: "Energy levels and fruit and vegetable intake have both been low lately. These two things often move together — not always, but often enough to be worth noticing as a pattern.",
    },
    SLEEP_DEBT: {
        type: 'PATTERN',
        title: "Sleep has been a bit short lately.",
        body: "Looking across the past week, sleep has consistently come in under what the body tends to want. Even a small gap adds up. It might be worth seeing whether that's affecting how you feel during the day.",
    },
    DEHYDRATION: {
        type: 'PATTERN',
        title: "Water intake has been on the lower side.",
        body: "Across the past several days, water intake has stayed pretty low. Mild dehydration is one of those things that's easy to miss but can quietly affect mood, focus, and energy. Something worth tracking.",
    },
    SEDENTARY: {
        type: 'PATTERN',
        title: "Limited time outdoors this week.",
        body: "There hasn't been much outdoor time lately. Movement and daylight have a way of working together — separately from weather or season, just the act of being outside changes something. Worth keeping in mind.",
    },
    SUSTAINED_STRESS: {
        type: 'PATTERN',
        title: "Stress has been high for a while.",
        body: "Stress levels have been elevated for most of this past week. That kind of sustained pressure is something the body notices even when the mind tries to push through. It's worth paying attention to what's underneath it.",
    },
};
