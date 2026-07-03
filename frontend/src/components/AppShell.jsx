import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LOGO_URL } from "@/lib/brand";
import { StatusBadge } from "@/components/StatusBadge";
import { gameState } from "@/lib/gameState";
import { MessageSquare, Radio, Inbox, RefreshCw } from "lucide-react";

function TabLink({ to, icon: Icon, label, badge, testId }) {
  return (
    <NavLink
      to={to}
      data-testid={testId}
      className={({ isActive }) =>
        [
          "relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-[11px] tracking-widest uppercase transition-colors",
          isActive
            ? "text-[color:var(--mars-cream)] bg-[color:var(--mars-panel-hi)] border border-[color:var(--mars-line)]"
            : "text-sand hover:text-cream border border-transparent hover:bg-[rgba(255,255,255,0.03)]",
        ].join(" ")
      }
    >
      <Icon size={13} />
      <span>{label}</span>
      {badge > 0 ? (
        <span
          data-testid={`${testId}-unread`}
          className="ml-1 inline-flex items-center justify-center rounded-full text-[10px] font-semibold"
          style={{
            minWidth: 18, height: 18, padding: "0 5px",
            background: "var(--mars-rust)", color: "#fff",
          }}
        >
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
}

export function AppShell({ children, showTabs = true, right = null }) {
  const status = gameState.getStatus();
  const dmUnread = gameState.unreadCount();
  const feedUnread = gameState.getFeedUnreadCount();
  const name = gameState.getName();
  const currentDay = gameState.getCurrentDay();
  const navigate = useNavigate();

  const handleRestart = () => {
    if (window.confirm("Restart the mission from Sol 01? All progress will be lost.")) {
      gameState.resetAll();
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen relative" style={{ zIndex: 2 }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{
          background: "linear-gradient(180deg, rgba(23,16,12,0.92), rgba(23,16,12,0.72))",
          borderBottom: "1px solid var(--mars-line-soft)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
          <a
            href="/"
            data-testid="brand-logo"
            className="flex items-center gap-3 group"
            onClick={(e) => { e.preventDefault(); navigate("/mission"); }}
          >
            <div
              className="rounded-md p-1.5"
              style={{ background: "rgba(255,255,255,0.96)", boxShadow: "0 4px 14px rgba(0,0,0,0.35)" }}
            >
              <img src={LOGO_URL} alt="Vidyaloop" style={{ width: 30, height: 30, objectFit: "contain" }} />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-[13px] font-semibold tracking-widest text-cream uppercase">
                Ares Habitat One
              </span>
              <span className="font-mono text-[10px] tracking-widest text-mute uppercase">
                Mars Habitat Engineering
              </span>
            </div>
          </a>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-3">
            <span className="mars-chip" data-testid="sol-chip">Sol {String(currentDay).padStart(2, "0")}</span>
            <StatusBadge status={status} />
          </div>

          <button
            data-testid="restart-btn"
            onClick={handleRestart}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest uppercase text-sand hover:text-cream transition-colors"
            style={{ border: "1px solid var(--mars-line-soft)" }}
            title="Restart mission"
          >
            <RefreshCw size={12} />
            Reset
          </button>
        </div>

        {showTabs && (
          <div className="max-w-6xl mx-auto px-4 md:px-6 pb-3 -mt-1">
            <div className="flex flex-wrap items-center gap-2">
              <TabLink to="/mission" icon={MessageSquare} label="Mission Chat" testId="tab-mission" />
              <TabLink to="/dashboard" icon={Radio} label="Habitat Dashboard" badge={feedUnread} testId="tab-dashboard" />
              <TabLink to="/dms" icon={Inbox} label="DMs" badge={dmUnread} testId="tab-dms" />
              <div className="flex-1" />
              {name ? (
                <span className="font-mono text-[11px] tracking-widest uppercase text-mute hidden sm:inline">
                  Intern: <span className="text-dust">{name}</span>
                </span>
              ) : null}
              {right}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 relative" style={{ zIndex: 2 }}>
        {children}
      </main>
    </div>
  );
}
