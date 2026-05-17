"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api, type AuthResponse, type CharacterRecord, type QuestSessionRecord } from "../../lib/api";
import { TOKEN_KEY } from "./room-helpers";

export function useRoomBackend() {
  const [token, setToken] = useState<string | null>(null);
  const [character, setCharacter] = useState<CharacterRecord | null>(null);
  const [quests, setQuests] = useState<QuestSessionRecord[]>([]);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const activeQuest = useMemo(
    () =>
      quests.find((quest) => quest.status === "active") ??
      quests.find((quest) => quest.status === "paused") ??
      null,
    [quests]
  );

  const hasInProgressQuest = activeQuest !== null;

  const clearClientSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCharacter(null);
    setQuests([]);
    setDataError(null);
  }, []);

  const loadData = useCallback(async (accessToken: string) => {
    setIsLoadingData(true);
    setDataError(null);
    try {
      const [nextCharacter, nextQuests] = await Promise.all([
        api.getCharacter(accessToken),
        api.getQuests(accessToken)
      ]);
      setCharacter(nextCharacter);
      setQuests(nextQuests);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not load the latest room data from the backend.";
      setDataError(message);
      throw error;
    } finally {
      setIsLoadingData(false);
    }
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

  const retryLoad = useCallback(async () => {
    if (!token) return;
    try {
      await loadData(token);
      toast.success("Room data refreshed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not refresh room data.");
    }
  }, [loadData, token]);

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

  const createAndStartQuest = useCallback(
    async (title: string, minutes: number) => {
      if (!token) return;
      setIsMutating(true);
      try {
        const createdQuest = await api.createQuest(token, title, minutes);
        await api.startQuest(token, createdQuest.id);
        await loadData(token);
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

  return {
    token,
    character,
    quests,
    activeQuest,
    hasInProgressQuest,
    isBootstrapping,
    isLoadingData,
    isMutating,
    dataError,
    handleAuthSubmit,
    retryLoad,
    createAndStartQuest,
    pauseQuest,
    resumeQuest,
    completeQuest
  };
}
