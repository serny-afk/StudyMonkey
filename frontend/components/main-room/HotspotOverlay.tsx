"use client";

import { useState } from "react";
import type { HotspotId, SessionMode } from "./MainRoomScreen";

interface HotspotOverlayProps {
  activeHotspot: HotspotId;
  onHotspotClick: (id: HotspotId) => void;
  sessionMode: SessionMode;
}

interface Hotspot {
  id: HotspotId;
  label: string;
  hint: string;
  style: React.CSSProperties;
  shape: "ellipse" | "rect";
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "desk",
    label: "Study Desk",
    hint: "Start a focus session",
    style: { left: "29%", bottom: "23%", width: "42%", height: "19%" },
    shape: "rect"
  },
  {
    id: "corkboard",
    label: "Quest Board",
    hint: "View your quests",
    style: { left: "25.5%", top: "13%", width: "19.5%", height: "21%" },
    shape: "rect"
  },
  {
    id: "shelf",
    label: "Bookshelf",
    hint: "XP and stats",
    style: { right: "4.5%", top: "7.5%", width: "16.5%", height: "51%" },
    shape: "rect"
  }
];

export default function HotspotOverlay({
  activeHotspot,
  onHotspotClick,
  sessionMode
}: HotspotOverlayProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<HotspotId>(null);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {HOTSPOTS.map((hotspot) => {
        const isActive = activeHotspot === hotspot.id;
        const isHovered = hoveredHotspot === hotspot.id;
        const showDeskPulse = hotspot.id === "desk" && sessionMode === "focusing";

        return (
          <button
            key={hotspot.id}
            className="absolute pointer-events-auto focus-ring"
            style={{
              ...hotspot.style,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              borderRadius: hotspot.shape === "ellipse" ? "50%" : "8px",
              transition: "all 0.25s ease",
              outline: "none"
            }}
            onClick={() => onHotspotClick(hotspot.id)}
            onMouseEnter={() => setHoveredHotspot(hotspot.id)}
            onMouseLeave={() => setHoveredHotspot(null)}
            aria-label={hotspot.label}
            aria-pressed={isActive}
            type="button"
          >
            <div
              style={{
                position: "absolute",
                inset: "-4px",
                borderRadius: hotspot.shape === "ellipse" ? "50%" : "12px",
                border: isActive
                  ? "2px solid rgba(245,166,35,0.7)"
                  : isHovered
                    ? "2px solid rgba(245,166,35,0.4)"
                    : "2px solid transparent",
                background: isActive
                  ? "rgba(245,166,35,0.08)"
                  : isHovered
                    ? "rgba(245,166,35,0.05)"
                    : "transparent",
                boxShadow: isActive
                  ? "0 0 20px 4px rgba(245,166,35,0.25), inset 0 0 12px rgba(245,166,35,0.1)"
                  : isHovered
                    ? "0 0 14px 2px rgba(245,166,35,0.15)"
                    : showDeskPulse
                      ? "0 0 16px 6px rgba(122,158,126,0.25)"
                      : "none",
                transition: "all 0.25s ease",
                pointerEvents: "none"
              }}
            />

            {showDeskPulse && (
              <div
                className="timer-pulse absolute"
                style={{
                  inset: "-8px",
                  borderRadius: "12px",
                  border: "2px solid rgba(122,158,126,0.4)",
                  pointerEvents: "none"
                }}
              />
            )}

            {isHovered && !isActive && (
              <div
                className="absolute pointer-events-none"
                style={{
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--walnut)",
                  color: "var(--cream)",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  padding: "5px 10px",
                  borderRadius: "99px",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(61,43,31,0.3)",
                  letterSpacing: "0.02em",
                  zIndex: 100
                }}
              >
                {hotspot.hint}
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "5px solid var(--walnut)"
                  }}
                />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
