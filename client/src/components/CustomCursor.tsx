/*
 * DESIGN: "Signal in the Dark" — Custom Cursor
 * Small dot + larger lagging ring.
 *
 * PERFORMANCE: Zero setState in the hot path.
 * - All cursor state (position, hover, visibility) is tracked via refs
 * - DOM mutations happen directly in the rAF loop — no React re-renders
 * - Ring size change uses transform:scale instead of width/height (GPU only)
 * - useEffect deps array is empty — single stable loop, no re-registration
 */

import { useEffect, useRef } from "react";

// Wrapper that skips rendering entirely on touch devices
export default function CustomCursor() {
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) return null;
  return <CustomCursorInner />;
}

function CustomCursorInner() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isVisible = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Only show on desktop (pointer: fine)
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Initial state — hidden until first mousemove
    dot.style.opacity = "0";
    ring.style.opacity = "0";

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible.current) {
        isVisible.current = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    const handleHoverIn = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        if (!isHovering.current) {
          isHovering.current = true;
          // Swap dot color via CSS class — no layout change
          dot.classList.add("cursor-hover");
          ring.classList.add("cursor-hover");
        }
      }
    };

    const handleHoverOut = () => {
      if (isHovering.current) {
        isHovering.current = false;
        dot.classList.remove("cursor-hover");
        ring.classList.remove("cursor-hover");
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleHoverIn, { passive: true });
    document.addEventListener("mouseout", handleHoverOut, { passive: true });

    // Single stable rAF loop — only transform/opacity, GPU only
    const animate = () => {
      // Dot: instant follow
      dot.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;

      // Ring: lerp lag
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${isHovering.current ? 1.25 : 1})`;

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
  }, []); // stable — never re-registers

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "rgba(14,12,10,0.85)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          transition: "opacity 0.3s ease, background 0.25s ease",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(14,12,10,0.2)",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          transition: "opacity 0.3s ease, border-color 0.25s ease, transform 0.15s ease",
        }}
      />
      <style>{`
        .cursor-dot.cursor-hover {
          background: linear-gradient(135deg, #1A3A2A, #B5CC18) !important;
        }
        .cursor-ring.cursor-hover {
          border-color: rgba(196,98,42,0.5) !important;
        }
      `}</style>
    </>
  );
}
