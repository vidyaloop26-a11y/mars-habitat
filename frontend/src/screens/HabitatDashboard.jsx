import React, { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PriorityBadge } from "@/components/PriorityBadge";
import { gameState } from "@/lib/gameState";
import { Radio, Cpu, FlaskConical, Rocket, ClipboardList } from "lucide-react";

const CATEGORY_META = {
  // Category badge colours — per Stage 4 spec.
  "Engineering Log": { icon: Cpu,           color: "#ea7c2c" }, // orange
  "System Alert":    { icon: Radio,         color: "#d63c2f" }, // red
  "Science Report":  { icon: FlaskConical,  color: "#3fa8a8" }, // teal
  "Rover Comms":     { icon: Rocket,        color: "#5b9bd5" }, // blue
  "Mission Report":  { icon: ClipboardList, color: "#4a6fa5" }, // navy
};

export default function HabitatDashboard() {
  const [feed, setFeed] = useState(() => gameState.getFeed());
  useEffect(() => {
    // Mark feed as read on mount so the tab badge clears.
    gameState.markFeedRead();
    // refresh every 1.2s (in case Mission Chat pushes new items)
    const id = setInterval(() => setFeed(gameState.getFeed()), 1200);
    return () => clearInterval(id);
  }, []);

  return (
    <AppShell>
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-rust">Habitat Dashboard</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-cream tracking-tight leading-tight mt-1">
            Live habitat feed
          </h1>
          <p className="text-sand text-[13.5px] mt-1">Read-only telemetry from Ares Habitat One systems.</p>
        </div>
        <div className="hidden sm:block mars-chip" data-testid="feed-count">
          {feed.length} entries
        </div>
      </div>

      {feed.length === 0 ? (
        <div className="mars-panel" style={{ padding: 28, textAlign: "center" }}>
          <div className="font-mono text-[11px] tracking-widest uppercase text-mute">
            No telemetry yet. Return to Mission Chat and continue the sol.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3" data-testid="feed-list">
          {feed.map((item, i) => {
            const meta = CATEGORY_META[item.category] || { icon: Radio, color: "#e8a678" };
            const Icon = meta.icon;
            return (
              <div
                key={i}
                data-testid={`feed-item-${i}`}
                className="mars-panel"
                style={{ padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${meta.color}18`,
                    border: `1px solid ${meta.color}55`,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    color: meta.color, flexShrink: 0,
                  }}
                >
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className="font-mono"
                      data-testid={`category-badge-${item.category.replace(/\s+/g, "-").toLowerCase()}`}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "0.18rem 0.55rem",
                        fontSize: 10,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: meta.color,
                        background: `${meta.color}1a`,
                        border: `1px solid ${meta.color}55`,
                        borderRadius: 6,
                      }}
                    >
                      {item.category}
                    </span>
                    <PriorityBadge priority={item.priority} />
                    <span className="font-mono text-[10px] tracking-widest uppercase text-mute ml-auto">
                      SOL {String(item.sol || 1).padStart(2, "0")} · {item.time}
                    </span>
                  </div>
                  <div className="text-[14.5px] text-cream leading-snug">
                    {item.headline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
