/*
 * Lenis smooth scroll — synced with GSAP ScrollTrigger
 * Critical: ScrollTrigger must use Lenis's scroll position, not native scroll.
 * This is done by calling ScrollTrigger.update() on every Lenis tick.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function useSmoothScroll() {
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    lenisInstance = lenis;

    // Sync Lenis with GSAP ScrollTrigger — this is the key integration
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Use GSAP ticker to drive Lenis (avoids double rAF).
    // Store the function reference so cleanup can actually remove it.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    // Disable GSAP's own lag smoothing so Lenis controls timing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

export function scrollTo(target: string | number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { duration: 1.2 });
  }
}
