/*
 * CaseStudyPage — Shared scrollytelling template
 *
 * Design: Dark editorial / Brutalist Precision
 * - Full-bleed hero with parallax image
 * - Scroll-driven section reveals (IntersectionObserver + CSS transitions)
 * - Sticky chapter labels
 * - Full-width image panels with parallax
 * - Stat/metric callout rows
 * - Quote/insight blocks
 * - Consistent Space Mono + Barlow Condensed typography
 */

import { useEffect, useRef, useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import ScrollCardReveal, { ScrollCardRevealCard } from "@/components/ScrollCardReveal";
import { addLenisScrollListener, removeLenisScrollListener } from "@/hooks/useSmoothScroll";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CaseStudySection {
  type:
    | "hero"
    | "video-hero"
    | "video-break"
    | "overview"
    | "chapter"
    | "image-full"
    | "image-full-right"
    | "image-split"
    | "stats"
    | "quote"
    | "text-block"
    | "image-grid"
    | "bento-grid"
    | "card-carousel"
    | "gif-pair"
    | "video-grid"
    | "scroll-gallery"
    | "closing";
  // hero
  heroImage?: string;
  heroTitle?: string;
  heroCategory?: string;
  heroYear?: string;
  heroRole?: string;
  // chapter label
  chapterLabel?: string;
  chapterNumber?: string;
  // overview
  overviewHeadline?: string;
  overviewBody?: string;
  overviewTags?: string[];
  // image-full
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  // image-split: left image, right text
  splitImage?: string;
  splitImageAlt?: string;
  splitHeadline?: string;
  splitBody?: string;
  splitReverse?: boolean;
  // stats
  stats?: { label: string; value: string; sub?: string }[];
  // quote
  quoteText?: string;
  quoteAuthor?: string;
  // text-block
  headline?: string;
  body?: string | ReactNode;
  // image-grid: 2 or 3 images
  images?: { src: string; alt?: string; caption?: string }[];
  // bento-grid: mixed-size component showcase
  bentoItems?: { src: string; alt?: string; caption?: string; span?: "wide" | "tall" | "square" | "full" }[];
  // card-carousel: horizontal drag-scroll card showcase
  carouselCards?: ScrollCardRevealCard[];
  carouselHeadline?: string;
  carouselSub?: string;
  /** Large display headline for the left panel */
  carouselLeftHeadline?: string;
  /** Body copy for the left panel */
  carouselLeftBody?: string;
  // gif-pair: two side-by-side animated GIFs
  gifLeft?: string;
  gifRight?: string;
  gifLeftAlt?: string;
  gifRightAlt?: string;
  gifCaption?: string;
  // video-grid: 2x2 grid of videos with scroll-driven slide-in
  videoGridItems?: { src: string; poster?: string; label?: string }[];
  // scroll-gallery: images animate in from alternating sides on scroll
  galleryImages?: { src: string; alt?: string; caption?: string }[];
  galleryHeadline?: string;
  // closing
  closingHeadline?: string;
  closingBody?: string;
  closingMedia?: string; // animated WebP / image shown to the right of the closing text
  nextProject?: { title: string; slug: string };
  // video-hero / video-break
  videoSrc?: string;
  videoPoster?: string;
  videoCaption?: string;
  videoLabel?: string;
  // video-break scale override (0–1, e.g. 0.85 = 85% width)
  videoScale?: number;
  // section background override
  sectionBg?: string;
}

export interface CaseStudyData {
  slug: string;
  title: string;
  category: string;
  year: string;
  role: string;
  accentColor: string;
  sections: CaseStudySection[];
}

// ─── Reveal hook ──────────────────────────────────────────────────────────────

function useReveal(ref: React.RefObject<Element | null>, threshold = 0.15) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div
      ref={ref}
      className={`reveal-block ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Parallax image ───────────────────────────────────────────────────────────

function ParallaxImage({
  src,
  alt = "",
  speed = 0.3,
}: {
  src: string;
  alt?: string;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    let raf = 0;
    let inView = false;

    const onScroll = () => {
      if (!inView) return; // skip when off-screen
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        const offset = progress * speed * 100;
        img.style.transform = `translateY(${offset}px)`;
      });
    };

    // Only run parallax when element is near the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) onScroll();
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(container);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      style={{ overflow: "hidden", width: "100%", height: "100%" }}
    >
      <div
        ref={imgRef}
        style={{
          width: "100%",
          height: "calc(100% + 120px)",
          marginTop: "-60px",
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
        role="img"
        aria-label={alt}
      />
    </div>
  );
}

// ─── Back button ────────────────────────────────────────────────────────────

function BackButton() {
  const [, setLocation] = useLocation();
  return (
    <button
      onClick={() => setLocation("/")}
      style={{
        position: "absolute",
        top: "2rem",
        left: "2rem",
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.15em",
        color: "rgba(242,237,232,0.6)",
        background: "none",
        border: "none",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        cursor: "pointer",
        transition: "color 0.2s ease",
        padding: 0,
        zIndex: 10,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "#F2EDE8")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLButtonElement).style.color = "rgba(242,237,232,0.6)")
      }
    >
      ← Back
    </button>
  );
}

// ─── Section renderers ────────────────────────────────────────────────────────

function HeroSection({ s, accent }: { s: CaseStudySection; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let inView = true; // hero is in view on mount
    const onScroll = () => {
      if (!inView) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const progress = window.scrollY / window.innerHeight;
        el.style.opacity = `${Math.max(0, 1 - progress * 1.5)}`;
        el.style.transform = `translateY(${progress * 40}px)`;
      });
    };
    // Stop updating once hero is fully scrolled past
    const observer = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting; },
      { rootMargin: "0px" }
    );
    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        background: "#0A0908",
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0 }}>
        <ParallaxImage src={s.heroImage || ""} alt={s.heroTitle} speed={0.25} />
      </div>

      {/* Overlays */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,9,8,0.3) 0%, rgba(10,9,8,0.1) 40%, rgba(10,9,8,0.7) 80%, rgba(10,9,8,1) 100%)",
        }}
      />

      {/* Back nav */}
      <BackButton />
    </div>
  );
}

function OverviewSection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "8rem 4rem",
        background: "#F2EDE8",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <Reveal>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            color: accent,
            textTransform: "uppercase",
            margin: "0 0 2rem",
          }}
        >
          Overview
        </p>
        <h2
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            lineHeight: 1.05,
            color: "#0E0C0A",
            margin: "0 0 2rem",
          }}
        >
          {s.overviewHeadline}
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.85rem",
            lineHeight: 1.9,
            color: "rgba(14,12,10,0.65)",
            margin: "0 0 3rem",
            maxWidth: "680px",
          }}
        >
          {s.overviewBody}
        </p>
        {s.overviewTags && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {s.overviewTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.4rem 0.8rem",
                  border: `1px solid ${accent}40`,
                  color: accent,
                  borderRadius: "2px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}

function ChapterSection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "6rem 4rem 3rem",
        background: "#F2EDE8",
        display: "flex",
        alignItems: "flex-end",
        gap: "2rem",
        borderTop: `1px solid rgba(14,12,10,0.08)`,
      }}
    >
      <Reveal>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            color: accent,
            textTransform: "uppercase",
            display: "block",
            marginBottom: "0.5rem",
          }}
        >
          {s.chapterNumber}
        </span>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            color: "#0E0C0A",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          {s.chapterLabel}
        </h3>
      </Reveal>
    </div>
  );
}

function ImageFullSection({ s, slideFromRight }: { s: CaseStudySection; slideFromRight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    const img = imgRef.current;
    if (!el || !img) return;
    let rafId: number;
    const tick = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when element is 120% below viewport, 1 when top reaches 30% from top
      const progress = Math.min(1, Math.max(0, 1 - rect.top / (vh * 1.2)));
      const tx = (1 - progress) * (slideFromRight ? 160 : -160); // slides from ±160px to 0
      const op = progress;
      // Round the leading edge (right side for left-slide, left side for right-slide)
      // during animation, snap to 0 when fully arrived
      const r = progress >= 1 ? 0 : 36;
      const br = slideFromRight
        ? `${r}px 0 0 ${r}px` // left corners round when sliding from right
        : `0 ${r}px ${r}px 0`; // right corners round when sliding from left
      img.style.transform = `translateX(${tx}px)`;
      img.style.opacity = `${op}`;
      img.style.borderRadius = br;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);
  return (
    <div
      ref={ref}
      style={{
        padding: "2rem 0 4rem",
        position: "relative",
        overflow: "hidden",
        background: s.sectionBg || "transparent",
      }}
    >
      <img
            loading="lazy"
            decoding="async"
        ref={imgRef}
        src={s.image || ""}
        alt={s.imageAlt || ""}        
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          objectFit: "contain",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      />
      {s.imageCaption && (
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            right: "2rem",
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: "rgba(242,237,232,0.4)",
            textTransform: "uppercase",
          }}
        >
          {s.imageCaption}
        </div>
      )}
    </div>
  );
}

function ImageSplitSection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  const isReverse = s.splitReverse;
  return (
    <div>
      <style>{`@media (max-width: 767px) { .split-grid { grid-template-columns: 1fr !important; min-height: auto !important; } }`}</style>
    <div
      className="split-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "520px",
        background: "#F2EDE8",
      }}
    >
      {/* Image */}
      <div
        style={{
          order: isReverse ? 2 : 1,
          position: "relative",
          overflow: "hidden",
          minHeight: "400px",
        }}
      >
        <ParallaxImage
          src={s.splitImage || ""}
          alt={s.splitImageAlt}
          speed={0.15}
        />
      </div>
      {/* Text */}
      <div
        style={{
          order: isReverse ? 1 : 2,
          padding: "5rem 4rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: isReverse ? "#0A0908" : "#F2EDE8",
        }}
      >
        <Reveal>
          <h3
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
              color: isReverse ? "#F2EDE8" : "#0E0C0A",
              margin: "0 0 1.5rem",
              textTransform: "uppercase",
              lineHeight: 1.05,
            }}
          >
            {s.splitHeadline}
          </h3>
        </Reveal>
        <Reveal delay={80}>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.8rem",
              lineHeight: 1.9,
              color: isReverse
                ? "rgba(242,237,232,0.6)"
                : "rgba(14,12,10,0.65)",
              margin: 0,
            }}
          >
            {s.splitBody}
          </p>
        </Reveal>
      </div>
    </div>
    </div>
  );
}

function StatsSection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "6rem 4rem",
        background: "#0A0908",
        display: "grid",
        gridTemplateColumns: `repeat(${s.stats?.length || 3}, 1fr)`,
        gap: "2rem",
      }}
    >
      {s.stats?.map((stat, i) => (
        <Reveal key={i} delay={i * 80}>
          <div
            style={{
              borderTop: `1px solid ${accent}40`,
              paddingTop: "1.5rem",
            }}
          >
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                color: "#F2EDE8",
                lineHeight: 1,
                marginBottom: "0.5rem",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: accent,
                textTransform: "uppercase",
                marginBottom: "0.25rem",
              }}
            >
              {stat.label}
            </div>
            {stat.sub && (
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  color: "rgba(242,237,232,0.35)",
                  lineHeight: 1.6,
                }}
              >
                {stat.sub}
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function QuoteSection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "8rem 4rem",
        background: "#F2EDE8",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Reveal>
        <div
          style={{
            width: "3rem",
            height: "2px",
            background: accent,
            marginBottom: "2.5rem",
          }}
        />
        <blockquote
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            lineHeight: 1.2,
            color: "#0E0C0A",
            margin: "0 0 2rem",
            fontStyle: "italic",
          }}
        >
          "{s.quoteText}"
        </blockquote>
        {s.quoteAuthor && (
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              color: accent,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            — {s.quoteAuthor}
          </p>
        )}
      </Reveal>
    </div>
  );
}

function TextBlockSection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "6rem 4rem",
        background: "#F2EDE8",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {s.headline && (
        <Reveal>
          <h3
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              color: "#0E0C0A",
              margin: "0 0 1.5rem",
              textTransform: "uppercase",
            }}
          >
            {s.headline}
          </h3>
        </Reveal>
      )}
      <Reveal delay={80}>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.82rem",
            lineHeight: 1.9,
            color: "rgba(14,12,10,0.65)",
            margin: 0,
            maxWidth: "680px",
          }}
        >
          {s.body}
        </p>
      </Reveal>
    </div>
  );
}

function ImageGridSection({ s }: { s: CaseStudySection }) {
  const cols = s.images?.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: cols,
        gap: "0.5rem",
        background: "#0A0908",
        padding: "0.5rem",
      }}
    >
      {s.images?.map((img, i) => (
        <Reveal key={i} delay={i * 60}>
          <div
            style={{
              position: "relative",
              height: "380px",
              overflow: "hidden",
            }}
          >
            <ParallaxImage src={img.src} alt={img.alt} speed={0.1} />
            {img.caption && (
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1rem",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.12em",
                  color: "rgba(242,237,232,0.4)",
                  textTransform: "uppercase",
                }}
              >
                {img.caption}
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

type BentoItem = { src: string; alt?: string; caption?: string; span?: string };

function MasonryCol({ colItems, speed }: { colItems: BentoItem[]; speed: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inView = false;
    const onScroll = () => {
      if (!inView) return; // skip when off-screen
      const section = el.closest('[data-masonry]') as HTMLElement | null;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = -rect.top / window.innerHeight;
      el.style.transform = `translateY(${progress * speed * 50}px)`;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) onScroll();
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [speed]);
  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', willChange: 'transform' }}>
      {colItems.map((item, i) => (
        <Reveal key={i} delay={i * 60}>
          <img
            src={item.src}
            alt={item.alt ?? ''}
            loading="lazy"
            decoding="async"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
          />
        </Reveal>
      ))}
    </div>
  );
}

function BentoGridSection({
  s,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  const items: BentoItem[] = s.bentoItems ?? [];
  const col0 = items.filter((_, i) => i % 3 === 0);
  const col1 = items.filter((_, i) => i % 3 === 1);
  const col2 = items.filter((_, i) => i % 3 === 2);
  return (
    <div
      data-masonry
      style={{ padding: '5rem 3rem 7rem', overflow: 'hidden' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1.25rem',
          maxWidth: '1300px',
          margin: '0 auto',
          alignItems: 'start',
        }}
      >
        <MasonryCol colItems={col0} speed={-0.4} />
        <MasonryCol colItems={col1} speed={0.2} />
        <MasonryCol colItems={col2} speed={-0.25} />
      </div>
    </div>
  );
}

// ─── Video Grid Section ───────────────────────────────────────────────────────
// 2×2 grid of videos that slide in from the sides on scroll (same animation as GifPairSection)
function VideoGridSection({ s }: { s: CaseStudySection }) {
  const ref = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const directions = [-1, 1, -1, 1];
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const elH = rect.height;
        const centre = rect.top + elH / 2 - vh / 2;
        const range = vh / 2 + elH / 2;
        if (!range || !isFinite(range)) return;
        const p = Math.max(-1, Math.min(1, centre / range));
        if (!isFinite(p)) return;
        const clampedOffset = Math.max(0, p);
        const travel = clampedOffset * 60;
        const opacity = Math.max(0, 1 - clampedOffset * 1.4);
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const dir = directions[i] ?? 1;
          card.style.transform = `translateX(${dir * travel}vw)`;
          card.style.opacity = String(opacity);
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const items = s.videoGridItems || [];
  const directions = [-1, 1, -1, 1];

  return (
    <div
      ref={ref}
      style={{
        background: "#F2EDE8",
        padding: "4rem clamp(1.5rem, 6vw, 6rem)",
        overflow: "hidden",
      }}
    >
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1.5rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}>
        {items.map((item, i) => {
          const dir = directions[i] ?? 1;
          return (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el; }}
              style={{
                borderRadius: "1.25rem",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(14,12,10,0.14)",
                willChange: "transform, opacity",
                transform: `translateX(${dir * 60}vw)`,
                opacity: 0,
                aspectRatio: "16/9",
                background: "#0A0908",
              }}
            >
              <VideoAutoplay src={item.src} poster={item.poster} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VideoAutoplay({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play();
        else el.pause();
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

function GifPairSection({ s }: { s: CaseStudySection }) {
  const ref = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const elH = rect.height;
        const centre = rect.top + elH / 2 - vh / 2;
        const range = vh / 2 + elH / 2;
        if (!range || !isFinite(range)) return;
        const p = Math.max(-1, Math.min(1, centre / range));
        if (!isFinite(p)) return;
        const clampedOffset = Math.max(0, p);
        const travel = clampedOffset * 60;
        const opacity = Math.max(0, 1 - clampedOffset * 1.4).toString();
        if (leftRef.current) {
          leftRef.current.style.transform = `translateX(-${travel}vw)`;
          leftRef.current.style.opacity = opacity;
        }
        if (rightRef.current) {
          rightRef.current.style.transform = `translateX(${travel}vw)`;
          rightRef.current.style.opacity = opacity;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const cardBase: React.CSSProperties = {
    width: "100%",
    maxWidth: "640px",
    borderRadius: "clamp(16px, 4vw, 36px)",
    overflow: "hidden",
    boxShadow: "0 8px 40px rgba(14,12,10,0.18)",
    willChange: "transform, opacity",
    transform: "translateX(60vw)",
    opacity: "0",
  };

  // Helper: render gif or mp4 source — mp4 gets a looping muted video, gif gets an img
  const renderMedia = (src: string, alt: string) => {
    if (src.endsWith(".mp4") || src.endsWith(".webm")) {
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        </video>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
    );
  };

  return (
    <div
      ref={ref}
      className="gif-pair-container"
      style={{
        background: "#F2EDE8",
        padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)",
        display: "flex",
        flexDirection: "row",
        gap: "clamp(1.5rem, 4vw, 4rem)",
        alignItems: "flex-start",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <style>{`@media (max-width: 767px) { .gif-pair-container { flex-direction: column !important; align-items: center !important; } }`}</style>
      {s.gifLeft && (
        <div ref={leftRef} style={cardBase}>
          {renderMedia(s.gifLeft, s.gifLeftAlt || "")}
        </div>
      )}
      {s.gifRight && (
        <div ref={rightRef} style={cardBase}>
          {renderMedia(s.gifRight, s.gifRightAlt || "")}
        </div>
      )}
    </div>
  );
}

// ─── Scroll Gallery Section ──────────────────────────────────────────────────
// Each row uses the same continuous scroll-driven parallax as GifPairSection:
// images travel in from the sides as you scroll down, retreat as you scroll up.

function ScrollGalleryRow({
  row,
  rowIdx,
  accent,
}: {
  row: { src: string; alt?: string; caption?: string }[];
  rowIdx: number;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: row.length === 1 ? "1fr" : "1fr 1fr",
        gap: "2rem",
        alignItems: "start",
        overflow: "hidden",
      }}
    >
      {row.map((img, colIdx) => {
        // Left image always slides in from left, right image always from right
        const goLeft = colIdx === 0;
        return (
          <div
            key={colIdx}
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateX(0)" : `translateX(${goLeft ? "-80px" : "80px"})`,
              transition: "opacity 0.85s cubic-bezier(0.23,1,0.32,1), transform 0.85s cubic-bezier(0.23,1,0.32,1)",
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                borderRadius: "4px",
                overflow: "hidden",
                boxShadow: "0 4px 32px rgba(14,12,10,0.12)",
                border: "1px solid rgba(14,12,10,0.06)",
              }}
            >
              <img
            loading="lazy"
            decoding="async"
                src={img.src}
                alt={img.alt || ""}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            {img.caption && (
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(14,12,10,0.35)",
                  marginTop: "0.75rem",
                  textAlign: colIdx === 0 ? "left" : "right",
                }}
              >
                {img.caption}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ScrollGallerySection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  const images = s.galleryImages ?? [];
  const rows: typeof images[] = [];
  for (let i = 0; i < images.length; i += 2) {
    rows.push(images.slice(i, i + 2));
  }

  return (
    <div
      style={{
        background: "#F2EDE8",
        padding: "5rem clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      {s.galleryHeadline && (
        <div style={{ maxWidth: "1360px", margin: "0 auto 3.5rem" }}>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: accent, marginBottom: "0.75rem" }}>
            Gallery
          </p>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "#0E0C0A", textTransform: "uppercase", letterSpacing: "-0.01em", margin: 0 }}>
            {s.galleryHeadline}
          </h2>
        </div>
      )}
      <div
        style={{
          maxWidth: "1360px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
        }}
      >
        {rows.map((row, rowIdx) => (
          <ScrollGalleryRow
            key={rowIdx}
            row={row}
            rowIdx={rowIdx}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}

function ClosingSection({
  s,
  accent,
}: {
  s: CaseStudySection;
  accent: string;
}) {
  return (
    <div
      style={{
        padding: "clamp(3rem, 8vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
        background: "#F2EDE8",
        borderTop: `1px solid ${accent}20`,
      }}
    >
      <style>{`@media (max-width: 767px) { .closing-grid { grid-template-columns: 1fr !important; } }`}</style>
      {/* Two-column layout when closingMedia is present — stacks on mobile */}
      <div
        className="closing-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(2rem, 5vw, 4rem)",
          alignItems: "center",
        }}
      >
        {/* Left: text — 60% */}
        <div style={{ minWidth: 0 }}>
          <Reveal>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: accent,
                textTransform: "uppercase",
                margin: "0 0 1.5rem",
              }}
            >
              Outcome
            </p>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(2rem, 5vw, 54px)',
                color: "#0A0908",
                margin: "0 0 2rem",
                textTransform: "uppercase",
                lineHeight: 0.95,
                width: "100%",
              }}
            >
              {s.closingHeadline}
            </h2>
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.82rem",
                lineHeight: 1.9,
                color: "rgba(10,9,8,0.55)",
                maxWidth: "520px",
                margin: "0 0 4rem",
              }}
            >
              {s.closingBody}
            </p>
          </Reveal>
        </div>{/* end left text column */}

        {/* Right: closing media image */}
        {s.closingMedia && (
          <Reveal delay={80}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 8px 48px rgba(14,12,10,0.12)",
                  width: "90%",
                }}
              >
                {/\.(mov|mp4|webm)$/i.test(s.closingMedia || "") ? (
                  <video
                    src={s.closingMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                ) : (
                  <img
            loading="lazy"
            decoding="async"
                    src={s.closingMedia}
                    alt=""
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>{/* end two-column row */}

      {s.nextProject && (
        <Reveal delay={120}>
          <div
            style={{
              borderTop: `1px solid ${accent}20`,
              paddingTop: "3rem",
              marginTop: "4rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "rgba(10,9,8,0.35)",
                textTransform: "uppercase",
                margin: "0 0 1rem",
              }}
            >
              Next Project
            </p>
            <Link
              href={`/project/${s.nextProject.slug}`}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
                color: "#0A0908",
                textDecoration: "none",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                gap: "1rem",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = accent)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "#0A0908")
              }
            >
              {s.nextProject.title} →
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  );
}

// ─── Card Carousel Section ───────────────────────────────────────────────────
// Thin wrapper — delegates entirely to the reusable ScrollCardReveal component.

function CardCarouselSection({ s, accent }: { s: CaseStudySection; accent: string }) {
  return (
    <ScrollCardReveal
      cards={s.carouselCards ?? []}
      headline={s.carouselHeadline}
      sub={s.carouselSub}
      leftHeadline={s.carouselLeftHeadline}
      leftBody={s.carouselLeftBody}
      accent={accent}
    />
  );
}

// ─── Video Hero Section ─────────────────────────────────────────────────────

function VideoHeroSection({ s, accent }: { s: CaseStudySection; accent: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const progress = window.scrollY / window.innerHeight;
        el.style.opacity = `${Math.max(0, 1 - progress * 1.5)}`;
        el.style.transform = `translateY(${progress * 40}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", minHeight: "600px", overflow: "hidden", background: "#0A0908" }}>
      {/* Hero background — image or video */}
      {s.heroImage ? (
        <img
            loading="lazy"
            decoding="async"
          src={s.heroImage}
          alt={s.heroTitle}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
      ) : (
        <video
          ref={videoRef}
          src={s.videoSrc}
          poster={s.videoPoster}
          autoPlay
          muted
          loop
          playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
      )}
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,9,8,0.25) 0%, rgba(10,9,8,0.05) 40%, rgba(10,9,8,0.65) 80%, rgba(10,9,8,1) 100%)" }} />
      {/* Content */}
      <div ref={overlayRef} style={{ position: "absolute", bottom: "1.5rem", left: "clamp(1.5rem, 4vw, 4rem)", right: "clamp(1.5rem, 4vw, 4rem)", paddingTop: "20px" }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", color: '#f29354', margin: "0 0 1rem", textTransform: "uppercase" }}>
          {s.heroCategory} — {s.heroYear}
        </p>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '45px', lineHeight: 1.0, color: "#F2EDE8", margin: "0 0 1.5rem", textTransform: "uppercase", letterSpacing: "-0.02em", width: '584px' }}>
          {s.heroTitle}
        </h1>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.15em", color: "rgba(242,237,232,0.5)", margin: 0, textTransform: "uppercase" }}>
          Role — {s.heroRole}
        </p>
      </div>
      <BackButton />
    </div>
  );
}

// ─── Video Break Section ──────────────────────────────────────────────────────

function VideoBreakSection({ s, accent, slideFromRight }: { s: CaseStudySection; accent: string; slideFromRight?: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const grainRef = useRef<SVGFETurbulenceElement>(null);
  let grainRaf = 0;
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const elH = rect.height;
        const centre = rect.top + elH / 2 - vh / 2;
        const range = vh / 2 + elH / 2;
        if (!range || !isFinite(range)) return;
        const p = Math.max(-1, Math.min(1, centre / range));
        if (!isFinite(p)) return;
        const clampedOffset = Math.max(0, p);
        const travel = clampedOffset * 60;
        const opacity = Math.max(0, 1 - clampedOffset * 1.4);
        el.style.transform = `translateX(${slideFromRight ? '' : '-'}${travel}vw)`;
        el.style.opacity = String(opacity);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [slideFromRight]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          // Animate grain
          let seed = 0;
          const animateGrain = () => {
            seed = (seed + 1) % 100;
            if (grainRef.current) grainRef.current.setAttribute("seed", String(seed));
            grainRaf = requestAnimationFrame(animateGrain);
          };
          animateGrain();
        } else {
          videoRef.current?.pause();
          cancelAnimationFrame(grainRaf);
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => { obs.disconnect(); cancelAnimationFrame(grainRaf); };
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        padding: s.videoScale ? `0 ${((1 - s.videoScale) / 2 * 100).toFixed(1)}%` : "0 clamp(1.5rem, 4vw, 5rem)",
        paddingBottom: "2rem",
        overflow: "hidden",
        willChange: "transform, opacity",
        transform: "translateX(60vw)",
        opacity: 0,
      }}
    >
      <div ref={containerRef} style={{ position: "relative", width: "100%", overflow: "hidden", background: "#0A0908", borderRadius: "1.25rem" }}>
        <video
          ref={videoRef}
          src={s.videoSrc}
          poster={s.videoPoster}
          muted
          loop
          playsInline
          style={{ width: "100%", height: "auto", objectFit: "contain", display: "block" }}
        />
        {/* Bottom label */}
        {(s.videoCaption || s.videoLabel) && (
          <div style={{ position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            {s.videoLabel && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: accent, background: "rgba(10,9,8,0.6)", padding: "0.3rem 0.6rem", backdropFilter: "blur(4px)" }}>
                {s.videoLabel}
              </span>
            )}
            {s.videoCaption && (
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.12em", color: "rgba(242,237,232,0.5)", textTransform: "uppercase" }}>
                {s.videoCaption}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CaseStudyPage({ data }: { data: CaseStudyData }) {
  // Scroll to top on mount — set scrollTop directly to bypass CSS scroll-behavior: smooth
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <>
      <style>{`
        .reveal-block {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1);
        }
        .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div style={{ background: "#F2EDE8", minHeight: "100vh" }}>
        {data.sections.map((section, i) => {
          switch (section.type) {
            case "hero":
              return (
                <HeroSection key={i} s={section} accent={data.accentColor} />
              );
            case "video-hero":
              return (
                <VideoHeroSection key={i} s={section} accent={data.accentColor} />
              );
            case "video-break": {
              const vbIndex = data.sections.filter((s2, j) => j < i && s2.type === "video-break").length;
              return (
                <VideoBreakSection key={i} s={section} accent={data.accentColor} slideFromRight={vbIndex % 2 === 1} />
              );
            }
            case "overview":
              return (
                <OverviewSection
                  key={i}
                  s={section}
                  accent={data.accentColor}
                />
              );
            case "chapter":
              return (
                <ChapterSection key={i} s={section} accent={data.accentColor} />
              );
            case "image-full":
              return <ImageFullSection key={i} s={section} />;
            case "image-full-right":
              return <ImageFullSection key={i} s={section} slideFromRight />;
            case "image-split":
              return (
                <ImageSplitSection
                  key={i}
                  s={section}
                  accent={data.accentColor}
                />
              );
            case "stats":
              return (
                <StatsSection key={i} s={section} accent={data.accentColor} />
              );
            case "quote":
              return (
                <QuoteSection key={i} s={section} accent={data.accentColor} />
              );
            case "text-block":
              return (
                <TextBlockSection
                  key={i}
                  s={section}
                  accent={data.accentColor}
                />
              );
            case "image-grid":
              return <ImageGridSection key={i} s={section} />;
            case "bento-grid":
              return (
                <BentoGridSection
                  key={i}
                  s={section}
                  accent={data.accentColor}
                />
              );
            case "card-carousel":
              return (
                <CardCarouselSection
                  key={i}
                  s={section}
                  accent={data.accentColor}
                />
              );
            case "video-grid":
              return <VideoGridSection key={i} s={section} />;
            case "gif-pair":
              return <GifPairSection key={i} s={section} />;
            case "scroll-gallery":
              return <ScrollGallerySection key={i} s={section} accent={data.accentColor} />;
            case "closing":
              return (
                <ClosingSection key={i} s={section} accent={data.accentColor} />
              );
            default:
              return null;
          }
        })}
      </div>
    </>
  );
}
