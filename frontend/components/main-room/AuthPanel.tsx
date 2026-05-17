"use client";

import { useState } from "react";

interface AuthPanelProps {
  onSubmit: (mode: "login" | "register", email: string, password: string) => Promise<void>;
  isSubmitting: boolean;
}

export default function AuthPanel({ onSubmit, isSubmitting }: AuthPanelProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const minimumPasswordLength = 8;

  return (
    <div
      className="absolute z-50"
      style={{
        left: "50%",
        top: "50%",
        width: "min(340px, calc(100vw - 24px))",
        transform: "translate(-50%, -50%)"
      }}
    >
      <div
        className="surface-parchment shadow-paper-lg"
        style={{
          borderRadius: "12px",
          border: "1.5px solid var(--border)",
          padding: "22px 20px 18px"
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
          Account Required
        </p>
        <h2 className="font-display" style={{ fontSize: "22px", color: "var(--ink)", marginBottom: "8px" }}>
          Enter The Study Room
        </h2>
        <p style={{ fontSize: "12px", lineHeight: 1.6, color: "var(--ink-light)", marginBottom: "16px" }}>
          Sign in or create an account to load your real quests, character XP, and session progress from the backend.
        </p>

        <div className="flex gap-1 mb-4" style={{ background: "var(--parchment-dark)", borderRadius: "8px", padding: "4px" }}>
          <button
            onClick={() => setMode("login")}
            disabled={isSubmitting}
            type="button"
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "6px",
              border: "none",
              background: mode === "login" ? "var(--parchment)" : "transparent",
              color: mode === "login" ? "var(--ink)" : "var(--ink-light)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            disabled={isSubmitting}
            type="button"
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: "6px",
              border: "none",
              background: mode === "register" ? "var(--parchment)" : "transparent",
              color: mode === "register" ? "var(--ink)" : "var(--ink-light)",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Register
          </button>
        </div>

        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await onSubmit(mode, email, password);
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="input-cozy"
            disabled={isSubmitting}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="input-cozy"
            disabled={isSubmitting}
            required
            minLength={minimumPasswordLength}
          />
          <p
            style={{
              marginTop: "-6px",
              fontSize: "11px",
              lineHeight: 1.5,
              color: "var(--ink-light)",
              fontFamily: "var(--font-sans)"
            }}
          >
            Passwords must be at least {minimumPasswordLength} characters.
          </p>
          <button className="btn-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Working..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
