/*
 * SCROLL MOTION ENGINE — "Signal in the Dark"
 * Foudre-style scroll motion:
 * 1. Fixed background layer morphs color via CSS transition (smooth, no rAF needed)
 * 2. GSAP ScrollTrigger parallax on project images
 * 3. Staggered text line reveals on scroll
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Background color morpher — Foudre technique:
// CSS transition on the fixed background div, IntersectionObserver triggers color change
export function useBackgroundMorph(bgRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    // Apply CSS transition for smooth color morphing (like Foudre)
    bg.style.transition = "background-color 0.7s cubic-bezier(0.23, 1, 0.32, 1)";
    bg.style.backgroundColor = "#080808";

    function morphTo(color: string) {
      if (bg) bg.style.backgroundColor = color;
    }

    // Watch all sections with data-bg-color
    const sections = document.querySelectorAll("[data-bg-color]");
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const color = (section as HTMLElement).dataset.bgColor || "#080808";
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              morphTo(color);
            }
          });
        },
        {
          threshold: 0,
          // Trigger when section center crosses viewport center
          rootMargin: "-35% 0px -35% 0px",
        }
      );
      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach(o => o.disconnect());
    };
  }, [bgRef]);
}

// Legacy hooks kept for compatibility
export function useParallaxImages() {
  // Parallax is now handled per-component with GSAP context
}

export function useTextReveal() {
  // Text reveal is now handled per-component with GSAP context
}

// Horizontal scroll sequence (kept for future use)
export function useHorizontalScroll(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const track = container.querySelector("[data-h-track]") as HTMLElement;
    if (!track) return;

    const timeout = setTimeout(() => {
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = trackWidth - viewportWidth;

      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${scrollDistance}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      ScrollTrigger.refresh();
    }, 700);

    return () => clearTimeout(timeout);
  }, [containerRef]);
}

// Utility: interpolate between hex colors
export function lerpColor(a: string, b: string, t: number): string {
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [8, 8, 8];
  };
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  const r = Math.round(ar + (br - ar) * t).toString(16).padStart(2, "0");
  const g = Math.round(ag + (bg - ag) * t).toString(16).padStart(2, "0");
  const bHex = Math.round(ab + (bb - ab) * t).toString(16).padStart(2, "0");
  return `#${r}${g}${bHex}`;
}
