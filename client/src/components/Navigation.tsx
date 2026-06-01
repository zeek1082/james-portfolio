/*
 * DESIGN: "Signal in the Dark" — Navigation
 *
 * Behavior:
 * - At top of page: logo + nav links + CTA visible, no hamburger
 * - After scrolling 80px: nav links + CTA fade out, hamburger icon fades in (top-right)
 * - Hamburger click: full-screen dark overlay wipes in from top-right corner
 *   Left: massive stacked nav items (Syne bold, huge)
 *   Center: tall portrait project image (clipped, parallax-offset)
 *   Right: contact info + availability
 * - Close: overlay wipes back out
 */

import { useEffect, useRef, useState } from "react";
import { scrollTo } from "@/hooks/useSmoothScroll";
import { motion, AnimatePresence } from "framer-motion";

const WDS_DOCS = "/manus-storage/wds-docs_a1579d02.png";

const navItems = [
  { label: "Work", target: "#work" },
  { label: "About", target: "#about" },
  { label: "Contact", target: "#contact" },
];

// Stagger children in menu
const menuContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const menuItemVariants = {
  hidden: { opacity: 0, y: 60, skewY: 4 },
  visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.65 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 1.08, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.9, delay: 0.2 } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.3 } },
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (target: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollTo(target), 400);
  };

  return (
    <>
      {/* ── Top nav bar ── */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between"
        style={{ background: "transparent" }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNav("#hero")}
          className="flex items-center gap-2 group"
          style={{ zIndex: 60, position: "relative" }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #7B5EA7, #00D4FF)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          >
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "0.7rem",
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              JS
            </span>
          </div>
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 600,
              fontSize: "0.85rem",
              color: menuOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
              letterSpacing: "0.05em",
              transition: "color 0.3s ease",
            }}
            className="hidden sm:block"
          >
            James Smith
          </span>
        </button>

        {/* Desktop nav links — fade out on scroll */}
        <div
          className="hidden md:flex items-center gap-8"
          style={{
            opacity: scrolled ? 0 : 1,
            pointerEvents: scrolled ? "none" : "auto",
            transition: "opacity 0.4s cubic-bezier(0.23,1,0.32,1)",
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNav(item.target)}
              style={{
                fontFamily: "Space Mono, monospace",
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                background: "none",
                border: "none",
                transition: "letter-spacing 0.3s ease, color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.letterSpacing = "0.2em";
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.letterSpacing = "0.12em";
                (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#contact")}
            className="btn-outline-glow"
            style={{ borderRadius: "2px" }}
          >
            Get in touch
          </button>
        </div>

        {/* Hamburger — fades in on scroll (desktop) + always visible on mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            position: "relative",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "8px",
            background: "none",
            border: "none",
            cursor: "pointer",
            opacity: scrolled || menuOpen ? 1 : 0,
            pointerEvents: scrolled || menuOpen ? "auto" : "none",
            transition: "opacity 0.4s cubic-bezier(0.23,1,0.32,1)",
          }}
          className="md:block"
        >
          {/* Show X when open, bars when closed */}
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: menuOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
              transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease",
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: menuOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
              transition: "opacity 0.25s ease",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: menuOpen ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
              transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease",
              transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </motion.nav>

      {/* ── Full-screen menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            key="menu-overlay"
            initial={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            animate={{ clipPath: "circle(170% at calc(100% - 48px) 48px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 48px) 48px)" }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "#0A0812",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Left — massive nav items */}
            <motion.div
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                padding: "0 5vw 0 8vw",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              {/* Label */}
              <motion.span
                variants={menuItemVariants}
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.2)",
                  marginBottom: "2rem",
                  display: "block",
                }}
              >
                Navigation
              </motion.span>

              {navItems.map((item) => (
                <motion.button
                  key={item.label}
                  variants={menuItemVariants}
                  onClick={() => handleNav(item.target)}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(3.5rem, 8vw, 7rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.04em",
                    color: hoveredItem === item.label
                      ? "transparent"
                      : "rgba(255,255,255,0.85)",
                    background: hoveredItem === item.label
                      ? "linear-gradient(135deg, #9B7EC8, #00D4FF)"
                      : "none",
                    WebkitBackgroundClip: hoveredItem === item.label ? "text" : "unset",
                    WebkitTextFillColor: hoveredItem === item.label ? "transparent" : "unset",
                    backgroundClip: hoveredItem === item.label ? "text" : "unset",
                    border: "none",
                    display: "block",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "color 0.2s ease, transform 0.3s cubic-bezier(0.23,1,0.32,1)",
                    transform: hoveredItem === item.label ? "translateX(12px)" : "translateX(0)",
                    padding: "0.15rem 0",
                  }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Divider */}
              <motion.div
                variants={menuItemVariants}
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.06)",
                  margin: "1.5rem 0",
                }}
              />

              {/* Availability badge */}
              <motion.div
                variants={menuItemVariants}
                style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#00D4FF",
                    boxShadow: "0 0 8px rgba(0,212,255,0.6)",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  Available for new roles
                </span>
              </motion.div>
            </motion.div>

            {/* Center — tall portrait image */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: "clamp(220px, 22vw, 340px)",
                aspectRatio: "2/3",
                borderRadius: "4px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <img
                src={WDS_DOCS}
                alt="Featured work"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  transform: "scale(1.05)",
                }}
              />
              {/* Overlay tint */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(10,8,18,0.2) 0%, rgba(10,8,18,0.5) 100%)",
                }}
              />
              {/* Label on image */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.25rem",
                  left: "1.25rem",
                  right: "1.25rem",
                }}
              >
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  Featured — WDS
                </span>
              </div>
            </motion.div>

            {/* Right — contact + social */}
            <motion.div
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                padding: "0 8vw 0 5vw",
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
                alignItems: "flex-end",
                textAlign: "right",
              }}
            >
              <motion.div variants={menuItemVariants}>
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Contact
                </span>
                <a
                  href="mailto:james@example.com"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(0.9rem, 1.4vw, 1.15rem)",
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                    transition: "color 0.2s ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#00D4FF")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                >
                  james@example.com
                </a>
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <span
                  style={{
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    display: "block",
                    marginBottom: "0.75rem",
                  }}
                >
                  Elsewhere
                </span>
                {["LinkedIn", "Dribbble", "Read.cv"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 300,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.35)",
                      textDecoration: "none",
                      display: "block",
                      marginBottom: "0.4rem",
                      letterSpacing: "0.02em",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                  >
                    {link} ↗
                  </a>
                ))}
              </motion.div>

              <motion.div variants={menuItemVariants}>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.78rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.2)",
                    maxWidth: "200px",
                    margin: 0,
                  }}
                >
                  Product Designer
                  <br />
                  Previously Meta
                  <br />
                  Based in San Francisco
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
