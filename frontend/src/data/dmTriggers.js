// Trust-gated Sol-start DMs — verbatim from the Character Bible.
// Fires one DM per character per Sol at the start of that Sol.
// Trust thresholds: High = > 65 | Neutral = 35–65 | Low = < 35.

export const SOL_START_DMS = {
  elena: {
    1: {
      high: "Glad to have you on this crew. Mars doesn't forgive mistakes, but it rewards people who think clearly under pressure. I expect that's you.",
      neutral: "Review the mission protocols when you're ready. Discipline keeps this crew alive.",
      low: "Mission briefing is available.",
    },
    2: {
      high: "Yesterday's storm damage is worse than expected. I need your best judgment today, not just your obedience.",
      neutral: "Status report is ready. Stay focused today.",
      low: "Follow mission protocols today.",
    },
    3: {
      high: "Today determines whether this colony becomes permanent. I'm trusting you with decisions that matter. Don't second-guess yourself.",
      neutral: "Final briefing is ready. Stay sharp today.",
      low: "Follow the mission plan today.",
    },
  },
  arjun: {
    1: {
      high: "Good. Someone who actually reads the systems documentation. I need that. Let's go over habitat diagnostics together.",
      neutral: "Engineering logs are updated. Worth reviewing before we start.",
      low: "System diagnostics available.",
    },
    2: {
      high: "Power systems took real damage. Your read on yesterday's allocation decision helped me plan today's repairs.",
      neutral: "Power systems update is ready. Review when you can.",
      low: "Engineering report filed.",
    },
    3: {
      high: "Habitat expansion is at 84%. If we finish today, this colony becomes self-sustaining. I'm glad you've been part of building it.",
      neutral: "Final systems check is underway. We're close.",
      low: "Engineering status updated.",
    },
  },
  meera: {
    1: {
      high: "Every rock here tells the story of a planet humans have never lived on before. I'm glad someone curious is here to help me read it.",
      neutral: "Surface survey results are ready. Take a look when you have time.",
      low: "Science logs available.",
    },
    2: {
      high: "I think we've found something significant underground. I haven't told the others yet. Want to see it first?",
      neutral: "Geological survey continuing. Updates incoming.",
      low: "Research update filed.",
    },
    3: {
      high: "Water production is stable. Three days ago this was a theory. Today it's the reason this colony might actually survive. Thank you for trusting the data with me.",
      neutral: "Final water analysis is ready for review.",
      low: "Science report available.",
    },
  },
  leo: {
    1: {
      high: "okay new crew member. one rule: if I say duck during an EVA, you duck. questions later. we good?",
      neutral: "rover's charged and ready whenever you need it.",
      low: "rover status available.",
    },
    2: {
      high: "survived sol one together. that counts for something out here. today's gonna be rougher btw, fair warning.",
      neutral: "solar array repairs underway. could get interesting.",
      low: "field update sent.",
    },
    3: {
      high: "final sol. not gonna lie, glad you're here for it. let's go build a city on mars.",
      neutral: "construction drones are online. ready when you are.",
      low: "drone status updated.",
    },
  },
};

export const trustTier = (v) => {
  const t = v ?? 50;
  if (t > 65) return "high";
  if (t < 35) return "low";
  return "neutral";
};

export const dmForSolStart = (character, day, trust) => {
  const perChar = SOL_START_DMS[character];
  if (!perChar) return null;
  const perDay = perChar[day];
  if (!perDay) return null;
  return perDay[trustTier(trust)] || null;
};
