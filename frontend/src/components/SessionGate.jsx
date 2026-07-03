import React from "react";
import { useNavigate } from "react-router-dom";
import { LOGO_URL } from "@/lib/brand";
import { gameState } from "@/lib/gameState";
import { AlertTriangle, RotateCcw } from "lucide-react";

/**
 * SessionGate — wraps any route that requires an active mission.
 * If sessionStorage is missing an intern name, we show the "Mission interrupted."
 * screen instead of a broken/empty state.
 */
export function SessionGate({ children }) {
  const hasSession = (gameState.getName() || "").length > 0;
  if (hasSession) return children;
  return <SessionInterrupted />;
}

export function SessionInterrupted() {
  const navigate = useNavigate();
  const restart = () => {
    try { gameState.resetAll(); } catch { /* no-op */ }
    navigate("/", { replace: true });
    // Hard reload as a belt-and-suspenders: forces every screen to re-read fresh state.
    setTimeout(() => window.location.assign("/"), 20);
  };

  return (
    <div className="min-h-screen relative flex flex-col" style={{ zIndex: 2 }} data-testid="session-interrupted">
      {/* Header — logo top-left, same shape as onboarding */}
      <header
        className="sticky top-0 z-20 backdrop-blur-md"
        style={{
          background: "linear-gradient(180deg, rgba(23,16,12,0.92), rgba(23,16,12,0.72))",
          borderBottom: "1px solid var(--mars-line-soft)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="rounded-md p-1.5"
              style={{ background: "rgba(255,255,255,0.96)", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}
            >
              <img src={LOGO_URL} alt="Vidyaloop" style={{ width: 30, height: 30, objectFit: "contain" }} />
            </div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-mute">
              Ares Habitat One
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 md:px-6 py-10">
        <div className="mars-panel w-full max-w-md" style={{ padding: "34px 28px", textAlign: "center" }}>
          <div
            className="mx-auto mb-5 inline-flex items-center justify-center rounded-full"
            style={{
              width: 54, height: 54,
              background: "rgba(225,75,58,0.12)",
              border: "1px solid rgba(225,75,58,0.45)",
              color: "#e14b3a",
            }}
          >
            <AlertTriangle size={22} />
          </div>
          <h1
            data-testid="session-interrupted-title"
            className="font-display text-3xl sm:text-4xl font-semibold text-cream leading-tight tracking-tight"
          >
            Mission interrupted.
          </h1>
          <p
            data-testid="session-interrupted-body"
            className="mt-3 text-sand text-[14.5px] leading-relaxed"
          >
            Your session ended. Please restart.
          </p>
          <button
            data-testid="restart-mission-btn"
            onClick={restart}
            className="mt-7 font-display font-semibold tracking-widest uppercase inline-flex items-center gap-2"
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              background: "var(--mars-rust)",
              color: "#fff",
              border: "1px solid var(--mars-rust)",
              fontSize: 12,
              boxShadow: "0 10px 24px -10px rgba(217,83,33,0.7)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ee7043")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--mars-rust)")}
          >
            <RotateCcw size={14} />
            Restart Mission
          </button>
        </div>
      </main>
    </div>
  );
}
