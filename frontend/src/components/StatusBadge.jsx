import React from "react";

// Habitat status: NOMINAL | ELEVATED RISK | CRITICAL | RECOVERING
const STATUS_STYLES = {
  NOMINAL: { color: "#5ab070", bg: "rgba(90,176,112,0.12)", border: "rgba(90,176,112,0.45)" },
  "ELEVATED RISK": { color: "#f0b632", bg: "rgba(240,182,50,0.12)", border: "rgba(240,182,50,0.45)" },
  CRITICAL: { color: "#e14b3a", bg: "rgba(225,75,58,0.12)", border: "rgba(225,75,58,0.45)" },
  RECOVERING: { color: "#5b9bd5", bg: "rgba(91,155,213,0.12)", border: "rgba(91,155,213,0.45)" },
};

export function StatusBadge({ status = "NOMINAL", size = "sm" }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.NOMINAL;
  const pad = size === "lg" ? "0.35rem 0.75rem" : "0.22rem 0.6rem";
  const fs = size === "lg" ? "12px" : "10.5px";
  return (
    <span
      data-testid={`status-badge-${status.replace(/\s+/g, "-").toLowerCase()}`}
      className="font-mono"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: pad,
        fontSize: fs,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 999,
      }}
    >
      <span
        style={{
          width: 6, height: 6, borderRadius: 999,
          background: s.color,
          boxShadow: `0 0 8px ${s.color}`,
        }}
      />
      {status}
    </span>
  );
}
