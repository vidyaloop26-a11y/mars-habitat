import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LOGO_URL } from "@/lib/brand";
import { gameState } from "@/lib/gameState";
import { DOMINANT_LINES, pickDominant, FINAL_MESSAGE } from "@/data/scenes";
import { CHARACTERS, CHARACTER_LIST } from "@/data/characters";
import { CrewAvatar } from "@/components/CrewAvatar";
import { StatusBadge } from "@/components/StatusBadge";
import { RotateCcw, Sparkles } from "lucide-react";
import { SessionGate } from "@/components/SessionGate";

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

function StatBar({ statKey, value, delayMs = 0, highlighted }) {
  const color = STAT_COLORS[statKey] || "#e8a678";
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div data-testid={`final-stat-${statKey}`}>
      <div className="flex items-baseline justify-between mb-1.5">
        <span
          className="font-mono text-[10.5px] tracking-[0.16em] uppercase"
          style={{ color: highlighted ? color : "var(--mars-sand)" }}
        >
          {STAT_LABELS[statKey]}
          {highlighted ? " · dominant" : ""}
        </span>
        <span className="font-display font-semibold text-[15px]" style={{ color }}>
          {pct}
        </span>
      </div>
      <div
        style={{
          height: 8, borderRadius: 999,
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${highlighted ? color + "88" : "var(--mars-line-soft)"}`,
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

export default function FinalSummary() {
  return (
    <SessionGate>
      <FinalSummaryInner />
    </SessionGate>
  );
}

function FinalSummaryInner() {
  const navigate = useNavigate();
  const vars = useMemo(() => gameState.getVars(), []);
  const name = gameState.getName();
  const dominant = useMemo(() => pickDominant(vars), [vars]);
  const dominantLine = DOMINANT_LINES[dominant];

  useEffect(() => {
    // Sanity: keep the reset button predictable.
  }, []);

  const startOver = () => {
    // Confirm: clears all sessionStorage and returns cleanly to onboarding.
    try {
      gameState.resetAll();
      // Belt-and-suspenders: nuke any remaining mhe_ keys defensively.
      const remaining = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith("mhe_")) remaining.push(k);
      }
      remaining.forEach((k) => sessionStorage.removeItem(k));
    } catch { /* no-op */ }
    // Hard reload to onboarding so every screen re-reads a fresh session.
    window.location.assign("/");
  };

  return (
    <div className="min-h-screen relative" style={{ zIndex: 2 }} data-testid="final-summary">
      {/* Header — logo top-left, same as onboarding */}
      <header
        className="sticky top-0 z-20 backdrop-blur-md"
        style={{
          background: "linear-gradient(180deg, rgba(23,16,12,0.92), rgba(23,16,12,0.72))",
          borderBottom: "1px solid var(--mars-line-soft)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-md p-1.5"
              style={{ background: "rgba(255,255,255,0.96)", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}
            >
              <img src={LOGO_URL} alt="Vidyaloop" style={{ width: 30, height: 30, objectFit: "contain" }} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[13px] font-semibold tracking-widest text-cream uppercase">
                Ares Habitat One
              </span>
              <span className="font-mono text-[10px] tracking-widest text-mute uppercase">
                Mission Complete · Sol 03
              </span>
            </div>
          </div>
          <div className="flex-1" />
          <StatusBadge status="NOMINAL" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-24 relative">
        {/* Sparkle header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.34em] uppercase text-rust">
            Final Mission Report · {name || "Habitat Intern"}
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--mars-line-soft)" }} />
        </div>

        {/* Dominant callout */}
        <div
          className="relative overflow-hidden rounded-3xl"
          style={{
            background:
              `radial-gradient(600px 300px at 90% 10%, ${STAT_COLORS[dominant]}22, transparent 65%),` +
              " linear-gradient(160deg, var(--mars-panel-hi), var(--mars-panel))",
            border: `1px solid ${STAT_COLORS[dominant]}55`,
            padding: "34px 30px",
          }}
          data-testid="dominant-callout"
        >
          <div
            className="font-mono text-[10px] tracking-[0.32em] uppercase"
            style={{ color: STAT_COLORS[dominant] }}
          >
            Signature Skill · {STAT_LABELS[dominant]}
          </div>
          <h1
            data-testid="dominant-line"
            className="font-display text-2xl sm:text-3xl md:text-[34px] leading-[1.2] mt-3 text-cream"
            style={{ maxWidth: "48ch" }}
          >
            {dominantLine}
          </h1>
          <div className="mt-5 inline-flex items-center gap-2 mars-chip">
            <Sparkles size={12} style={{ color: STAT_COLORS[dominant] }} /> Highest final score: {vars[dominant]}
          </div>
        </div>

        {/* All 6 stat bars */}
        <div className="mars-panel mt-4" style={{ padding: "22px 22px" }}>
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-dust mb-4">
            Final Mission Systems
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {gameState.statKeys.map((k, i) => (
              <StatBar key={k} statKey={k} value={vars[k]} delayMs={i * 90} highlighted={k === dominant} />
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mars-panel mt-4" style={{ padding: "22px 22px" }}>
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-dust mb-4">
            Crew Trust · Sol 03
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHARACTER_LIST.map((id) => {
              const v = vars[`trust_${id}`];
              const rel = relationshipLabel(v);
              return (
                <div
                  key={id}
                  data-testid={`final-relationship-${id}`}
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

        {/* Final message */}
        <div
          className="mt-6 rounded-2xl overflow-hidden"
          data-testid="final-message"
          style={{
            border: "1px solid rgba(217,83,33,0.35)",
            background: "linear-gradient(135deg, rgba(217,83,33,0.10), rgba(232,166,120,0.06))",
            padding: "26px 26px",
          }}
        >
          <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-rust mb-3">
            Colony Log · Final Entry
          </div>
          <p className="text-cream text-[15.5px] leading-[1.7]" style={{ maxWidth: "68ch" }}>
            {FINAL_MESSAGE}
          </p>
        </div>

        {/* Start Over */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <button
            data-testid="start-over-btn"
            onClick={startOver}
            className="font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2"
            style={{
              padding: "13px 30px",
              borderRadius: 999,
              background: "var(--mars-rust)",
              color: "#fff",
              border: "1px solid var(--mars-rust)",
              fontSize: 13,
              cursor: "pointer",
              boxShadow: "0 12px 30px -12px rgba(217,83,33,0.8)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ee7043")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--mars-rust)")}
          >
            <RotateCcw size={14} />
            Start Over
          </button>
          <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-mute">
            Wipes session · returns to onboarding
          </span>
        </div>

        <footer className="mt-12 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-mute">
            Mars Habitat Engineering — Stage 3 · Vidyaloop Learning and Innovation Labs
          </p>
        </footer>
      </main>
    </div>
  );
}
