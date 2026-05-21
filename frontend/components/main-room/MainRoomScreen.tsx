"use client";

import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import AuthPanel from "./AuthPanel";
import FocusSessionPanel from "./FocusSessionPanel";
import ProgressPanel from "./ProgressPanel";
import QuestLogPanel from "./QuestLogPanel";
import RoomMenu from "./RoomMenu";
import RoomStatusNotice from "./RoomStatusNotice";
import RoomScene from "./RoomScene";
import StatusRibbon from "./StatusRibbon";
import type { RoomSectionId } from "./room-types";
import { useRoomBackend } from "./useRoomBackend";
import { useRoomViewModel } from "./useRoomViewModel";

export default function MainRoomScreen() {
  const [activeSection, setActiveSection] = useState<RoomSectionId>("desk");
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [questTitle, setQuestTitle] = useState("Focus Session");
  const [plannedMinutes, setPlannedMinutes] = useState(25);
  const {
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
  } = useRoomBackend();
  const { session, xp, level, xpProgress } = useRoomViewModel({
    activeQuest,
    character,
    plannedMinutes
  });

  const handleStartQuest = useCallback(
    async (title: string, minutes: number) => {
      await createAndStartQuest(title, minutes);
      setPlannedMinutes(minutes);
    },
    [createAndStartQuest]
  );

  const handleSectionSelect = useCallback((id: Exclude<RoomSectionId, null>) => {
    setActiveSection(id);
  }, []);

  const closePanel = useCallback(() => setActiveSection(null), []);

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

      <RoomScene sessionMode={session.mode} />

      <StatusRibbon session={session} level={level} xp={xp} xpProgress={xpProgress} />

      {token && !isBootstrapping && (
        <RoomMenu
          activeSection={activeSection}
          onSelect={handleSectionSelect}
          collapsed={menuCollapsed}
          onToggleCollapsed={() => setMenuCollapsed((value) => !value)}
        />
      )}

      {isBootstrapping && (
        <RoomStatusNotice
          title="Loading Your Study Room"
          body="Checking your saved session and pulling the latest quests and progression from the backend."
        />
      )}

      {!token && !isBootstrapping && <AuthPanel isSubmitting={isMutating} onSubmit={handleAuthSubmit} />}

      {token && !isBootstrapping && dataError && activeSection === null && (
        <RoomStatusNotice
          title="Could Not Refresh Room Data"
          body={`${dataError} You can retry without leaving the room.`}
          actionLabel={isLoadingData ? "Refreshing..." : "Retry"}
          onAction={isLoadingData ? undefined : retryLoad}
        />
      )}

      {token && activeSection === "desk" && (
        <FocusSessionPanel
          session={session}
          questTitle={questTitle}
          onQuestTitleChange={setQuestTitle}
          hasInProgressQuest={hasInProgressQuest}
          onStart={handleStartQuest}
          onPause={pauseQuest}
          onResume={resumeQuest}
          onComplete={completeQuest}
          onSetDuration={setPlannedMinutes}
          onClose={closePanel}
          isSubmitting={isMutating || isLoadingData}
        />
      )}

      {token && activeSection === "quests" && (
        <QuestLogPanel
          quests={quests}
          isLoading={isLoadingData}
          errorMessage={dataError}
          onClose={closePanel}
        />
      )}

      {token && activeSection === "stats" && (
        <ProgressPanel
          xp={xp}
          level={level}
          xpProgress={xpProgress}
          isLoading={isLoadingData}
          errorMessage={dataError}
          onClose={closePanel}
        />
      )}
    </div>
  );
}
