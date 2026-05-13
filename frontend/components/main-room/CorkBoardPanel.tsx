"use client";

import { useState } from "react";
import type { Quest } from "./MainRoomScreen";

interface CorkBoardPanelProps {
  quests: Quest[];
  onToggleQuest: (id: string) => void;
  onClose: () => void;
}

const CATEGORY_LABELS = { daily: "Today", weekly: "This Week" };
const CATEGORY_COLORS = { daily: "#c8773a", weekly: "#7a9e7e" };

export default function CorkBoardPanel({ quests, onToggleQuest, onClose }: CorkBoardPanelProps) {
  const [filter, setFilter] = useState<"all" | "daily" | "weekly">("all");
  const filtered = quests.filter((q) => filter === "all" || q.category === filter);
  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;

  return (
    <div
      className="absolute overlay-enter"
      style={{
        left: "24%",
        top: "14%",
        zIndex: 50,
        width: "300px",
        transform: "translateX(-5%) rotate(-1deg)"
      }}
    >
      <div className="surface-cork shadow-paper-lg" style={{ borderRadius: "6px", border: "6px solid #8b6340", padding: "16px" }}>
        <div className="surface-parchment shadow-paper" style={{ borderRadius: "3px", padding: "16px", transform: "rotate(0.5deg)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-display" style={{ fontSize: "17px", fontWeight: 600, color: "var(--ink)" }}>
                Quest Board
              </h2>
              <div className="flex items-center gap-1 mt-1">
                <div
                  style={{
                    width: "60px",
                    height: "4px",
                    background: "rgba(61,43,31,0.1)",
                    borderRadius: "2px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(completedCount / totalCount) * 100}%`,
                      background: "linear-gradient(90deg, #7a9e7e, #5a8060)",
                      transition: "width 0.4s ease"
                    }}
                  />
                </div>
                <span style={{ fontSize: "10px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
                  {completedCount}/{totalCount} done
                </span>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: "2px 6px", fontSize: "14px" }} type="button">
              x
            </button>
          </div>

          <div className="flex gap-1 mb-3 p-1" style={{ background: "var(--parchment-dark)", borderRadius: "6px" }}>
            {(["all", "daily", "weekly"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  background: filter === cat ? "var(--parchment)" : "transparent",
                  color: filter === cat ? "var(--ink)" : "var(--ink-light)",
                  border: filter === cat ? "1px solid var(--border)" : "1px solid transparent",
                  cursor: "pointer"
                }}
                type="button"
              >
                {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          <div className="scrollbar-cozy" style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {filtered.map((quest) => (
              <div
                key={quest.id}
                className="flex items-start gap-2.5"
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  background: quest.completed ? "rgba(122,158,126,0.08)" : "rgba(61,43,31,0.03)",
                  border: `1px solid ${quest.completed ? "rgba(122,158,126,0.2)" : "rgba(61,43,31,0.08)"}`,
                  cursor: "pointer"
                }}
                onClick={() => onToggleQuest(quest.id)}
              >
                <input
                  type="checkbox"
                  className="quest-check"
                  checked={quest.completed}
                  onChange={() => onToggleQuest(quest.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Complete ${quest.title}`}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: quest.completed ? "var(--ink-light)" : "var(--ink)",
                      fontFamily: "var(--font-sans)",
                      textDecoration: quest.completed ? "line-through" : "none",
                      lineHeight: 1.4
                    }}
                  >
                    {quest.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        padding: "1px 5px",
                        borderRadius: "99px",
                        background: `${CATEGORY_COLORS[quest.category]}22`,
                        color: CATEGORY_COLORS[quest.category],
                        fontFamily: "var(--font-sans)"
                      }}
                    >
                      {CATEGORY_LABELS[quest.category].toUpperCase()}
                    </span>
                    <span style={{ fontSize: "10px", color: "#c8773a", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                      +{quest.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
