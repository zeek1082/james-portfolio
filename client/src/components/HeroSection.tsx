/*
 * DESIGN: "Warm Editorial" — Hero Section
 *
 * On first load (after PasswordGate): title starts at scale(0.88) opacity(0)
 * and animates to scale(1) opacity(1) when the unlock event fires — creating
 * a seamless continuation of the gate zoom-in motion.
 *
 * On direct load (already authenticated): title appears normally with a
 * gentle fade-in.
 */

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollTo, addLenisScrollListener, removeLenisScrollListener} from "@/hooks/useSmoothScroll";
import { useUnlock } from "@/contexts/UnlockContext";

gsap.registerPlugin(ScrollTrigger);

const WDS_IMG = "/manus-storage/wds-docs_dbcd9481.webp";
const AR_IMG = "/manus-storage/ar-tool-ui_1226bd7c.webp";
const RAYBAN_IMG = "/manus-storage/rayban-meta-hero_1a588487.webp";

export default function HeroSection() {
  const { onUnlock } = useUnlock();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const jamesRef = useRef<HTMLDivElement>(null);
  const smithRef = useRef<HTMLDivElement>(null);
  const glitchRafRef = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);
  const [titleReady, setTitleReady] = useState(false);

  // Check if already authenticated (skip gate animation)
  const alreadyAuthed = (() => { try { return sessionStorage.getItem("js_portfolio_auth") === "1"; } catch { return false; } })();

  // Gate ALL hero content behind unlock event (or show immediately if already authed)
  useEffect(() => {
    if (alreadyAuthed) {
      // Already authenticated — gentle fade in
      const t = setTimeout(() => { setTitleReady(true); setLoaded(true); }, 80);
      return () => clearTimeout(t);
    } else {
      // Wait for PasswordGate to fire unlock — everything animates in together
      const unsub = onUnlock(() => {
        setTitleReady(true);
        setLoaded(true);
      });
      return unsub;
    }
  }, [onUnlock, alreadyAuthed]);

  // GSAP scroll: title scales up + cards spread as user scrolls
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          scale: 1.06,
          y: "-6%",
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "80% top",
            scrub: 1.5,
          },
        });
      }

      if (jamesRef.current) {
        gsap.to(jamesRef.current, {
          x: "-18vw",
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "100% top",
            scrub: 1.8,
          },
        });
      }
      if (smithRef.current) {
        gsap.to(smithRef.current, {
          x: "18vw",
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "100% top",
            scrub: 1.8,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Chromatic aberration removed for performance
  useEffect(() => {
    let heroVisible = true;

    const io = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        if (!heroVisible) {
          cancelAnimationFrame(glitchRafRef.current);
        }
      },
      { threshold: 0 }
    );
    if (heroRef.current) io.observe(heroRef.current);

    return () => {
      cancelAnimationFrame(glitchRafRef.current);
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      data-bg-color="#F2EDE8"
      style={{
        position: "relative",
        height: "100svh",
        backgroundColor: "#F2EDE8",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Subtle paper grain texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── MASSIVE BACKGROUND TITLE ── */}
      {/* Starts at scale(0.88) opacity(0), animates to scale(1) opacity(1) on unlock */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "clamp(-1rem, -1vh, 0rem)",
          marginTop: "-2vh",
          zIndex: 1,
          pointerEvents: "none",
          transformOrigin: "top center",
          // Scale-in from slightly small — continues the gate zoom motion
          opacity: titleReady ? 1 : 0,
          transform: titleReady ? "scale(1)" : "scale(0.88)",
          transition: titleReady
            ? "opacity 900ms cubic-bezier(0.23, 1, 0.32, 1), transform 900ms cubic-bezier(0.23, 1, 0.32, 1)"
            : "none",
        }}
      >
        <div
          ref={jamesRef}
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "#0E0C0A",
            textAlign: "center",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          JAMES
        </div>
        <div
          ref={smithRef}
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(6rem, 18vw, 22rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "#0E0C0A",
            textAlign: "center",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          SMITH
        </div>
      </div>

      {/* ── BOTTOM CONTENT ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "0 clamp(1.5rem, 4vw, 4rem) clamp(2rem, 4vh, 3.5rem)",
          gap: "2rem",
        }}
      >
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1s ease 0.6s, transform 1s cubic-bezier(0.23,1,0.32,1) 0.6s",
          }}
        >
          <p
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(14,12,10,0.35)",
              margin: "0 0 0.6rem",
            }}
          >
            Design Systems - Wearables - AI Focused - AR/VR
          </p>
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem, 3.5vw, 3.2rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#0E0C0A",
              margin: 0,
            }}
          >
            Product Design Leader
          </p>
        </div>
      </div>

      {/* Availability dot — right edge, vertical */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "clamp(1rem, 2vw, 2rem)",
          transform: "translateY(-50%)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          opacity: loaded ? 0.6 : 0,
          transition: "opacity 1s ease 1s",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#1A3A2A",
            animation: "dotPulse 2.5s ease-in-out infinite",
          }}
        />
        <span
          style={{
            fontFamily: "Space Mono, monospace",
            fontSize: "0.5rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#1A3A2A",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            whiteSpace: "nowrap",
          }}
        >
          Available
        </span>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(26,58,42,0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(26,58,42,0); }
        }
      `}</style>
    </section>
  );
}
