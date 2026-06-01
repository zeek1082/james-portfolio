/**
 * PasswordGate — overlay-only approach.
 *
 * CRITICAL: children are ALWAYS mounted and NEVER remounted.
 * The gate is a fixed overlay that sits on top. When the animation
 * completes, the overlay is faded out and then set to display:none.
 * This prevents the Home component from remounting (which was causing
 * Lenis/GSAP/background hooks to re-run, creating the "reload" effect).
 *
 * Flow:
 *  1. #root starts opacity:0 (from index.html CSS)
 *  2. On mount, we claim ownership via window.__GATE_ACTIVE__
 *  3. Wait for Syne 800 → reveal #root (gate overlay covers everything)
 *  4. Correct password → zoom animation → fireUnlock() → overlay fades out
 *  5. Overlay gets display:none — children were always mounted, no remount
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { useUnlock } from "@/contexts/UnlockContext";

const PASSWORD = "James2026";
const SESSION_KEY = "js_portfolio_auth";

declare global { interface Window { __GATE_ACTIVE__?: boolean } }

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const { fireUnlock } = useUnlock();

  const alreadyAuthed = (() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
  })();

  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [animating, setAnimating] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const ZOOM_DURATION = 1200;
  const FADE_DURATION = 700;

  // Claim #root opacity ownership on mount
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    if (alreadyAuthed) {
      // Already authed — hide overlay immediately, reveal root
      if (overlayRef.current) {
        overlayRef.current.style.display = "none";
      }
      root.style.opacity = "1";
      // Fire unlock so components animate in normally
      fireUnlock();
      return;
    }

    // First visit — own opacity, wait for font
    window.__GATE_ACTIVE__ = true;
    const reveal = () => { root.style.opacity = "1"; };
    document.fonts.load("800 1em Syne").then(reveal).catch(reveal);
    const fallback = setTimeout(reveal, 800);

    return () => {
      clearTimeout(fallback);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runZoomAnimation = useCallback(() => {
    setAnimating(true);
    startTimeRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / ZOOM_DURATION, 1);

      // Quartic ease-in: slow start, explosive finish
      const eased = t * t * t * t;
      const scale = 1 + eased * 11; // 1x → 12x

      if (sceneRef.current) {
        sceneRef.current.style.transform = `scale(${scale})`;
      }

      // Fade overlay bg from black → cream starting at 40%
      if (overlayRef.current && t > 0.4) {
        const bgT = Math.min((t - 0.4) / 0.6, 1);
        const bgEased = bgT * bgT;
        const r = Math.round(10 + bgEased * (242 - 10));
        const g = Math.round(10 + bgEased * (237 - 10));
        const b = Math.round(10 + bgEased * (232 - 10));
        overlayRef.current.style.background = `rgb(${r},${g},${b})`;
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}

        // Signal all components to animate in — children are already mounted
        fireUnlock();

        // Fade out overlay — children underneath are already visible
        requestAnimationFrame(() => {
          if (overlayRef.current) {
            overlayRef.current.style.transition = `opacity ${FADE_DURATION}ms cubic-bezier(0.23, 1, 0.32, 1)`;
            overlayRef.current.style.opacity = "0";
          }

          setTimeout(() => {
            // Remove overlay from layout entirely — no more DOM cost
            if (overlayRef.current) {
              overlayRef.current.style.display = "none";
            }
            window.__GATE_ACTIVE__ = false;
          }, FADE_DURATION + 50);
        });
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [fireUnlock]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      setError(false);
      runZoomAnimation();
    } else {
      setError(true);
      setInput("");
      // Shake the whole form container for a stronger effect
      const form = document.getElementById("pw-form");
      if (form) {
        form.classList.remove("pw-shake");
        void (form as HTMLElement).offsetWidth;
        form.classList.add("pw-shake");
      }
    }
  };

  return (
    <>
      {/* Children are ALWAYS mounted — never conditionally rendered */}
      {children}

      {/* Gate overlay — sits on top, fades out, then display:none */}
      {!alreadyAuthed && (
        <div
          ref={overlayRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Scene — zooms in like a camera push */}
          <div
            ref={sceneRef}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transformOrigin: "center center",
              willChange: "transform",
            }}
          >
            {/* JAMES SMITH — each word clips up from below */}
            <div
              style={{
                textAlign: "center",
                lineHeight: 0.88,
                marginBottom: "3rem",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {["JAMES", "SMITH"].map((word, i) => (
                <div
                  key={word}
                  style={{
                    overflow: "hidden",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(4rem, 16vw, 16rem)",
                      color: "#F2EDE8",
                      textTransform: "uppercase",
                      letterSpacing: "-0.04em",
                      display: "block",
                      animation: `gateWordIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both`,
                      animationDelay: `${0.1 + i * 0.12}s`,
                    }}
                  >
                    {word}
                  </div>
                </div>
              ))}
            </div>

            {/* Password form */}
            {!animating && (
              <form
                id="pw-form"
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  animation: "gateFormIn 0.7s cubic-bezier(0.23, 1, 0.32, 1) both",
                  animationDelay: "0.55s",
                }}
              >
                <input
                  id="pw-input"
                  type="password"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(false); }}
                  placeholder="Enter password"
                  autoFocus
                  autoComplete="off"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.75rem",
                    letterSpacing: "0.2em",
                    color: "#F2EDE8",
                    background: "transparent",
                    border: `1px solid ${error ? "#ff4444" : "rgba(242,237,232,0.25)"}`,
                    borderRadius: "2px",
                    padding: "0.75rem 1.25rem",
                    width: "240px",
                    outline: "none",
                    textAlign: "center",
                    transition: "border-color 200ms ease",
                  }}
                  onFocus={(e) => { if (!error) e.target.style.borderColor = "rgba(242,237,232,0.7)"; }}
                  onBlur={(e) => { if (!error) e.target.style.borderColor = "rgba(242,237,232,0.25)"; }}
                />
                <button
                  type="submit"
                  className="pw-btn"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#0a0a0a",
                    background: "#F2EDE8",
                    border: "1px solid #F2EDE8",
                    borderRadius: "2px",
                    padding: "0.65rem 2rem",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)"; }}
                  onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  <span className="pw-btn-text">Enter</span>
                </button>
                {error && (
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.15em",
                    color: "#ff4444",
                    margin: 0,
                    textTransform: "uppercase",
                  }}>
                    Incorrect password
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes gateWordIn {
          from { transform: translateY(110%); }
          to   { transform: translateY(0); }
        }
        @keyframes gateFormIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pw-shake {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-10px); }
          30%  { transform: translateX(9px); }
          45%  { transform: translateX(-7px); }
          60%  { transform: translateX(5px); }
          75%  { transform: translateX(-3px); }
          100% { transform: translateX(0); }
        }
        .pw-shake {
          animation: pw-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }

        /* Button: background wipe from left on hover */
        .pw-btn {
          transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1),
                      color 220ms ease;
        }
        .pw-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #0a0a0a;
          transform: translateX(-101%);
          transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }
        .pw-btn:hover::before {
          transform: translateX(0);
        }
        .pw-btn:hover .pw-btn-text {
          color: #F2EDE8;
        }
        .pw-btn-text {
          position: relative;
          z-index: 1;
          transition: color 220ms ease;
          color: #0a0a0a;
        }
      `}</style>
    </>
  );
}
