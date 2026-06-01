/*
 * DESIGN: "Signal in the Dark" — About Section
 *
 * Wipe reveal: mirrors the nav overlay approach (Framer Motion clipPath).
 * The entire section is clipped via inset(0 100% 0 0) → inset(0 0% 0 0)
 * when it enters the viewport (IntersectionObserver), revealing the dark
 * section sweeping in from the left — exactly like the menu circle expand.
 *
 * The section sits over a light background wrapper so the wipe is visible.
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const skills = [
  "Product Design", "Design Systems", "Wearable OS",
  "Spatial Computing", "AI/ML Interfaces", "Motion Design",
  "Prototyping", "User Research", "Design Ops",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    /*
     * Outer wrapper: light page background — visible before/during the wipe.
     * The dark motion.div clips in over it from the left.
     */
    <div
      ref={sectionRef}
      id="about"
      style={{ backgroundColor: "#f0ede6" }}
    >
      <motion.section
        initial={{ clipPath: "circle(0% at 0% 100%)" }}
        animate={inView ? { clipPath: "circle(150% at 0% 100%)" } : { clipPath: "circle(0% at 0% 100%)" }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{
          backgroundColor: "#0a0a0a",
          color: "#fff",
          minHeight: "100vh",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-32 md:py-40">
          {/* Section label */}
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-20">About</p>

          {/* Hero quote */}
          <div className="mb-24 md:mb-32">
            <h2
              className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight text-white"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              "The best interfaces
              <br />
              <span className="text-white/30">disappear."</span>
            </h2>
          </div>

          {/* Bio + stats grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
            {/* Bio */}
            <div>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8">
                Product designer at Meta, working at the intersection of wearable computing,
                AI, and spatial experiences. I've spent the last several years helping define
                what it means to wear intelligence — from the design system that powers the
                glasses OS, to the AI character that greets you each morning.
              </p>
              <p className="text-base text-white/50 leading-relaxed">
                I care deeply about craft, systems thinking, and the moments that make
                technology feel human.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 content-start">
              {[
                { value: "4", label: "Years at Meta" },
                { value: "60+", label: "Components shipped" },
                { value: "3", label: "Products launched" },
              ].map(({ value, label }) => (
                <div key={label} className="border-t border-white/10 pt-6">
                  <div
                    className="text-4xl md:text-5xl font-black text-white mb-2"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-white/40 uppercase tracking-widest leading-tight">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="border-t border-white/10 pt-12 mb-24">
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-6">Disciplines</p>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-sm text-white/60 border border-white/10 px-4 py-2 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Currently */}
          <div className="border-t border-white/10 pt-12">
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Currently</p>
            <p className="text-white/70 text-base">
              Product Designer at Meta · Wearable Computing &amp; AI Experiences
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
