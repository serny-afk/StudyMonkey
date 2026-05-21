"use client";

import type { RoomSectionId } from "./room-types";

interface RoomMenuProps {
  activeSection: RoomSectionId;
  onSelect: (id: Exclude<RoomSectionId, null>) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const MENU_ITEMS: Array<{
  id: Exclude<RoomSectionId, null>;
  label: string;
  description: string;
  badge: string;
}> = [
  {
    id: "desk",
    label: "Focus Session",
    description: "Timer and current study quest",
    badge: "FS"
  },
  {
    id: "quests",
    label: "Quest Log",
    description: "Open, active, and completed quests",
    badge: "QL"
  },
  {
    id: "stats",
    label: "XP & Stats",
    description: "Level progress and current XP",
    badge: "XP"
  }
];

export default function RoomMenu({
  activeSection,
  onSelect,
  collapsed,
  onToggleCollapsed
}: RoomMenuProps) {
  return (
    <aside
      className="absolute z-40 flex flex-col"
      style={{
        left: "20px",
        top: "20px",
        bottom: "20px",
        width: collapsed ? "88px" : "min(292px, calc(100vw - 40px))",
        borderRadius: "28px",
        background: "linear-gradient(180deg, rgba(18,20,33,0.97), rgba(24,27,41,0.94))",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 28px 80px rgba(6, 10, 18, 0.42)",
        backdropFilter: "blur(20px)",
        transition: "width 0.22s ease"
      }}
    >
      <div style={{ padding: collapsed ? "18px 14px 10px" : "22px 20px 14px" }}>
        <div className="flex items-center gap-3" style={{ justifyContent: collapsed ? "center" : "space-between" }}>
          <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              background: "linear-gradient(180deg, #2f8dff 0%, #2375e8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f9fbff",
              fontFamily: "var(--font-sans)",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.06em"
            }}
          >
            SM
          </div>
          <div>
            <p
              style={{
                color: "rgba(188,195,217,0.64)",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)"
              }}
            >
              Productivity Room
            </p>
            <h1
              style={{
                color: "#f5f7fb",
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: 1.15,
                marginTop: "3px"
              }}
            >
              StudyMonkey
            </h1>
          </div>
        </div>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.04)",
              color: "#dfe7fb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>

        {!collapsed && (
          <p
            style={{
              marginTop: "14px",
              color: "rgba(198,205,225,0.58)",
              fontSize: "12px",
              lineHeight: 1.6,
              fontFamily: "var(--font-sans)"
            }}
          >
            A cleaner app-style layout with the same study session, quest log, and progression flow underneath.
          </p>
        )}
      </div>

      <div style={{ padding: "8px 12px 0" }}>
        {!collapsed && (
          <p
            style={{
              padding: "0 8px 10px",
              color: "rgba(159,169,193,0.46)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans)"
            }}
          >
            Navigation
          </p>
        )}

        <div className="grid gap-2">
          {MENU_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  width: "100%",
                  justifyContent: collapsed ? "center" : "flex-start",
                  textAlign: "left",
                  padding: collapsed ? "12px" : "13px 14px",
                  borderRadius: "20px",
                  border: isActive
                    ? "1px solid rgba(69, 146, 255, 0.32)"
                    : "1px solid rgba(255,255,255,0.04)",
                  background: isActive
                    ? "linear-gradient(180deg, rgba(45, 97, 181, 0.48), rgba(28, 55, 106, 0.42))"
                    : "rgba(255,255,255,0.025)",
                  boxShadow: isActive ? "0 14px 28px rgba(8, 13, 24, 0.3)" : "none",
                  cursor: "pointer",
                  transition: "all 0.18s ease"
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "12px",
                    background: isActive
                      ? "linear-gradient(180deg, #78bbff 0%, #4d8fff 100%)"
                      : "rgba(255,255,255,0.07)",
                    color: isActive ? "#11223b" : "#dfe7fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    flexShrink: 0
                  }}
                >
                  {item.badge}
                </div>

                {!collapsed && <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      color: "#f5f7fb",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)"
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      marginTop: "3px",
                      color: "rgba(182,191,213,0.6)",
                      fontSize: "10px",
                      lineHeight: 1.5,
                      fontFamily: "var(--font-sans)"
                    }}
                  >
                    {item.description}
                  </div>
                </div>}
              </button>
            );
          })}
        </div>
      </div>

      {!collapsed && <div style={{ marginTop: "auto", padding: "18px 16px 18px" }}>
        <div
          style={{
            borderRadius: "24px",
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(255,255,255,0.05)",
            padding: "14px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <img
            src="/assets/monkey_avatar_1.png"
            alt="StudyMonkey companion"
            style={{
              width: "58px",
              height: "58px",
              objectFit: "contain",
              flexShrink: 0,
              filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.22))"
            }}
          />
          <div>
            <div
              style={{
                color: "#f7f8fb",
                fontSize: "12px",
                fontWeight: 600,
                fontFamily: "var(--font-sans)"
              }}
            >
              Companion
            </div>
            <div
              style={{
                marginTop: "3px",
                color: "rgba(182,191,213,0.6)",
                fontSize: "10px",
                lineHeight: 1.5,
                fontFamily: "var(--font-sans)"
              }}
            >
              The monkey stays as your room mascot for now, with the UI ready for future reactions and states.
            </div>
          </div>
        </div>
      </div>}
    </aside>
  );
}
