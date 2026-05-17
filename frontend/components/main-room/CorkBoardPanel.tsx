"use client";

import { useState } from "react";
import type { QuestSessionRecord } from "../../lib/api";
import PanelShell from "./PanelShell";

interface CorkBoardPanelProps {
  quests: QuestSessionRecord[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
}

function formatDuration(seconds: number): string {
  const minutes = Math.max(Math.floor(seconds / 60), 0);
  return `${minutes} min`;
}

export default function CorkBoardPanel({
  quests,
  isLoading = false,
  errorMessage = null,
  onClose
}: CorkBoardPanelProps) {
  const [filter, setFilter] = useState<"all" | "open" | "completed">("all");
  const filtered = quests.filter((q) => {
    if (filter === "all") return true;
    if (filter === "completed") return q.status === "completed";
    return q.status !== "completed";
  });
  const completedCount = quests.filter((q) => q.status === "completed").length;
  const totalCount = quests.length;

  return (
    <PanelShell
      placement="left"
      width="min(300px, calc(100vw - 24px))"
      style={{ transform: "rotate(-1deg)" }}
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
            {(["all", "open", "completed"] as const).map((cat) => (
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
                {cat === "all" ? "All" : cat === "open" ? "Open" : "Completed"}
              </button>
            ))}
          </div>

          <div className="scrollbar-cozy" style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
            {isLoading && (
              <p style={{ fontSize: "12px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
                Loading quest log...
              </p>
            )}
            {!isLoading && errorMessage && (
              <p style={{ fontSize: "12px", color: "#9b4b3f", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                {errorMessage}
              </p>
            )}
            {!isLoading && !errorMessage && filtered.length === 0 && (
              <p style={{ fontSize: "12px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
                No quests in this view yet.
              </p>
            )}
            {!isLoading && !errorMessage && filtered.map((quest) => (
              <div
                key={quest.id}
                className="flex items-start gap-2.5"
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                  background: quest.status === "completed" ? "rgba(122,158,126,0.08)" : "rgba(61,43,31,0.03)",
                  border: `1px solid ${quest.status === "completed" ? "rgba(122,158,126,0.2)" : "rgba(61,43,31,0.08)"}`
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: quest.status === "completed" ? "var(--ink-light)" : "var(--ink)",
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
                            ? "rgba(122,158,126,0.15)"
                            : quest.status === "active"
                              ? "rgba(200,119,58,0.15)"
                              : "rgba(61,43,31,0.08)",
                        color:
                          quest.status === "completed"
                            ? "#5a8060"
                            : quest.status === "active"
                              ? "#c8773a"
                              : "var(--ink-light)",
                        fontFamily: "var(--font-sans)"
                      }}
                    >
                      {quest.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--ink-light)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                      {quest.plannedDurationMinutes} min planned
                    </span>
                    <span style={{ fontSize: "10px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
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
