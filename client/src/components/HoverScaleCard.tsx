/*
 * HoverScaleCard — Reusable hover scale wrapper
 *
 * PERFORMANCE: Pure CSS hover — zero React state, zero re-renders.
 * The scale is injected as a CSS custom property so it can be
 * customised per-instance without generating unique class names.
 */

import type { CSSProperties, ReactNode } from "react";

interface HoverScaleCardProps {
  children: ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

export default function HoverScaleCard({
  children,
  scale = 1.025,
  duration = 350,
  className,
  style,
}: HoverScaleCardProps) {
  return (
    <div
      className={`hover-scale-card${className ? ` ${className}` : ""}`}
      style={{
        width: "100%",
        height: "100%",
        cursor: "pointer",
        ...style,
        // CSS custom props for per-instance values
        ["--hsc-scale" as string]: scale,
        ["--hsc-duration" as string]: `${duration}ms`,
        transition: `transform ${duration}ms cubic-bezier(0.23,1,0.32,1)`,
        transform: "scale(1)",
      }}
    >
      {children}
      <style>{`
        .hover-scale-card:hover {
          transform: scale(var(--hsc-scale, 1.025)) !important;
        }
      `}</style>
    </div>
  );
}
