import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { gameState } from "@/lib/gameState";
import { getDay, resolveSceneMessages } from "@/data/scenes";
import { CharBubble, ChoiceBubble, TypingIndicator, SceneHeader, InlineAlert } from "@/components/ChatBubbles";
import { DecisionCard } from "@/components/DecisionCard";
import { CrewRoster } from "@/components/CrewAvatar";
import { SessionGate } from "@/components/SessionGate";
import { ArrowRight, Moon, ChevronDown } from "lucide-react";

// Idempotent log entries keyed by `_k` — StrictMode / double-effects safe.
// Types: 'header' | 'alert' | 'msg' | 'choice' | 'reaction'

const TYPING_MIN = 380;
const TYPING_MAX = 780;
const SCROLL_LOCK_THRESHOLD = 100; // px — auto-scroll only if within this distance from bottom
const rand = (a, b) => a + Math.floor(Math.random() * (b - a));

export default function MissionChat() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const isAtBottomRef = useRef(true);

  const currentDay = gameState.getCurrentDay();
  const day = getDay(currentDay);
  const scenes = day.scenes;

  // Persisted state
  const [log, setLog] = useState(() => gameState.getLog());
  const [sceneIdx, setSceneIdx] = useState(() => gameState.getSceneIdx());
  const [phase, setPhase] = useState(() => gameState.getPhase());
  const [typingFrom, setTypingFrom] = useState(null);
  const [pendingDecision, setPendingDecision] = useState(() => {
    const p = gameState.getPhase();
    const idx = gameState.getSceneIdx();
    if (p === "awaiting_decision") return scenes[idx]?.decision || null;
    return null;
  });
  const [hasNewBelow, setHasNewBelow] = useState(false);
  const [, setTick] = useState(0);

  // Persist to sessionStorage on change
  useEffect(() => { gameState.setLog(log); }, [log]);
  useEffect(() => { gameState.setSceneIdx(sceneIdx); }, [sceneIdx]);
  useEffect(() => { gameState.setPhase(phase); }, [phase]);

  // Auto-scroll fix: only auto-scroll when user is within 100px of bottom.
  // Otherwise, surface a "New message ↓" pill.
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    isAtBottomRef.current = true;
    setHasNewBelow(false);
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distance <= SCROLL_LOCK_THRESHOLD;
    isAtBottomRef.current = atBottom;
    if (atBottom) setHasNewBelow(false);
  };

  useEffect(() => {
    if (isAtBottomRef.current) {
      // Defer to allow layout to settle
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
      });
    } else {
      setHasNewBelow(true);
    }
  }, [log, typingFrom, pendingDecision, phase]);

  // Idempotent pushLog (dedupes by _k)
  const pushLog = (entry, key) => {
    setLog((prev) => (prev.some((l) => l._k === key) ? prev : [...prev, { ...entry, _k: key, ts: Date.now() }]));
  };

  // Reactive step engine — runs on every log change while playing.
  useEffect(() => {
    if (phase !== "playing") return;
    const scene = scenes[sceneIdx];
    if (!scene) {
      setPhase("end_of_day");
      return;
    }

    const hasHeader = log.some((l) => l._k === `header:${scene.id}`);
    if (!hasHeader) {
      pushLog({ type: "header", sceneId: scene.id, header: scene.header }, `header:${scene.id}`);
      if (scene.header.status) gameState.setStatus(scene.header.status);
      if (scene.statusChange) gameState.setStatus(scene.statusChange);
      setTick((t) => t + 1);
      return;
    }

    if (scene.inlineAlert) {
      const hasAlert = log.some((l) => l._k === `alert:${scene.id}`);
      if (!hasAlert) {
        const tid = setTimeout(() => {
          pushLog({ type: "alert", sceneId: scene.id, alert: scene.inlineAlert }, `alert:${scene.id}`);
          if (scene.feedItem) {
            gameState.pushFeed(scene.feedItem);
            setTick((t) => t + 1);
          }
        }, 420);
        return () => clearTimeout(tid);
      }
    }

    const msgs = resolveSceneMessages(scene, gameState.getVars());
    const playedCount = log.filter((l) => l.type === "msg" && l.sceneId === scene.id).length;

    if (playedCount < msgs.length) {
      const nextMsg = msgs[playedCount];
      const key = `msg:${scene.id}:${playedCount}`;
      const already = log.some((l) => l._k === key);
      if (already) return;

      const typingDelay = rand(TYPING_MIN, TYPING_MAX);
      const t1 = setTimeout(() => setTypingFrom(nextMsg.from), 260);
      const t2 = setTimeout(() => {
        setTypingFrom(null);
        pushLog({ type: "msg", sceneId: scene.id, from: nextMsg.from, text: nextMsg.text }, key);
      }, 260 + typingDelay);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    const t = setTimeout(() => {
      if (scene.feedItem && !scene.inlineAlert) {
        gameState.pushFeed(scene.feedItem);
        setTick((tk) => tk + 1);
      }
      if (scene.dmTrigger) {
        gameState.pushDM(scene.dmTrigger.from, scene.dmTrigger.text);
        setTick((tk) => tk + 1);
      }

      if (scene.decision) {
        setPendingDecision(scene.decision);
        setPhase("awaiting_decision");
      } else if (scene.isEndOfDay) {
        setPhase("end_of_day");
      } else {
        setPhase("awaiting_continue");
      }
    }, 500);
    return () => clearTimeout(t);
  }, [phase, sceneIdx, log, scenes]);

  const handleDecision = (option) => {
    const scene = scenes[sceneIdx];
    const decision = scene.decision;
    gameState.applyEffects(option.effects);
    gameState.recordDecision(decision.id, option.id);
    pushLog(
      { type: "choice", sceneId: scene.id, text: option.label, decisionId: decision.id, optionId: option.id },
      `choice:${decision.id}`
    );
    setPendingDecision(null);
    setPhase("playing_reactions");

    let cumulative = 400;
    option.reactions.forEach((r, ri) => {
      const typingDelay = rand(TYPING_MIN, TYPING_MAX);
      setTimeout(() => setTypingFrom(r.from), cumulative);
      cumulative += typingDelay;
      setTimeout(() => {
        setTypingFrom(null);
        pushLog(
          { type: "reaction", sceneId: scene.id, from: r.from, text: r.text },
          `reaction:${decision.id}:${option.id}:${ri}`
        );
      }, cumulative);
      cumulative += 380;
    });
    setTimeout(() => {
      setPhase(scene.isEndOfDay ? "end_of_day" : "awaiting_continue");
    }, cumulative + 350);
  };

  const handleContinue = () => {
    setSceneIdx((i) => i + 1);
    setPhase("playing");
  };

  const handleEndDay = () => navigate("/reflection");

  const renderEntry = (entry, i) => {
    switch (entry.type) {
      case "header":   return <SceneHeader key={entry._k || i} header={entry.header} />;
      case "alert":    return <InlineAlert key={entry._k || i} alert={entry.alert} />;
      case "msg":      return <CharBubble key={entry._k || i} from={entry.from} text={entry.text} />;
      case "reaction": return <CharBubble key={entry._k || i} from={entry.from} text={entry.text} />;
      case "choice":   return <ChoiceBubble key={entry._k || i} text={entry.text} internName={gameState.getName()} />;
      default: return null;
    }
  };

  return (
    <SessionGate>
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        <section className="mars-panel overflow-hidden flex flex-col relative" style={{ minHeight: "70vh" }} data-testid="mission-chat">
          <div
            className="px-5 py-3 flex items-center gap-3"
            style={{ borderBottom: "1px solid var(--mars-line-soft)", background: "rgba(0,0,0,0.2)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="font-display text-cream text-[15px] font-semibold tracking-wide">
                Crew Comms · Ares One
              </div>
              <div className="font-mono text-[10px] tracking-widest text-mute uppercase">
                Sol {String(currentDay).padStart(2, "0")} · live channel · encrypted
              </div>
            </div>
            <span className="mars-chip" data-testid="scene-progress">
              Scene {Math.min(sceneIdx + 1, scenes.length)} / {scenes.length}
            </span>
          </div>

          <div
            ref={scrollRef}
            onScroll={onScroll}
            className="flex-1 overflow-y-auto px-5 py-4"
            data-testid="chat-scroll"
          >
            {log.length === 0 && phase === "playing" && !typingFrom ? (
              <div className="font-mono text-[11px] tracking-widest uppercase text-mute py-8 text-center">
                establishing comms link…
              </div>
            ) : null}
            {log.map(renderEntry)}
            {typingFrom ? <TypingIndicator from={typingFrom} /> : null}

            {phase === "awaiting_decision" && pendingDecision ? (
              <div className="mt-3">
                <DecisionCard decision={pendingDecision} onChoose={handleDecision} />
              </div>
            ) : null}

            {phase === "awaiting_continue" ? (
              <div className="chat-in mt-5 flex justify-center">
                <button
                  data-testid="continue-btn"
                  onClick={handleContinue}
                  className="font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2 transition-all"
                  style={{
                    padding: "10px 18px", borderRadius: 999,
                    background: "var(--mars-rust)", color: "#fff",
                    border: "1px solid var(--mars-rust)", fontSize: 12,
                    boxShadow: "0 10px 24px -10px rgba(217,83,33,0.7)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ee7043")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--mars-rust)")}
                >
                  Continue <ArrowRight size={14} />
                </button>
              </div>
            ) : null}

            {phase === "end_of_day" ? (
              <div className="chat-in mt-6 flex flex-col items-center gap-3">
                <div className="font-mono text-[10.5px] tracking-[0.28em] uppercase text-dust">
                  End of Sol {String(currentDay).padStart(2, "0")} · Habitat lights dimming
                </div>
                <button
                  data-testid="end-sol-btn"
                  onClick={handleEndDay}
                  className="font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2"
                  style={{
                    padding: "12px 22px", borderRadius: 999,
                    background: "linear-gradient(135deg, var(--mars-rust), #b5401b)",
                    color: "#fff", border: "1px solid var(--mars-rust)", fontSize: 13,
                    boxShadow: "0 12px 30px -12px rgba(217,83,33,0.8)",
                  }}
                >
                  <Moon size={14} /> Enter Sol {String(currentDay).padStart(2, "0")} Reflection
                </button>
              </div>
            ) : null}
          </div>

          {/* Floating "New message ↓" pill — appears when user has scrolled up */}
          {hasNewBelow ? (
            <button
              data-testid="new-message-pill"
              onClick={scrollToBottom}
              className="absolute font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2"
              style={{
                bottom: 18, left: "50%", transform: "translateX(-50%)",
                padding: "8px 14px",
                borderRadius: 999,
                background: "rgba(217,83,33,0.95)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                fontSize: 11,
                boxShadow: "0 10px 28px -6px rgba(0,0,0,0.6)",
                cursor: "pointer",
                zIndex: 20,
              }}
            >
              New message <ChevronDown size={14} />
            </button>
          ) : null}
        </section>

        <aside className="hidden lg:flex flex-col gap-4">
          <div className="mars-panel" style={{ padding: 16 }}>
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-dust mb-3">
              Crew Aboard · Sol {String(currentDay).padStart(2, "0")}
            </div>
            <CrewRoster activeId={typingFrom} className="justify-between" />
          </div>

          <div className="mars-panel" style={{ padding: 16 }}>
            <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-dust mb-2">Mission Ops</div>
            <ul className="text-[12.5px] text-sand space-y-1.5">
              <li>· Read every alert on the Dashboard.</li>
              <li>· Check DMs — the crew talks to you privately.</li>
              <li>· Every decision compounds. Choose deliberately.</li>
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
    </SessionGate>
  );
}
