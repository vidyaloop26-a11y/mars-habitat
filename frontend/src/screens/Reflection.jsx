import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { SessionGate } from "@/components/SessionGate";
import { gameState } from "@/lib/gameState";
import { getDay } from "@/data/scenes";
import { CHARACTERS, CHARACTER_LIST } from "@/data/characters";
import { CrewAvatar } from "@/components/CrewAvatar";
import { ArrowRight, Lock, Rocket } from "lucide-react";

const STAT_LABELS = {
  leadership: "Leadership",
  engineering: "Engineering",
  science: "Science",
  power: "Power",
  habitat_integrity: "Habitat Integrity",
  crew_morale: "Crew Morale",
};

const STAT_COLORS = {
  leadership: "#e8a678",
  engineering: "#5b9bd5",
  science: "#5ab070",
  power: "#f0b632",
  habitat_integrity: "#d95321",
  crew_morale: "#e14b3a",
};

function relationshipLabel(v) {
  if (v >= 60) return { label: "High",    color: "#5ab070" };
  if (v <= 40) return { label: "Low",     color: "#e14b3a" };
  return { label: "Neutral", color: "#e8a678" };
}

function StatBar({ statKey, value, delayMs = 0 }) {
  const color = STAT_COLORS[statKey] || "#e8a678";
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div data-testid={`stat-${statKey}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-sand">
          {STAT_LABELS[statKey]}
        </span>
        <span className="font-display font-semibold text-[15px]" style={{ color }}>
          {pct}
        </span>
      </div>
      <div
        style={{
          height: 8, borderRadius: 999,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--mars-line-soft)",
          overflow: "hidden",
        }}
      >
        <div
          className="stat-fill"
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            animationDelay: `${delayMs}ms`,
            boxShadow: `0 0 12px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

export default function Reflection() {
  return (
    <SessionGate>
      <ReflectionInner />
    </SessionGate>
  );
}

function DayTransitioning({ label = "Loading next Sol briefing…", onContinue }) {
  const [showFallback, setShowFallback] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowFallback(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <AppShell showTabs={false}>
      <div
        data-testid="day-transition"
        className="max-w-md mx-auto mt-16 mars-panel"
        style={{ padding: "34px 28px", textAlign: "center" }}
      >
        <div className="inline-flex items-center gap-1 mb-4" aria-hidden>
          <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: 999, background: "var(--mars-rust)" }} />
          <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: 999, background: "var(--mars-rust)" }} />
          <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: 999, background: "var(--mars-rust)" }} />
        </div>
        <div className="font-display text-cream text-[20px] font-semibold">
          {label}
        </div>
        <div className="font-mono text-[10.5px] tracking-widest uppercase text-mute mt-2">
          Ares Command · Comms uplink
        </div>
        {showFallback ? (
          <button
            data-testid="day-transition-continue-btn"
            onClick={onContinue}
            className="mt-6 font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2"
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              background: "var(--mars-rust)",
              color: "#fff",
              border: "1px solid var(--mars-rust)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Continue <ArrowRight size={14} />
          </button>
        ) : null}
      </div>
    </AppShell>
  );
}

function ReflectionInner() {
  const navigate = useNavigate();
  const currentDay = gameState.getCurrentDay();
  const day = getDay(currentDay);
  const questions = day.reflectionQuestions;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(() => gameState.getReflection(currentDay) || {});
  const [input, setInput] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const vars = useMemo(() => gameState.getVars(), [showSummary]);

  useEffect(() => {
    if (step < questions.length) setInput(answers[`q${step + 1}`] || "");
  }, [step, answers, questions.length]);

  const submit = () => {
    const next = { ...answers, [`q${step + 1}`]: input.trim() };
    setAnswers(next);
    gameState.saveReflection(currentDay, next);
    setInput("");
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setShowSummary(true);
    }
  };

  const [transitioning, setTransitioning] = useState(false);

  const handleBeginNextDay = () => {
    if (day.isFinalDay) {
      navigate("/final");
      return;
    }
    if (!day.canStartNextDay) return;
    setTransitioning(true);
    // Do the state transition inside a try so any unexpected failure doesn't leak.
    try {
      gameState.startDay(day.nextDay);
    } catch {
      /* swallow — the fallback Continue button lets the user proceed manually */
    }
    // Small delay lets the loading screen breathe; navigation happens right after.
    setTimeout(() => {
      try { navigate("/mission"); } catch { /* no-op */ }
    }, 650);
  };

  const manualContinueToMission = () => {
    try { navigate("/mission"); } catch { /* no-op */ }
    setTimeout(() => window.location.assign("/mission"), 40);
  };

  // Auto-advance to Final Summary Card on the last day, after the student has viewed the summary.
  useEffect(() => {
    if (!showSummary || !day.isFinalDay) return;
    const t = setTimeout(() => {
      navigate("/final");
    }, 6500);
    return () => clearTimeout(t);
  }, [showSummary, day.isFinalDay, navigate]);

  if (transitioning) {
    return <DayTransitioning onContinue={manualContinueToMission} />;
  }

  if (!showSummary) {
    const q = questions[step];
    return (
      <AppShell showTabs={false}>
        <div className="max-w-2xl mx-auto pt-6 pb-16" data-testid="reflection-questions">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-rust">
              Sol {String(currentDay).padStart(2, "0")} · Reflection · Question {step + 1} of {questions.length}
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--mars-line-soft)" }} />
          </div>

          <div className="mars-panel chat-in" style={{ padding: "28px 26px" }} key={step}>
            <h2
              className="font-display text-2xl md:text-3xl text-cream font-semibold leading-snug"
              data-testid={`reflection-q${step + 1}`}
            >
              {q}
            </h2>

            <textarea
              data-testid={`reflection-input-${step + 1}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Take a moment. Type honestly."
              className="w-full mt-6 text-cream text-[15px] leading-relaxed"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid var(--mars-line)",
                borderRadius: 12,
                padding: "14px 16px",
                minHeight: 130,
                outline: "none",
                resize: "vertical",
                fontFamily: "'DM Sans', sans-serif",
              }}
              rows={5}
            />

            <div className="mt-5 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest uppercase text-mute">
                Habitat time · 22:00
              </span>
              <button
                data-testid="reflection-next-btn"
                onClick={submit}
                className="font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2"
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "var(--mars-rust)",
                  color: "#fff",
                  border: "1px solid var(--mars-rust)",
                  fontSize: 12,
                }}
              >
                {step + 1 < questions.length ? "Next question" : "Show Sol summary"}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 justify-center">
            {questions.map((_, i) => (
              <span
                key={i}
                style={{
                  width: 22, height: 3, borderRadius: 999,
                  background: i <= step ? "var(--mars-rust)" : "var(--mars-line)",
                }}
              />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // Summary view
  const nextDayEnabled = day.canStartNextDay;
  return (
    <AppShell showTabs={false}>
      <div className="max-w-3xl mx-auto pt-4 pb-20" data-testid="reflection-summary">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-rust">
            Sol {String(currentDay).padStart(2, "0")} · Variable Summary
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--mars-line-soft)" }} />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-cream tracking-tight leading-[1.04]">
          Sol {String(currentDay).padStart(2, "0")} · <span className="text-rust">Debrief</span>
        </h1>
        <p className="text-sand text-[14px] mt-2 max-w-[60ch]">
          {day.isFinalDay
            ? "The final sol is complete. Here" + "'" + "s how the mission ended — and how the crew came to see you."
            : currentDay === 1
              ? "A quiet moment before the storm. Here" + "'" + "s how your first sol on Mars scored across mission systems and crew relationships."
              : "The storm has passed. Here" + "'" + "s how Sol 02 shifted the colony" + "'" + "s balance and the trust the crew places in you."}
        </p>

        {/* Stat bars */}
        <div className="mars-panel mt-6" style={{ padding: "22px 22px" }} data-testid="mission-systems">
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-dust mb-4">
            Mission Systems
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {gameState.statKeys.map((k, i) => (
              <StatBar key={k} statKey={k} value={vars[k]} delayMs={i * 90} />
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="mars-panel mt-4" style={{ padding: "22px 22px" }} data-testid="crew-relationships">
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-dust mb-4">
            Crew Relationships
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHARACTER_LIST.map((id) => {
              const v = vars[`trust_${id}`];
              const rel = relationshipLabel(v);
              return (
                <div
                  key={id}
                  data-testid={`relationship-${id}`}
                  className="flex flex-col items-center gap-2 py-3 rounded-xl"
                  style={{ background: "rgba(0,0,0,0.25)", border: "1px solid var(--mars-line-soft)" }}
                >
                  <CrewAvatar id={id} size={44} />
                  <div className="font-display font-semibold text-cream text-[13px]">
                    {CHARACTERS[id].short}
                  </div>
                  <div
                    className="font-mono text-[10px] tracking-[0.18em] uppercase"
                    style={{ color: rel.color }}
                  >
                    {rel.label} · {v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teaser (skipped on the final day) */}
        {day.teaser ? (
          <div
            className="mt-4 rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(240,182,50,0.35)",
              background: "linear-gradient(135deg, rgba(240,182,50,0.10), rgba(217,83,33,0.10))",
            }}
            data-testid="next-day-teaser"
          >
            <div className="px-5 py-4 flex items-start gap-3">
              <span
                className="font-mono text-[10px] tracking-[0.24em] uppercase"
                style={{ color: "#f0b632" }}
              >
                Incoming
              </span>
              <div className="flex-1 text-cream text-[14.5px] leading-relaxed">
                {day.teaser}
              </div>
            </div>
          </div>
        ) : null}

        {/* Begin next day OR continue to final report */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {day.isFinalDay ? (
            <button
              data-testid="continue-to-final-btn"
              onClick={handleBeginNextDay}
              className="font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2 transition-all"
              style={{
                padding: "13px 28px",
                borderRadius: 999,
                background: "linear-gradient(135deg, var(--mars-rust), #b5401b)",
                color: "#fff",
                border: "1px solid var(--mars-rust)",
                cursor: "pointer",
                fontSize: 13,
                boxShadow: "0 12px 30px -12px rgba(217,83,33,0.8)",
              }}
            >
              <Rocket size={14} />
              View Final Mission Report
            </button>
          ) : (
            <button
              data-testid={`begin-day-${day.nextDay}-btn`}
              disabled={!nextDayEnabled}
              aria-disabled={!nextDayEnabled}
              onClick={handleBeginNextDay}
              className="font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2 transition-all"
              style={{
                padding: "13px 28px",
                borderRadius: 999,
                background: nextDayEnabled
                  ? "linear-gradient(135deg, var(--mars-rust), #b5401b)"
                  : "rgba(217,83,33,0.18)",
                color: nextDayEnabled ? "#fff" : "rgba(244,232,220,0.5)",
                border: `1px solid ${nextDayEnabled ? "var(--mars-rust)" : "rgba(217,83,33,0.35)"}`,
                cursor: nextDayEnabled ? "pointer" : "not-allowed",
                fontSize: 13,
                boxShadow: nextDayEnabled ? "0 12px 30px -12px rgba(217,83,33,0.8)" : "none",
              }}
            >
              {nextDayEnabled ? <Rocket size={14} /> : <Lock size={14} />}
              {day.nextDayLabel}
            </button>
          )}
          {day.isFinalDay ? (
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mute">
              Auto-advancing in a few seconds…
            </span>
          ) : !nextDayEnabled ? (
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mute">
              Sol {String(day.nextDay).padStart(2, "0")} unlocks in Stage 3
            </span>
          ) : (
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mute">
              All variables & crew trust carry forward
            </span>
          )}
        </div>
      </div>
    </AppShell>
  );
}
