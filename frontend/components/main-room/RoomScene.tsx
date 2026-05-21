"use client";

import type { SessionMode } from "./room-types";

interface RoomSceneProps {
  sessionMode: SessionMode;
}

const modeOverlay: Record<SessionMode, string> = {
  idle: "linear-gradient(180deg, rgba(7, 14, 27, 0.08) 0%, rgba(7, 14, 27, 0.22) 100%)",
  focusing:
    "linear-gradient(180deg, rgba(7, 14, 27, 0.12) 0%, rgba(9, 18, 34, 0.28) 100%)",
  paused:
    "linear-gradient(180deg, rgba(22, 18, 12, 0.12) 0%, rgba(24, 16, 12, 0.24) 100%)",
};

export default function RoomScene({ sessionMode }: RoomSceneProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("/assets/background.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          transform: "scale(1.01)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 68% 36%, rgba(255, 201, 130, 0.12), transparent 18%), radial-gradient(circle at 84% 26%, rgba(255, 205, 112, 0.09), transparent 20%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{ background: modeOverlay[sessionMode] }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 68% 55% at 62% 55%, transparent 14%, rgba(7, 14, 27, 0.07) 66%, rgba(5, 10, 18, 0.24) 100%)",
        }}
      />

      <div
        className="absolute"
        style={{
          right: "7.2%",
          bottom: "20%",
          width: "clamp(220px, 18vw, 320px)",
          aspectRatio: "1 / 1.12",
          filter: "drop-shadow(0 24px 24px rgba(7, 10, 18, 0.34))",
        }}
      >
        <img
          src="/assets/monkey_avatar_1.png"
          alt="StudyMonkey avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
