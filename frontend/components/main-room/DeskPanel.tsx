"use client";

import { useState } from "react";
import type { SessionState } from "./MainRoomScreen";

interface DeskPanelProps {
  session: SessionState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onBreak: () => void;
  onSetDuration: (minutes: number) => void;
  onClose: () => void;
  xpEarned: number;
}

const DURATION_OPTIONS = [15, 25, 30, 45, 60, 90];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function getProgressPercent(remaining: number, total: number): number {
  return ((total - remaining) / total) * 100;
}

export default function DeskPanel({
  session,
  onStart,
  onPause,
  onStop,
  onBreak,
  onSetDuration,
  onClose,
  xpEarned
}: DeskPanelProps) {
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const progress = getProgressPercent(session.timeRemaining, session.sessionDuration);
  const sessionMinutes = session.sessionDuration / 60;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="absolute overlay-enter"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-20%, -60%)",
        zIndex: 50,
        width: "320px"
      }}
    >
      <div
        className="surface-parchment shadow-paper-lg"
        style={{
          borderRadius: "4px 12px 12px 4px",
          border: "1.5px solid var(--border)",
          position: "relative"
        }}
      >
        <div style={{ padding: "24px 20px 20px" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2
                className="font-display"
                style={{ fontSize: "18px", fontWeight: 600, color: "var(--ink)", lineHeight: 1.2 }}
              >
                Study Session
              </h2>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--ink-light)",
                  marginTop: "2px",
                  fontFamily: "var(--font-sans)"
                }}
              >
                {session.mode === "idle"
                  ? "Ready to focus?"
                  : session.mode === "focusing"
                    ? "Deep work mode"
                    : "Taking a break"}
              </p>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: "4px 8px", fontSize: "16px", lineHeight: 1 }} type="button">
              x
            </button>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative" style={{ width: "140px", height: "140px" }}>
              <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(61,43,31,0.1)" strokeWidth="8" />
                <circle
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  stroke={session.mode === "break" ? "#7a9e7e" : "#c8773a"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={session.mode === "focusing" ? "font-display timer-pulse" : "font-display"}
                  style={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1
                  }}
                >
                  {formatTime(session.timeRemaining)}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--ink-light)",
                    fontFamily: "var(--font-sans)",
                    marginTop: "4px",
                    letterSpacing: "0.05em"
                  }}
                >
                  {sessionMinutes} MIN
                </div>
                {xpEarned > 0 && session.mode === "focusing" && (
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#c8773a",
                      fontFamily: "var(--font-sans)",
                      marginTop: "2px"
                    }}
                  >
                    +{xpEarned} XP
                  </div>
                )}
              </div>
            </div>
          </div>

          {session.mode === "idle" && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--ink-light)",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase"
                  }}
                >
                  Duration
                </span>
                <button
                  onClick={() => setShowDurationPicker((s) => !s)}
                  style={{
                    fontSize: "11px",
                    color: "var(--primary)",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0
                  }}
                  type="button"
                >
                  {showDurationPicker ? "Done" : "Change"}
                </button>
              </div>

              {showDurationPicker ? (
                <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  {DURATION_OPTIONS.map((mins) => (
                    <button
                      key={mins}
                      onClick={() => {
                        onSetDuration(mins);
                        setShowDurationPicker(false);
                      }}
                      style={{
                        padding: "6px 4px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        fontFamily: "var(--font-sans)",
                        background:
                          session.sessionDuration === mins * 60 ? "var(--primary)" : "var(--parchment-dark)",
                        color: session.sessionDuration === mins * 60 ? "var(--cream)" : "var(--ink)",
                        border: "1.5px solid",
                        borderColor:
                          session.sessionDuration === mins * 60 ? "var(--primary)" : "var(--border)",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                      type="button"
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--parchment-dark)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    border: "1.5px solid var(--border)"
                  }}
                >
                  <span
                    style={{ fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}
                  >
                    {sessionMinutes} minutes
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--ink-light)" }}>
                    ~{Math.floor(sessionMinutes * 3)} XP
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            {session.mode === "idle" && (
              <button className="btn-primary flex-1" onClick={onStart} type="button">
                Start Focus
              </button>
            )}

            {session.mode === "focusing" && (
              <>
                <button className="btn-secondary flex-1" onClick={onPause} type="button">
                  Pause
                </button>
                <button className="btn-ghost" onClick={onBreak} style={{ color: "var(--ink)" }} type="button">
                  Break
                </button>
                <button className="btn-ghost" onClick={onStop} style={{ color: "#c8403a" }} type="button">
                  Stop
                </button>
              </>
            )}

            {session.mode === "break" && (
              <>
                <button className="btn-primary flex-1" onClick={onStart} style={{ background: "#7a9e7e" }} type="button">
                  Resume Focus
                </button>
                <button className="btn-ghost" onClick={onStop} style={{ color: "#c8403a" }} type="button">
                  End
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
