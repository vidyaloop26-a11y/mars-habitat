import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOGO_URL } from "@/lib/brand";
import { gameState, DEFAULT_VARS } from "@/lib/gameState";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowRight, Clock, MapPin, User, Users } from "lucide-react";

const GRID_ITEMS = [
  { icon: Clock, label: "Duration", value: "3 Sols" },
  { icon: MapPin, label: "Location", value: "Ares Habitat One, Mars" },
  { icon: User, label: "Role", value: "Habitat Engineering Intern" },
  { icon: Users, label: "Team", value: "Cmdr. Elena Rao · Dr. Arjun Sen · Dr. Meera Kapoor · Leo Fernandes" },
];

const BRIEFING = `Humanity has established its first permanent settlement on Mars: Ares Habitat One. After years of robotic missions and unmanned testing, four specialists now live and work on the Martian surface, building the infrastructure that will let humans call this planet home. You have been selected as a Habitat Engineering Intern. Over the next three sols, your decisions will affect oxygen levels, power generation, habitat integrity, and crew morale. Every choice has a trade-off. Every system depends on the last. Mars doesn't forgive mistakes. Let's make sure we don't make any.`;

export default function Onboarding() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => gameState.getName());
  const disabled = name.trim().length === 0;

  useEffect(() => {
    // Ensure fresh defaults if user never started
    if (!sessionStorage.getItem(gameState.keys.vars)) {
      gameState.setVars({ ...DEFAULT_VARS });
    }
    if (!sessionStorage.getItem(gameState.keys.status)) {
      gameState.setStatus("NOMINAL");
    }
  }, []);

  const begin = () => {
    if (disabled) return;
    gameState.setName(name.trim());
    if (!sessionStorage.getItem(gameState.keys.vars)) gameState.setVars({ ...DEFAULT_VARS });
    if (!sessionStorage.getItem(gameState.keys.status)) gameState.setStatus("NOMINAL");
    // startDay(1) fires the four trust-gated Sol 1 DMs.
    gameState.startDay(1);
    navigate("/mission");
  };

  return (
    <div className="min-h-screen relative" style={{ zIndex: 2 }}>
      {/* Header: logo top-left across ALL screens */}
      <header
        className="sticky top-0 z-20 backdrop-blur-md"
        style={{
          background: "linear-gradient(180deg, rgba(23,16,12,0.92), rgba(23,16,12,0.72))",
          borderBottom: "1px solid var(--mars-line-soft)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-md p-1.5"
              style={{ background: "rgba(255,255,255,0.96)", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}
            >
              <img src={LOGO_URL} alt="Vidyaloop" style={{ width: 30, height: 30, objectFit: "contain" }} data-testid="onboarding-logo" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-[13px] font-semibold tracking-widest text-cream uppercase">
                Vidyaloop
              </span>
              <span className="font-mono text-[10px] tracking-widest text-mute uppercase">
                Learning & Innovation Labs
              </span>
            </div>
          </div>
          <div className="flex-1" />
          <StatusBadge status="NOMINAL" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-24 relative">
        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-rust">Mission Brief · Stage 01</span>
          <div className="flex-1 h-px" style={{ background: "var(--mars-line-soft)" }} />
        </div>

        <h1
          data-testid="onboarding-title"
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-[1.02] tracking-tight"
        >
          ARES <span style={{ color: "var(--mars-rust)" }}>HABITAT</span> ONE
        </h1>
        <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-dust mt-3">
          Mars Habitat Engineering — a 3-Sol internship simulation
        </p>

        {/* 4-item grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8" data-testid="onboarding-grid">
          {GRID_ITEMS.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="mars-panel"
              style={{ padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 14 }}
            >
              <div
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(217,83,33,0.14)",
                  border: "1px solid rgba(217,83,33,0.4)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: "var(--mars-rust)", flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-mute">{label}</div>
                <div className="text-[14.5px] mt-1 text-cream leading-snug">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Briefing text */}
        <div className="mars-panel mt-6 relative" style={{ padding: "22px 22px" }} data-testid="onboarding-briefing">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-rust">Mission Briefing</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-mute">// classified</span>
          </div>
          <p className="text-[15px] leading-[1.7] text-cream" style={{ maxWidth: "72ch" }}>
            {BRIEFING}
          </p>
        </div>

        {/* Name + begin */}
        <div
          className="mt-6 mars-panel"
          style={{ padding: "22px 22px" }}
        >
          <label
            htmlFor="intern-name"
            className="font-mono text-[10px] tracking-[0.24em] uppercase text-dust block"
          >
            Enter your name to join the colony
          </label>
          <div className="mt-3 flex flex-col md:flex-row gap-3 md:items-center">
            <input
              id="intern-name"
              data-testid="onboarding-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") begin(); }}
              placeholder="e.g. Kavya Menon"
              className="flex-1 font-display text-[18px] text-cream"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid var(--mars-line)",
                borderRadius: 10,
                padding: "12px 14px",
                outline: "none",
              }}
              maxLength={40}
              autoFocus
            />
            <button
              data-testid="begin-mission-btn"
              onClick={begin}
              disabled={disabled}
              className="font-display font-semibold tracking-widest uppercase transition-all"
              style={{
                padding: "12px 22px",
                borderRadius: 10,
                background: disabled ? "rgba(217,83,33,0.25)" : "var(--mars-rust)",
                color: disabled ? "rgba(255,255,255,0.5)" : "#fff",
                border: "1px solid var(--mars-rust)",
                cursor: disabled ? "not-allowed" : "pointer",
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: disabled ? "none" : "0 10px 24px -10px rgba(217,83,33,0.7)",
                fontSize: 13,
              }}
              onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "#ee7043"; }}
              onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.background = "var(--mars-rust)"; }}
            >
              Begin Mission
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="font-mono text-[10.5px] tracking-widest uppercase text-mute mt-3">
            Ares Command · Comms encrypted · Sol 01 pending
          </p>
        </div>

        <footer className="mt-10 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-mute">
            Mars Habitat Engineering — Stage 1 · Vidyaloop Learning and Innovation Labs
          </p>
        </footer>
      </main>
    </div>
  );
}
