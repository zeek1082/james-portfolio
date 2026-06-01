/*
 * DESIGN: "Signal in the Dark" — Fixed Background Layer
 * Foudre-style: a fixed full-viewport div behind everything.
 * Its background-color morphs smoothly as sections enter the viewport.
 * The page content sits on top with transparent backgrounds.
 */

import { useRef } from "react";
import { useBackgroundMorph } from "@/hooks/useScrollMotion";

export default function FixedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  useBackgroundMorph(bgRef);

  return (
    <div
      ref={bgRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        backgroundColor: "#F2EDE8",
        transition: "none", // We handle transitions manually in the hook
        pointerEvents: "none",
      }}
    />
  );
}
