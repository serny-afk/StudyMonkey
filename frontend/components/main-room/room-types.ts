export type RoomSectionId = "desk" | "quests" | "stats" | null;
export type SessionMode = "idle" | "focusing" | "paused";

export interface SessionState {
  mode: SessionMode;
  timeRemaining: number;
  sessionDuration: number;
  currentQuestTitle: string | null;
}
