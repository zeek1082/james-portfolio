/*
 * DESIGN: "Signal in the Dark" — Work Section
 *
 * Foudre-exact layout:
 * - Each project: full-width section, project shortTitle at MASSIVE scale
 *   as typographic wallpaper (outline text, very large, behind the cards)
 * - 1–2 tall portrait-format image cards per project, layered/offset (collage-in-motion)
 * - Cards slide up at different speeds on scroll (parallax depth effect)
 * - Image is dominant visual; text panel is secondary
 * - Foudre-style card-reveal: translateY(40%) → 0 + opacity 0→1
 * - Image scale-in: scale(1.15) → scale(1) from overflow:hidden container
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WDS_DOCS = "/manus-storage/wds-docs_a1579d02.png";
const WDS_OPS = "/manus-storage/wds-ops-tool_eb8d5de3.png";
const AR_TOOL = "/manus-storage/ar-tool-ui_4e0d1460.png";
const AR_PATHS = "/manus-storage/ar-tool-paths_40f68d92.png";
const RAYBAN = "/manus-storage/rayban-meta-hero_f845eb03.png";
const AI_IDENTITY = "https://d2xsxph8kpxj0f.cloudfront.net/310519663492833389/E4X24s2bgzcXDLXF5dJoLn/project-ai-identity-8eLbH6vp6gDYVbQjgUXGyK.webp";

const projects = [
  {
    id: "wds",
    bgColor: "#0A0812",
    accentColor: "#7B5EA7",
    num: "01",
    label: "Design Systems",
    title: "Wearable Design System",
    shortTitle: "WDS",
    description: "Built the foundational design language for Meta's smart glasses OS — a 30+ component library covering Home Navigation, Activity Panel, Live Activities, App Grid, and Controls.",
    tags: ["Design Systems", "Wearable OS", "Component Library"],
    images: [WDS_DOCS, WDS_OPS],
  },
  {
    id: "ar-tool",
    bgColor: "#080C12",
    accentColor: "#0090D4",
    num: "02",
    label: "Spatial Computing",
    title: "Spatial AR Authoring Tool",
    shortTitle: "AR Tool",
    description: "An internal tool for authoring AR experiences in real-world spaces. Floorplan view, camera path editor, timeline, walk generation, and depth-of-field controls.",
    tags: ["AR/XR", "Spatial Design", "Camera Systems"],
    images: [AR_TOOL, AR_PATHS],
  },
  {
    id: "day0",
    bgColor: "#0C0808",
    accentColor: "#D4700A",
    num: "03",
    label: "Onboarding Experience",
    title: "Ray-Ban Meta Day 0",
    shortTitle: "Day 0",
    description: "The first-run setup experience for new Ray-Ban Meta owners — connecting WhatsApp and Instagram, configuring AI preferences, and establishing the emotional tone of the product.",
    tags: ["Consumer UX", "Onboarding", "Ray-Ban Meta"],
    images: [RAYBAN],
  },
  {
    id: "wds-ops",
    bgColor: "#08100A",
    accentColor: "#2A9D5C",
    num: "04",
    label: "Internal Tooling",
    title: "WDS Ops Tool",
    shortTitle: "Ops",
    description: "An internal design operations tool for managing the WDS component lifecycle — tracking adoption, surfacing inconsistencies, and enabling cross-team contribution workflows.",
    tags: ["Design Ops", "Internal Tools", "Workflow"],
    images: [WDS_OPS, WDS_DOCS],
  },
  {
    id: "ai-motion",
    bgColor: "#0A0A14",
    accentColor: "#5B6FD4",
    num: "05",
    label: "AI Motion Design",
    title: "Meta AI Motion System",
    shortTitle: "Motion",
    description: "A comprehensive motion design system for Meta AI on glasses — messaging, contact search, notifications, autocorrect, text input, EDU flows, discovery, and accessibility.",
    tags: ["Motion Design", "AI", "Interaction Design"],
    images: [AR_PATHS],
  },
  {
    id: "ai-identity",
    bgColor: "#0D0810",
    accentColor: "#9B5EA7",
    num: "06",
    label: "AI Identity",
    title: "Meta AI Identity & Characters",
    shortTitle: "Identity",
    description: "The personality layer of Meta AI — hero identity images, fidget animations, spatial character expressions, and the visual language for how AI presents itself across Meta's wearable ecosystem.",
    tags: ["AI Identity", "Character Design", "Animation"],
    images: [AI_IDENTITY],
  },
];

// Hook: adds .is-inview when element enters viewport
function useInView(threshold = 0.05, rootMargin = "0px 0px -5% 0px") {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-inview");
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  return ref;
}

// A single project section with Foudre-style stacked portrait cards
function ProjectSection({
  id, bgColor, accentColor, num, label, title, shortTitle, description, tags, images, index,
}: typeof projects[0] & { index: number }) {
  const sectionRef = useInView(0.04, "0px 0px -3% 0px");
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (card1Ref.current) {
        gsap.to(card1Ref.current, {
          y: "6%",
          ease: "none",
          scrollTrigger: {
            trigger: card1Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
      if (card2Ref.current) {
        gsap.to(card2Ref.current, {
          y: "-6%",
          ease: "none",
          scrollTrigger: {
            trigger: card2Ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  const isEven = index % 2 === 0;
  const hasTwo = images.length > 1;

  return (
    <div
      ref={sectionRef}
      id={id}
      data-bg-color={bgColor}
      style={{
        position: "relative",
        backgroundColor: "transparent",
        padding: "10rem 0 14rem",
        overflow: "hidden",
      }}
    >
      {/* ── MASSIVE BACKGROUND TITLE (typographic wallpaper) ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: isEven ? "-1%" : "auto",
          right: isEven ? "auto" : "-1%",
          transform: "translateY(-50%)",
          fontFamily: "Syne, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(8rem, 20vw, 22rem)",
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          color: "transparent",
          WebkitTextStroke: `1px ${accentColor}28`,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        {shortTitle}
      </div>

      {/* ── AMBIENT GLOW ── */}
      <div
        style={{
          position: "absolute",
          [isEven ? "left" : "right"]: "-10%",
          top: "20%",
          width: "60vw",
          height: "60vw",
          background: `radial-gradient(circle, ${accentColor}09 0%, transparent 65%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 5rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── TOP ROW: Number + Label ── */}
        <div
          className="fade-up"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "4rem",
            "--delay": "0ms",
          } as React.CSSProperties}
        >
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              color: accentColor,
              opacity: 0.9,
            }}
          >
            {num}
          </span>
          <div style={{ height: "1px", width: "40px", background: `linear-gradient(90deg, ${accentColor}70, transparent)` }} />
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
            }}
          >
            {label}
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.04)" }} />
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.12)",
            }}
          >
            {num} / 06
          </span>
        </div>

        {/* ── MAIN LAYOUT: Images (dominant) + Text ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isEven ? "1.1fr 0.5fr" : "0.5fr 1.1fr",
            gap: "clamp(2rem, 5vw, 7rem)",
            alignItems: "flex-start",
          }}
        >
          {/* ── IMAGE COLLAGE (dominant side) ── */}
          <div
            style={{
              order: isEven ? 1 : 2,
              position: "relative",
              paddingBottom: hasTwo ? "10rem" : "0",
            }}
          >
            {/* Primary card */}
            <div
              className="card-reveal"
              style={{ "--delay": "0ms" } as React.CSSProperties}
            >
              <div ref={card1Ref}>
                <div
                  className="img-reveal-wrap img-card-hover"
                  style={{
                    borderRadius: "3px",
                    border: `1px solid ${accentColor}1A`,
                    aspectRatio: hasTwo ? "4/3" : "16/10",
                    position: "relative",
                    boxShadow: `0 48px 96px rgba(0,0,0,0.55), 0 0 0 1px ${accentColor}0E`,
                  }}
                >
                  <img
                    src={images[0]}
                    alt={title}
                    className="img-reveal"
                    style={{ objectPosition: "center top" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(160deg, ${accentColor}14 0%, transparent 55%)`,
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Secondary card — offset, layered */}
            {hasTwo && (
              <div
                className="card-reveal"
                style={{
                  "--delay": "200ms",
                  position: "absolute",
                  bottom: 0,
                  right: isEven ? "-6%" : "auto",
                  left: isEven ? "auto" : "-6%",
                  width: "58%",
                } as React.CSSProperties}
              >
                <div ref={card2Ref}>
                  <div
                  className="img-reveal-wrap img-card-hover"
                  style={{
                    borderRadius: "3px",
                    border: `1px solid ${accentColor}24`,
                    aspectRatio: "4/3",
                    position: "relative",
                    boxShadow: `0 32px 64px rgba(0,0,0,0.65), 0 0 0 1px ${accentColor}16`,
                  }}
                  >
                    <img
                      src={images[1]}
                      alt={`${title} — detail`}
                      className="img-reveal"
                      style={{ objectPosition: "center top" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(160deg, ${accentColor}10 0%, transparent 55%)`,
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── TEXT PANEL ── */}
          <div
            style={{
              order: isEven ? 2 : 1,
              display: "flex",
              flexDirection: "column",
              gap: "1.8rem",
              paddingTop: "clamp(1rem, 5vw, 6rem)",
            }}
          >
            {/* Title */}
            <div>
              <div className="line-wrap" style={{ overflow: "hidden" }}>
                <h2
                  className="line-inner"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.8rem, 3vw, 3.2rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                    color: "#FFFFFF",
                    margin: 0,
                    "--delay": "120ms",
                  } as React.CSSProperties}
                >
                  {title}
                </h2>
              </div>
            </div>

            {/* Accent rule */}
            <div
              className="clip-reveal"
              style={{
                height: "2px",
                width: "52px",
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                borderRadius: "1px",
                "--delay": "260ms",
              } as React.CSSProperties}
            />

            {/* Description */}
            <p
              className="fade-up"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: "0.88rem",
                lineHeight: 1.9,
                color: "rgba(255,255,255,0.38)",
                margin: 0,
                "--delay": "300ms",
              } as React.CSSProperties}
            >
              {description}
            </p>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {tags.map((tag, i) => (
                <span
                  key={tag}
                  className="tag-pill scale-in"
                  style={{ "--delay": `${380 + i * 70}ms` } as React.CSSProperties}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div
              className="fade-up"
              style={{ "--delay": "540ms", marginTop: "0.4rem" } as React.CSSProperties}
            >
              <button
                className="btn-outline-glow"
                style={{
                  borderRadius: "2px",
                  borderColor: `${accentColor}40`,
                  color: `${accentColor}CC`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(0,212,255,0.5)";
                  el.style.color = "#00D4FF";
                  el.style.boxShadow = "0 0 24px rgba(0,212,255,0.12)";
                  el.style.letterSpacing = "0.22em";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${accentColor}40`;
                  el.style.color = `${accentColor}CC`;
                  el.style.boxShadow = "none";
                  el.style.letterSpacing = "0.15em";
                }}
              >
                View Case Study →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "clamp(1.5rem, 5vw, 5rem)",
          right: "clamp(1.5rem, 5vw, 5rem)",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${accentColor}22, transparent)`,
        }}
      />
    </div>
  );
}

// Section header
function WorkHeader() {
  const ref = useInView(0.1);

  return (
    <section
      ref={ref}
      data-bg-color="#080808"
      style={{
        backgroundColor: "transparent",
        padding: "9rem clamp(1.5rem, 5vw, 5rem) 5rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          paddingBottom: "3.5rem",
        }}
      >
        <div className="fade-up" style={{ marginBottom: "1.5rem" }}>
          <span
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Selected Work
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div className="line-wrap">
              <h2
                className="line-inner"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.035em",
                  color: "#FFFFFF",
                  margin: 0,
                  "--delay": "60ms",
                } as React.CSSProperties}
              >
                Six years at the frontier.
              </h2>
            </div>
          </div>

          <div
            className="slide-in-right"
            style={{ "--delay": "200ms" } as React.CSSProperties}
          >
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: "0.88rem",
                lineHeight: 1.8,
                color: "rgba(255,255,255,0.3)",
                maxWidth: "300px",
                margin: 0,
              }}
            >
              Designing wearable OS, spatial tools, AI identity, and motion systems for Meta's next-generation hardware.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sticky manifesto section
function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);
  const word4Ref = useRef<HTMLSpanElement>(null);
  const word5Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = [word1Ref, word2Ref, word3Ref, word4Ref, word5Ref]
      .map((r) => r.current)
      .filter(Boolean) as HTMLSpanElement[];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "70% center",
          scrub: 1.5,
        },
      });
      words.forEach((word, i) => {
        tl.fromTo(
          word,
          { y: "100%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.3, ease: "power2.out" },
          i * 0.15
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const wordStyle: React.CSSProperties = {
    display: "inline-block",
    transform: "translateY(120%)",
    opacity: 0,
    willChange: "transform, opacity",
  };

  const wrapStyle: React.CSSProperties = {
    display: "inline-flex",
    overflow: "hidden",
    verticalAlign: "bottom",
  };

  return (
    <div
      ref={sectionRef}
      className="sticky-scroll-section"
      data-bg-color="#0A0812"
      style={{ backgroundColor: "transparent" }}
    >
      <div className="sticky-screen">
        <div
          style={{
            textAlign: "center",
            padding: "0 4rem",
            maxWidth: "900px",
          }}
        >
          <p
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.025em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            <span style={wrapStyle}>
              <span ref={word1Ref} style={wordStyle}>Craft</span>
            </span>{" "}
            <span style={wrapStyle}>
              <span ref={word2Ref} style={wordStyle}>that</span>
            </span>{" "}
            <span style={wrapStyle}>
              <span
                ref={word3Ref}
                style={{
                  ...wordStyle,
                  background: "linear-gradient(135deg, #9B7EC8, #00D4FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ships.
              </span>
            </span>{" "}
            <span style={wrapStyle}>
              <span ref={word4Ref} style={wordStyle}>Systems</span>
            </span>{" "}
            <span style={wrapStyle}>
              <span ref={word5Ref} style={wordStyle}>that scale.</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WorkSection() {
  return (
    <div id="work">
      <WorkHeader />
      <ManifestoSection />
      {projects.map((project, i) => (
        <ProjectSection key={project.id} {...project} index={i} />
      ))}
    </div>
  );
}
