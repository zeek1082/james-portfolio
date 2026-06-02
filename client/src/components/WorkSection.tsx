/**
 * WorkSection — Sticky scroll-driven card stack
 *
 * Design: Dark editorial / Brutalist Precision
 *
 * Mechanic:
 *   - Left panel: sticky info, updates per active card
 *   - All cards rest at centerLeft = (window.innerWidth / 2) - (cardWidth / 2)
 *     so the resting position is centered on the FULL page (not just the card area)
 *   - Card 1: pinned at left: centerLeft, never moves
 *   - Cards 2–N: absolutely positioned at left: centerLeft
 *     Each starts with translateX = (j)*step (off to the right)
 *     As scroll progresses, translateX moves toward 0 (docking at centerLeft)
 *
 * centerLeft = (vw / 2) - (cardW / 2)  — computed in JS at scroll time
 * step = cardWidth + gap
 */

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useIsMobile } from "@/hooks/useMobile";
import { Link, useLocation, useRouter } from "wouter";
import { scrollToTopImmediate, getLenisInstance } from "@/hooks/useSmoothScroll";
import HoverScaleCard from "./HoverScaleCard";

interface Project {
  id: number;
  num: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  bgColor: string;
  accentColor: string;
  slug: string;
}

const projects: Project[] = [
  {
    id: 1,
    num: "01",
    category: "DESIGN SYSTEMS",
    title: "Ray-Ban Meta Display Design System",
    description:
      "A design system built for a light passthrough display — mitigating optical artifacts while maintaining visual clarity.",
    tags: ["DESIGN SYSTEMS", "WEARABLE OS"],
    image: "/manus-storage/rayban-meta-hero_1a588487.webp",
    bgColor: "#F2EDE8",
    accentColor: "#1A3A2A",
    slug: "rayban-display-ds",
  },
  {
    id: 2,
    num: "02",
    category: "DESIGN SYSTEMS",
    title: "Wearables Color System",
    description:
      "A unified color token system spanning smartwatches, phones, and AR display glasses — with third-party theming for Spotify, Apple Music, and more.",
    tags: ["COLOR SYSTEMS", "CROSS-DEVICE"],
    image: "/manus-storage/wearables-color-system-card_09dd2118.webp",
    bgColor: "#F5F1EC",
    accentColor: "#1A3A2A",
    slug: "wearables-color-system",
  },
  {
    id: 3,
    num: "03",
    category: "NEURAL INPUT",
    title: "EMG Handwriting",
    description:
      "The first consumer EMG text input — write messages by moving your fingers through the air. Shipped spring 2026.",
    tags: ["NEURAL INPUT", "EMG"],
    image: "/manus-storage/neural-input-card_b0c02bd8.webp",
    bgColor: "#F2EDE8",
    accentColor: "#1A3A2A",
    slug: "emg-handwriting",
  },
  {
    id: 4,
    num: "04",
    category: "AI SYSTEMS",
    title: "AI Assistant Device",
    description:
      "A watch with no OS — just an AI that learns what you need. Two design systems: a system language and a user theming framework.",
    tags: ["AI SYSTEMS", "VIBE CODING"],
    image: "/manus-storage/ai-smartwatch-card_6e67093b.webp",
    bgColor: "#F5F1EC",
    accentColor: "#1A3A2A",
    slug: "ai-smartwatch",
  },
  {
    id: 5,
    num: "05",
    category: "TOOLING & AI",
    title: "Design Systems Tooling",
    description:
      "AI-powered design tooling — from system linters to a full vibe-coding IDE built on web components.",
    tags: ["AI TOOLING", "FIGMA PLUGINS"],
    image: "/manus-storage/ds-tooling-card_440191c4.webp",
    bgColor: "#F2EDE8",
    accentColor: "#1A3A2A",
    slug: "ds-tooling",
  },
];

const CARD_GAP_VW = 3; // gap between cards in vw
const TOTAL_SCROLL_MULTIPLIER = 5; // total scroll height = N * this * 100vh

function CaseStudyButton({ active }: { active: Project }) {
  const [, setLocation] = useLocation();
  return (
    <button
      onClick={() => setLocation(`/project/${active.slug}`)}
      style={{
        fontFamily: "Space Mono, monospace",
        fontSize: "0.52rem",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: active.accentColor,
        background: "transparent",
        border: `1px solid ${active.accentColor}50`,
        borderRadius: "2px",
        padding: "0.75rem 1.25rem",
        cursor: "pointer",
        alignSelf: "flex-start",
        transition: "all 0.2s ease",
        animation: "fadeSlideUp 0.5s 0.2s cubic-bezier(0.23,1,0.32,1) both",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = `${active.accentColor}10`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      View Case Study →
    </button>
  );
}

export default function WorkSection() {
  const router = useRouter();
  const [, navigate] = useLocation();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Drag-distance guard: track mouse-down Y to prevent accidental navigation during scroll
  const mouseDownScrollY = useRef<number>(0);
  const DRAG_THRESHOLD = 8; // px — if scroll moved more than this, ignore the click

  const handleCardMouseDown = useCallback(() => {
    mouseDownScrollY.current = window.scrollY;
  }, []);

  const navigateToProject = useCallback((slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    // Guard: if the page scrolled significantly since mousedown, treat as scroll not click
    const scrollDelta = Math.abs(window.scrollY - mouseDownScrollY.current);
    if (scrollDelta > DRAG_THRESHOLD) return;
    // Use Lenis scrollTo(0, immediate) — native scrollTo is intercepted by Lenis
    scrollToTopImmediate();
    navigate(`/project/${slug}`);
    // Fire again after navigation in case Lenis restores position
    requestAnimationFrame(() => scrollToTopImmediate());
    setTimeout(() => scrollToTopImmediate(), 50);
  }, [navigate]);

  const N = projects.length - 1; // 4 track cards (cards 2-5)
  // Refs for each of the track cards
  const cardRefs = useRef<(HTMLElement | null)[]>([null, null, null, null, null]);
  // Ref for card 1 (pinned) so we can read its width
  const card1Ref = useRef<HTMLElement | null>(null);
  // Ref to store computed centerLeft so CSS left can be kept in sync
  const centerLeftRef = useRef<number>(0);
  // Ref for the card area container so we can measure its left offset
  const cardAreaRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const headerRafRef = useRef<number>(0);
  const lastHeaderScrollY = useRef<number>(0);
  const activeIndexRef = useRef<number>(0);
  const [sectionInView, setSectionInView] = useState(false);
  const [coachVisible, setCoachVisible] = useState(false);
  const contextParaRef = useRef<HTMLParagraphElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null); // guards against redundant setState

  // Cached layout measurements — recomputed only on resize, not every scroll tick
  const cachedLayout = useRef<{ cardW: number; gapPx: number; step: number; centerLeft: number; outerHeight: number; outerTop: number } | null>(null);

  const recomputeLayout = useCallback(() => {
    const card1El = card1Ref.current;
    const cardAreaEl = cardAreaRef.current;
    const outer = outerRef.current;
    if (!card1El || !cardAreaEl || !outer) return;
    const cardW = card1El.offsetWidth;
    const gapPx = window.innerWidth * (CARD_GAP_VW / 100);
    const step = cardW + gapPx;
    const cardAreaOffsetLeft = cardAreaEl.getBoundingClientRect().left;
    const centerLeft = (window.innerWidth / 2) - (cardW / 2) - cardAreaOffsetLeft;
    const outerHeight = outer.offsetHeight;
    const outerTop = outer.getBoundingClientRect().top + window.scrollY; // absolute top
    cachedLayout.current = { cardW, gapPx, step, centerLeft, outerHeight, outerTop };
  }, []);

  // Trigger fade-up animations when header enters viewport
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSectionInView(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Coach mark: show when sticky section enters view, hide on first scroll
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setCoachVisible(true);
    }, { threshold: 0.3 });
    obs.observe(outer);
    const hideOnScroll = () => { setCoachVisible(false); };
    window.addEventListener("scroll", hideOnScroll, { passive: true, once: true });
    return () => { obs.disconnect(); window.removeEventListener("scroll", hideOnScroll); };
  }, []);



  useEffect(() => {
    recomputeLayout();
    const ro = new ResizeObserver(recomputeLayout);
    if (outerRef.current) ro.observe(outerRef.current);
    window.addEventListener('resize', recomputeLayout, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recomputeLayout);
    };
  }, [recomputeLayout]);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const layout = cachedLayout.current;
      if (!layout) { recomputeLayout(); return; }

      const viewH = window.innerHeight;
      // Use absolute outerTop + current scrollY to avoid getBoundingClientRect in hot path
      const outerTop = layout.outerTop - window.scrollY;
      const { outerHeight, step, centerLeft } = layout;

      const scrolled = Math.max(0, -outerTop);
      const maxScroll = outerHeight - viewH;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, scrolled / maxScroll);

      const card1El = card1Ref.current;
      if (!card1El) return;

      centerLeftRef.current = centerLeft;
      // Keep arrows just to the left of the first card
      if (arrowsRef.current) {
        const cardAreaEl = cardAreaRef.current;
        const offset = cardAreaEl ? cardAreaEl.getBoundingClientRect().left : 0;
        arrowsRef.current.style.left = `${Math.max(4, centerLeft - 56)}px`;
      }

      // Keep card 1 pinned at centerLeft; clear the CSS translateX(-50%) fallback
      card1El.style.left = `${centerLeft}px`;
      card1El.style.transform = "none";

      // Apply ease-out curve so motion decelerates smoothly into docking positions
      const eased = 1 - Math.pow(1 - progress, 2.2);
      // Travel (N-1)*step so the last card (j=N-1) ends at +step (one step right of card 1)
      // giving a final two-card side-by-side view instead of full stack.
      const groupOffset = eased * (N - 1) * step;

      // activeJ = highest j whose card has docked (translateX ≈ step or less)
      let activeJ = -1;

      for (let j = 0; j < N; j++) {
        const el = cardRefs.current[j];
        if (!el) continue;
        // Position each track card at centerLeft so it rests centered when translateX=0
        el.style.left = `${centerLeft}px`;
        const rawOffset = (j + 1) * step - groupOffset;
        // Last card clamps at step (not 0) so it stays one card-width to the right
        const minOffset = j === N - 1 ? step : 0;
        const offset = Math.max(minOffset, rawOffset);
        el.style.transform = `translateX(${offset}px)`;
        if (rawOffset <= minOffset + 2) {
          activeJ = j;
        }
      }

      const nextIndex = activeJ + 1;
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    });
  }, [N, recomputeLayout]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  // Split parallax + chromatic aberration on section header
  useEffect(() => {
    const onHeaderScroll = () => {
      cancelAnimationFrame(headerRafRef.current);
      headerRafRef.current = requestAnimationFrame(() => {
        const header = headerRef.current;
        if (!header) return;

        const rect = header.getBoundingClientRect();
        const viewH = window.innerHeight;
        // progress: 0 when header enters bottom of viewport, 1 when it exits top
        const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (viewH + rect.height)));

        // Parallax removed — heading stays fixed


      });
    };
    window.addEventListener("scroll", onHeaderScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onHeaderScroll);
      cancelAnimationFrame(headerRafRef.current);
    };
  }, []);

  const isMobile = useIsMobile();
  const active = projects[activeIndex];

  // ── MOBILE: vertical stack ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div id="work" style={{ backgroundColor: "transparent" }}>
        {/* Header */}
        <div style={{ padding: "5rem 1.5rem 3rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "1.2rem" }}>
            Selected Work
          </span>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "clamp(2.5rem, 10vw, 4.5rem)", lineHeight: 1.0, letterSpacing: "-0.03em", color: "#0E0C0A", margin: 0 }}>
            Some of my recent work
          </h2>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(14,12,10,0.45)", margin: "1rem 0 0" }}>
            As Design Lead on each of these projects, I drove strategy across a team of 15 — visual, product, motion, content, and accessibility designers.
          </p>
        </div>

        {/* Vertical card list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              style={{ backgroundColor: project.bgColor, padding: "3rem 1.5rem" }}
              onClick={() => { scrollToTopImmediate(); navigate(`/project/${project.slug}`); }}
            >
              {/* Number + category */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.6rem", color: project.accentColor, letterSpacing: "0.1em" }}>{project.num}</span>
                <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${project.accentColor}60, transparent)` }} />
                <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(14,12,10,0.4)" }}>{project.category}</span>
              </div>

              {/* Image */}
              <div style={{ borderRadius: "4px", overflow: "hidden", marginBottom: "1.5rem", aspectRatio: "16/9" }}>
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
                />
              </div>

              {/* Title + description */}
              <h3 style={{ fontFamily: "Space Mono, monospace", fontWeight: 400, fontSize: "clamp(1rem, 4vw, 1.3rem)", lineHeight: 1.3, color: "#0E0C0A", margin: "0 0 0.75rem" }}>{project.title}</h3>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 300, fontSize: "0.88rem", lineHeight: 1.75, color: "rgba(14,12,10,0.5)", margin: "0 0 1.25rem" }}>{project.description}</p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                {project.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: "Space Mono, monospace", fontSize: "0.48rem", letterSpacing: "0.15em", textTransform: "uppercase", color: project.accentColor, border: `1px solid ${project.accentColor}40`, borderRadius: "2px", padding: "0.35rem 0.6rem" }}>{tag}</span>
                ))}
              </div>

              {/* CTA */}
              <button style={{ fontFamily: "Space Mono, monospace", fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase", color: project.accentColor, background: "transparent", border: `1px solid ${project.accentColor}50`, borderRadius: "2px", padding: "0.75rem 1.25rem", cursor: "pointer" }}>
                View Case Study →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── DESKTOP: sticky horizontal carousel ─────────────────────────────────────
  return (
    <div id="work">
      {/* Section header */}
      <div
        ref={headerRef}
        style={{
          padding: "8rem clamp(2rem, 5vw, 5rem) 5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
        className={sectionInView ? "is-inview" : ""}
      >
        <span
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            display: "block",
            marginBottom: "1.5rem",
          }}
        >
          Selected Work
        </span>
        <h2
          ref={headingRef}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
            color: "#0E0C0A",
            margin: 0,
          }}
        >
          Some of my recent work
        </h2>
        <p
          ref={contextParaRef}
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(0.85rem, 1.2vw, 1rem)",
            lineHeight: 1.75,
            color: "rgba(14,12,10,0.45)",
            maxWidth: "520px",
            margin: "1.5rem 0 0",
          }}
        >
          As Design Lead on each of these projects, I drove strategy across a team of 15 — visual, product, motion, content, and accessibility designers.
        </p>
      </div>

      {/* Outer scroll wrapper — tall enough for all transitions */}
      <div
        ref={outerRef}
        style={{ height: `${TOTAL_SCROLL_MULTIPLIER * 100}vh`, position: "relative" }}
      >
        {/* Sticky full-viewport frame */}
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            backgroundColor: projects[0].bgColor,
            display: "flex",
            flexDirection: "row",
            contain: "layout style",
          }}
        >
          {/* Background color layers — opacity crossfade (GPU) instead of background-color transition (CPU repaint) */}
          {projects.map((p, i) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: p.bgColor,
                opacity: i === activeIndex ? 1 : 0,
                transition: "opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Coach mark — fades in on entry, disappears on first scroll */}
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              opacity: coachVisible ? 1 : 0,
              transition: "opacity 0.6s ease",
              pointerEvents: "none",
            }}
          >
            <span style={{ fontFamily: "Space Mono, monospace", fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(14,12,10,0.4)" }}>
              Scroll to explore
            </span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" style={{ animation: "coachBounce 1.4s ease-in-out infinite" }}>
              <path d="M8 0v20M1 13l7 7 7-7" stroke="rgba(14,12,10,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* ── LEFT PANEL ── */}
          <div
            style={{
              width: "clamp(260px, 28vw, 380px)",
              flexShrink: 0,
              position: "relative",
              zIndex: 20,
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 clamp(1.5rem, 3vw, 3rem)",
            }}
          >
            {/* Counter */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "2.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.65rem",
                  color: active.accentColor,
                  letterSpacing: "0.1em",
                  transition: "color 0.4s ease",
                }}
              >
                {active.num}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: `linear-gradient(to right, ${active.accentColor}60, transparent)`,
                  transition: "background 0.4s ease",
                }}
              />
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.55rem",
                  color: "rgba(14,12,10,0.3)",
                  letterSpacing: "0.1em",
                }}
              >
                / {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            <span
              key={`cat-${activeIndex}`}
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.52rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: active.accentColor,
                marginBottom: "1rem",
                animation: "fadeSlideUp 0.4s cubic-bezier(0.23,1,0.32,1) both",
              }}
            >
              {active.category}
            </span>

            <h3
              key={`title-${activeIndex}`}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 400,
                fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                color: "#0E0C0A",
                margin: "0 0 1.25rem",
                animation: "fadeSlideUp 0.45s 0.05s cubic-bezier(0.23,1,0.32,1) both",
              }}
            >
              {active.title}
            </h3>

            <div
              style={{
                width: "2rem",
                height: "2px",
                backgroundColor: active.accentColor,
                marginBottom: "1.25rem",
                transition: "background-color 0.4s ease",
              }}
            />

            <p
              key={`desc-${activeIndex}`}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.78rem",
                lineHeight: 1.65,
                color: "rgba(14,12,10,0.55)",
                margin: "0 0 1.75rem",
                animation: "fadeSlideUp 0.5s 0.1s cubic-bezier(0.23,1,0.32,1) both",
              }}
            >
              {active.description}
            </p>

            <div
              key={`tags-${activeIndex}`}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                marginBottom: "1.75rem",
                animation: "fadeSlideUp 0.5s 0.15s cubic-bezier(0.23,1,0.32,1) both",
              }}
            >
              {active.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.48rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(14,12,10,0.5)",
                    border: "1px solid rgba(14,12,10,0.15)",
                    borderRadius: "2px",
                    padding: "0.3rem 0.6rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <CaseStudyButton active={active} />

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "2rem" }}>
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    width: i === activeIndex ? "24px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    backgroundColor:
                      i === activeIndex ? active.accentColor : "rgba(14,12,10,0.15)",
                    transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── CARD AREA ── */}
          <div
            ref={cardAreaRef}
            style={{
              flex: 1,
              position: "relative",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            {/* Prev/Next arrows — positioned just left of the first card via JS */}
            <div
              ref={arrowsRef}
              style={{
                position: "absolute",
                top: "50%",
                left: "1.5rem",
                transform: "translateY(-50%)",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                pointerEvents: "none",
              }}
            >
            {[{ dir: -1, label: "←" }, { dir: 1, label: "→" }].map(({ dir, label }) => (
              <button
                key={label}
                onClick={() => {
                  const lenis = getLenisInstance();
                  const outer = outerRef.current;
                  if (!outer) return;
                  const maxScroll = outer.offsetHeight - window.innerHeight;
                  const perCard = maxScroll / (projects.length - 1);
                  const target = window.scrollY + dir * perCard;
                  if (lenis) lenis.scrollTo(target, { duration: 1.0 });
                  else window.scrollTo({ top: target, behavior: "smooth" });
                }}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: `1px solid ${active.accentColor}50`,
                  background: `rgba(242,237,232,0.85)`,
                  backdropFilter: "blur(8px)",
                  color: active.accentColor,
                  fontSize: "1rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  pointerEvents: "all",
                  boxShadow: "0 2px 12px rgba(14,12,10,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(242,237,232,1)`;
                  e.currentTarget.style.borderColor = active.accentColor;
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(14,12,10,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(242,237,232,0.85)`;
                  e.currentTarget.style.borderColor = `${active.accentColor}50`;
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(14,12,10,0.1)";
                }}
              >
                {label}
              </button>
            ))}
          </div>


            {/* Card 1 — pinned, centered on full page; left is set by JS */}
            <Link
              href={`/project/${projects[0].slug}`}
              ref={(el: HTMLAnchorElement | null) => { card1Ref.current = el as HTMLElement | null; }}
              onMouseDown={handleCardMouseDown}
              onClick={(e) => navigateToProject(projects[0].slug, e)}
              style={{ display: "block", position: "absolute", top: "3rem", bottom: "3rem", left: 0, width: "clamp(260px, 38vw, 500px)", zIndex: 1, textDecoration: "none", cursor: "pointer", willChange: "transform" }}
            >
              <ProjectCard
                project={projects[0]}
                isActive={activeIndex === 0}
              />
            </Link>

            {/* Cards 2–N — left and translateX both set by JS; start off-screen right */}
            {projects.slice(1).map((project, j) => (
              <Link
                key={project.id}
                href={`/project/${project.slug}`}
                ref={(el: HTMLAnchorElement | null) => { cardRefs.current[j] = el as HTMLElement | null; }}
                onMouseDown={handleCardMouseDown}
                onClick={(e) => navigateToProject(project.slug, e)}
                style={{
                  display: "block",
                  textDecoration: "none",
                  position: "absolute",
                  top: "3rem",
                  bottom: "3rem",
                  left: 0, // JS overrides this immediately on first scroll tick
                  width: "clamp(260px, 38vw, 500px)",
                  zIndex: j + 2, // higher j = higher z-index = on top
                  willChange: "transform",
                  // Initial translateX keeps card off-screen right; JS overrides on first tick
                  transform: `translateX(${(j + 1) * 600}px)`,
                }}
              >
                <ProjectCard
                  project={project}
                  isActive={j + 1 === activeIndex}
                />
              </Link>
            ))}
          </div>

          {/* Scroll hint */}
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              opacity: 0.3,
              zIndex: 25,
            }}
          >
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              Scroll to explore
            </span>
            <div
              style={{ width: "24px", height: "1px", background: "rgba(255,255,255,0.4)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  isActive,
}: {
  project: Project;
  isActive: boolean;
}) {
  return (
    <HoverScaleCard style={{ borderRadius: "12px", overflow: "hidden", position: "relative" }}>
      <img
        src={project.image}
        alt={project.title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Simple gradient for text legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 40%, transparent 55%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          left: "1.25rem",
          right: "1.25rem",
        }}
      >
        <span
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.85)",
            textTransform: "uppercase",
          }}
        >
          {project.num} — {project.category}
        </span>

      </div>

      <div
        style={{
          position: "absolute",
          bottom: "1.25rem",
          left: "1.25rem",
          right: "1.25rem",
          display: "flex",
          gap: "0.4rem",
          flexWrap: "wrap",
        }}
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.45rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "2px",
              padding: "0.3rem 0.55rem",
            }}
          >
            {tag}
          </span>
        )        )}
      </div>
    </HoverScaleCard>
  );
}
