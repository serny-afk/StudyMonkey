"use client";

import { useMemo } from "react";
import type { CharacterRecord, QuestSessionRecord } from "../../lib/api";
import { deriveSessionState } from "./room-helpers";
import { useSessionClock } from "./useSessionClock";

interface UseRoomViewModelArgs {
  activeQuest: QuestSessionRecord | null;
  character: CharacterRecord | null;
  plannedMinutes: number;
}

export function useRoomViewModel({
  activeQuest,
  character,
  plannedMinutes
}: UseRoomViewModelArgs) {
  const fallbackSession = deriveSessionState(activeQuest, Date.now(), plannedMinutes);
  const now = useSessionClock(fallbackSession.mode);
  const session = deriveSessionState(activeQuest, now, plannedMinutes);
  const xp = character?.xp ?? 0;
  const level = character?.level ?? 1;

  const xpProgress = useMemo(() => {
    const xpPerLevel = 100;
    const xpInCurrentLevel = xp % xpPerLevel;
    return (xpInCurrentLevel / xpPerLevel) * 100;
  }, [xp]);

  return {
    session,
    xp,
    level,
    xpProgress
  };
}
