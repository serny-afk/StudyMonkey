export type HotspotId = "desk" | "corkboard" | "shelf" | null;
export type SessionMode = "idle" | "focusing" | "paused";

export interface SessionState {
  mode: SessionMode;
  timeRemaining: number;
  sessionDuration: number;
  currentQuestTitle: string | null;
}
