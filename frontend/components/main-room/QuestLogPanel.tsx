"use client";

import { useState } from "react";
import type { QuestSessionRecord } from "../../lib/api";
import PanelShell from "./PanelShell";

interface QuestLogPanelProps {
  quests: QuestSessionRecord[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  const minutes = Math.max(Math.floor(seconds / 60), 0);
  return `${minutes} min`;
}

export default function QuestLogPanel({
  quests,
  isLoading = false,
  errorMessage = null,
  onClose
}: QuestLogPanelProps) {
  const [filter, setFilter] = useState<"all" | "open" | "completed">("all");
  const filtered = quests.filter((q) => {
    if (filter === "all") return true;
    if (filter === "completed") return q.status === "completed";
    return q.status !== "completed";
  });
  const completedCount = quests.filter((q) => q.status === "completed").length;
  const totalCount = quests.length;

  return (
    <PanelShell placement="right" width="min(360px, calc(100vw - 336px))">
      <div
        className="shadow-paper-lg"
        style={{
          borderRadius: "28px",
          background: "linear-gradient(180deg, rgba(18,20,33,0.96), rgba(24,27,41,0.94))",
          border: "1px solid rgba(255,255,255,0.07)",
          padding: "16px",
          backdropFilter: "blur(18px)"
        }}
      >
        <div
          style={{
            borderRadius: "22px",
            padding: "18px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)"
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-display" style={{ fontSize: "17px", fontWeight: 700, color: "#f5f7fb" }}>
                Quest Board
              </h2>
              <div className="flex items-center gap-1 mt-1">
                <div
                  style={{
                    width: "60px",
                    height: "4px",
                    background: "rgba(230,236,248,0.12)",
                    borderRadius: "2px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(completedCount / totalCount) * 100}%`,
                      background: "linear-gradient(90deg, #4aa3ff, #2684ff)",
                      transition: "width 0.4s ease"
                    }}
                  />
                </div>
                <span style={{ fontSize: "10px", color: "rgba(188,195,217,0.58)", fontFamily: "var(--font-sans)" }}>
                  {completedCount}/{totalCount} done
                </span>
              </div>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: "2px 6px", fontSize: "14px" }} type="button">
              x
            </button>
          </div>

          <div className="flex gap-1 mb-3 p-1" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "14px" }}>
            {(["all", "open", "completed"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  background: filter === cat ? "linear-gradient(180deg, #3592ff 0%, #1f7cf2 100%)" : "transparent",
                  color: filter === cat ? "#f7fbff" : "rgba(188,195,217,0.62)",
                  border: filter === cat ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                  cursor: "pointer"
                }}
                type="button"
              >
                {cat === "all" ? "All" : cat === "open" ? "Open" : "Completed"}
              </button>
            ))}
          </div>

          <div className="scrollbar-cozy" style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {isLoading && (
              <p style={{ fontSize: "12px", color: "rgba(188,195,217,0.58)", fontFamily: "var(--font-sans)" }}>
                Loading quest log...
              </p>
            )}
            {!isLoading && errorMessage && (
              <p style={{ fontSize: "12px", color: "#9b4b3f", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                {errorMessage}
              </p>
            )}
            {!isLoading && !errorMessage && filtered.length === 0 && (
              <p style={{ fontSize: "12px", color: "rgba(188,195,217,0.58)", fontFamily: "var(--font-sans)" }}>
                No quests in this view yet.
              </p>
            )}
            {!isLoading && !errorMessage && filtered.map((quest) => (
              <div
                key={quest.id}
                className="flex items-start gap-2.5"
                style={{
                  padding: "10px",
                  borderRadius: "16px",
                  background: quest.status === "completed" ? "rgba(255,255,255,0.065)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${quest.status === "completed" ? "rgba(74,163,255,0.16)" : "rgba(255,255,255,0.06)"}`
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: quest.status === "completed" ? "rgba(188,195,217,0.72)" : "#f5f7fb",
                      fontFamily: "var(--font-sans)",
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
                        background:
                          quest.status === "completed"
                            ? "rgba(74,163,255,0.16)"
                            : quest.status === "active"
                              ? "rgba(38,132,255,0.18)"
                              : "rgba(255,255,255,0.08)",
                        color:
                          quest.status === "completed"
                            ? "#8ec9ff"
                            : quest.status === "active"
                              ? "#5faeff"
                              : "rgba(188,195,217,0.66)",
                        fontFamily: "var(--font-sans)"
                      }}
                    >
                      {quest.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "10px", color: "rgba(188,195,217,0.58)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                      {quest.plannedDurationMinutes} min planned
                    </span>
                    <span style={{ fontSize: "10px", color: "rgba(188,195,217,0.58)", fontFamily: "var(--font-sans)" }}>
                      {formatDuration(quest.actualDurationSeconds)} logged
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}
