import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyMonkey",
  description: "A JRPG-inspired study quest interface for focus sessions and leveling up."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
