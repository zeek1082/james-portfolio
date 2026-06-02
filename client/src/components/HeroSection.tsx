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
import { scrollTo, addLenisScrollListener, removeLenisScrollListener, scrollToTopImmediate } from "@/hooks/useSmoothScroll";
import { useIsMobile } from "@/hooks/useMobile";
import { useUnlock } from "@/contexts/UnlockContext";

gsap.registerPlugin(ScrollTrigger);

const WDS_IMG = "/manus-storage/wds-docs_dbcd9481.webp";
const AR_IMG = "/manus-storage/ar-tool-ui_1226bd7c.webp";
const RAYBAN_IMG = "/manus-storage/rayban-meta-hero_1a588487.webp";

export default function HeroSection() {
  const { onUnlock } = useUnlock();
  // Synchronous mobile check — useIsMobile() has a 1-frame delay which causes layout flash
  const isMobileSync = typeof window !== "undefined" && window.innerWidth < 768;
  // Check auth before useState so we can use it as default value
  const alreadyAuthed = (() => { try { return sessionStorage.getItem("js_portfolio_auth") === "1"; } catch { return false; } })();
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const jamesRef = useRef<HTMLDivElement>(null);
  const smithRef = useRef<HTMLDivElement>(null);
  const glitchRafRef = useRef<number>(0);
  const lastScrollY = useRef<number>(0);
  // On mobile: skip the password-gate entrance animation entirely — show immediately
  const [loaded, setLoaded] = useState(alreadyAuthed || isMobileSync);
  const [titleReady, setTitleReady] = useState(alreadyAuthed || isMobileSync);

  // Gate ALL hero content behind unlock event (or show immediately if already authed)
  useEffect(() => {
    if (alreadyAuthed) {
      // Already authenticated — gentle fade in
      const t = setTimeout(() => { setTitleReady(true); setLoaded(true); }, 80);
      return () => clearTimeout(t);
    } else {
      // Wait for PasswordGate to fire unlock — everything animates in together
      const unsub = onUnlock(() => {
        scrollToTopImmediate();
        setTitleReady(true);
        setLoaded(true);
      });
      return unsub;
    }
  }, [onUnlock, alreadyAuthed]);

  const isMobile = useIsMobile();

  // GSAP scroll: split animation disabled on mobile to prevent x-axis clipping
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: "-6%",
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "80% top", scrub: 0.5 },
        });
      }
      if (!isMobileSync && jamesRef.current) {
        gsap.to(jamesRef.current, {
          x: "-18vw",
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "100% top", scrub: 0.6 },
        });
      }
      if (!isMobileSync && smithRef.current) {
        gsap.to(smithRef.current, {
          x: "18vw",
          ease: "none",
          scrollTrigger: { trigger: "#hero", start: "top top", end: "100% top", scrub: 0.6 },
        });
      }
    });
    return () => ctx.revert();
  }, [isMobileSync]);

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
        minHeight: isMobileSync ? "auto" : "100svh",
        backgroundColor: "#F2EDE8",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...(isMobileSync ? {
          justifyContent: "flex-start",
          paddingTop: "5rem",
          paddingBottom: "clamp(2rem, 4vh, 3.5rem)",
          gap: "2rem",
        } : {}),
      }}
    >
      {/* Static noise texture — replaces SVG feTurbulence (which is CPU-rendered) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/manus-storage/noise.webp')",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── MASSIVE BACKGROUND TITLE ── */}
      {/* Starts at scale(0.88) opacity(0), animates to scale(1) opacity(1) on unlock */}
      <div
        ref={titleRef}
        style={{
          ...(isMobileSync ? {
            position: "relative",
            zIndex: 1,
            pointerEvents: "none",
          } : {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: isMobileSync ? "0" : "clamp(-1rem, -1vh, 0rem)",
          marginTop: isMobileSync ? "0" : "-2vh",
          zIndex: 1,
          pointerEvents: "none",
          transformOrigin: "top center",
          willChange: "transform, opacity",
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
            fontSize: "clamp(3rem, 18vw, 22rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "#0E0C0A",
            textAlign: "center",
            userSelect: "none",
            willChange: "transform",
          }}
        >
          JAMES
        </div>
        <div
          ref={smithRef}
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(3rem, 18vw, 22rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "#0E0C0A",
            textAlign: "center",
            userSelect: "none",
            willChange: "transform",
          }}
        >
          SMITH
        </div>
      </div>

      {/* ── BOTTOM CONTENT ── */}
      <div
        style={{
          ...(isMobileSync ? {
            position: "relative",
            zIndex: 4,
          } : {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }),
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

      {/* Availability dot — right edge, vertical — hidden on mobile */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "clamp(1rem, 2vw, 2rem)",
          transform: "translateY(-50%)",
          zIndex: 5,
          display: isMobileSync ? "none" : "flex",
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
