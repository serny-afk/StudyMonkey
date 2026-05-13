"use client";

import type { SessionMode } from "./MainRoomScreen";

interface MonkeyPanelProps {
  mood: "happy" | "focused" | "sleepy" | "excited";
  streak: number;
  level: number;
  sessionMode: SessionMode;
  onClose: () => void;
}

const MOOD_CONFIG = {
  happy: {
    label: "Cheerful",
    color: "#f5a623",
    messages: [
      "Ready to tackle something great today?",
      "Your study space is all set. Let us go.",
      "One session at a time."
    ]
  },
  focused: {
    label: "In the Zone",
    color: "#7a9e7e",
    messages: [
      "Deep focus activated. I will not disturb you.",
      "You are doing amazing. Keep that flow going.",
      "Every minute counts."
    ]
  },
  sleepy: {
    label: "Resting",
    color: "#8b9dc3",
    messages: [
      "Good breaks make great sessions.",
      "Recharging is part of the process too.",
      "I will be here when you are ready again."
    ]
  },
  excited: {
    label: "Excited",
    color: "#d4856a",
    messages: [
      "That session was incredible.",
      "Another level closer.",
      "Great work."
    ]
  }
};

export default function MonkeyPanel({ mood, streak, level, sessionMode, onClose }: MonkeyPanelProps) {
  const moodConfig = MOOD_CONFIG[mood];
  const currentMessage = moodConfig.messages[streak % moodConfig.messages.length];

  return (
    <div className="absolute overlay-enter" style={{ right: "10%", bottom: "35%", zIndex: 50, width: "280px" }}>
      <div className="surface-parchment shadow-paper-lg" style={{ borderRadius: "12px 12px 12px 4px", border: "1.5px solid var(--border)", position: "relative" }}>
        <div style={{ padding: "18px 16px 16px" }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="animate-breathe"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #a0704a, #8b5e3c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  border: `2px solid ${moodConfig.color}`,
                  boxShadow: `0 0 8px ${moodConfig.color}40`,
                  color: "var(--cream)",
                  flexShrink: 0
                }}
              >
                MONK
              </div>
              <div>
                <p className="font-display" style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>
                  Biscuit
                </p>
                <span style={{ fontSize: "10px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
                  {moodConfig.label}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: "2px 6px", fontSize: "14px" }} type="button">
              x
            </button>
          </div>

          <div style={{ background: `linear-gradient(135deg, ${moodConfig.color}12, ${moodConfig.color}06)`, border: `1px solid ${moodConfig.color}25`, borderRadius: "8px", padding: "10px 12px", marginBottom: "12px" }}>
            <p className="font-display" style={{ fontSize: "13px", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.5 }}>
              "{currentMessage}"
            </p>
          </div>

          <div style={{ borderTop: "1px dashed var(--border)", paddingTop: "10px", display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-sans)" }}>{streak}d</div>
              <div style={{ fontSize: "9px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>Streak</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-sans)" }}>{level}</div>
              <div style={{ fontSize: "9px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>Level</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-sans)" }}>{sessionMode}</div>
              <div style={{ fontSize: "9px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>Mode</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
