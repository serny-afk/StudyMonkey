import type { QuestSessionRecord } from "../../lib/api";
import type { SessionState } from "./room-types";

export const TOKEN_KEY = "studymonkey_access_token";

export function deriveSessionState(
  quest: QuestSessionRecord | null,
  now: number,
  fallbackMinutes: number
): SessionState {
  if (!quest) {
    return {
      mode: "idle",
      timeRemaining: fallbackMinutes * 60,
      sessionDuration: fallbackMinutes * 60,
      currentQuestTitle: null
    };
  }

  const totalSeconds = quest.plannedDurationMinutes * 60;
  const activeSegmentSeconds =
    quest.status === "active" && quest.lastResumedAt
      ? Math.max(Math.floor((now - new Date(quest.lastResumedAt).getTime()) / 1000), 0)
      : 0;
  const elapsed = quest.actualDurationSeconds + activeSegmentSeconds;

  return {
    mode: quest.status === "active" ? "focusing" : "paused",
    timeRemaining: Math.max(totalSeconds - elapsed, 0),
    sessionDuration: totalSeconds,
    currentQuestTitle: quest.title
  };
}
