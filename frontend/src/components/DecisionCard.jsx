import React, { useRef, useState } from "react";

const EFFECT_LABELS = {
  leadership: "Leadership",
  engineering: "Engineering",
  science: "Science",
  power: "Power",
  habitat_integrity: "Habitat Integrity",
  crew_morale: "Crew Morale",
  trust_elena: "Elena",
  trust_arjun: "Arjun",
  trust_meera: "Meera",
  trust_leo: "Leo",
};

function EffectChip({ k, v }) {
  const isTrust = k.startsWith("trust_");
  const positive = v > 0;
  const color = positive ? "#5ab070" : "#e14b3a";
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 10, letterSpacing: "0.06em",
        padding: "2px 6px", borderRadius: 4,
        border: `1px solid ${color}55`,
        background: `${color}12`,
        color,
        display: "inline-flex", alignItems: "center", gap: 4,
      }}
    >
      <span style={{ textTransform: isTrust ? "none" : "uppercase" }}>{EFFECT_LABELS[k] || k}</span>
      <span>{positive ? `+${v}` : v}</span>
    </span>
  );
}

export function DecisionCard({ decision, onChoose }) {
  const [locked, setLocked] = useState(false);
  // Ref-based synchronous guard — prevents double-tap even if two events fire before React re-renders.
  const lockedRef = useRef(false);

  const pick = (opt) => {
    if (lockedRef.current) return;
    lockedRef.current = true;
    setLocked(true);
    onChoose(opt);
  };

  return (
    <div
      data-testid={`decision-card-${decision.id}`}
      className="mars-panel chat-in"
      style={{ padding: "18px 18px", marginTop: 8 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-rust">
          Decision Required
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-mute">
          {decision.id}
        </span>
      </div>
      <div className="font-display text-[17px] md:text-[18px] font-semibold text-cream leading-snug mb-4">
        {decision.prompt}
      </div>

      <div className="grid gap-2.5">
        {decision.options.map((opt) => (
          <button
            key={opt.id}
            data-testid={`decision-${decision.id}-option-${opt.id}`}
            onClick={() => pick(opt)}
            disabled={locked}
            className="text-left group transition-all"
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              background: "rgba(0,0,0,0.25)",
              border: "1px solid var(--mars-line-soft)",
              color: "var(--mars-cream)",
              cursor: locked ? "not-allowed" : "pointer",
              opacity: locked ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!locked) {
                e.currentTarget.style.borderColor = "var(--mars-rust)";
                e.currentTarget.style.background = "rgba(217,83,33,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--mars-line-soft)";
              e.currentTarget.style.background = "rgba(0,0,0,0.25)";
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="font-display font-bold"
                style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: "var(--mars-rust)",
                  color: "#fff",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0,
                }}
              >
                {opt.id}
              </span>
              <div className="flex-1">
                <div className="text-[15px] font-medium">{'"'}{opt.label}{'"'}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {Object.entries(opt.effects).map(([k, v]) => (
                    <EffectChip key={k} k={k} v={v} />
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
