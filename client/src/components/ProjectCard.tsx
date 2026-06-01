/*
 * DESIGN: "Signal in the Dark" — Project Card
 * Full-bleed dark sections with parallax image, clip-path reveal, gradient overlay.
 * Alternating left/right layout. Image at 55% width, text floats.
 * Background color shifts per project (Foudre-inspired section morphing).
 */

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ProjectCardProps {
  index: number;
  label: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  bgColor?: string;
  accentColor?: string;
  reverse?: boolean;
}

export default function ProjectCard({
  index,
  label,
  title,
  description,
  tags,
  image,
  imageAlt = "",
  bgColor = "#0A0812",
  accentColor = "#7B5EA7",
  reverse = false,
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-100px" });

  const numStr = String(index + 1).padStart(2, "0");

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: bgColor,
        minHeight: "75vh",
        transition: "background-color 0.6s ease",
      }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          [reverse ? "right" : "left"]: "-15%",
          top: "15%",
          width: "60vw",
          height: "60vw",
          background: `radial-gradient(circle, ${accentColor}14 0%, transparent 65%)`,
        }}
      />

      <div
        className="relative z-10"
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "5rem 4rem" }}
      >
        <div
          className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 lg:gap-16 items-center`}
        >
          {/* Image block */}
          <motion.div
            className="w-full lg:w-[58%]"
            initial={{ opacity: 0, x: reverse ? 80 : -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.0, delay: 0.05 }}
            style={{ borderRadius: "3px", overflow: "hidden" }}
          >
            <div
              style={{
                aspectRatio: "16/10",
                position: "relative",
                overflow: "hidden",
                borderRadius: "3px",
                border: "1px solid rgba(255,255,255,0.07)",
                cursor: "none",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1.04)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img") as HTMLImageElement;
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src={image}
                alt={imageAlt || title}
                loading="lazy"
                decoding="async"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  transform: "scale(1)",
                  transition: "transform 0.9s cubic-bezier(0.23,1,0.32,1)",
                }}
              />
              {/* Gradient overlay on image */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg, ${accentColor}12 0%, transparent 50%)`,
                  pointerEvents: "none",
                }}
              />
              {/* Bottom fade */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "30%",
                  background: `linear-gradient(180deg, transparent 0%, ${bgColor}80 100%)`,
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {/* Text block */}
          <motion.div
            className="w-full lg:w-[42%] flex flex-col gap-5"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            {/* Index + label row */}
            <div className="flex items-center gap-3">
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  color: accentColor,
                  opacity: 0.7,
                  minWidth: "28px",
                }}
              >
                {numStr}
              </span>
              <div
                style={{
                  height: "1px",
                  width: "32px",
                  background: `linear-gradient(90deg, ${accentColor}50, transparent)`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                {label}
              </span>
            </div>

            {/* Title */}
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              {title}
            </h2>

            {/* Accent line */}
            <div
              style={{
                height: "2px",
                width: "40px",
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                borderRadius: "1px",
              }}
            />

            {/* Description */}
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: "0.95rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.48)",
                margin: 0,
              }}
            >
              {description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-1">
              {tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-3">
              <button
                className="btn-outline-glow"
                style={{
                  borderRadius: "2px",
                  borderColor: `${accentColor}45`,
                  color: `${accentColor}CC`,
                  transition: "all 0.3s cubic-bezier(0.23,1,0.32,1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(0,212,255,0.5)";
                  el.style.color = "#00D4FF";
                  el.style.boxShadow = "0 0 24px rgba(0,212,255,0.12)";
                  el.style.letterSpacing = "0.2em";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${accentColor}45`;
                  el.style.color = `${accentColor}CC`;
                  el.style.boxShadow = "none";
                  el.style.letterSpacing = "0.15em";
                }}
              >
                View Case Study →
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="divider-gradient" />
    </section>
  );
}
