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
      data-bg-color="#080808"
      style={{ backgroundColor: "transparent", padding: "10rem 0 6rem" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(123,94,167,0.1) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10"
        style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 4rem" }}
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
                color: "rgba(255,255,255,0.22)",
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
                  color: "#FFFFFF",
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
                    background: "linear-gradient(135deg, #7B5EA7 0%, #00D4FF 100%)",
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
                color: "rgba(255,255,255,0.38)",
                maxWidth: "460px",
                margin: 0,
              }}
            >
              I'm selectively open to new opportunities — especially at the intersection of AI, wearables, and spatial computing.
            </p>
          </div>

          {/* CTAs — fade-up with stagger */}
          <div
            className="fade-up flex flex-col sm:flex-row items-center gap-4"
            style={{ marginTop: "1rem", "--delay": "460ms" } as React.CSSProperties}
          >
            <a
              href="mailto:james@example.com"
              className="btn-outline-glow"
              style={{ borderRadius: "2px", textDecoration: "none", display: "inline-block" }}
            >
              Say Hello →
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(255,255,255,0.28)")}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          className="mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 fade-up"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
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
                background: "linear-gradient(135deg, #7B5EA7, #00D4FF)",
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
                color: "rgba(255,255,255,0.18)",
              }}
            >
              James Smith · Product Designer
            </span>
          </div>
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.13)",
            }}
          >
            © 2026 · Designed with intent
          </span>
        </div>
      </div>
    </section>
  );
}
