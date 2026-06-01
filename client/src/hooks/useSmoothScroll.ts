/*
 * Lenis smooth scroll — synced with GSAP ScrollTrigger
 * Critical: ScrollTrigger must use Lenis's scroll position, not native scroll.
 * This is done by calling ScrollTrigger.update() on every Lenis tick.
 *
 * Scroll event bus: components can subscribe via addLenisScrollListener()
 * to receive { scroll, velocity, direction } on every Lenis frame.
 */

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

// Module-level scroll event bus
type ScrollPayload = { scroll: number; velocity: number; direction: number };
type ScrollListener = (payload: ScrollPayload) => void;
const scrollListeners = new Set<ScrollListener>();

export function addLenisScrollListener(fn: ScrollListener) {
  scrollListeners.add(fn);
}

export function removeLenisScrollListener(fn: ScrollListener) {
  scrollListeners.delete(fn);
}

// Store the ticker callback so we can remove the exact same reference
let gsapTickerCallback: ((time: number) => void) | null = null;

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      syncTouch: true,
    });

    lenisInstance = lenis;

    // Sync Lenis with GSAP ScrollTrigger AND broadcast to scroll event bus
    lenis.on("scroll", (e: { scroll: number; velocity: number; direction: number }) => {
      // Only update ScrollTrigger if there are active instances — saves work on simple pages
      if (ScrollTrigger.getAll().length > 0) ScrollTrigger.update();
      if (scrollListeners.size > 0) {
        const payload: ScrollPayload = {
          scroll: e.scroll,
          velocity: e.velocity,
          direction: e.direction,
        };
        scrollListeners.forEach((fn) => fn(payload));
      }
    });

    // Use GSAP ticker to drive Lenis (avoids double rAF)
    // Store the exact callback reference so cleanup removes the right one
    gsapTickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(gsapTickerCallback);

    // Disable GSAP's own lag smoothing so Lenis controls timing
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (gsapTickerCallback) {
        gsap.ticker.remove(gsapTickerCallback);
        gsapTickerCallback = null;
      }
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

/** Instantly jump to top via Lenis (bypasses native scroll which Lenis overrides) */
export function scrollToTopImmediate() {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: true });
  } else {
    // Fallback if Lenis not yet initialized
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }
}

export function getLenisInstance() {
  return lenisInstance;
}
