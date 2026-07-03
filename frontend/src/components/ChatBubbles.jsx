import React from "react";
import { CrewAvatar } from "@/components/CrewAvatar";
import { CHARACTERS } from "@/data/characters";

export function CharBubble({ from, text }) {
  const c = CHARACTERS[from] || { name: from, hue: "#888", short: from };
  return (
    <div className="chat-in flex items-start gap-3 py-1.5" data-testid={`msg-${from}`}>
      <CrewAvatar id={from} size={32} />
      <div className="max-w-[85%]">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-display font-semibold text-[13px]" style={{ color: c.hue }}>
            {c.short}
          </span>
          <span className="font-mono text-[10px] tracking-widest uppercase text-mute">
            {c.role}
          </span>
        </div>
        <div
          className="text-[14.5px] leading-relaxed text-cream"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--mars-line-soft)",
            padding: "9px 13px",
            borderRadius: "4px 14px 14px 14px",
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

export function ChoiceBubble({ text, internName }) {
  return (
    <div className="chat-in flex justify-end py-1.5" data-testid="msg-you">
      <div className="max-w-[85%]">
        <div className="flex items-baseline gap-2 justify-end mb-0.5">
          <span className="font-mono text-[10px] tracking-widest uppercase text-mute">
            Habitat Intern
          </span>
          <span className="font-display font-semibold text-[13px] text-dust">
            {internName || "You"}
          </span>
        </div>
        <div
          className="text-[14.5px] leading-relaxed"
          style={{
            background: "linear-gradient(135deg, var(--mars-rust) 0%, #b5401b 100%)",
            color: "#fff5ee",
            padding: "9px 13px",
            borderRadius: "14px 4px 14px 14px",
            boxShadow: "0 6px 20px -8px rgba(217,83,33,0.6)",
          }}
        >
          {'"'}{text}{'"'}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator({ from }) {
  const c = CHARACTERS[from] || { hue: "#888", short: from };
  return (
    <div className="flex items-start gap-3 py-1.5" data-testid={`typing-${from}`}>
      <CrewAvatar id={from} size={32} />
      <div
        style={{
          padding: "10px 14px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--mars-line-soft)",
          borderRadius: "4px 14px 14px 14px",
          display: "inline-flex", alignItems: "center", gap: 4,
        }}
      >
        <span className="blink-dot" style={{ width: 5, height: 5, borderRadius: 999, background: c.hue }} />
        <span className="blink-dot" style={{ width: 5, height: 5, borderRadius: 999, background: c.hue }} />
        <span className="blink-dot" style={{ width: 5, height: 5, borderRadius: 999, background: c.hue }} />
      </div>
    </div>
  );
}

export function SceneHeader({ header }) {
  return (
    <div className="chat-in my-4 flex items-center gap-3" data-testid="scene-header">
      <div className="flex-1 h-px" style={{ background: "var(--mars-line-soft)" }} />
      <div
        className="font-mono text-[10.5px] tracking-[0.24em] uppercase px-3 py-1.5 rounded-full"
        style={{ border: "1px solid var(--mars-line-soft)", color: "var(--mars-dust)", background: "rgba(0,0,0,0.35)" }}
      >
        {header.location}
        {header.sol ? <span className="text-mute"> · Sol {String(header.sol).padStart(2, "0")}</span> : null}
        {header.time ? <span className="text-mute"> · {header.time}</span> : null}
      </div>
      <div className="flex-1 h-px" style={{ background: "var(--mars-line-soft)" }} />
    </div>
  );
}

export function InlineAlert({ alert }) {
  const color =
    alert.priority === "CRITICAL" ? "#e14b3a"
    : alert.priority === "WARNING" ? "#f0b632"
    : "#5ab070";
  return (
    <div
      data-testid="inline-alert"
      className="chat-in my-3"
      style={{
        padding: "12px 14px",
        border: `1px solid ${color}66`,
        background: `${color}12`,
        borderRadius: 10,
        display: "flex", gap: 12, alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 18, lineHeight: "18px", color }}>{alert.icon || "⚠"}</span>
      <div>
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase" style={{ color }}>
          {alert.title}
        </div>
        <div className="text-[13.5px] text-cream mt-1 leading-snug">{alert.body}</div>
      </div>
    </div>
  );
}
