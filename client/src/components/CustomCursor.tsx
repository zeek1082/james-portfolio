/*
 * DESIGN: "Signal in the Dark" — Custom Cursor
 * Small dot + larger lagging ring. Transforms on hover over interactive elements.
 *
 * Performance: all state is kept in refs and written directly to DOM.
 * No React re-renders triggered by mouse movement or hover changes.
 * Single rAF loop that never restarts.
 */

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only show on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const setVisible = (v: boolean) => {
      if (isVisible.current === v) return;
      isVisible.current = v;
      dot.style.opacity = v ? "1" : "0";
      ring.style.opacity = v ? "1" : "0";
    };

    const setHovering = (h: boolean) => {
      if (isHovering.current === h) return;
      isHovering.current = h;
      if (h) {
        dot.style.background = "linear-gradient(135deg, #7B5EA7, #00D4FF)";
        ring.style.width = "50px";
        ring.style.height = "50px";
        ring.style.borderColor = "rgba(0,212,255,0.5)";
      } else {
        dot.style.background = "rgba(255,255,255,0.9)";
        ring.style.width = "40px";
        ring.style.height = "40px";
        ring.style.borderColor = "rgba(255,255,255,0.2)";
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    const handleHoverIn = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(
        target.tagName === "A" || target.tagName === "BUTTON" ||
        !!target.closest("a") || !!target.closest("button")
      );
    };

    const handleHoverOut = () => setHovering(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleHoverIn);
    document.addEventListener("mouseout", handleHoverOut);

    // Single rAF loop — runs once, never restarts
    const animate = () => {
      // Dot follows immediately
      dot.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;

      // Ring lags behind
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleHoverIn);
      document.removeEventListener("mouseout", handleHoverOut);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // empty deps — runs once, never restarts

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transition: "opacity 0.3s ease, background 0.3s ease, width 0.3s ease, height 0.3s ease",
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.2)",
          pointerEvents: "none",
          zIndex: 9998,
          opacity: 0,
          transition: "opacity 0.3s ease, border-color 0.3s ease, width 0.3s ease, height 0.3s ease",
          willChange: "transform",
        }}
      />
    </>
  );
}
