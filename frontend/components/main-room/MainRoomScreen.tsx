"use client";

import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import AuthPanel from "./AuthPanel";
import CorkBoardPanel from "./CorkBoardPanel";
import DeskPanel from "./DeskPanel";
import HotspotOverlay from "./HotspotOverlay";
import RoomStatusNotice from "./RoomStatusNotice";
import RoomScene from "./RoomScene";
import ShelfPanel from "./ShelfPanel";
import StatusRibbon from "./StatusRibbon";
import type { HotspotId } from "./room-types";
import { useRoomBackend } from "./useRoomBackend";
import { useRoomViewModel } from "./useRoomViewModel";

export default function MainRoomScreen() {
  const [activeHotspot, setActiveHotspot] = useState<HotspotId>(null);
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

      <HotspotOverlay activeHotspot={activeHotspot} onHotspotClick={handleHotspotClick} />

      {isBootstrapping && (
        <RoomStatusNotice
          title="Loading Your Study Room"
          body="Checking your saved session and pulling the latest quests and progression from the backend."
        />
      )}

      {!token && !isBootstrapping && <AuthPanel isSubmitting={isMutating} onSubmit={handleAuthSubmit} />}

      {token && !isBootstrapping && dataError && activeHotspot === null && (
        <RoomStatusNotice
          title="Could Not Refresh Room Data"
          body={`${dataError} You can retry without leaving the room.`}
          actionLabel={isLoadingData ? "Refreshing..." : "Retry"}
          onAction={isLoadingData ? undefined : retryLoad}
        />
      )}

      {token && activeHotspot === "desk" && (
        <DeskPanel
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

      {token && activeHotspot === "corkboard" && (
        <CorkBoardPanel
          quests={quests}
          isLoading={isLoadingData}
          errorMessage={dataError}
          onClose={closePanel}
        />
      )}

      {token && activeHotspot === "shelf" && (
        <ShelfPanel
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
