"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

interface XPRadialChartProps {
  progress: number;
  level: number;
}

export default function XPRadialChart({ progress, level }: XPRadialChartProps) {
  const data = [{ name: "xp", value: progress, fill: "var(--primary)" }];

  return (
    <div style={{ position: "relative", width: "72px", height: "72px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="68%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
          barSize={7}
        >
          <RadialBar
            background={{ fill: "rgba(61,43,31,0.08)" }}
            dataKey="value"
            cornerRadius={4}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--ink)",
            lineHeight: 1
          }}
        >
          {level}
        </span>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "8px",
            color: "var(--ink-light)",
            fontWeight: 600,
            letterSpacing: "0.05em"
          }}
        >
          LVL
        </span>
      </div>
    </div>
  );
}
