/*
 * useReveal — Foudre-style scroll reveal system
 *
 * Exact techniques extracted from Agence Foudre:
 * 1. Text lines: overflow:hidden wrapper + translateY(120%) → translateY(0) on .is-inview
 * 2. Images: scale(1.2) → scale(1) on .is-inview, transition 0.8s cubic-bezier(0.645, 0.045, 0.355, 1)
 * 3. Cards: translateY(25%) + opacity:0 → translate(0) + opacity:1 on .-animateIn
 *    with 2s cubic-bezier(0.19, 1, 0.22, 1) — the elastic ease-out
 * 4. Stagger: CSS --delay custom property on each child
 * 5. All triggered by IntersectionObserver adding classes (no GSAP for reveals)
 */

import { useEffect, useRef } from "react";

// Foudre's exact easing values
export const EASE_EXPO = "cubic-bezier(0.23, 1, 0.32, 1)";
export const EASE_ELASTIC_OUT = "cubic-bezier(0.19, 1, 0.22, 1)";
export const EASE_IMAGE = "cubic-bezier(0.645, 0.045, 0.355, 1)";
export const EASE_STRONG = "cubic-bezier(0.86, 0, 0.07, 1)";

/**
 * useRevealOnScroll — attaches IntersectionObserver to a container ref.
 * When the container enters the viewport, adds 'is-inview' class.
 * All child animations are driven by CSS transitions keyed on this class.
 */
export function useRevealOnScroll(
  options: { threshold?: number; rootMargin?: string; once?: boolean } = {}
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { threshold = 0.15, rootMargin = "0px 0px -8% 0px", once = true } = options;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-inview");
          if (once) observer.disconnect();
        } else if (!once) {
          el.classList.remove("is-inview");
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return ref;
}

/**
 * useStaggerReveal — adds is-inview to a container and sets --delay CSS vars
 * on each [data-stagger] child for staggered entrance.
 */
export function useStaggerReveal(staggerMs = 80) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set delay on each stagger child
    const children = Array.from(el.querySelectorAll("[data-stagger]"));
    children.forEach((child, i) => {
      (child as HTMLElement).style.setProperty("--delay", `${i * staggerMs}ms`);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-inview");
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [staggerMs]);

  return ref;
}
