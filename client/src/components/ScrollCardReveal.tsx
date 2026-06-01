/**
 * ScrollCardReveal — Reusable sticky scroll-driven horizontal card stack
 *
 * Design: Warm Editorial — cream background, near-black ink, forest green accent
 *
 * Layout:
 *   Left column (~42% width): sticky text panel — updates per active card
 *   Right column (~58% width): scroll-driven card stack — cards slide in from right
 *
 * Mechanic:
 *   - Outer wrapper is tall (N * scrollMultiplier * 100vh) to create scroll budget
 *   - Inner sticky frame is 100vh — both columns live inside it
 *   - Cards are portrait-sized, computed in JS from the right column's available space
 *   - Card 0 is pinned; Cards 1–N slide in from the right as user scrolls
 *
 * Per-card metadata (optional):
 *   If cards include `category`, `title`, `description`, `tags`, and `slug`,
 *   the left panel will update dynamically like the home page WorkSection.
 *   Falls back to static `leftHeadline`/`leftBody` if per-card data is absent.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import HoverScaleCard from "./HoverScaleCard";

export interface ScrollCardRevealCard {
  src: string;
  alt?: string;
  label?: string;
  // Per-card metadata for dynamic left panel (mirrors WorkSection Project shape)
  num?: string;
  category?: string;
  title?: string;
  description?: string;
  tags?: string[];
  slug?: string;
}

interface ScrollCardRevealProps {
  cards: ScrollCardRevealCard[];
  headline?: string;
  sub?: string;
  /** Large display headline for the left panel (used when cards lack per-card metadata) */
  leftHeadline?: string;
  /** Body copy for the left panel (used when cards lack per-card metadata) */
  leftBody?: string;
  accent?: string;
  scrollMultiplier?: number;
}

const CARD_ASPECT = 1350 / 1648; // portrait ≈ 0.82
const CARD_GAP_PX = 20;
const GUTTER_PX = 48; // 3rem at 16px
// Vertical space consumed by top/bottom chrome
const CARD_V_RESERVE_PX = 160;
// Left column takes 42% of viewport width
const LEFT_COL_RATIO = 0.42;

function computeCardSize(viewW: number, viewH: number) {
  const rightColW = viewW * (1 - LEFT_COL_RATIO) - GUTTER_PX * 2;
  const maxH = viewH - CARD_V_RESERVE_PX;
  const fromH = maxH * CARD_ASPECT;
  // Cap at 80% of the right column width so the next card can peek in
  const maxW = rightColW * 0.72;
  const w = Math.min(fromH, maxW);
  const h = w / CARD_ASPECT;
  return { w: Math.round(w), h: Math.round(h) };
}

// ── Dynamic left panel (home-page style) ────────────────────────────────────

function DynamicLeftPanel({
  cards,
  activeIndex,
  accent,
}: {
  cards: ScrollCardRevealCard[];
  activeIndex: number;
  accent: string;
}) {
  const [, setLocation] = useLocation();
  const active = cards[activeIndex] ?? cards[0];
  const total = cards.length;

  const handleCTA = () => {
    if (active.slug) setLocation(`/project/${active.slug}`);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: `4rem ${GUTTER_PX}px`,
        boxSizing: "border-box",
      }}
    >
      {/* Counter row */}
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
            color: accent,
            letterSpacing: "0.1em",
            transition: "color 0.4s ease",
          }}
        >
          {active.num ?? String(activeIndex + 1).padStart(2, "0")}
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: `linear-gradient(to right, ${accent}60, transparent)`,
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
          / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* Category */}
      {active.category && (
        <span
          key={`cat-${activeIndex}`}
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: accent,
            marginBottom: "1rem",
            animation: "fadeSlideUp 0.4s cubic-bezier(0.23,1,0.32,1) both",
          }}
        >
          {active.category}
        </span>
      )}

      {/* Title */}
      {active.title && (
        <h3
          key={`title-${activeIndex}`}
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 400,
            fontSize: "clamp(1rem, 1.6vw, 1.45rem)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: "#0E0C0A",
            margin: "0 0 1.25rem",
            animation: "fadeSlideUp 0.45s 0.05s cubic-bezier(0.23,1,0.32,1) both",
          }}
        >
          {active.title}
        </h3>
      )}

      {/* Divider */}
      <div
        style={{
          width: "2rem",
          height: "2px",
          backgroundColor: accent,
          marginBottom: "1.25rem",
          transition: "background-color 0.4s ease",
        }}
      />

      {/* Description */}
      {active.description && (
        <p
          key={`desc-${activeIndex}`}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.78rem",
            lineHeight: 1.65,
            color: "rgba(14,12,10,0.55)",
            margin: "0 0 1.75rem",
            animation: "fadeSlideUp 0.5s 0.1s cubic-bezier(0.23,1,0.32,1) both",
            width: "437px",
          }}
        >
          {active.description}
        </p>
      )}

      {/* Tags */}
      {active.tags && active.tags.length > 0 && (
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
      )}

      {/* CTA button (only when slug present) */}
      {active.slug && (
        <button
          onClick={handleCTA}
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#0E0C0A",
            background: "transparent",
            border: "1px solid rgba(14,12,10,0.25)",
            borderRadius: "2px",
            padding: "0.85rem 1.5rem",
            cursor: "pointer",
            alignSelf: "flex-start",
            marginBottom: "2rem",
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = `${accent}12`;
            (e.currentTarget as HTMLButtonElement).style.borderColor = accent;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(14,12,10,0.25)";
          }}
        >
          VIEW CASE STUDY →
        </button>
      )}

      {/* Progress dots */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {cards.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? "24px" : "6px",
              height: "6px",
              borderRadius: "3px",
              backgroundColor:
                i === activeIndex ? accent : "rgba(14,12,10,0.15)",
              transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Static left panel (fallback when no per-card metadata) ──────────────────

function StaticLeftPanel({
  sub,
  headline,
  leftHeadline,
  leftBody,
  accent,
}: {
  sub?: string;
  headline?: string;
  leftHeadline?: string;
  leftBody?: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        padding: `4rem ${GUTTER_PX}px`,
        boxSizing: "border-box",
      }}
    >
      {(sub || headline) && (
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#1A3A2A",
            margin: "0 0 1.25rem",
          }}
        >
          {sub ?? headline}
        </p>
      )}
      {leftHeadline && (
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: "40px",
            color: "#0E0C0A",
            margin: "0 0 1.25rem",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 1.05, width: '474px',
          }}
        >
          {leftHeadline}
        </h2>
      )}
      {!leftHeadline && headline && (
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.6rem, 3vw, 3.2rem)",
            color: "#0E0C0A",
            margin: "0 0 1.25rem",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {headline}
        </h2>
      )}
      {leftBody && (
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(0.55rem, 0.75vw, 0.68rem)",
            lineHeight: 1.7,
            color: "rgba(14,12,10,0.5)",
            margin: 0,
            maxWidth: "32ch",
          }}
        >
          {leftBody}
        </p>
      )}
    </div>
  );
}

export default function ScrollCardReveal({
  cards,
  headline,
  sub,
  leftHeadline,
  leftBody,
  accent = "#4ADE80",
  scrollMultiplier = 1.1,
}: ScrollCardRevealProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardSize, setCardSize] = useState(() =>
    computeCardSize(
      typeof window !== "undefined" ? window.innerWidth : 1440,
      typeof window !== "undefined" ? window.innerHeight : 900
    )
  );

  const N = cards.length - 1;
  const cardRefs = useRef<(HTMLDivElement | null)[]>(
    Array.from({ length: Math.max(N, 0) }, () => null)
  );
  const card0Ref = useRef<HTMLDivElement | null>(null);
  const cardAreaRef = useRef<HTMLDivElement | null>(null);
  const centerLeftRef = useRef<number>(0);

  const totalScrollVh = cards.length * scrollMultiplier;

  // Detect whether cards have per-card metadata
  const hasDynamicData = cards.some((c) => c.category || c.title || c.description);

  useEffect(() => {
    const onResize = () => {
      setCardSize(computeCardSize(window.innerWidth, window.innerHeight));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const outer = outerRef.current;
      if (!outer) return;

      const outerTop = outer.getBoundingClientRect().top;
      const outerHeight = outer.offsetHeight;
      const viewH = window.innerHeight;

      const scrolled = Math.max(0, -outerTop);
      const maxScroll = outerHeight - viewH;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, scrolled / maxScroll);

      const card0El = card0Ref.current;
      if (!card0El) return;
      const cardW = card0El.offsetWidth;
      const step = cardW + CARD_GAP_PX;

      const cardAreaEl = cardAreaRef.current;
      const cardAreaOffsetLeft = cardAreaEl ? cardAreaEl.getBoundingClientRect().left : 0;
      const centerLeft = (window.innerWidth / 2) - (cardW / 2) - cardAreaOffsetLeft;
      centerLeftRef.current = centerLeft;

      card0El.style.left = `${centerLeft}px`;

      const eased = 1 - Math.pow(1 - progress, 2.2);
      const groupOffset = eased * (N - 1) * step;

      let activeJ = -1;

      for (let j = 0; j < N; j++) {
        const el = cardRefs.current[j];
        if (!el) continue;
        el.style.left = `${centerLeft}px`;
        const rawOffset = (j + 1) * step - groupOffset;
        const minOffset = j === N - 1 ? step : 0;
        const offset = Math.max(minOffset, rawOffset);
        el.style.transform = `translateX(${offset}px)`;
        el.style.opacity = "1";
        if (rawOffset <= minOffset + 2) activeJ = j;
      }

      setActiveIndex(activeJ + 1);
    });
  }, [N]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  if (cards.length === 0) return null;

  const active = cards[activeIndex] ?? cards[0];
  const { w: cw, h: ch } = cardSize;

  const rightColLeft = `${LEFT_COL_RATIO * 100}%`;
  const cardLeft = `calc(${rightColLeft} + ${GUTTER_PX}px)`;

  return (
    <div
      ref={outerRef}
      style={{ height: `${totalScrollVh * 100}vh`, position: "relative" }}
    >
      {/* Sticky full-width cream container */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#F2EDE8",
        }}
      >

        {/* ── LEFT COLUMN ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${LEFT_COL_RATIO * 100}%`,
            height: "100%",
            zIndex: 20,
            boxSizing: "border-box",
          }}
        >
          {hasDynamicData ? (
            <DynamicLeftPanel
              cards={cards}
              activeIndex={activeIndex}
              accent={accent}
            />
          ) : (
            <StaticLeftPanel
              sub={sub}
              headline={headline}
              leftHeadline={leftHeadline}
              leftBody={leftBody}
              accent={accent}
            />
          )}
        </div>

        {/* ── RIGHT COLUMN CHROME ── */}

        {/* Active card label + dots (bottom of right col) — only shown in static mode */}
        {!hasDynamicData && (
          <div
            style={{
              position: "absolute",
              bottom: "clamp(1.5rem, 3vh, 2.5rem)",
              left: cardLeft,
              zIndex: 30,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {active.label && (
              <span
                key={`label-${activeIndex}`}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#1A3A2A",
                  animation: "fadeSlideUp 0.35s cubic-bezier(0.23,1,0.32,1) both",
                }}
              >
                {active.label}
              </span>
            )}
            <div style={{ display: "flex", gap: "0.45rem", alignItems: "center" }}>
              {cards.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === activeIndex ? "20px" : "5px",
                    height: "5px",
                    borderRadius: "3px",
                    backgroundColor:
                      i === activeIndex ? "#1A3A2A" : "rgba(14,12,10,0.15)",
                    transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Counter (top-right) */}
        <div
          style={{
            position: "absolute",
            top: "clamp(1.5rem, 3vh, 2.5rem)",
            right: `${GUTTER_PX}px`,
            zIndex: 30,
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.15em",
            color: "rgba(14,12,10,0.35)",
          }}
        >
          <span style={{ color: accent }}>
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          {" / "}
          {String(cards.length).padStart(2, "0")}
        </div>

        {/* Scroll hint (bottom-right) */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(1.5rem, 3vh, 2.5rem)",
            right: `${GUTTER_PX}px`,
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            opacity: activeIndex === cards.length - 1 ? 0 : 0.4,
            transition: "opacity 0.4s ease",
          }}
        >
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.48rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#0E0C0A",
            }}
          >
            Scroll to explore
          </span>
          <div
            style={{ width: "20px", height: "1px", background: "rgba(14,12,10,0.3)" }}
          />
        </div>

        {/* ── CARD AREA (full width so centered card is never clipped) ── */}
        <div
          ref={cardAreaRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          {/* Card 0 — pinned; JS sets left to center on full page */}
          <div
            ref={card0Ref}
            style={{
              position: "absolute",
              top: `calc(50% - ${ch / 2}px)`,
              left: 0,
              width: cw,
              height: ch,
              zIndex: 1,
            }}
          >
            <CardImage
              card={cards[0]}
              accent={accent}
              index={0}
              isActive={activeIndex === 0}
            />
          </div>

          {/* Cards 1–N — slide in from right */}
          {cards.slice(1).map((card, j) => (
            <div
              key={j}
              ref={(el) => {
                cardRefs.current[j] = el;
              }}
              style={{
                position: "absolute",
                top: `calc(50% - ${ch / 2}px)`,
                left: 0,
                width: cw,
                height: ch,
                zIndex: j + 2,
                willChange: "transform",
                transform: `translateX(${(j + 1) * (window.innerWidth + CARD_GAP_PX)}px)`,
              }}

            >
              <CardImage
                card={card}
                accent={accent}
                index={j + 1}
                isActive={j + 1 === activeIndex}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Clean card image ──────────────────────────────────────────────────────────

function CardImage({
  card,
}: {
  card: ScrollCardRevealCard;
  accent: string;
  index: number;
  isActive: boolean;
}) {
  return (
    <HoverScaleCard style={{ overflow: "hidden", position: "relative" }}>
      <img
        src={card.src}
        alt={card.alt ?? ""}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
          pointerEvents: "none",
        }}
      />
    </HoverScaleCard>
  );
}
