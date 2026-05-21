"use client";

import dynamic from "next/dynamic";
import PanelShell from "./PanelShell";

const XPRadialChart = dynamic(() => import("./XPRadialChart"), { ssr: false });

interface ProgressPanelProps {
  xp: number;
  level: number;
  xpProgress: number;
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
}

export default function ProgressPanel({
  xp,
  level,
  xpProgress,
  isLoading = false,
  errorMessage = null,
  onClose
}: ProgressPanelProps) {
  const xpInLevel = xp % 500;
  const xpToNext = 500 - xpInLevel;

  return (
    <PanelShell placement="right" width="min(300px, calc(100vw - 24px))">
      <div
        className="shadow-paper-lg"
        style={{
          borderRadius: "28px",
          border: "1px solid rgba(255,255,255,0.07)",
          position: "relative",
          background: "linear-gradient(180deg, rgba(18,20,33,0.96), rgba(24,27,41,0.94))",
          backdropFilter: "blur(18px)"
        }}
      >
        <div style={{ padding: "20px 18px 18px" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display" style={{ fontSize: "17px", fontWeight: 700, color: "#f5f7fb" }}>
                Progress Log
              </h2>
              <p style={{ fontSize: "11px", color: "rgba(188,195,217,0.62)", fontFamily: "var(--font-sans)", marginTop: "2px" }}>
                Level {level} Scholar
              </p>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: "2px 6px", fontSize: "14px" }} type="button">
              x
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4 p-3" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "18px", border: "1px solid rgba(255,255,255,0.07)" }}>
            {isLoading ? (
              <p style={{ fontSize: "12px", color: "rgba(188,195,217,0.62)", fontFamily: "var(--font-sans)" }}>
                Loading progression...
              </p>
            ) : errorMessage ? (
              <p style={{ fontSize: "12px", color: "#9b4b3f", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                {errorMessage}
              </p>
            ) : (
              <>
                <div style={{ flexShrink: 0, width: "72px", height: "72px" }}>
                  <XPRadialChart progress={xpProgress} level={level} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-display" style={{ fontSize: "22px", fontWeight: 700, color: "#f5f7fb", fontVariantNumeric: "tabular-nums" }}>
                      {xp.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "11px", color: "rgba(188,195,217,0.58)", fontFamily: "var(--font-sans)" }}>total XP</span>
                  </div>
                  <div style={{ marginBottom: "4px" }}>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "rgba(188,195,217,0.58)" }}>Lvl {level}</span>
                      <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "rgba(188,195,217,0.58)" }}>Lvl {level + 1}</span>
                    </div>
                    <div style={{ height: "6px", background: "rgba(230,236,248,0.12)", borderRadius: "3px", overflow: "hidden" }}>
                      <div className="xp-fill" style={{ height: "100%", width: `${xpProgress}%`, background: "linear-gradient(90deg, #4aa3ff, #2684ff)" }} />
                    </div>
                  </div>
                  <p style={{ fontSize: "10px", color: "rgba(188,195,217,0.58)", fontFamily: "var(--font-sans)" }}>
                    {xpToNext} XP to level {level + 1}
                  </p>
                </div>
              </>
            )}
          </div>

          <div
            style={{
              padding: "12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.07)"
            }}
          >
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "rgba(188,195,217,0.52)",
                fontFamily: "var(--font-sans)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "6px"
              }}
            >
              MVP Scope
            </p>
            <p style={{ fontSize: "12px", color: "#edf1fb", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
              This panel currently shows only character progression data that maps cleanly to the backend: level progress and total XP.
            </p>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
