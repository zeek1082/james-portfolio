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
import { addLenisScrollListener, removeLenisScrollListener, scrollTo } from "@/hooks/useSmoothScroll";
import { motion, AnimatePresence } from "framer-motion";
import { useUnlock } from "@/contexts/UnlockContext";

const WDS_DOCS = "/manus-storage/wds-docs_dbcd9481.webp";

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
  const { onUnlock } = useUnlock();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Gate nav entrance behind unlock event (or show immediately if already authed)
  const alreadyAuthed = (() => { try { return sessionStorage.getItem("js_portfolio_auth") === "1"; } catch { return false; } })();
  const [navReady, setNavReady] = useState(alreadyAuthed);

  useEffect(() => {
    if (alreadyAuthed) return;
    const unsub = onUnlock(() => setNavReady(true));
    return unsub;
  }, [onUnlock, alreadyAuthed]);

  useEffect(() => {
    // Use addLenisScrollListener so this piggybacks on the existing Lenis tick
    // instead of adding a separate window scroll listener.
    const handleScroll = ({ scroll }: { scroll: number }) => {
      setScrolled(scroll > 80);
    };
    addLenisScrollListener(handleScroll);
    return () => removeLenisScrollListener(handleScroll);
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
        animate={{ opacity: navReady ? 1 : 0, y: navReady ? 0 : -20 }}
        transition={{ duration: 0.7, delay: navReady ? 0.1 : 0, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-start gap-6"
        style={{ background: "transparent" }}
      >
        {/* Hamburger — top-left, only nav element */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            position: "relative",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "#2D5016",
            border: "none",
            cursor: "pointer",
            transition: "background 0.35s cubic-bezier(0.23,1,0.32,1), transform 0.15s ease",
            boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          {/* Show X when open, bars when closed */}
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: "rgba(255,255,255,0.95)",
              transition: "transform 0.35s cubic-bezier(0.23,1,0.32,1), opacity 0.25s ease",
              transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none",
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: "rgba(255,255,255,0.95)",
              transition: "opacity 0.25s ease",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "1.5px",
              background: "rgba(255,255,255,0.95)",
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
            initial={{ clipPath: "circle(0% at 48px 48px)" }}
            animate={{ clipPath: "circle(170% at 48px 48px)" }}
            exit={{ clipPath: "circle(0% at 48px 48px)" }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "#2D5016",
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
                      ? "#B5CC18"
                      : "rgba(255,255,255,0.85)",
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
                    background: "#2A5A3A",
                    boxShadow: "0 0 8px rgba(42,90,58,0.6)",
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
                  href="mailto:jamespsmith1082@gmail.com"
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
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#B5CC18")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                >
                  jamespsmith1082@gmail.com
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
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/james-smith-241a3470/" },
                  { label: "Read.cv", href: "#" },
                ].map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      fontWeight: 300,
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.35)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      gap: "0.4rem",
                      marginBottom: "0.4rem",
                      letterSpacing: "0.02em",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                  >
                    {label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5 }}>
                      <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
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
                  Product Design Leader @ Meta — Based in San Francisco
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
