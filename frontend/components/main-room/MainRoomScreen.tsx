"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { api, type AuthResponse, type CharacterRecord, type QuestSessionRecord } from "../../lib/api";
import AuthPanel from "./AuthPanel";
import CorkBoardPanel from "./CorkBoardPanel";
import DeskPanel from "./DeskPanel";
import HotspotOverlay from "./HotspotOverlay";
import RoomScene from "./RoomScene";
import ShelfPanel from "./ShelfPanel";
import StatusRibbon from "./StatusRibbon";

export type HotspotId = "desk" | "corkboard" | "shelf" | null;
export type SessionMode = "idle" | "focusing" | "paused";

export interface SessionState {
  mode: SessionMode;
  timeRemaining: number;
  sessionDuration: number;
  currentQuestTitle: string | null;
}

const TOKEN_KEY = "studymonkey_access_token";

function deriveSessionState(
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

export default function MainRoomScreen() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null);
  const [questTitle, setQuestTitle] = useState("Focus Session");
  const [plannedMinutes, setPlannedMinutes] = useState(25);
  const [token, setToken] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterRecord | null>(null);
  const [quests, setQuests] = useState<QuestSessionRecord[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeQuest =
    quests.find((quest) => quest.status === "active") ??
    quests.find((quest) => quest.status === "paused") ??
    null;
  const hasInProgressQuest = activeQuest !== null;

  const session = deriveSessionState(activeQuest, now, plannedMinutes);
  const xp = character?.xp ?? 0;
  const level = character?.level ?? 1;
  const XP_PER_LEVEL = 100;
  const xpInCurrentLevel = xp % XP_PER_LEVEL;
  const xpProgress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

  const loadData = useCallback(async (accessToken: string) => {
    const [nextCharacter, nextQuests] = await Promise.all([
      api.getCharacter(accessToken),
      api.getQuests(accessToken)
    ]);
    setCharacter(nextCharacter);
    setQuests(nextQuests);
  }, []);

  const clearClientSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCharacter(null);
    setQuests([]);
    setActiveHotspot(null);
  }, []);

  const handleAuthSubmit = useCallback(
    async (mode: "login" | "register", email: string, password: string) => {
      setIsMutating(true);
      try {
        const response: AuthResponse =
          mode === "login" ? await api.login(email, password) : await api.register(email, password);
        localStorage.setItem(TOKEN_KEY, response.accessToken);
        setToken(response.accessToken);
        if (response.character) {
          setCharacter(response.character);
        }
        await loadData(response.accessToken);
        toast.success(mode === "login" ? "Signed in." : "Account created.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Authentication failed.");
      } finally {
        setIsMutating(false);
      }
    },
    [loadData]
  );

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setIsBootstrapping(false);
      return;
    }

    setToken(savedToken);
    loadData(savedToken)
      .catch(() => {
        clearClientSession();
        toast.error("Your session expired. Please sign in again.");
      })
      .finally(() => setIsBootstrapping(false));
  }, [clearClientSession, loadData]);

  useEffect(() => {
    if (session.mode !== "focusing") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session.mode]);

  const createAndStartQuest = useCallback(
    async (title: string, minutes: number) => {
      if (!token) return;
      setIsMutating(true);
      try {
        const createdQuest = await api.createQuest(token, title, minutes);
        await api.startQuest(token, createdQuest.id);
        await loadData(token);
        setPlannedMinutes(minutes);
        toast.success("Focus quest started.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not start quest.");
      } finally {
        setIsMutating(false);
      }
    },
    [loadData, token]
  );

  const pauseQuest = useCallback(async () => {
    if (!token || !activeQuest) return;
    setIsMutating(true);
    try {
      await api.pauseQuest(token, activeQuest.id);
      await loadData(token);
      toast("Quest paused.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not pause quest.");
    } finally {
      setIsMutating(false);
    }
  }, [activeQuest, loadData, token]);

  const resumeQuest = useCallback(async () => {
    if (!token || !activeQuest) return;
    setIsMutating(true);
    try {
      await api.resumeQuest(token, activeQuest.id);
      await loadData(token);
      toast.success("Quest resumed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not resume quest.");
    } finally {
      setIsMutating(false);
    }
  }, [activeQuest, loadData, token]);

  const completeQuest = useCallback(async () => {
    if (!token || !activeQuest) return;
    setIsMutating(true);
    try {
      const result = await api.completeQuest(token, activeQuest.id);
      setCharacter(result.character);
      await loadData(token);
      toast.success(`Quest completed. +${result.xpAwarded} XP`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete quest.");
    } finally {
      setIsMutating(false);
    }
  }, [activeQuest, loadData, token]);

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

      {!token && !isBootstrapping && <AuthPanel isSubmitting={isMutating} onSubmit={handleAuthSubmit} />}

      {token && activeHotspot === "desk" && (
        <DeskPanel
          session={session}
          questTitle={questTitle}
          onQuestTitleChange={setQuestTitle}
          hasInProgressQuest={hasInProgressQuest}
          onStart={createAndStartQuest}
          onPause={pauseQuest}
          onResume={resumeQuest}
          onComplete={completeQuest}
          onSetDuration={setPlannedMinutes}
          onClose={closePanel}
          isSubmitting={isMutating}
        />
      )}

      {token && activeHotspot === "corkboard" && (
        <CorkBoardPanel quests={quests} onClose={closePanel} />
      )}

      {token && activeHotspot === "shelf" && (
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
