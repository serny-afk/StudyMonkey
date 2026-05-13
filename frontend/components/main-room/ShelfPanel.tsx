"use client";

import dynamic from "next/dynamic";

const XPRadialChart = dynamic(() => import("./XPRadialChart"), { ssr: false });

interface ShelfPanelProps {
  xp: number;
  level: number;
  xpProgress: number;
  streak: number;
  todayFocusMinutes: number;
  sessionsToday: number;
  onClose: () => void;
}

export default function ShelfPanel({
  xp,
  level,
  xpProgress,
  streak,
  todayFocusMinutes,
  sessionsToday,
  onClose
}: ShelfPanelProps) {
  const xpInLevel = xp % 500;
  const xpToNext = 500 - xpInLevel;

  return (
    <div className="absolute overlay-enter" style={{ right: "22%", top: "8%", zIndex: 50, width: "300px" }}>
      <div className="surface-parchment shadow-paper-lg" style={{ borderRadius: "8px", border: "1.5px solid var(--border)", position: "relative" }}>
        <div style={{ padding: "20px 18px 18px" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display" style={{ fontSize: "17px", fontWeight: 600, color: "var(--ink)" }}>
                Progress Log
              </h2>
              <p style={{ fontSize: "11px", color: "var(--ink-light)", fontFamily: "var(--font-sans)", marginTop: "2px" }}>
                Level {level} Scholar
              </p>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: "2px 6px", fontSize: "14px" }} type="button">
              x
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4 p-3" style={{ background: "linear-gradient(135deg, rgba(61,43,31,0.05), rgba(245,166,35,0.05))", borderRadius: "8px", border: "1px solid rgba(61,43,31,0.08)" }}>
            <div style={{ flexShrink: 0, width: "72px", height: "72px" }}>
              <XPRadialChart progress={xpProgress} level={level} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display" style={{ fontSize: "22px", fontWeight: 700, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                  {xp.toLocaleString()}
                </span>
                <span style={{ fontSize: "11px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>total XP</span>
              </div>
              <div style={{ marginBottom: "4px" }}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--ink-light)" }}>Lvl {level}</span>
                  <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--ink-light)" }}>Lvl {level + 1}</span>
                </div>
                <div style={{ height: "6px", background: "rgba(61,43,31,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                  <div className="xp-fill" style={{ height: "100%", width: `${xpProgress}%`, background: "linear-gradient(90deg, #f5a623, #c8773a)" }} />
                </div>
              </div>
              <p style={{ fontSize: "10px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
                {xpToNext} XP to level {level + 1}
              </p>
            </div>
          </div>

          <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div style={{ textAlign: "center", padding: "8px 4px", background: "rgba(61,43,31,0.03)", borderRadius: "6px", border: "1px solid rgba(61,43,31,0.07)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#f5a623", fontFamily: "var(--font-sans)" }}>{streak}</div>
              <div style={{ fontSize: "9px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>Streak</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 4px", background: "rgba(61,43,31,0.03)", borderRadius: "6px", border: "1px solid rgba(61,43,31,0.07)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#7a9e7e", fontFamily: "var(--font-sans)" }}>
                {Math.floor(todayFocusMinutes / 60)}h {todayFocusMinutes % 60}m
              </div>
              <div style={{ fontSize: "9px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>Today</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 4px", background: "rgba(61,43,31,0.03)", borderRadius: "6px", border: "1px solid rgba(61,43,31,0.07)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#c8773a", fontFamily: "var(--font-sans)" }}>{sessionsToday}</div>
              <div style={{ fontSize: "9px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
