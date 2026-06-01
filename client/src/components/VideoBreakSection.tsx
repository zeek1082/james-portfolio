/*
 * DESIGN: "Warm Editorial" — Video Break Section
 * Overlay: Scanlines + chromatic aberration (variant B)
 */

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/manus-storage/hero-reel_24578860.mp4";

export default function VideoBreakSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const video = videoRef.current;
    if (!section || !text || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            text.style.opacity = "1";
            text.style.transform = "translateY(0)";
            video.play().catch(() => {});
          } else {
            text.style.opacity = "0";
            text.style.transform = "translateY(24px)";
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bg-color="#0E0C0A"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed video — preload=none, play/pause managed by IntersectionObserver */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          zIndex: 0,
        }}
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Base vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(14,12,10,0.45) 0%, rgba(14,12,10,0.15) 50%, rgba(14,12,10,0.6) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Red channel shift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          background: "rgba(255,0,60,0.04)",
          transform: "translateX(-2px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Cyan channel shift */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          pointerEvents: "none",
          background: "rgba(0,220,255,0.04)",
          transform: "translateX(2px)",
          mixBlendMode: "screen",
        }}
      />

      {/* Film grain — static base */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 4,
          opacity: 0.15,
          pointerEvents: "none",
          mixBlendMode: "overlay",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain-b">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-b)" />
      </svg>

      {/* Film grain — animated flicker layer */}
      <style>{`
        @keyframes grain-flicker {
          0%   { transform: translate(0,0); }
          10%  { transform: translate(-2%,-3%); }
          20%  { transform: translate(3%,1%); }
          30%  { transform: translate(-1%,4%); }
          40%  { transform: translate(2%,-2%); }
          50%  { transform: translate(-3%,2%); }
          60%  { transform: translate(1%,-4%); }
          70%  { transform: translate(-2%,3%); }
          80%  { transform: translate(3%,-1%); }
          90%  { transform: translate(-1%,2%); }
          100% { transform: translate(0,0); }
        }
        .grain-flicker { animation: grain-flicker 0.12s steps(1) infinite; }
      `}</style>
      <svg
        className="grain-flicker"
        style={{
          position: "absolute",
          inset: "-10%",
          width: "120%",
          height: "120%",
          zIndex: 4,
          opacity: 0.1,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain-b2">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-b2)" />
      </svg>

      {/* Bottom-left text overlay */}
      <div
        ref={textRef}
        style={{
          position: "absolute",
          bottom: "clamp(2rem, 5vh, 4rem)",
          left: "clamp(1.5rem, 4vw, 4rem)",
          zIndex: 10,
          opacity: 0,
          transform: "translateY(24px)",
          transition:
            "opacity 1.2s cubic-bezier(0.23,1,0.32,1), transform 1.2s cubic-bezier(0.23,1,0.32,1)",
        }}
      >
        <p
          style={{
            fontFamily: "Space Mono, monospace",
            fontWeight: 400,
            fontSize: "clamp(0.75rem, 1.2vw, 1.1rem)",
            lineHeight: 1.2,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(242,237,232,0.9)",
            margin: 0,
          }}
        >
          Ray Ban Meta Display - Design System
        </p>
      </div>
    </section>
  );
}
