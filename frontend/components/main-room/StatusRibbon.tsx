"use client";

import type { SessionState } from "./room-types";

interface StatusRibbonProps {
  session: SessionState;
  level: number;
  xp: number;
  xpProgress: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const MODE_CONFIG = {
  idle: { label: "Idle", bg: "rgba(19,22,34,0.76)", dot: "#8d96b2" },
  focusing: { label: "Focusing", bg: "rgba(17,21,34,0.82)", dot: "#2684ff" },
  paused: { label: "Paused", bg: "rgba(17,21,34,0.82)", dot: "#f5a623" }
};

export default function StatusRibbon({
  session,
  level,
  xp,
  xpProgress
}: StatusRibbonProps) {
  const modeConfig = MODE_CONFIG[session.mode];

  return (
    <div
      className="absolute top-0 left-0 right-0 z-40 flex items-start justify-end px-6 py-5"
      style={{
        background: "linear-gradient(180deg, rgba(8,11,18,0.3) 0%, transparent 100%)",
        pointerEvents: "none"
      }}
    >
      <div className="flex items-center gap-3" style={{ pointerEvents: "auto", marginRight: "min(360px, 25vw)" }}>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: modeConfig.bg,
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 10px 24px rgba(8, 12, 20, 0.24)",
            backdropFilter: "blur(14px)"
          }}
        >
          <div
            className={session.mode === "focusing" ? "animate-pulse-soft" : ""}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: modeConfig.dot,
              boxShadow: session.mode === "focusing" ? "0 0 10px rgba(38,132,255,0.55)" : "none"
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#f6f8fc",
              letterSpacing: "0.05em"
            }}
          >
            {modeConfig.label}
          </span>
        </div>

        {session.mode !== "idle" && (
          <div
            className="font-display"
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#f5f7fb",
              textShadow: "0 1px 6px rgba(7,14,27,0.32)",
              fontVariantNumeric: "tabular-nums",
              minWidth: "56px",
              textAlign: "center"
            }}
          >
            {formatTime(session.timeRemaining)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3" style={{ pointerEvents: "auto" }}>
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            <span
              style={{
              fontFamily: "var(--font-sans)",
              fontSize: "10px",
              fontWeight: 500,
              color: "rgba(230,236,248,0.68)",
              letterSpacing: "0.05em"
            }}
          >
              LVL
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                fontWeight: 700,
                color: "#4aa3ff"
              }}
            >
              {level}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                color: "rgba(230,236,248,0.5)"
              }}
            >
              {(xp % 500)}/{500} XP
            </span>
          </div>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "rgba(230,236,248,0.14)",
              borderRadius: "2px",
              overflow: "hidden"
            }}
          >
            <div
              className="xp-fill"
              style={{
                height: "100%",
                width: `${xpProgress}%`,
                background: "linear-gradient(90deg, #4aa3ff, #2684ff)",
                borderRadius: "2px"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
