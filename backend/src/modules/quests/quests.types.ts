export type QuestSessionRecord = {
  id: string;
  userId: string;
  title: string;
  plannedDurationMinutes: number;
  actualDurationSeconds: number;
  status: string;
  startedAt: Date | null;
  lastResumedAt: Date | null;
  pausedAt: Date | null;
  endedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
