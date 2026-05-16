"use client";

import dynamic from "next/dynamic";
import PanelShell from "./PanelShell";

const XPRadialChart = dynamic(() => import("./XPRadialChart"), { ssr: false });

interface ShelfPanelProps {
  xp: number;
  level: number;
  xpProgress: number;
  onClose: () => void;
}

export default function ShelfPanel({
  xp,
  level,
  xpProgress,
  onClose
}: ShelfPanelProps) {
  const xpInLevel = xp % 500;
  const xpToNext = 500 - xpInLevel;

  return (
    <PanelShell placement="right" width="min(300px, calc(100vw - 24px))">
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

          <div
            style={{
              padding: "12px",
              background: "rgba(61,43,31,0.03)",
              borderRadius: "8px",
              border: "1px solid rgba(61,43,31,0.07)"
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "var(--ink-light)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "6px"
              }}
            >
              MVP Scope
            </p>
            <p style={{ fontSize: "12px", color: "var(--ink)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
              This panel currently shows only character progression data that maps cleanly to the backend: level progress and total XP.
            </p>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
