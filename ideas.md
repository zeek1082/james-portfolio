# James Smith Portfolio — Design Brainstorm

## Three Design Directions

<response>
<probability>0.07</probability>
<text>

### Direction A: "Dark Observatory" — Brutalist Editorial Dark

**Design Movement:** Neo-Brutalism meets Editorial Dark Mode

**Core Principles:**
- Raw typographic power — text IS the design, not decoration
- Asymmetric tension — nothing is centered, everything is intentional
- Ink-black canvas with surgical light leaks (not gradients, but hard-edged light)
- Friction as a feature — the user earns the content through scroll

**Color Philosophy:** Near-black (#0A0A0A) base. A single acid accent — electric lime (#C8FF00) — used sparingly as a scalpel, not a paintbrush. White type at full opacity. No grays.

**Layout Paradigm:** Full-bleed sections with hard horizontal rules. Project cards are massive typographic blocks with a single image that bleeds off-screen. No cards, no rounded corners. Everything is flush.

**Signature Elements:**
- Oversized section numbers (01, 02, 03) in a condensed grotesque at 20vw
- Hard horizontal rules that animate in on scroll
- Project titles that split across two lines with the second line indented 40%

**Interaction Philosophy:** No hover states that feel "nice." Instead: cursor transforms into a crosshair. Text glitches on hover. Images desaturate on hover, re-saturate on click.

**Animation:** Text lines slide in from left with a 40ms stagger. Section transitions are hard cuts, not fades. Parallax is vertical only, 0.3x ratio.

**Typography System:** Display: Bebas Neue (condensed, all-caps). Body: IBM Plex Mono (monospace, adds a technical/systems feel). Size contrast: 120px display vs 14px body.

</text>
</response>

<response>
<probability>0.08</probability>
<text>

### Direction B: "Signal in the Dark" — Cinematic Dark with Locomotive Scroll ✅ CHOSEN

**Design Movement:** Cinematic Dark Editorial — inspired by Agence Foudre's section morphing + Studio Hazey's gradient breathing + Breakthrough Energy's convergence

**Core Principles:**
- The page breathes — background color shifts as you scroll through sections (deep black → near-black navy → dark charcoal → near-black with violet bleed)
- Typography at cinematic scale — headlines fill the viewport, body text is intimate
- Projects emerge from darkness — cards start invisible, parallax-reveal on scroll
- Personality through precision — sharp copy, unexpected details, confident voice

**Color Philosophy:** Base: #080808 (near-black, not pure black). Section tints shift subtly: #080808 → #08080F (navy bleed) → #0C0808 (warm charcoal) → #0A0812 (violet bleed). Accent: Electric violet (#7B5EA7) bleeding into cyan (#00D4FF) — AI-inspired, premium. Used for glow effects, active states, and gradient text on key headlines.

**Layout Paradigm:** Asymmetric. Hero: full-viewport with name at 15vw left-aligned, role at bottom-right. Projects: alternating left/right image + text, with the image at 60% width and text floating over it. Footer: full-bleed dark with a horizontal marquee.

**Signature Elements:**
- Animated gradient hero background (slow-morphing, Studio Hazey-inspired)
- Horizontal marquee ticker: "WEARABLE DESIGN SYSTEM · RAY-BAN META · SPATIAL AR · AI IDENTITY · META AI MOTION ·"
- Project cards with parallax depth: image moves at 0.7x scroll speed, text at 1x
- Section background color morphing on scroll (Foudre-inspired)

**Interaction Philosophy:** Custom cursor (small dot + larger ring that lags). Hover on project cards: image scales to 1.05x, a color overlay fades in. Hover on nav: letters space out.

**Animation:** Framer Motion for all entrances. Text lines reveal with a clip-path wipe (not fade). Section backgrounds transition over 600ms. Parallax via scroll-linked transforms.

**Typography System:** Display: Syne (geometric, distinctive, not Inter). Body: DM Sans (clean, readable). Accent/label: Space Mono (monospace, for metadata labels). Size hierarchy: 96px hero → 48px section title → 18px body → 11px label.

</text>
</response>

<response>
<probability>0.06</probability>
<text>

### Direction C: "Void Interface" — Spatial Dark with Floating Elements

**Design Movement:** Spatial UI / Glassmorphism Dark — inspired by the AR tool work itself

**Core Principles:**
- The portfolio IS the product — it looks like one of James's AR interfaces
- Depth through layers — foreground, midground, background all move independently
- Glass panels float over dark void backgrounds
- The UI references the work: AR-style crosshairs, depth-of-field blur effects

**Color Philosophy:** True black (#000000) base. Teal (#00C9A7) as the primary accent — matching the AR tool's teal UI. Frosted glass panels at 10% white opacity with 20px blur.

**Layout Paradigm:** Fixed sidebar navigation (like the AR tool's left panel). Main content scrolls in the center. Project cards are glass panels that float and cast soft shadows.

**Signature Elements:**
- Crosshair cursor that matches the AR tool's aesthetic
- Glass panel cards with frosted blur backgrounds
- Subtle scanline texture overlay on the entire page
- Depth-of-field blur on background elements

**Interaction Philosophy:** Everything feels like operating an AR interface. Hover states add a teal glow. Click states ripple outward.

**Animation:** Panels slide in from depth (scale 0.95 → 1.0 + opacity 0 → 1). Background elements parallax at 0.2x. Scanlines animate slowly.

**Typography System:** Display: Space Grotesk. Body: Inter. Accent: Space Mono. All text is white or teal.

</text>
</response>

---

## CHOSEN: Direction B — "Signal in the Dark"

This direction best synthesizes all three reference sites and creates the most compelling narrative for James's work at Meta. The section color morphing creates cinematic scene changes, the Locomotive-style scroll keeps things interesting, and the AI-gradient palette (violet → cyan) directly references the nature of the work (smart glasses, AI, spatial computing).
