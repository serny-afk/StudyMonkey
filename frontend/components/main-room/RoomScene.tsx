"use client";

import { INTERACTIVE_ROOM_OBJECTS } from "./room-layout";
import type { SessionMode } from "./room-types";

interface RoomSceneProps {
  ambience: "day" | "evening" | "night" | "rain";
  sessionMode: SessionMode;
}

const ambienceConfig = {
  day: {
    skyTop: "#87CEEB",
    skyBottom: "#c8e8f5",
    lightOverlay: "rgba(255, 248, 220, 0.05)",
    wallColor: "#d4c4a0",
    floorColor: "#8b6340",
    windowGlow: "#fffde0"
  },
  evening: {
    skyTop: "#e8704a",
    skyBottom: "#f5a623",
    lightOverlay: "rgba(245, 166, 35, 0.08)",
    wallColor: "#c8b48a",
    floorColor: "#7a5530",
    windowGlow: "#ffd080"
  },
  night: {
    skyTop: "#1a1a3e",
    skyBottom: "#2d2d5a",
    lightOverlay: "rgba(100, 80, 200, 0.05)",
    wallColor: "#b0a080",
    floorColor: "#6a4520",
    windowGlow: "#b0b8ff"
  },
  rain: {
    skyTop: "#7a8fa0",
    skyBottom: "#9aafb8",
    lightOverlay: "rgba(120, 140, 160, 0.08)",
    wallColor: "#bfb090",
    floorColor: "#7a5530",
    windowGlow: "#d0e8f0"
  }
};

export default function RoomScene({ ambience, sessionMode }: RoomSceneProps) {
  const cfg = ambienceConfig[ambience];
  const { corkboard, desk, shelf } = INTERACTIVE_ROOM_OBJECTS;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${cfg.wallColor} 0%, ${cfg.wallColor}ee 60%, ${cfg.floorColor} 100%)`
        }}
      />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(61,43,31,0.15) 1px, transparent 0)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="absolute inset-0" style={{ background: cfg.lightOverlay }} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 40%, transparent 30%, rgba(61,43,31,0.35) 100%)"
        }}
      />

      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "30%",
          background: `linear-gradient(180deg, ${cfg.floorColor} 0%, #5a3a20 100%)`
        }}
      />

      <div className="absolute bottom-0 left-0 right-0" style={{ height: "30%" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={`plank-h-${i}`}
            className="absolute left-0 right-0"
            style={{
              top: `${i * 14.5}%`,
              height: "1px",
              background: "rgba(61,43,31,0.2)"
            }}
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <div
            key={`plank-v-${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${i * 8.5 + 2}%`,
              width: "1px",
              background: "rgba(61,43,31,0.1)",
              opacity: 0.5
            }}
          />
        ))}
      </div>

      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "30%",
          height: "16px",
          background: "linear-gradient(180deg, #6b4c35 0%, #5a3a20 100%)",
          boxShadow: "0 -2px 8px rgba(61,43,31,0.3)"
        }}
      />

      <div className="absolute" style={{ left: "4.5%", top: "9.5%", width: "25%", maxWidth: "380px" }}>
        <div
          className="relative"
          style={{
            background: "#5a3a20",
            borderRadius: "4px",
            padding: "10px",
            boxShadow: "4px 4px 16px rgba(61,43,31,0.4)"
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${cfg.skyTop}, ${cfg.skyBottom})`,
              borderRadius: "2px",
              aspectRatio: "3/4",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: "6px",
              padding: "4px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 30% 20%, ${cfg.windowGlow}60, transparent 60%)`
              }}
            />
            {[0, 1, 2, 3].map((p) => (
              <div
                key={`pane-${p}`}
                style={{
                  background: `linear-gradient(135deg, ${cfg.skyTop}cc, ${cfg.skyBottom}88)`,
                  borderRadius: "1px"
                }}
              />
            ))}

            {(ambience === "day" || ambience === "evening") && (
              <div
                className="absolute animate-float-slow"
                style={{
                  right: "15%",
                  top: "10%",
                  width: "20%",
                  aspectRatio: "1",
                  borderRadius: "50%",
                  background:
                    ambience === "evening"
                      ? "linear-gradient(135deg, #ff8c42, #f5a623)"
                      : "linear-gradient(135deg, #fffde0, #f5f0c0)",
                  boxShadow:
                    ambience === "evening"
                      ? "0 0 20px rgba(255,140,66,0.5)"
                      : "0 0 15px rgba(255,253,200,0.6)"
                }}
              />
            )}
          </div>

          <div
            className="absolute"
            style={{
              top: "10px",
              left: "10px",
              right: "10px",
              bottom: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none"
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "0",
                bottom: "0",
                width: "8px",
                background: "#5a3a20",
                transform: "translateX(-50%)"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "0",
                right: "0",
                height: "8px",
                background: "#5a3a20",
                transform: "translateY(-50%)"
              }}
            />
          </div>
        </div>

        <div
          className="absolute pointer-events-none"
          style={{ top: "-12px", left: "-26px", width: "38px", bottom: "-12px" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, #8b5e3c, #a0704a)",
              borderRadius: "0 0 8px 8px",
              clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)"
            }}
          />
        </div>

        <div
          className="absolute pointer-events-none"
          style={{ top: "-12px", right: "-26px", width: "38px", bottom: "-12px" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, #a0704a, #8b5e3c)",
              borderRadius: "0 0 8px 8px",
              clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)"
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "-16px",
            left: "-46px",
            right: "-46px",
            height: "8px",
            background: "#4a2e14",
            borderRadius: "999px"
          }}
        />
      </div>

      <div className="absolute" style={shelf.visual}>
        <div
          style={{
            background: "linear-gradient(180deg, #6b4c35 0%, #5a3a20 100%)",
            borderRadius: "6px 6px 4px 4px",
            padding: "8px 6px",
            boxShadow: "4px 4px 20px rgba(61,43,31,0.4)",
            border: "2px solid #4a2e14"
          }}
        >
          {[
            ["#c8403a", "#3d6b8e", "#7a9e4e", "#c8773a", "#8b5e8e"],
            ["#3d6b8e", "#c8773a", "#c8403a", "#6b8e3d"],
            ["#8e6b3d", "#c8403a", "#4e8e6b", "#c8773a", "#3d6b8e"]
          ].map((row, ri) => (
            <div key={`shelf-row-${ri}`}>
              <div className="flex items-end gap-0.5 justify-center" style={{ height: "42px", padding: "0 4px" }}>
                {row.map((color, bi) => (
                  <div
                    key={`book-${ri}-${bi}`}
                    style={{
                      width: `${12 + (bi % 3) * 4}px`,
                      height: `${28 + (bi % 4) * 6}px`,
                      background: `linear-gradient(180deg, ${color}dd, ${color}aa)`,
                      borderRadius: "2px 2px 0 0",
                      flexShrink: 0,
                      boxShadow: "1px 0 3px rgba(0,0,0,0.2)"
                    }}
                  />
                ))}
                <div
                  style={{
                    width: "10px",
                    height: "14px",
                    background: "linear-gradient(180deg, #f5a623, #c8773a)",
                    borderRadius: "50% 50% 0 0",
                    marginLeft: "4px"
                  }}
                />
              </div>
              <div
                style={{
                  height: "6px",
                  background: "linear-gradient(180deg, #8b6340, #6b4c35)",
                  margin: "0 -2px",
                  borderRadius: "1px",
                  boxShadow: "0 2px 4px rgba(61,43,31,0.3)"
                }}
              />
            </div>
          ))}

          <div className="flex items-end gap-2 justify-center" style={{ height: "36px", padding: "4px" }}>
            <div className="relative" style={{ width: "20px" }}>
              <div
                style={{
                  width: "8px",
                  height: "14px",
                  background: "#4e8e4e",
                  margin: "0 auto",
                  borderRadius: "0 0 2px 2px"
                }}
              />
              <div
                style={{
                  width: "20px",
                  height: "10px",
                  background: "linear-gradient(180deg, #a0704a, #8b5e3c)",
                  borderRadius: "2px 2px 4px 4px"
                }}
              />
            </div>
            <div className="relative animate-flicker" style={{ width: "10px" }}>
              <div
                style={{
                  width: "4px",
                  height: "6px",
                  background: "linear-gradient(180deg, #ff8c42, #f5a623)",
                  borderRadius: "50% 50% 0 0",
                  margin: "0 auto",
                  opacity: 0.9
                }}
              />
              <div
                style={{
                  width: "10px",
                  height: "18px",
                  background: "linear-gradient(180deg, #fdf6e3, #e8d5b0)",
                  borderRadius: "2px"
                }}
              />
            </div>
            <div
              style={{
                width: "18px",
                textAlign: "center",
                fontSize: "11px",
                lineHeight: 1,
                color: "#f5a623",
                fontWeight: 700
              }}
            >
              XP
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "10%",
            right: "10%",
            height: "8px",
            background: "rgba(61,43,31,0.2)",
            filter: "blur(4px)",
            borderRadius: "50%"
          }}
        />
      </div>

      <div className="absolute" style={desk.visual}>
        <div
          style={{
            background: "linear-gradient(180deg, #8b6340 0%, #7a5530 60%, #6b4520 100%)",
            borderRadius: "8px 8px 0 0",
            height: "16px",
            boxShadow: "0 -2px 12px rgba(61,43,31,0.3)",
            position: "relative"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: "8px",
              right: "8px",
              height: "3px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "1px"
            }}
          />
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, #7a5530 0%, #6b4520 100%)",
            padding: "8px 16px 4px",
            display: "flex",
            alignItems: "flex-end",
            gap: "12px",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "60px",
              height: "44px",
              background: "linear-gradient(135deg, #fdf6e3, #f0e6c8)",
              borderRadius: "3px 6px 6px 3px",
              border: "1px solid #c9a87c",
              position: "relative",
              flexShrink: 0
            }}
          >
            <div style={{ position: "absolute", left: "8px", top: "8px", right: "8px", height: "2px", background: "#c9a87c", opacity: 0.5 }} />
            <div style={{ position: "absolute", left: "8px", top: "14px", right: "8px", height: "2px", background: "#c9a87c", opacity: 0.4 }} />
            <div style={{ position: "absolute", left: "8px", top: "20px", right: "8px", height: "2px", background: "#c9a87c", opacity: 0.3 }} />
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                bottom: "0",
                width: "6px",
                background: "linear-gradient(180deg, #c8773a, #a05a28)",
                borderRadius: "3px 0 0 3px"
              }}
            />
          </div>

          <div className="relative" style={{ width: "28px", flexShrink: 0 }}>
            <div
              style={{
                width: "28px",
                height: "20px",
                background: "linear-gradient(135deg, #f5a623, #c8773a)",
                clipPath: "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)",
                position: "relative"
              }}
            />
            <div style={{ width: "4px", height: "28px", background: "#5a3a20", margin: "0 auto" }} />
            <div style={{ width: "16px", height: "4px", background: "#5a3a20", margin: "0 auto" }} />
          </div>

          <div style={{ width: "22px", flexShrink: 0 }}>
            <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginBottom: "2px" }}>
              <div style={{ width: "3px", height: "16px", background: "#3d6b8e", borderRadius: "1px 1px 0 0" }} />
              <div style={{ width: "3px", height: "20px", background: "#c8403a", borderRadius: "1px 1px 0 0" }} />
              <div style={{ width: "3px", height: "14px", background: "#f5a623", borderRadius: "1px 1px 0 0" }} />
            </div>
            <div style={{ width: "22px", height: "14px", background: "linear-gradient(180deg, #8b5e3c, #6b4c35)", borderRadius: "3px" }} />
          </div>

          <div style={{ width: "24px", flexShrink: 0 }}>
            <div style={{ fontSize: "8px", textAlign: "center", opacity: 0.6, color: "rgba(255,255,255,0.75)" }}>~</div>
            <div
              style={{
                width: "24px",
                height: "22px",
                background: "linear-gradient(180deg, #fdf6e3, #f0e6c8)",
                borderRadius: "3px 3px 6px 6px",
                border: "1.5px solid #c9a87c",
                position: "relative"
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "-5px",
                  top: "4px",
                  width: "5px",
                  height: "10px",
                  border: "1.5px solid #c9a87c",
                  borderLeft: "none",
                  borderRadius: "0 4px 4px 0"
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "4px",
                  right: "4px",
                  height: "2px",
                  background: "#8b5e3c",
                  borderRadius: "1px",
                  opacity: 0.4
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
          <div style={{ width: "12px", height: "24px", background: "linear-gradient(180deg, #6b4520, #5a3510)", borderRadius: "0 0 3px 3px" }} />
          <div style={{ width: "12px", height: "24px", background: "linear-gradient(180deg, #6b4520, #5a3510)", borderRadius: "0 0 3px 3px" }} />
        </div>
      </div>

      <div className="absolute" style={corkboard.visual}>
        <div
          className="surface-cork"
          style={{
            borderRadius: "6px",
            padding: "10px",
            border: "6px solid #8b6340",
            boxShadow: "4px 4px 16px rgba(61,43,31,0.35)",
            aspectRatio: "4/3",
            position: "relative"
          }}
        >
          {[
            { top: "8%", left: "8%", rot: "-3deg", color: "#fdf6e3", text: "Math HW", pin: "#c8403a" },
            { top: "12%", left: "50%", rot: "2deg", color: "#e8f5e9", text: "Read Ch.4", pin: "#3d6b8e" },
            { top: "55%", left: "15%", rot: "-1deg", color: "#fff9e8", text: "Essay draft", pin: "#f5a623" },
            { top: "50%", left: "55%", rot: "4deg", color: "#fce4ec", text: "5-day streak", pin: "#c8403a" }
          ].map((note, ni) => (
            <div
              key={`cork-note-${ni}`}
              className="absolute"
              style={{
                top: note.top,
                left: note.left,
                transform: `rotate(${note.rot})`,
                background: note.color,
                padding: "4px 6px",
                borderRadius: "2px",
                fontSize: "7px",
                fontFamily: "var(--font-sans)",
                color: "var(--ink)",
                boxShadow: "1px 2px 4px rgba(61,43,31,0.2)",
                whiteSpace: "nowrap"
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: note.pin,
                  position: "absolute",
                  top: "-3px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.3)"
                }}
              />
              {note.text}
            </div>
          ))}

          <div
            style={{
              position: "absolute",
              top: "0",
              left: "20%",
              width: "30%",
              height: "8px",
              background: "rgba(200,119,58,0.4)",
              transform: "rotate(-1deg)"
            }}
          />
        </div>
      </div>

      <div
        className="absolute"
        style={{
          right: "14.5%",
          bottom: "15.5%",
          width: "22.5%",
          maxWidth: "330px",
          minWidth: "216px",
          aspectRatio: "1 / 1.18",
          filter: "drop-shadow(0 12px 18px rgba(61,43,31,0.18))"
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
            pointerEvents: "none"
          }}
        />
      </div>

      {[15, 35, 55, 72, 88].map((x, di) => (
        <div
          key={`dust-${di}`}
          className="absolute pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${20 + di * 8}%`,
            width: "3px",
            height: "3px",
            borderRadius: "50%",
            background: "rgba(245, 166, 35, 0.3)",
            animation: `float ${4 + di * 0.7}s ease-in-out infinite`,
            animationDelay: `${di * 0.5}s`
          }}
        />
      ))}
    </div>
  );
}
