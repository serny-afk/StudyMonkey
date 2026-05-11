import { CharacterRecord } from '../users/users.types';

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

export type CompleteQuestResult = {
  quest: QuestSessionRecord;
  xpAwarded: number;
  character: CharacterRecord;
};
