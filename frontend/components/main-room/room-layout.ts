import type { CSSProperties } from "react";
import type { HotspotId } from "./room-types";

export interface InteractiveRoomObject {
  id: Exclude<HotspotId, null>;
  label: string;
  hint: string;
  shape: "ellipse" | "rect";
  visual: CSSProperties;
  hotspot: CSSProperties;
}

export const INTERACTIVE_ROOM_OBJECTS: Record<Exclude<HotspotId, null>, InteractiveRoomObject> = {
  desk: {
    id: "desk",
    label: "Study Desk",
    hint: "Start a focus session",
    shape: "rect",
    visual: {
      left: "50%",
      bottom: "24.5%",
      transform: "translateX(-50%)",
      width: "46%",
      maxWidth: "680px"
    },
    hotspot: {
      left: "29%",
      bottom: "23%",
      width: "42%",
      height: "19%"
    }
  },
  corkboard: {
    id: "corkboard",
    label: "Quest Board",
    hint: "View your quests",
    shape: "rect",
    visual: {
      left: "26%",
      top: "14%",
      width: "18%",
      maxWidth: "250px"
    },
    hotspot: {
      left: "25.8%",
      top: "13.3%",
      width: "13.4%",
      height: "22.2%"
    }
  },
  shelf: {
    id: "shelf",
    label: "Bookshelf",
    hint: "XP and stats",
    shape: "rect",
    visual: {
      right: "5%",
      top: "8%",
      width: "16%",
      maxWidth: "220px"
    },
    hotspot: {
      right: "5.1%",
      top: "8.15%",
      width: "12.9%",
      height: "19.6%"
    }
  }
};

export const ROOM_HOTSPOTS = Object.values(INTERACTIVE_ROOM_OBJECTS).map(
  ({ id, label, hint, shape, hotspot }) => ({
    id,
    label,
    hint,
    shape,
    style: hotspot
  })
);
