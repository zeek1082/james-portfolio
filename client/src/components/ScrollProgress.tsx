/*
 * DESIGN: "Signal in the Dark" — Scroll Progress
 * Thin gradient line at the top of the viewport showing scroll progress.
 *
 * PERFORMANCE: No setState — direct DOM mutation via ref.
 * Uses transform:scaleX (GPU) instead of animating width (layout).
 * transform-origin: left so it scales from the left edge.
 */

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = `scaleX(${pct})`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={barRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "2px",
        width: "100%",
        transformOrigin: "left center",
        transform: "scaleX(0)",
        background: "linear-gradient(90deg, #1A3A2A, #B5CC18)",
        zIndex: 100,
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
