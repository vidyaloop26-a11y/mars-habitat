import React from "react";

const STYLES = {
  CRITICAL: { c: "#e14b3a", bg: "rgba(225,75,58,0.14)", b: "rgba(225,75,58,0.5)" },
  WARNING:  { c: "#f0b632", bg: "rgba(240,182,50,0.14)", b: "rgba(240,182,50,0.5)" },
  NOMINAL:  { c: "#5ab070", bg: "rgba(90,176,112,0.14)", b: "rgba(90,176,112,0.5)" },
};

export function PriorityBadge({ priority = "NOMINAL" }) {
  const s = STYLES[priority] || STYLES.NOMINAL;
  return (
    <span
      className="font-mono"
      data-testid={`priority-badge-${priority.toLowerCase()}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.35rem",
        padding: "0.15rem 0.5rem",
        fontSize: "10px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: s.c, background: s.bg, border: `1px solid ${s.b}`,
        borderRadius: 6,
      }}
    >
      {priority}
    </span>
  );
}
