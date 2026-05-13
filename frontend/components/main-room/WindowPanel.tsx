"use client";

interface WindowPanelProps {
  ambience: "day" | "evening" | "night" | "rain";
  ambienceSound: string;
  isSoundOn: boolean;
  onSetAmbience: (a: "day" | "evening" | "night" | "rain") => void;
  onSetSound: (s: string) => void;
  onToggleSound: () => void;
  onClose: () => void;
}

const AMBIENCE_OPTIONS = [
  { id: "day" as const, label: "Morning", desc: "Bright and clear" },
  { id: "evening" as const, label: "Evening", desc: "Golden hour" },
  { id: "night" as const, label: "Night", desc: "Starlit calm" },
  { id: "rain" as const, label: "Rainy", desc: "Cozy drizzle" }
];

const SOUND_OPTIONS = ["fireplace", "rain", "cafe", "forest", "ocean", "silence"];

export default function WindowPanel({
  ambience,
  ambienceSound,
  isSoundOn,
  onSetAmbience,
  onSetSound,
  onToggleSound,
  onClose
}: WindowPanelProps) {
  return (
    <div className="absolute overlay-enter" style={{ left: "4%", top: "52%", zIndex: 50, width: "280px" }}>
      <div className="surface-parchment shadow-paper-lg" style={{ borderRadius: "8px", border: "1.5px solid var(--border)", position: "relative" }}>
        <div style={{ padding: "18px 16px 16px" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display" style={{ fontSize: "17px", fontWeight: 600, color: "var(--ink)" }}>
                The Window
              </h2>
              <p style={{ fontSize: "11px", color: "var(--ink-light)", fontFamily: "var(--font-sans)", marginTop: "2px" }}>
                Set your scene and soundscape
              </p>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: "2px 6px", fontSize: "14px" }} type="button">
              x
            </button>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--ink-light)", fontFamily: "var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
              Time of Day
            </p>
            <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {AMBIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onSetAmbience(opt.id)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: `1.5px solid ${ambience === opt.id ? "var(--primary)" : "var(--border)"}`,
                    background:
                      ambience === opt.id
                        ? "linear-gradient(135deg, rgba(200,119,58,0.1), rgba(245,166,35,0.06))"
                        : "var(--parchment-dark)",
                    cursor: "pointer",
                    textAlign: "left"
                  }}
                  type="button"
                >
                  <p style={{ fontSize: "12px", fontWeight: 600, color: ambience === opt.id ? "var(--primary)" : "var(--ink)", fontFamily: "var(--font-sans)" }}>
                    {opt.label}
                  </p>
                  <p style={{ fontSize: "10px", color: "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <div className="flex items-center justify-between mb-2">
              <p style={{ fontSize: "10px", fontWeight: 600, color: "var(--ink-light)", fontFamily: "var(--font-sans)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Soundscape
              </p>
              <button
                onClick={onToggleSound}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 8px",
                  borderRadius: "99px",
                  background: isSoundOn ? "rgba(122,158,126,0.15)" : "rgba(61,43,31,0.06)",
                  border: `1px solid ${isSoundOn ? "rgba(122,158,126,0.3)" : "var(--border)"}`,
                  cursor: "pointer",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-sans)",
                  color: isSoundOn ? "#5a8060" : "var(--ink-light)"
                }}
                type="button"
              >
                <span>{isSoundOn ? "On" : "Off"}</span>
              </button>
            </div>

            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {SOUND_OPTIONS.map((sound) => (
                <button
                  key={sound}
                  onClick={() => onSetSound(sound)}
                  style={{
                    padding: "6px 4px",
                    borderRadius: "6px",
                    border: `1.5px solid ${ambienceSound === sound ? "var(--primary)" : "var(--border)"}`,
                    background: ambienceSound === sound ? "rgba(200,119,58,0.1)" : "var(--parchment-dark)",
                    cursor: "pointer",
                    textAlign: "center",
                    opacity: !isSoundOn && sound !== "silence" ? 0.5 : 1
                  }}
                  type="button"
                >
                  <div style={{ fontSize: "10px", fontWeight: ambienceSound === sound ? 700 : 500, color: ambienceSound === sound ? "var(--primary)" : "var(--ink-light)", fontFamily: "var(--font-sans)" }}>
                    {sound}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
