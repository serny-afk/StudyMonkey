"use client";

interface RoomStatusNoticeProps {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function RoomStatusNotice({
  title,
  body,
  actionLabel,
  onAction
}: RoomStatusNoticeProps) {
  return (
    <div
      className="absolute z-50"
      style={{
        left: "50%",
        top: "50%",
        width: "min(360px, calc(100vw - 32px))",
        transform: "translate(-50%, -50%)"
      }}
    >
      <div
        className="surface-parchment shadow-paper-lg"
        style={{
          borderRadius: "12px",
          border: "1.5px solid var(--border)",
          padding: "20px 18px"
        }}
      >
        <p
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--ink-light)",
            fontFamily: "var(--font-sans)",
            marginBottom: "8px"
          }}
        >
          Room Status
        </p>
        <h2 className="font-display" style={{ fontSize: "21px", color: "var(--ink)", marginBottom: "8px" }}>
          {title}
        </h2>
        <p style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--ink-light)" }}>{body}</p>
        {actionLabel && onAction && (
          <button className="btn-primary" onClick={onAction} style={{ marginTop: "16px", width: "100%" }} type="button">
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
