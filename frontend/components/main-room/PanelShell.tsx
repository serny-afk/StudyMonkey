"use client";

import type { CSSProperties, ReactNode } from "react";

type PanelPlacement = "right" | "left";

interface PanelShellProps {
  children: ReactNode;
  placement?: PanelPlacement;
  width?: string;
  style?: CSSProperties;
}

const placementStyles: Record<PanelPlacement, CSSProperties> = {
  right: {
    right: "clamp(12px, 4vw, 32px)",
    top: "clamp(12px, 4vh, 32px)"
  },
  left: {
    left: "clamp(12px, 4vw, 32px)",
    top: "clamp(12px, 4vh, 32px)"
  }
};

export default function PanelShell({
  children,
  placement = "right",
  width = "min(320px, calc(100vw - 24px))",
  style
}: PanelShellProps) {
  return (
    <div
      className="absolute overlay-enter"
      style={{
        ...placementStyles[placement],
        zIndex: 50,
        width,
        maxHeight: "calc(100vh - 24px)",
        ...style
      }}
    >
      {children}
    </div>
  );
}
