"use client";

import type { SessionState } from "./MainRoomScreen";

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
  idle: { label: "Idle", bg: "rgba(122,98,72,0.85)", dot: "#c9a87c" },
  focusing: { label: "Focusing", bg: "rgba(61,43,31,0.9)", dot: "#7a9e7e" },
  paused: { label: "Paused", bg: "rgba(61,43,31,0.9)", dot: "#f5a623" }
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
      className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2"
      style={{
        background: "linear-gradient(180deg, rgba(61,43,31,0.75) 0%, transparent 100%)",
        pointerEvents: "none"
      }}
    >
      <div className="flex items-center gap-2" style={{ pointerEvents: "auto" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            background: "linear-gradient(135deg, #f5a623, #c8773a)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            boxShadow: "0 2px 6px rgba(61,43,31,0.3)"
          }}
        >
          SM
        </div>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--cream)",
            textShadow: "0 1px 4px rgba(61,43,31,0.5)",
            letterSpacing: "0.01em"
          }}
        >
          StudyMonkey
        </span>
      </div>

      <div className="flex items-center gap-3" style={{ pointerEvents: "auto" }}>
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: modeConfig.bg,
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)"
          }}
        >
          <div
            className={session.mode === "focusing" ? "animate-pulse-soft" : ""}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: modeConfig.dot
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--cream)",
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
              color: "var(--cream)",
              textShadow: "0 1px 4px rgba(61,43,31,0.5)",
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
                color: "rgba(253,246,227,0.7)",
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
                color: "#f5a623"
              }}
            >
              {level}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                color: "rgba(253,246,227,0.6)"
              }}
            >
              {(xp % 500)}/{500} XP
            </span>
          </div>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "rgba(253,246,227,0.15)",
              borderRadius: "2px",
              overflow: "hidden"
            }}
          >
            <div
              className="xp-fill"
              style={{
                height: "100%",
                width: `${xpProgress}%`,
                background: "linear-gradient(90deg, #f5a623, #c8773a)",
                borderRadius: "2px"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
