"use client";

import { useMemo, useState } from "react";

type RoomPanelId = "desk" | "board" | "shelf" | "window" | "companion";
type SessionMode = "idle" | "focusing" | "break";

type PanelContent = {
  title: string;
  eyebrow: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  items: string[];
};

const panelContent: Record<RoomPanelId, PanelContent> = {
  desk: {
    eyebrow: "Focus Station",
    title: "Desk Timer",
    description:
      "Use the desk as the main control point for your study runs. Keep the active session front and center instead of hiding it in a utility panel.",
    primaryAction: "Start Focus",
    secondaryAction: "Pause Session",
    items: [
      "Current quest: Database modeling review",
      "Planned duration: 45 minutes",
      "Reward on completion: 180 XP"
    ]
  },
  board: {
    eyebrow: "Quest Board",
    title: "Pinned Objectives",
    description:
      "The cork board works well as your quest list. It feels in-world, and it gives you a natural place for tasks, side quests, and deadlines.",
    primaryAction: "Add Quest",
    secondaryAction: "View All",
    items: [
      "Submit software testing notes",
      "Finish two linear algebra drills",
      "Draft backend API report outline"
    ]
  },
  shelf: {
    eyebrow: "Progress Shelf",
    title: "Character Progress",
    description:
      "The shelf can hold all the progression systems that usually turn into boring stat cards: level, streak, earned titles, and unlocked milestones.",
    primaryAction: "Claim Reward",
    secondaryAction: "Open Journal",
    items: [
      "Level 12 Scholar",
      "9 day study streak",
      "82 percent to next rank"
    ]
  },
  window: {
    eyebrow: "Room Ambience",
    title: "Window Mood",
    description:
      "Tie ambience to app state. During focus mode the room becomes warmer and calmer, while break mode can brighten the scene and make it feel rewarding.",
    primaryAction: "Switch to Night",
    secondaryAction: "Play Rain",
    items: [
      "Current ambience: Late afternoon",
      "Lamp glow synced to focus mode",
      "Rain and birds can become unlockable soundscapes"
    ]
  },
  companion: {
    eyebrow: "Companion Corner",
    title: "Monkey Companion",
    description:
      "This is where the app gets personality. The companion can react to session state, celebrate completed quests, and keep the room from feeling static.",
    primaryAction: "Give Snack",
    secondaryAction: "Change Pose",
    items: [
      "Mood: Calm and ready",
      "Companion bonus: morale buff",
      "Suggested animation: idle breathing loop"
    ]
  }
};

const statusCopy: Record<
  SessionMode,
  { label: string; timer: string; note: string; glow: string }
> = {
  idle: {
    label: "Room Resting",
    timer: "00:00",
    note: "No active quest. Choose a hotspot to stage the next study run.",
    glow: "soft"
  },
  focusing: {
    label: "Focus Quest Active",
    timer: "24:17",
    note: "Lamp is lit, ambience is calm, and the room is tuned for deliberate work.",
    glow: "warm"
  },
  break: {
    label: "Break Time",
    timer: "05:00",
    note: "Session paused for a short reset. Keep the room bright and low-pressure.",
    glow: "bright"
  }
};

const hotspots: Array<{
  id: RoomPanelId;
  label: string;
  className: string;
}> = [
  { id: "window", label: "Window", className: "hotspot-window" },
  { id: "board", label: "Quest Board", className: "hotspot-board" },
  { id: "desk", label: "Desk Timer", className: "hotspot-desk" },
  { id: "shelf", label: "Progress Shelf", className: "hotspot-shelf" },
  { id: "companion", label: "Monkey Corner", className: "hotspot-companion" }
];

export function FocusRoom() {
  const [activePanel, setActivePanel] = useState<RoomPanelId>("desk");
  const [mode, setMode] = useState<SessionMode>("idle");

  const activeContent = panelContent[activePanel];
  const sceneState = statusCopy[mode];
  const completion = useMemo(() => {
    if (mode === "focusing") return 67;
    if (mode === "break") return 84;
    return 22;
  }, [mode]);

  return (
    <main className={`room-page room-${sceneState.glow}`}>
      <header className="top-bar">
        <div>
          <p className="ui-label">StudyMonkey</p>
          <h1>Focus Room Prototype</h1>
          <p className="hero-subtitle">
            A cozy focus room with in-world controls instead of dashboard cards.
          </p>
        </div>
        <div className="top-actions">
          <button
            className={`mode-chip${mode === "idle" ? " is-active" : ""}`}
            onClick={() => setMode("idle")}
            type="button"
          >
            Idle
          </button>
          <button
            className={`mode-chip${mode === "focusing" ? " is-active" : ""}`}
            onClick={() => setMode("focusing")}
            type="button"
          >
            Focus
          </button>
          <button
            className={`mode-chip${mode === "break" ? " is-active" : ""}`}
            onClick={() => setMode("break")}
            type="button"
          >
            Break
          </button>
        </div>
      </header>

      <section className="room-layout">
        <section className="scene-frame">
          <div className="scene-status">
            <span>{sceneState.label}</span>
            <strong>{sceneState.timer}</strong>
          </div>

          <div className="focus-room-scene" aria-label="Interactive focus room">
            <div className="scene-vignette" />
            <div className="beam beam-left" />
            <div className="beam beam-right" />
            <div className="window-glow" />
            <div className="window-frame">
              <div className="window-sky" />
              <div className="window-bars" />
              <div className="curtain curtain-left" />
              <div className="curtain curtain-right" />
            </div>
            <div className="quest-board">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="shelf">
              <div className="shelf-plank plank-top" />
              <div className="shelf-plank plank-middle" />
              <div className="shelf-plank plank-bottom" />
            </div>
            <div className="desk-surface" />
            <div className="desk-legs" />
            <div className={`lamp lamp-${mode}`}>
              <div className="lamp-head" />
              <div className="lamp-arm lamp-arm-upper" />
              <div className="lamp-arm lamp-arm-lower" />
              <div className="lamp-base" />
            </div>
            <div className="book-stack" />
            <div className="open-journal" />
            <div className="mug" />
            <div className="chair" />
            <div className="rug" />
            <div className="plant plant-left" />
            <div className="plant plant-mid" />
            <div className="plant plant-right" />
            <div className="companion">
              <div className="companion-ear companion-ear-left" />
              <div className="companion-ear companion-ear-right" />
              <div className="companion-body" />
              <div className="companion-tail" />
            </div>

            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                className={`scene-hotspot ${hotspot.className}${
                  hotspot.id === activePanel ? " is-selected" : ""
                }`}
                onClick={() => setActivePanel(hotspot.id)}
                type="button"
              >
                <span>{hotspot.label}</span>
              </button>
            ))}
          </div>

          <div className="scene-footer">
            <p>{sceneState.note}</p>
            <div className="progress-meter" aria-hidden="true">
              <span style={{ width: `${completion}%` }} />
            </div>
          </div>
        </section>

        <aside className="control-panel">
          <p className="ui-label">{activeContent.eyebrow}</p>
          <h2>{activeContent.title}</h2>
          <p className="panel-copy">{activeContent.description}</p>

          <div className="panel-actions">
            <button className="panel-button panel-button-primary" type="button">
              {activeContent.primaryAction}
            </button>
            <button className="panel-button" type="button">
              {activeContent.secondaryAction}
            </button>
          </div>

          <div className="panel-card paper-card">
            <p className="ui-label">Working Notes</p>
            <ul>
              {activeContent.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="panel-card ledger-card">
            <p className="ui-label">Why This Works</p>
            <p className="panel-copy">
              The image you generated can replace this CSS scene later. For now,
              this screen already gives us the gameplay structure: room,
              hotspots, state, and context-aware panel content.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
