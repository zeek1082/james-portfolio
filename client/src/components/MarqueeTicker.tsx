/*
 * DESIGN: "Signal in the Dark" — Marquee Ticker
 * Horizontal scrolling ticker of skills/projects. Locomotive-style.
 */

interface MarqueeTickerProps {
  items: string[];
  speed?: number;
  className?: string;
}

export default function MarqueeTicker({ items, speed = 30, className = "" }: MarqueeTickerProps) {
  const doubled = [...items, ...items];

  return (
    <div
      className={`overflow-hidden ${className}`}
      data-bg-color="#080808"
      style={{ borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-6"
            style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              whiteSpace: "nowrap",
              padding: "1.2rem 2rem",
            }}
          >
            <span>{item}</span>
            <span
              style={{
                display: "inline-block",
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7B5EA7, #00D4FF)",
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
