"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import CorkBoardPanel from "./CorkBoardPanel";
import DeskPanel from "./DeskPanel";
import HotspotOverlay from "./HotspotOverlay";
import RoomScene from "./RoomScene";
import ShelfPanel from "./ShelfPanel";
import StatusRibbon from "./StatusRibbon";

export type HotspotId = "desk" | "corkboard" | "shelf" | null;
export type SessionMode = "idle" | "focusing" | "break";

export interface Quest {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
  category: "daily" | "weekly";
}

export interface SessionState {
  mode: SessionMode;
  timeRemaining: number;
  sessionDuration: number;
  todayFocusMinutes: number;
  sessionsToday: number;
}

const INITIAL_QUESTS: Quest[] = [
  { id: "quest-001", title: "Complete a 25-minute focus session", xpReward: 50, completed: false, category: "daily" },
  { id: "quest-002", title: "Study for 2 hours today", xpReward: 120, completed: false, category: "daily" },
  { id: "quest-003", title: "Take a proper break", xpReward: 20, completed: true, category: "daily" },
  { id: "quest-004", title: "Complete 5 sessions this week", xpReward: 200, completed: false, category: "weekly" }
];

export default function MainRoomScreen() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [xp, setXp] = useState(2340);
  const [level] = useState(7);
  const [session, setSession] = useState<SessionState>({
    mode: "idle",
    timeRemaining: 25 * 60,
    sessionDuration: 25 * 60,
    todayFocusMinutes: 87,
    sessionsToday: 3
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const XP_PER_LEVEL = 500;
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const xpProgress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

  const startSession = useCallback(() => {
    setSession((prev) => ({ ...prev, mode: "focusing" }));
    toast.success("Focus session started.");
  }, []);

  const pauseSession = useCallback(() => {
    setSession((prev) => ({ ...prev, mode: "idle" }));
    toast("Session paused.");
  }, []);

  const stopSession = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const minutesFocused = Math.floor((session.sessionDuration - session.timeRemaining) / 60);
    const earnedXp = Math.max(minutesFocused * 3, 0);
    setXp((prev) => prev + earnedXp);
    setSession((prev) => ({
      ...prev,
      mode: "idle",
      timeRemaining: prev.sessionDuration,
      todayFocusMinutes: prev.todayFocusMinutes + minutesFocused,
      sessionsToday: prev.sessionsToday + 1
    }));
    if (earnedXp > 0) toast.success(`+${earnedXp} XP earned.`);
  }, [session.sessionDuration, session.timeRemaining]);

  const startBreak = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSession((prev) => ({
      ...prev,
      mode: "break",
      timeRemaining: 5 * 60,
      sessionDuration: 5 * 60
    }));
    toast("Break time.");
  }, []);

  const setSessionDuration = useCallback(
    (minutes: number) => {
      if (session.mode === "idle") {
        setSession((prev) => ({
          ...prev,
          timeRemaining: minutes * 60,
          sessionDuration: minutes * 60
        }));
      }
    },
    [session.mode]
  );

  useEffect(() => {
    if (session.mode === "focusing" || session.mode === "break") {
      timerRef.current = setInterval(() => {
        setSession((prev) => {
          if (prev.timeRemaining <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (prev.mode === "focusing") {
              const minutesFocused = Math.floor(prev.sessionDuration / 60);
              const earnedXp = minutesFocused * 3;
              setXp((value) => value + earnedXp);
              toast.success(`Session complete. +${earnedXp} XP`);
              return {
                ...prev,
                mode: "idle",
                timeRemaining: prev.sessionDuration,
                todayFocusMinutes: prev.todayFocusMinutes + minutesFocused,
                sessionsToday: prev.sessionsToday + 1
              };
            }
            toast("Break over.");
            return { ...prev, mode: "idle", timeRemaining: 25 * 60, sessionDuration: 25 * 60 };
          }

          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.mode]);

  const toggleQuest = useCallback((questId: string) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === questId) {
          const nowCompleted = !quest.completed;
          if (nowCompleted) {
            setXp((value) => value + quest.xpReward);
            toast.success(`Quest complete. +${quest.xpReward} XP`);
          }
          return { ...quest, completed: nowCompleted };
        }
        return quest;
      })
    );
  }, []);

  const handleHotspotClick = useCallback((id: HotspotId) => {
    setActiveHotspot((prev) => (prev === id ? null : id));
  }, []);

  const closePanel = useCallback(() => setActiveHotspot(null), []);

  return (
    <div className="room-scene">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--parchment)",
            color: "var(--ink)",
            border: "1.5px solid var(--border)",
            fontFamily: "var(--font-sans)",
            fontSize: "14px"
          }
        }}
      />

      <RoomScene ambience="evening" sessionMode={session.mode} />

      <StatusRibbon session={session} level={level} xp={xp} xpProgress={xpProgress} />

      <HotspotOverlay activeHotspot={activeHotspot} onHotspotClick={handleHotspotClick} sessionMode={session.mode} />

      {activeHotspot === "desk" && (
        <DeskPanel
          session={session}
          onStart={startSession}
          onPause={pauseSession}
          onStop={stopSession}
          onBreak={startBreak}
          onSetDuration={setSessionDuration}
          onClose={closePanel}
          xpEarned={Math.floor((session.sessionDuration - session.timeRemaining) / 60) * 3}
        />
      )}

      {activeHotspot === "corkboard" && (
        <CorkBoardPanel quests={quests} onToggleQuest={toggleQuest} onClose={closePanel} />
      )}

      {activeHotspot === "shelf" && (
        <ShelfPanel
          xp={xp}
          level={level}
          xpProgress={xpProgress}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
