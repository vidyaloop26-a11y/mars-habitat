# Mars Habitat Engineering — PRD

## Original Problem Statement (verbatim)
Build a 3-day Mars colony engineering internship simulation called Mars Habitat Engineering for school students (ages 13–17). Section A (attached MHE_Stage1.docx) contains the full build brief (React + Tailwind, sessionStorage state, JSON dialogue, 5 screens, 10 variables, character voices, Mars aesthetic). Section B contains the exact content for the onboarding page and the 8 Day 1 scenes — every line, every decision, every variable change is used verbatim. Vidyaloop logo is present in the top-left header across all screens. Stop after Day 1 Reflection renders (stat summary + disabled "Begin Day 2" button).

## Target Personas
- School students ages 13–17 (middle / high school).
- Teachers running the module in a school lab or 1:1 device setting.

## Architecture
- **Frontend only** (React 19 + Tailwind + Craco). No backend needed for Stage 1.
- **State**: sessionStorage via `/app/frontend/src/lib/gameState.js`. Ten defaulted variables + log/feed/DMs/reflection.
- **Content**: `/app/frontend/src/data/scenes.js` (verbatim Day 1 lines) and `/app/frontend/src/data/characters.js`.
- **Design tokens**: Mars rust/dust palette in `/app/frontend/src/index.css`. Fonts: Chakra Petch (display) + DM Sans (body) + JetBrains Mono (system/status).

## What's implemented (Stages 1–4 — Feb 2026)
- **Screen 1 · Onboarding** (`/`): Vidyaloop logo, "ARES HABITAT ONE" title, 4-item grid (Duration / Location / Role / Team), verbatim mission briefing, name input storing `intern_name`, "Begin Mission" button disabled until name is entered.
- **Screen 2 · Mission Chat** (`/mission`): Sol + habitat status badge in header, 4 crew avatars in right rail, chat log with per-character typing indicator (350–780ms), decision cards inline with three options + variable-effect chips, orange outgoing bubble for the intern's choice, sequential reactions, Continue button between scenes.
- **Screen 3 · Habitat Dashboard** (`/dashboard`): Read-only reverse-chronological feed. Category badge + headline + priority (CRITICAL / WARNING / NOMINAL) + Sol/time. Categories: Engineering Log, System Alert, Science Report, Rover Comms, Mission Report.
- **Screen 4 · DMs** (`/dms`): Four character threads. Unread dot fires when a DM arrives (Elena fires an unread DM at end of Scene 1.1). Mark-as-read on open. Return-to-Mission button.
- **Screen 5 · Day Reflection** (`/reflection`): Three verbatim reflection questions revealed one-at-a-time, then Day 1 Variable Summary — six stat bars (0–100) animated 600ms with stagger, four relationship indicators (Low/Neutral/High), teaser, "Begin Day 2" button rendered but disabled.
- **All 8 Day 1 scenes** delivered verbatim from Section B (Stage 1):
  1.1 Welcome to Mars (fires Elena DM)
  1.2 Habitat Activation (Engineering Log feed)
  1.3 Solar Array Warning (System Alert + Decision 1)
  1.4 Greenhouse Planning (Decision 2)
  1.5 Water Extraction Test (Science Report feed)
  1.6 Dust Storm Approaches (Mission Alert + Decision 3 + status → ELEVATED RISK)
  1.7 Evening Debrief
  1.8 Reflection screen
- **All 8 Day 2 scenes** delivered verbatim from Stage 2 Section B:
  2.1 Morning Systems Report (Engineering Log feed, WARNING)
  2.2 Power Crisis (Decision 4)
  2.3 Rover Expedition (Rover Comms feed, NOMINAL)
  2.4 Underground Ice Discovery (Decision 5)
  2.5 Oxygen Leak (System Alert feed + Decision 6)
  2.6 Crew Fatigue (Private Messages, no decision)
  2.7 Expansion Strategy (Decision 7)
  2.8 Reflection screen
- **All 6 Day 3 scenes** delivered verbatim from Stage 3 Section B:
  3.1 Final Mission Briefing (⚙ Engineering Log inline, no feed push per spec)
  3.2 Habitat Expansion (Engineering Log feed WARNING + Decision 8)
  3.3 Communications Blackout (⚠ inline alert, no feed)
  3.4 Colony Milestone (📋 Mission Report feed NOMINAL)
  3.5 Final Engineering Decision (Decision 9)
  3.6 Mission Success (habitat status → NOMINAL, 4 base messages + trust-gated farewells)
  3.7 Reflection screen (auto-advances to Final Summary Card)
- **Trust-gated farewells** at Scene 3.6: each of Elena / Arjun / Meera / Leo delivers their `>65` "high" line or `≤65` "low" line based on final trust.
- **Final Summary Card** (`/final`): dominant-variable callout (max wins, tiebreaker: leadership → engineering → science → power → habitat_integrity → crew_morale) with the exact one-liner per variable, all 6 stat bars (dominant highlighted), all 4 trust indicators, final "Welcome to the colony" message, and a **Start Over** button that clears sessionStorage and returns to onboarding. No certificate, no download — per spec.
- **Auto-scroll fix (Stage 2 spec)**: chat auto-scrolls only if user is within 100px of the bottom; otherwise a floating "New message ↓" pill appears and scrolls to bottom on tap.
- **Dashboard unread badge** on the tab strip — clears when the Habitat Dashboard is opened.
- **Multi-day scaffold**: `current_day` in sessionStorage; `startDay(n)` carries variables/feed/DMs forward, resets scene log + index, fires day-start DMs. Reflection answers stored per day.
- **Variables**: all 10 defaults = 50; decisions apply the exact +/- deltas from Section B, clamped to [0,100]. Leadership drifts +1 per decision.
- **Status badge**: NOMINAL / ELEVATED RISK / CRITICAL / RECOVERING mapped to green / amber / red / blue.
- **Idempotent playback**: Chat log entries are keyed (StrictMode + navigation safe). DMs and feed items are deduped.

## Backlog (P0 / P1 / P2)
- **P1 · Teacher/classroom mode** — link-shareable run summary (variables + decisions + reflection text) exportable as PDF for teachers.
- **P1 · Accessibility pass** — aria-live for chat log; keyboard-only decision selection.
- **P1 · Sound design** — subtle habitat hum + comms chirp on new message (mutable).
- **P2 · Analytics** — track decision distribution across students so teachers can spot cohort tendencies (safety-first vs exploration-first classes).
- **P2 · Persist beyond session** — optional backend so a student can resume across devices.
- **P2 · Alternate crew configurations** — swap crew backgrounds/nationalities for classroom representation.
- **P2 · Crew "trust delta" strip** on Sol 2 & Sol 3 debriefs — visualise +/- movement in trust vs previous sol for classroom discussion.

## Next Actions
1. Ship the full 3-sol module to a pilot classroom for playtesting.
2. Design the classroom-facing "Student Sol Card" export.
3. Accessibility + sound design polish pass.
