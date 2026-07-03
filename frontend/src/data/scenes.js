// Sol content — VERBATIM from MHE Section B (Stages 1 & 2).
// Do not alter any lines.

export const DAY_1_SCENES = [
  {
    id: "1.1",
    title: "Welcome to Mars",
    header: { location: "Mission Chat", sol: 1, time: "08:00", status: "NOMINAL" },
    messages: [
      { from: "elena", text: "Welcome to Ares Habitat One. You're officially part of humanity's first permanent settlement." },
      { from: "leo",   text: "no pressure... just don't break Mars 😄" },
      { from: "meera", text: "We've waited years for this mission. Glad you're finally here." },
      { from: "arjun", text: "Orientation begins in five minutes. Habitat diagnostics first." },
      { from: "elena", text: "Arjun's right. Systems before sentiment. Let's move." },
    ],
    // Sol 1 start-of-Sol DMs are fired by gameState.startDay(1) at Onboarding "Begin Mission",
    // using each character's trust-gated variant from the Character Bible.
  },
  {
    id: "1.2",
    title: "Habitat Activation",
    header: { location: "Engineering Log", time: "09:00" },
    messages: [
      { from: "arjun", text: "This is the full tour. Life-support, solar arrays, communications, greenhouse, power modules." },
      { from: "arjun", text: "Life-support recycles ninety-three percent of water and oxygen. The remaining seven percent is why the greenhouse matters." },
      { from: "meera", text: "The greenhouse isn't just food. It's also part of our oxygen cycle." },
      { from: "leo",   text: "And the rovers, which are clearly the most important system, are parked outside." },
      { from: "arjun", text: "The rovers are not the most important system." },
      { from: "leo",   text: "Agree to disagree." },
    ],
    feedItem: {
      category: "Engineering Log",
      headline: "Habitat systems nominal | Life-support: 93% efficiency | Power: 100% | Greenhouse: operational",
      priority: "NOMINAL",
      time: "09:00",
      sol: 1,
    },
  },
  {
    id: "1.3",
    title: "Solar Array Warning",
    header: { location: "System Alert", time: "10:30" },
    inlineAlert: {
      icon: "⚠",
      title: "SOLAR ARRAY WARNING",
      body: "Dust accumulation reducing solar output by 18%. Power generation declining.",
      priority: "WARNING",
    },
    feedItem: {
      category: "System Alert",
      headline: "SOLAR ARRAY WARNING — Dust accumulation reducing solar output by 18%. Power generation declining.",
      priority: "WARNING",
      time: "10:30",
      sol: 1,
    },
    messages: [
      { from: "arjun", text: "We should clean the arrays immediately. Eighteen percent loss compounds quickly." },
      { from: "leo",   text: "A rover can do most of the work without anyone needing to suit up." },
      { from: "elena", text: "Time is the constraint. What's the call?" },
    ],
    decision: {
      id: "D1",
      prompt: "DECISION 1 — How do we handle the solar array dust?",
      options: [
        {
          id: "A",
          label: "Send an EVA crew now.",
          effects: { power: 6, habitat_integrity: -3, trust_leo: 3 },
          reactions: [
            { from: "leo",   text: "Fastest option. Let's suit up." },
            { from: "arjun", text: "Faster but higher risk. Watch the radiation exposure window." },
          ],
        },
        {
          id: "B",
          label: "Use the autonomous rover.",
          effects: { engineering: 6, power: 3, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "Safer and nearly as fast. Good engineering judgment." },
          ],
        },
        {
          id: "C",
          label: "Wait for a weather update first.",
          effects: { habitat_integrity: 5, power: -3, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "Cautious. Correct. We don't send crews into uncertainty." },
          ],
        },
      ],
    },
  },
  {
    id: "1.4",
    title: "Greenhouse Planning",
    header: { location: "Research Lab", time: "12:15" },
    messages: [
      { from: "meera", text: "I want to propose expanding the greenhouse using processed Martian regolith as growing medium." },
      { from: "elena", text: "That uses construction materials we may need for habitat expansion." },
      { from: "meera", text: "It also means more food production and better oxygen cycling long-term." },
      { from: "arjun", text: "We could test it at small scale before committing resources." },
      { from: "elena", text: "What's the recommendation?" },
    ],
    decision: {
      id: "D2",
      prompt: "DECISION 2 — How do we approach greenhouse expansion?",
      options: [
        {
          id: "A",
          label: "Expand food production immediately.",
          effects: { crew_morale: 6, science: 3, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "Thank you. Long-term food security matters more than people realise." },
          ],
        },
        {
          id: "B",
          label: "Preserve construction materials for the habitat.",
          effects: { engineering: 5, habitat_integrity: 3, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "Right call. Habitat integrity comes first. Food can wait a sol." },
          ],
        },
        {
          id: "C",
          label: "Run a small-scale experiment first.",
          effects: { science: 6, engineering: 3, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "Good science. Test before you commit resources." },
          ],
        },
      ],
    },
  },
  {
    id: "1.5",
    title: "Water Extraction Test",
    header: { location: "Science Bay", time: "15:00" },
    messages: [
      { from: "meera", text: "Ice samples from beneath the surface could provide a long-term water supply. The readings are promising." },
      { from: "arjun", text: "We'll need more drilling equipment to confirm the depth and volume." },
      { from: "leo",   text: "Or I send the rover deeper today while we still have daylight." },
      { from: "meera", text: "Either works. We just need confirmation before we commit resources to extraction infrastructure." },
    ],
    feedItem: {
      category: "Science Report",
      headline: "Subsurface ice signature detected | Estimated depth: 2.3m | Confidence: MODERATE",
      priority: "NOMINAL",
      time: "15:00",
      sol: 1,
    },
  },
  {
    id: "1.6",
    title: "Dust Storm Approaches",
    header: { location: "Mission Alert", time: "18:40" },
    inlineAlert: {
      icon: "⚠",
      title: "DUST STORM WARNING",
      body: "Category-3 storm arriving in two hours. Communications weakening. Power generation falling.",
      priority: "CRITICAL",
    },
    feedItem: {
      category: "Mission Report",
      headline: "DUST STORM WARNING — Category-3 storm arriving in two hours. Communications weakening. Power generation falling.",
      priority: "CRITICAL",
      time: "18:40",
      sol: 1,
    },
    statusChange: "ELEVATED RISK",
    messages: [
      { from: "arjun", text: "Storm models confirm category-3 intensity. We have roughly two hours." },
      { from: "leo",   text: "Exploration teams are still out near the ice site." },
      { from: "elena", text: "Decision time. What's our priority?" },
    ],
    decision: {
      id: "D3",
      prompt: "DECISION 3 — How do we prepare for the dust storm?",
      options: [
        {
          id: "A",
          label: "Secure external equipment first.",
          effects: { engineering: 5, habitat_integrity: 4, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "Protecting equipment now saves repair time later. Smart." },
          ],
        },
        {
          id: "B",
          label: "Recall all exploration teams immediately.",
          effects: { crew_morale: 6, habitat_integrity: 3, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "Correct priority. No equipment is worth a crew member's safety." },
          ],
        },
        {
          id: "C",
          label: "Keep drilling until the last safe minute.",
          effects: { science: 6, habitat_integrity: -4, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "Risky but the data could be invaluable. Thank you for trusting the science." },
            { from: "elena", text: "Noted. Cutting it close." },
          ],
        },
      ],
    },
  },
  {
    id: "1.7",
    title: "Evening Debrief",
    header: { location: "Command Room", time: "20:30", status: "ELEVATED RISK" },
    messages: [
      { from: "elena", text: "Sol one summary. Solar output recovering. Greenhouse plan in motion. Ice deposit confirmed. Storm incoming but the crew is secure." },
      { from: "arjun", text: "Power reserves at sixty-eight percent. Manageable through the storm." },
      { from: "meera", text: "The ice data alone makes today a success." },
      { from: "leo",   text: "and nobody got hit by a dust storm. personal win." },
      { from: "elena", text: "Get some rest. Tomorrow the storm hits us directly." },
    ],
    isEndOfDay: true,
  },
];

export const DAY_2_SCENES = [
  {
    id: "2.1",
    title: "Morning Systems Report",
    header: { location: "Mission Chat", sol: 2, time: "08:00", status: "ELEVATED RISK" },
    inlineAlert: {
      icon: "⚙",
      title: "ENGINEERING LOG",
      body: "Storm damage assessment complete | Solar output: -31% | Battery reserves: LIMITED",
      priority: "WARNING",
    },
    feedItem: {
      category: "Engineering Log",
      headline: "Storm damage assessment complete | Solar output: -31% | Battery reserves: LIMITED",
      priority: "WARNING",
      time: "08:00",
      sol: 2,
    },
    messages: [
      { from: "elena", text: "Status update. Dust storm damage is worse than expected." },
      { from: "arjun", text: "Solar output is down thirty-one percent. Battery reserves are limited." },
      { from: "meera", text: "Yesterday's ice readings deserve another expedition. The data window won't stay open forever." },
      { from: "leo",   text: "Rover Atlas is repaired and ready whenever we need it." },
      { from: "elena", text: "Today tests the colony. Let's get to work." },
    ],
  },
  {
    id: "2.2",
    title: "Power Crisis",
    header: { location: "Engineering Log", time: "09:15" },
    inlineAlert: {
      icon: "⚠",
      title: "POWER ALLOCATION CONFLICT",
      body: "Life-support and research labs cannot both run at full capacity simultaneously.",
      priority: "WARNING",
    },
    messages: [
      { from: "arjun", text: "We're at a hard limit. Life-support and the research labs can't both run at full power." },
      { from: "meera", text: "The lab equipment needs continuous power or we lose days of data." },
      { from: "elena", text: "Life-support isn't negotiable. But there may be a middle path." },
      { from: "arjun", text: "There's always a middle path. It's usually just less efficient." },
    ],
    decision: {
      id: "D4",
      prompt: "DECISION 4 — How do we allocate limited power?",
      options: [
        {
          id: "A",
          label: "Prioritize life-support systems.",
          effects: { habitat_integrity: 7, science: -4, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "Correct call. We don't gamble with breathable air." },
            { from: "arjun", text: "Safe and sound. Research can wait." },
          ],
        },
        {
          id: "B",
          label: "Prioritize research equipment.",
          effects: { science: 7, habitat_integrity: -4, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "Thank you. This data could be irreplaceable." },
            { from: "elena", text: "Noted. Watch the margins closely." },
          ],
        },
        {
          id: "C",
          label: "Rotate power between both systems.",
          effects: { engineering: 6, habitat_integrity: 2, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "More complex to manage but nobody loses everything. Good engineering compromise." },
          ],
        },
      ],
    },
  },
  {
    id: "2.3",
    title: "Rover Expedition",
    header: { location: "Rover Communications", time: "11:00" },
    inlineAlert: {
      icon: "🛰",
      title: "ROVER COMMS",
      body: "Atlas approaching lava tube formation | Potential radiation shielding site identified",
      priority: "NOMINAL",
    },
    feedItem: {
      category: "Rover Comms",
      headline: "Atlas approaching lava tube formation | Potential radiation shielding site identified",
      priority: "NOMINAL",
      time: "11:00",
      sol: 2,
    },
    messages: [
      { from: "leo",   text: "Atlas just found something interesting. A lava tube. Could be natural radiation shielding." },
      { from: "elena", text: "How deep does it go?" },
      { from: "leo",   text: "Unknown. I want to send Atlas deeper to map it properly." },
      { from: "elena", text: "We don't have eyes inside that tube. Caution matters here." },
      { from: "leo",   text: "Caution is slower than curiosity, but sure, I hear you." },
    ],
  },
  {
    id: "2.4",
    title: "Underground Ice Discovery",
    header: { location: "Science Bay", time: "13:00" },
    inlineAlert: {
      icon: "🔬",
      title: "SCIENCE REPORT",
      body: "Underground water ice confirmed | Estimated volume: significant | Drilling required for extraction",
      priority: "NOMINAL",
    },
    messages: [
      { from: "meera", text: "It's confirmed. Underground water ice, larger than yesterday's estimate." },
      { from: "arjun", text: "I want to start drilling immediately while we have stable weather." },
      { from: "meera", text: "I'd rather survey the full site first. We don't know the structural risk yet." },
      { from: "elena", text: "What's the call?" },
    ],
    decision: {
      id: "D5",
      prompt: "DECISION 5 — How do we handle the ice deposit?",
      options: [
        {
          id: "A",
          label: "Begin drilling now.",
          effects: { engineering: 6, habitat_integrity: -3, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "Fast results. Some risk. I'll monitor the structural readings closely." },
          ],
        },
        {
          id: "B",
          label: "Survey the site completely first.",
          effects: { science: 6, habitat_integrity: 3, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "Thank you. We don't lose anything by being thorough." },
          ],
        },
        {
          id: "C",
          label: "Return with heavier equipment tomorrow.",
          effects: { habitat_integrity: 5, engineering: 3, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "Patient and correct. The ice isn't going anywhere." },
          ],
        },
      ],
    },
  },
  {
    id: "2.5",
    title: "Oxygen Leak",
    header: { location: "Emergency Alert", time: "15:30" },
    inlineAlert: {
      icon: "⚠",
      title: "OXYGEN LEAK DETECTED",
      body: "Habitat Module B. Severity: minor. Immediate assessment required.",
      priority: "WARNING",
    },
    feedItem: {
      category: "System Alert",
      headline: "OXYGEN LEAK DETECTED — Habitat Module B. Severity: minor. Immediate assessment required.",
      priority: "WARNING",
      time: "15:30",
      sol: 2,
    },
    messages: [
      { from: "arjun", text: "Minor oxygen leak in Module B. I'm requesting an immediate shutdown to assess." },
      { from: "meera", text: "That module houses three crew bunks. Where do they go?" },
      { from: "leo",   text: "I can patch it without a full evacuation if the leak's small enough." },
      { from: "elena", text: "Decision needed now. What's our approach?" },
    ],
    decision: {
      id: "D6",
      prompt: "DECISION 6 — How do we handle the oxygen leak?",
      options: [
        {
          id: "A",
          label: "Evacuate Module B completely.",
          effects: { habitat_integrity: 6, crew_morale: -3, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "Safest option. We don't take chances with breathable air." },
          ],
        },
        {
          id: "B",
          label: "Repair while occupied.",
          effects: { crew_morale: 5, habitat_integrity: -4, trust_leo: 3 },
          reactions: [
            { from: "leo",   text: "less disruption to everyone's sleep schedule. let's patch it fast." },
            { from: "arjun", text: "Risky but workable if we move quickly." },
          ],
        },
        {
          id: "C",
          label: "Seal only the damaged section.",
          effects: { engineering: 6, habitat_integrity: 3, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "Targeted and efficient. Exactly the right scale of response." },
          ],
        },
      ],
    },
  },
  {
    id: "2.6",
    title: "Crew Fatigue",
    header: { location: "Private Messages", time: "17:00" },
    messages: [
      { from: "elena", text: "Continuous work shifts are catching up with the crew. I need your read on this." },
      { from: "elena", text: "Push through and finish today's objectives, or scale back and protect rest cycles?" },
      { from: "elena", text: "Your recommendation matters here. What do you think?" },
    ],
  },
  {
    id: "2.7",
    title: "Expansion Strategy",
    header: { location: "Command Briefing", time: "19:00" },
    messages: [
      { from: "elena", text: "Tomorrow's priority needs deciding tonight. Three options on the table." },
      { from: "arjun", text: "Redundant power systems would prevent another crisis like today's." },
      { from: "meera", text: "Expanded labs would accelerate the science that's keeping this colony viable long-term." },
      { from: "leo",   text: "Bigger living quarters would help with the fatigue problem we just talked about." },
      { from: "elena", text: "What's the priority?" },
    ],
    decision: {
      id: "D7",
      prompt: "DECISION 7 — What does the colony build next?",
      options: [
        {
          id: "A",
          label: "Expand living quarters.",
          effects: { crew_morale: 6, habitat_integrity: 3, trust_leo: 3 },
          reactions: [
            { from: "leo",   text: "finally, more space. the crew needed this." },
          ],
        },
        {
          id: "B",
          label: "Expand scientific laboratories.",
          effects: { science: 6, engineering: 3, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "This accelerates everything we're learning here. Thank you." },
          ],
        },
        {
          id: "C",
          label: "Build redundant power systems first.",
          effects: { engineering: 6, habitat_integrity: 4, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "The responsible choice. Today shouldn't happen again." },
          ],
        },
      ],
    },
    isEndOfDay: true,
  },
];

export const DAY_3_SCENES = [
  {
    id: "3.1",
    title: "Final Mission Briefing",
    header: { location: "Mission Chat", sol: 3, time: "08:00", status: "NOMINAL" },
    inlineAlert: {
      icon: "⚙",
      title: "ENGINEERING LOG",
      body: "Habitat expansion: 84% complete | Water extraction: exceeding projections | All systems operational",
      priority: "NOMINAL",
    },
    // (No feed push here — Dashboard items only fire at 3.2 and 3.4, per Section A.)
    statusChange: "NOMINAL",
    messages: [
      { from: "elena", text: "Today determines whether this colony becomes permanent." },
      { from: "arjun", text: "Habitat expansion is eighty-four percent complete. We finish today or we don't finish at all this sol." },
      { from: "meera", text: "Water extraction results exceeded expectations. The colony has a sustainable water source." },
      { from: "leo",   text: "Construction drones are online. Ready when you are." },
      { from: "elena", text: "Then let's build a future here." },
    ],
  },
  {
    id: "3.2",
    title: "Habitat Expansion",
    header: { location: "Engineering Log", time: "09:30" },
    inlineAlert: {
      icon: "⚠",
      title: "DUST FRONT APPROACHING",
      body: "Final habitat module must connect before next storm system arrives.",
      priority: "WARNING",
    },
    feedItem: {
      category: "Engineering Log",
      headline: "DUST FRONT APPROACHING — Final habitat module must connect before next storm system arrives.",
      priority: "WARNING",
      time: "09:30",
      sol: 3,
    },
    messages: [
      { from: "arjun", text: "The final module needs to connect before the next dust front. We have a tight window." },
      { from: "meera", text: "The greenhouse could also use today's window for expansion while conditions hold." },
      { from: "leo",   text: "Or we shore up the power grid first so none of this gets undone if something fails." },
      { from: "elena", text: "One priority. What's the call?" },
    ],
    decision: {
      id: "D8",
      prompt: "DECISION 8 — What's the priority before the dust front arrives?",
      options: [
        {
          id: "A",
          label: "Finish the habitat connection first.",
          effects: { habitat_integrity: 7, engineering: 4, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "This is the right call. A permanent colony needs a permanent structure." },
          ],
        },
        {
          id: "B",
          label: "Expand the greenhouse first.",
          effects: { crew_morale: 6, science: 4, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "Thank you. Long-term food security shouldn't wait either." },
          ],
        },
        {
          id: "C",
          label: "Reinforce the power grid before expansion.",
          effects: { engineering: 6, habitat_integrity: 4, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "Protects everything we've already built. Smart sequencing." },
          ],
        },
      ],
    },
  },
  {
    id: "3.3",
    title: "Communications Blackout",
    header: { location: "System Alert", time: "11:15" },
    inlineAlert: {
      icon: "⚠",
      title: "COMMUNICATIONS BLACKOUT",
      body: "Solar event interrupting contact with Earth. Estimated restoration: unknown.",
      priority: "WARNING",
    },
    messages: [
      { from: "elena", text: "A solar event has cut our communications with Earth. We're on our own until it clears." },
      { from: "arjun", text: "No real-time support from mission control. Every decision from here is ours." },
      { from: "meera", text: "That's actually a milestone. We're operating as a self-sufficient colony, even if only temporarily." },
      { from: "leo",   text: "yeah let's not lose anyone while proving that point though" },
      { from: "elena", text: "Agreed. The mission depends entirely on this colony right now." },
    ],
  },
  {
    id: "3.4",
    title: "Colony Milestone",
    header: { location: "Mission Report", time: "13:00" },
    inlineAlert: {
      icon: "📋",
      title: "MISSION REPORT",
      body: "First crops growing | Water production: stable | Radiation shielding: operational | Self-sufficiency: APPROACHING",
      priority: "NOMINAL",
    },
    feedItem: {
      category: "Mission Report",
      headline: "First crops growing | Water production: stable | Radiation shielding: operational | Self-sufficiency: APPROACHING",
      priority: "NOMINAL",
      time: "13:00",
      sol: 3,
    },
    messages: [
      { from: "meera", text: "First crops are growing in the greenhouse. Actual food, grown on Mars." },
      { from: "arjun", text: "Water production is stable. Radiation shielding is fully operational." },
      { from: "elena", text: "We are very close to becoming self-sustaining." },
      { from: "leo",   text: "we're basically a real city now. a tiny, dusty, very cool city." },
    ],
  },
  {
    id: "3.5",
    title: "Final Engineering Decision",
    header: { location: "Operations Room", time: "14:30" },
    messages: [
      { from: "elena", text: "Remaining construction resources are enough for one final major project. This is the last call." },
      { from: "arjun", text: "An additional habitat module increases our capacity for future crew arrivals." },
      { from: "meera", text: "Expanded laboratories would accelerate everything we're learning here." },
      { from: "arjun", text: "Or redundant life-support, so today's near-miss with the oxygen leak never threatens us again." },
      { from: "elena", text: "What's the final recommendation?" },
    ],
    decision: {
      id: "D9",
      prompt: "DECISION 9 — What's the final construction priority?",
      options: [
        {
          id: "A",
          label: "Build an additional habitat module.",
          effects: { habitat_integrity: 7, leadership: 4, trust_elena: 3 },
          reactions: [
            { from: "elena", text: "This colony grows. That was always the point." },
          ],
        },
        {
          id: "B",
          label: "Expand scientific laboratories.",
          effects: { science: 7, engineering: 4, trust_meera: 3 },
          reactions: [
            { from: "meera", text: "Every discovery here shapes the next mission. Thank you for prioritising that." },
          ],
        },
        {
          id: "C",
          label: "Construct redundant life-support systems.",
          effects: { habitat_integrity: 6, engineering: 5, trust_arjun: 3 },
          reactions: [
            { from: "arjun", text: "The responsible long-term choice. We don't get a second oxygen leak." },
          ],
        },
      ],
    },
  },
  {
    id: "3.6",
    title: "Mission Success",
    header: { location: "Command Chat", time: "16:00", status: "NOMINAL" },
    statusChange: "NOMINAL", // Reset habitat status after a successful sol.
    messages: [
      { from: "elena", text: "Outstanding work. Humanity has a future here." },
      { from: "arjun", text: "Every system is operating within safe limits." },
      { from: "meera", text: "Today's discoveries will shape future missions for years." },
      { from: "leo",   text: "we actually built a city on mars 🚀" },
    ],
    // Farewells appended dynamically at play-time based on trust scores (>65 = high, else low).
    farewellByTrust: true,
    farewells: {
      elena: {
        high: "Three sols ago you were an intern. Today you helped make critical decisions that shaped a permanent Martian colony. I don't say this lightly: well done.",
        low:  "The mission succeeded. The colony is stable. That's what matters.",
      },
      arjun: {
        high: "Every system we built worked because the decisions behind them were sound. You understood the trade-offs. That's rare.",
        low:  "All systems are within operational parameters. The engineering held.",
      },
      meera: {
        high: "You trusted the science even when it meant taking the slower path. That's exactly the instinct good research needs. Thank you.",
        low:  "The data confirms a sustainable water source. That's the scientific outcome we needed.",
      },
      leo: {
        high: "not gonna lie, three sols ago I wasn't sure about you. now? you're crew. proper Mars crew. that means something out here.",
        low:  "we made it through three sols on Mars. that's the only scoreboard that matters 🚀",
      },
    },
    isEndOfDay: true,
  },
];

// Per-day reflection content + next-day gating.
export const DAYS = {
  1: {
    scenes: DAY_1_SCENES,
    reflectionQuestions: [
      "What was your most important engineering decision today?",
      "Did you prioritise exploration or safety?",
      "What worries you most about tomorrow on Mars?",
    ],
    teaser:
      "Tomorrow: SOL 2 — Systems Under Pressure. The dust storm hits. Power reserves drop. And the colony must survive its first real crisis.",
    nextDayLabel: "Begin Day 2",
    nextDay: 2,
    canStartNextDay: true,
    isFinalDay: false,
  },
  2: {
    scenes: DAY_2_SCENES,
    reflectionQuestions: [
      "Which engineering trade-off was the most difficult today?",
      "Did you value exploration over safety?",
      "What should the colony focus on tomorrow?",
    ],
    teaser:
      "Tomorrow: SOL 3 — Building the Future. The final habitat module. A communications blackout. And the decision that determines whether this colony becomes permanent.",
    nextDayLabel: "Begin Day 3",
    nextDay: 3,
    canStartNextDay: true, // Day 3 unlocked in Stage 3
    isFinalDay: false,
  },
  3: {
    scenes: DAY_3_SCENES,
    reflectionQuestions: [
      "Which engineering decision had the greatest impact?",
      "How did you balance safety, exploration and innovation?",
      "What should humanity build next on Mars?",
    ],
    teaser: null,
    nextDayLabel: null,
    nextDay: null,
    canStartNextDay: false,
    isFinalDay: true,
  },
};

export const getDay = (n) => DAYS[n] || DAYS[1];

// Resolve messages for a scene, appending trust-gated farewells when applicable.
export const resolveSceneMessages = (scene, vars) => {
  if (!scene.farewellByTrust || !scene.farewells) return scene.messages || [];
  const extras = ["elena", "arjun", "meera", "leo"].map((id) => {
    const trust = vars?.[`trust_${id}`] ?? 50;
    const line = trust > 65 ? scene.farewells[id].high : scene.farewells[id].low;
    return { from: id, text: line };
  });
  return [...(scene.messages || []), ...extras];
};

// Final Summary Card — dominant variable line (highest wins; tiebreaker: leadership).
export const DOMINANT_LINES = {
  leadership: "You inspired the colony through every crisis. Mars has a future because someone made the hard calls with confidence.",
  engineering: "Your designs made Mars livable. Every system standing today reflects the trade-offs you got right.",
  science: "Discovery became your legacy. The water, the data, the breakthroughs — all traced back to decisions you made.",
  power: "You kept the lights on when it mattered most. Every other system depended on the choices you made about energy.",
  habitat_integrity: "Your systems kept everyone alive. That is, in the end, the only metric that truly matters on Mars.",
  crew_morale: "You built a future through teamwork. A colony isn't just structures and power — it's the people who choose to stay.",
};

export const DOMINANT_ORDER = [
  "leadership",     // tiebreaker: leadership comes first
  "engineering",
  "science",
  "power",
  "habitat_integrity",
  "crew_morale",
];

export const pickDominant = (vars) => {
  let best = "leadership";
  let bestVal = -Infinity;
  for (const k of DOMINANT_ORDER) {
    const v = vars?.[k] ?? 0;
    if (v > bestVal) { best = k; bestVal = v; }
  }
  return best;
};

export const FINAL_MESSAGE =
  "Three sols ago, four specialists and one intern began building humanity's future on Mars. Today, that future is real. Every decision mattered. Every system held. Welcome to the colony.";

// Trust-state DM from Elena when Sol 2 begins. (Deprecated — moved to @/data/dmTriggers)
export const elenaSol2DM = (trustElena) => {
  if (trustElena > 65) {
    return "Yesterday's storm damage is worse than expected. I need your best judgment today, not just your obedience.";
  }
  if (trustElena < 35) {
    return "Follow mission protocols today.";
  }
  return "Status report is ready. Stay focused today.";
};

// Kept for backwards compatibility (unused after Stage 4 refactor — DM triggers now live in @/data/dmTriggers).
export const REFLECTION_QUESTIONS = DAYS[1].reflectionQuestions;
export const NEXT_DAY_TEASER = DAYS[1].teaser;
