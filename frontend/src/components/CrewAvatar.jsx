import React from "react";
import { CHARACTERS } from "@/data/characters";

export function CrewAvatar({ id, size = 34, ring = false }) {
  const c = CHARACTERS[id] || { initials: "??", hue: "#888", name: id };
  return (
    <div
      title={`${c.name} — ${c.role}`}
      data-testid={`avatar-${id}`}
      className="font-display"
      style={{
        width: size, height: size,
        borderRadius: 999,
        background: `linear-gradient(150deg, ${c.hue}, ${c.hue}aa 60%, #221410)`,
        color: "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: Math.round(size * 0.36),
        fontWeight: 700,
        letterSpacing: "0.02em",
        border: ring ? `2px solid ${c.hue}` : "1px solid rgba(255,255,255,0.12)",
        boxShadow: `0 0 0 2px rgba(0,0,0,0.35), 0 4px 14px ${c.hue}33`,
        flexShrink: 0,
      }}
    >
      {c.initials}
    </div>
  );
}

export function CrewRoster({ activeId, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {["elena", "arjun", "meera", "leo"].map((id) => (
        <div key={id} className="flex flex-col items-center gap-1">
          <CrewAvatar id={id} size={38} ring={activeId === id} />
          <span className="font-mono text-[9.5px] tracking-widest uppercase text-mute">
            {CHARACTERS[id].short}
          </span>
        </div>
      ))}
    </div>
  );
}
