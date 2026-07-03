import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { SessionGate } from "@/components/SessionGate";
import { CrewAvatar } from "@/components/CrewAvatar";
import { CHARACTERS, CHARACTER_LIST } from "@/data/characters";
import { gameState } from "@/lib/gameState";
import { ArrowLeft } from "lucide-react";

export default function DMs() {
  return (
    <SessionGate>
      <DMsInner />
    </SessionGate>
  );
}

function DMsInner() {
  const navigate = useNavigate();
  const [dms, setDms] = useState(() => gameState.getDMs());
  const [active, setActive] = useState(() => {
    const cur = gameState.getDMs();
    const withUnread = CHARACTER_LIST.find((c) => (cur[c] || []).some((m) => m.unread));
    return withUnread || CHARACTER_LIST[0];
  });
  // Mobile: null = show thread list; otherwise the character id whose thread is open full-screen.
  const [mobileOpen, setMobileOpen] = useState(null);

  useEffect(() => {
    gameState.markRead(active);
    setDms(gameState.getDMs());
  }, [active]);

  const openThread = (id) => {
    setActive(id);
    setMobileOpen(id);
  };
  const closeMobile = () => setMobileOpen(null);

  const threads = dms;

  return (
    <AppShell>
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <div>
          <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-rust">Direct Messages</div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-cream tracking-tight leading-tight mt-1">
            Private crew comms
          </h1>
          <p className="text-sand text-[13.5px] mt-1">One-to-one messages from the Ares One crew. Read-only.</p>
        </div>
        <button
          data-testid="back-to-mission"
          onClick={() => navigate("/mission")}
          className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-[11px] tracking-widest uppercase text-sand hover:text-cream transition-colors"
          style={{ border: "1px solid var(--mars-line-soft)" }}
        >
          <ArrowLeft size={13} /> Return to Mission Chat
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
        {/* Threads list */}
        <aside className="mars-panel" style={{ padding: 10 }} data-testid="dm-threads">
          <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-mute px-2 py-2">
            Crew · 04
          </div>
          <ul className="flex flex-col gap-1">
            {CHARACTER_LIST.map((id) => {
              const c = CHARACTERS[id];
              const arr = threads[id] || [];
              const last = arr[arr.length - 1];
              const unread = arr.some((m) => m.unread);
              const isActive = id === active;
              return (
                <li key={id}>
                  <button
                    data-testid={`dm-thread-${id}`}
                    onClick={() => openThread(id)}
                    className="w-full text-left flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors"
                    style={{
                      background: isActive ? "rgba(217,83,33,0.10)" : "transparent",
                      border: `1px solid ${isActive ? "rgba(217,83,33,0.4)" : "transparent"}`,
                    }}
                  >
                    <CrewAvatar id={id} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-[13.5px] text-cream">
                          {c.name}
                        </span>
                        {unread ? (
                          <span
                            data-testid={`dm-unread-${id}`}
                            style={{
                              width: 7, height: 7, borderRadius: 999,
                              background: "var(--mars-rust)",
                              boxShadow: "0 0 8px var(--mars-rust)",
                            }}
                          />
                        ) : null}
                      </div>
                      <div className="text-[11.5px] text-mute truncate">
                        {last ? last.text : "No messages yet."}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Thread panel — hidden on mobile (uses full-screen overlay below) */}
        <section
          className="mars-panel hidden md:block"
          style={{ padding: 0, minHeight: 380 }}
          data-testid={`dm-panel-${active}`}
        >
          <ThreadPanel
            active={active}
            messages={threads[active] || []}
          />
        </section>
      </div>

      {/* Mobile full-screen overlay */}
      {mobileOpen ? (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col"
          data-testid="dm-mobile-overlay"
          style={{ background: "var(--mars-void)" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: "1px solid var(--mars-line-soft)", background: "rgba(23,16,12,0.95)" }}
          >
            <button
              data-testid="dm-mobile-back"
              onClick={closeMobile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10.5px] tracking-widest uppercase text-sand"
              style={{ border: "1px solid var(--mars-line-soft)" }}
            >
              <ArrowLeft size={12} /> Back
            </button>
            <div className="flex-1" />
            <button
              onClick={() => navigate("/mission")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10.5px] tracking-widest uppercase text-sand"
              style={{ border: "1px solid var(--mars-line-soft)" }}
              data-testid="dm-mobile-return-mission"
            >
              To Mission
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ThreadPanel active={mobileOpen} messages={threads[mobileOpen] || []} />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}

function ThreadPanel({ active, messages }) {
  return (
    <div>
      <header
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid var(--mars-line-soft)" }}
      >
        <CrewAvatar id={active} size={40} />
        <div>
          <div className="font-display font-semibold text-cream text-[15px]">
            {CHARACTERS[active].name}
          </div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-mute">
            {CHARACTERS[active].role} · Ares One
          </div>
        </div>
      </header>
      <div className="p-5 flex flex-col gap-3">
        {messages.length === 0 ? (
          <div className="font-mono text-[11px] tracking-widest uppercase text-mute py-6 text-center">
            No messages from {CHARACTERS[active].short} yet.
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="flex items-start gap-3" data-testid={`dm-msg-${active}-${i}`}>
              <CrewAvatar id={active} size={28} />
              <div
                className="text-[14px] leading-relaxed text-cream"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--mars-line-soft)",
                  padding: "10px 13px",
                  borderRadius: "4px 14px 14px 14px",
                  maxWidth: "90%",
                }}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
