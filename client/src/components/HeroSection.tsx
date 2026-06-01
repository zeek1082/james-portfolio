/*
 * DESIGN: "Signal in the Dark" — Hero Section
 *
 * Foudre-exact animation system:
 * - Name lines: line-wrap/line-inner masked reveal (translateY(105%) → 0)
 * - Subtitle, tags: fade-up with staggered --delay
 * - GSAP scroll-driven: hero content fades + moves up as user scrolls (scrubbed)
 * - Background: animated gradient orbs (CSS keyframes)
 * - Vertical year label, availability dot, scroll indicator line
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollTo } from "@/hooks/useSmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492833389/E4X24s2bgzcXDLXF5dJoLn/hero-gradient-UYRsk3ubiGbvzbqJCwgDw7.webp";

export default function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Trigger .is-inview on mount (after a short delay for page load)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const t = setTimeout(() => {
      hero.classList.add("is-inview");
    }, 100);
    return () => clearTimeout(t);
  }, []);

  // GSAP scroll-driven: hero content fades out and moves up as user scrolls
  useEffect(() => {
    const content = contentRef.current;
    const bgImg = bgImgRef.current;
    if (!content) return;

    const ctx = gsap.context(() => {
      gsap.to(content, {
        y: "-16%",
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "75% top",
          scrub: 1.2,
        },
      });

      if (bgImg) {
        gsap.to(bgImg, {
          y: "22%",
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      data-bg-color="#080808"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0" style={{ overflow: "hidden" }}>
        <img
          ref={bgImgRef}
          src={HERO_BG}
          alt=""
          style={{
            width: "100%",
            height: "130%",
            objectFit: "cover",
            objectPosition: "center",
            opacity: 0.4,
            display: "block",
            willChange: "transform",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(8,8,8,0.05) 0%, rgba(8,8,8,0.3) 50%, rgba(8,8,8,1) 100%)",
          }}
        />
        {/* Violet orb */}
        <div
          className="absolute"
          style={{
            top: "5%",
            left: "-5%",
            width: "55vw",
            height: "55vw",
            background: "radial-gradient(circle, rgba(123,94,167,0.14) 0%, transparent 65%)",
            animation: "orbFloat 10s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        {/* Cyan orb */}
        <div
          className="absolute"
          style={{
            bottom: "10%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 65%)",
            animation: "orbFloat 14s ease-in-out infinite reverse",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Year label — right side vertical */}
      <div
        className="absolute top-1/2 right-6 md:right-10 z-10 hidden md:block fade-up"
        style={{
          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "center",
          "--delay": "1800ms",
        } as React.CSSProperties}
      >
        <span
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.1)",
            whiteSpace: "nowrap",
          }}
        >
          Product Design — Meta — 2026
        </span>
      </div>

      {/* Main content */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col justify-end flex-1"
        style={{ padding: "8rem 4rem 5rem" }}
      >
        {/* Label — fade-up */}
        <div
          className="fade-up"
          style={{ marginBottom: "2rem", "--delay": "200ms" } as React.CSSProperties}
        >
          <span
            className="tag-pill"
            style={{ fontFamily: "Space Mono, monospace" }}
          >
            Product Designer · Meta
          </span>
        </div>

        {/* "James" — line-wrap masked reveal */}
        <div className="line-wrap" style={{ lineHeight: 0.9, marginBottom: "0.05em" }}>
          <h1
            className="line-inner"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(4rem, 13vw, 12rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              margin: 0,
              "--delay": "300ms",
            } as React.CSSProperties}
          >
            James
          </h1>
        </div>

        {/* "Smith." — line-wrap masked reveal with gradient */}
        <div className="line-wrap" style={{ lineHeight: 0.9, marginBottom: "3rem" }}>
          <h1
            className="line-inner"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(4rem, 13vw, 12rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              background: "linear-gradient(135deg, #9B7EC8 0%, #00D4FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              "--delay": "440ms",
            } as React.CSSProperties}
          >
            Smith.
          </h1>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div
            className="fade-up"
            style={{ "--delay": "700ms" } as React.CSSProperties}
          >
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)",
                color: "rgba(255,255,255,0.4)",
                maxWidth: "400px",
                lineHeight: 1.65,
                margin: 0,
              }}
            >
              Designing the next era of wearable computing,<br />
              AI identity, and spatial experiences at Meta.
            </p>
          </div>

          <div
            className="fade-up flex flex-col items-start md:items-end gap-3"
            style={{ "--delay": "850ms" } as React.CSSProperties}
          >
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#2A9D5C",
                  animation: "dotPulse 2.5s ease-in-out infinite",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                Available for select projects
              </span>
            </div>
            <button
              onClick={() => scrollTo("#work")}
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.22)",
                background: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "color 0.3s ease, letter-spacing 0.3s ease",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(255,255,255,0.7)";
                el.style.letterSpacing = "0.22em";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "rgba(255,255,255,0.22)";
                el.style.letterSpacing = "0.15em";
              }}
            >
              View work ↓
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator line */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 fade-up"
        style={{ "--delay": "1400ms" } as React.CSSProperties}
      >
        <div
          style={{
            width: "1px",
            height: "70px",
            background: "linear-gradient(180deg, rgba(0,212,255,0.6) 0%, transparent 100%)",
            animation: "scrollLine 2.5s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(2%, 3%) scale(1.04); }
          66% { transform: translate(-1%, -2%) scale(0.97); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(42,157,92,0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(42,157,92,0); }
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; opacity: 0; }
          30% { transform: scaleY(1); transform-origin: top; opacity: 1; }
          70% { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
