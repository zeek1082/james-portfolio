/*
 * DESIGN: "Signal in the Dark" — Contact Section
 * Foudre-style reveals:
 * - Big headline: line-wrap/line-inner masked reveal
 * - Subtitle, CTAs: fade-up with stagger
 */

import { useEffect, useRef } from "react";

export default function ContactSection() {
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden"
      data-bg-color="#E8E2DB"
      style={{ backgroundColor: "transparent", padding: "clamp(5rem, 10vh, 10rem) 0 6rem" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(26,58,42,0.07) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10"
        style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 clamp(1.5rem, 5vw, 4rem)" }}
      >
        <div className="flex flex-col items-center text-center" style={{ gap: "2rem" }}>

          {/* Label — fade-up */}
          <div className="fade-up">
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(14,12,10,0.3)",
              }}
            >
              Let's work together
            </span>
          </div>

          {/* Big headline — line-wrap masked reveal */}
          <div>
            <div className="line-wrap">
              <h2
                className="line-inner"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "#0E0C0A",
                  margin: 0,
                  "--delay": "60ms",
                } as React.CSSProperties}
              >
                Have something
              </h2>
            </div>
            <div className="line-wrap">
              <h2
                className="line-inner"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(3rem, 8vw, 7rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  "--delay": "180ms",
                } as React.CSSProperties}
              >
                <span
                  style={{
                    backgroundImage: "linear-gradient(135deg, #1A3A2A 0%, #B5CC18 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  interesting?
                </span>
              </h2>
            </div>
          </div>

          {/* Subtitle — fade-up */}
          <div className="fade-up" style={{ "--delay": "320ms" } as React.CSSProperties}>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: "1.05rem",
                lineHeight: 1.75,
                color: "rgba(14,12,10,0.45)",
                maxWidth: "460px",
                margin: 0,
              }}
            >
              I'm selectively open to new opportunities — especially at the intersection of Design Systems, AI, wearables, and spatial computing.
            </p>
          </div>

          {/* CTAs — fade-up with stagger */}
          <div
            className="fade-up flex flex-col sm:flex-row items-center gap-4"
            style={{ marginTop: "1rem", "--delay": "460ms" } as React.CSSProperties}
          >
            <a
              href="mailto:jamespsmith1082@gmail.com"
              className="btn-outline-glow"
              style={{ borderRadius: "2px", textDecoration: "none", display: "inline-block" }}
            >
              Say Hello →
            </a>
            <a
              href="https://www.linkedin.com/in/james-smith-241a3470/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(14,12,10,0.35)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(14,12,10,0.85)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(14,12,10,0.35)")}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 fade-up"
          style={{
            borderTop: "1px solid rgba(14,12,10,0.08)",
            "--delay": "600ms",
          } as React.CSSProperties}
        >
          <div className="flex items-center gap-2">
            <div
              style={{
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1A3A2A, #B5CC18)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              }}
            >
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "0.45rem", color: "white" }}>
                JS
              </span>
            </div>
            <span
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "rgba(14,12,10,0.3)",
              }}
            >
              James Smith · Product Design Leader
            </span>
          </div>
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
                color: "rgba(14,12,10,0.22)",
              }}
            >
              © 2026 · Designed with intent
          </span>
        </div>
      </div>
    </section>
  );
}
