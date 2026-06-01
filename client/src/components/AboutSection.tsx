/*
 * DESIGN: "Signal in the Dark" — About Section
 * Foudre-style reveals:
 * - Quote headline: line-wrap/line-inner masked reveal
 * - Stats: card-reveal with staggered --delay
 * - Skills: scale-in with stagger
 * - Body text: fade-up
 */

import { useEffect, useRef } from "react";

const skills = [
  "Product Design", "Design Systems", "Wearable OS",
  "Spatial Computing", "AI/ML Interfaces", "Motion Design",
  "Prototyping", "User Research", "Design Ops",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-inview");
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
      data-bg-color="#0A0A0A"
      style={{ backgroundColor: "transparent", padding: "8rem 0" }}
    >
      {/* Background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-5%",
          top: "10%",
          width: "40vw",
          height: "40vw",
          background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)",
        }}
      />

      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 4rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Big quote + bio */}
          <div className="flex flex-col justify-center" style={{ gap: "2rem" }}>
            {/* Label */}
            <div className="fade-up">
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                  display: "block",
                }}
              >
                About
              </span>
            </div>

            {/* Quote — line-wrap masked reveal */}
            <div>
              <div className="line-wrap">
                <p
                  className="line-inner"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                    margin: 0,
                    "--delay": "60ms",
                  } as React.CSSProperties}
                >
                  "The best interfaces
                </p>
              </div>
              <div className="line-wrap">
                <p
                  className="line-inner"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                    lineHeight: 1.2,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    "--delay": "160ms",
                  } as React.CSSProperties}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #9B7EC8 0%, #00D4FF 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    disappear."
                  </span>
                </p>
              </div>
            </div>

            {/* Body text — fade-up */}
            <div className="fade-up" style={{ "--delay": "280ms" } as React.CSSProperties}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 300,
                  fontSize: "0.95rem",
                  lineHeight: 1.85,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                  maxWidth: "480px",
                }}
              >
                Product designer at Meta, working at the intersection of wearable computing, AI, and spatial experiences. I've spent the last several years helping define what it means to wear intelligence — from the design system that powers the glasses OS, to the AI character that greets you each morning.
              </p>
            </div>

            <div className="fade-up" style={{ "--delay": "360ms" } as React.CSSProperties}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 300,
                  fontSize: "0.95rem",
                  lineHeight: 1.85,
                  color: "rgba(255,255,255,0.4)",
                  margin: 0,
                  maxWidth: "480px",
                }}
              >
                I care deeply about craft, systems thinking, and the moments that make technology feel human.
              </p>
            </div>
          </div>

          {/* Right: Stats + skills */}
          <div className="flex flex-col" style={{ gap: "3rem" }}>
            {/* Stats — card-reveal with stagger */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { num: "6+", label: "Years at Meta" },
                { num: "30+", label: "Components shipped" },
                { num: "3", label: "Products launched" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="card-reveal flex flex-col gap-1"
                  style={{
                    "--delay": `${i * 100}ms`,
                    borderTop: "1px solid rgba(255,255,255,0.07)",
                    paddingTop: "1.25rem",
                  } as React.CSSProperties}
                >
                  <span
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 800,
                      fontSize: "2.5rem",
                      lineHeight: 1,
                      background: "linear-gradient(135deg, #7B5EA7 0%, #00D4FF 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {stat.num}
                  </span>
                  <span
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.28)",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider — horizontal line reveal */}
            <div
              className="line-reveal-h divider-gradient"
              style={{ "--delay": "300ms" } as React.CSSProperties}
            />

            {/* Skills — scale-in with stagger */}
            <div>
              <div className="fade-up" style={{ marginBottom: "1rem", "--delay": "200ms" } as React.CSSProperties}>
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.22)",
                    display: "block",
                  }}
                >
                  Disciplines
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={skill}
                    className="tag-pill scale-in"
                    style={{ "--delay": `${280 + i * 50}ms` } as React.CSSProperties}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Currently — card-reveal */}
            <div
              className="card-reveal"
              style={{
                "--delay": "400ms",
                padding: "1.5rem",
                border: "1px solid rgba(123,94,167,0.18)",
                borderRadius: "4px",
                background: "rgba(123,94,167,0.04)",
              } as React.CSSProperties}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#00D4FF",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(0,212,255,0.65)",
                  }}
                >
                  Currently
                </span>
              </div>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.48)",
                  margin: 0,
                }}
              >
                Product Designer at Meta · Wearable Computing & AI Experiences
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
