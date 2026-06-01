/*
 * DESIGN: "Signal in the Dark" — Scroll Progress
 * Thin gradient line at the top of the viewport showing scroll progress.
 * Uses a ref to write directly to the DOM — no React re-renders on scroll.
 */

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      bar.style.width = `${pct}%`;
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
        width: "0%",
        background: "linear-gradient(90deg, #7B5EA7, #00D4FF)",
        zIndex: 100,
        pointerEvents: "none",
        willChange: "width",
      }}
    />
  );
}
