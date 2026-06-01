import CaseStudyPage, { CaseStudyData } from "../../components/CaseStudyPage";

const data: CaseStudyData = {
  slug: "rayban-display-ds",
  title: "Ray-Ban Meta Display Design System",
  category: "Design Systems",
  year: "2025",
  role: "Design Lead",
  accentColor: "#4A7C6F",
  sections: [
    {
      type: "video-hero",
      videoSrc: "/manus-storage/rayban-video1_dea47b97.mp4",
      heroTitle: "Ray-Ban Meta Display Design System",
      heroCategory: "Design Systems",
      heroYear: "2025",
      heroRole: "Design Lead",
    },
    {
      type: "overview",
      overviewHeadline:
        "Designing for light — a system built to survive the physics of a passthrough display.",
      overviewBody:
        "The Ray-Ban Meta Display is the first consumer product to place a full-colour in-lens display inside a form factor that looks like ordinary glasses. Unlike a phone screen or a watch face, the display sits in front of the real world — meaning every design decision had to account for ambient light, lens tint, and the optical artifacts that come with waveguide technology. We built a design system from first principles that could hold up in every lighting condition, from a bright outdoor street to a dim restaurant.",
      overviewTags: [
        "Design Systems",
        "Wearable OS",
        "AR Display",
        "Optical UX",
        "Token Architecture",
      ],
    },
    {
      type: "gif-pair",
      gifLeft: "/manus-storage/rayban-gif-new-left_beb85ae0.mp4",
      gifRight: "/manus-storage/rayban-gif-new-right_a0dbae6c.gif",
      gifLeftAlt: "Ray-Ban Meta Display — WhatsApp messaging list",
      gifRightAlt: "Ray-Ban Meta Display — WhatsApp conversation thread",
    },
    {
      type: "text-block",
      headline: "Flaring, Ghosting, and the Limits of the Waveguide",
      body: "Waveguide displays work by bouncing light through a thin piece of glass to reach your eye. The physics of this process create a set of unavoidable optical artifacts — most notably flaring, where bright UI elements bleed into the surrounding image, and ghosting, where high-contrast edges leave a faint trail. Our first challenge was to understand exactly which design choices caused these artifacts, and build a system that minimised them by default.",
    },
    {
      type: "card-carousel",
      carouselSub: "Component Library",
      carouselHeadline: "40+ Components. One Coherent System.",
      carouselLeftHeadline: "40+ Components.\nOne Coherent System.",
      carouselLeftBody: "Every component in the Ray-Ban Meta Display System was designed against the waveguide's optical constraints — tested for flaring, ghosting, and legibility across Day, Night, and High-Glare modes before it shipped.",
      carouselCards: [
        {
          src: "/manus-storage/rb-card-photo_13edb2f2.webp",
          alt: "Ray-Ban Meta Display — Photo Card component",
          label: "Photo Card",
          num: "01",
          category: "COMPONENT LIBRARY",
          title: "Photo Card",
          description: "Full-bleed media card optimised for waveguide rendering — high contrast edges, no flaring at the frame boundary.",
          tags: ["MEDIA", "DISPLAY"],
        },
        {
          src: "/manus-storage/rayban-messaging-sheena_e208ee50.webp",
          alt: "Ray-Ban Meta Display — Messaging component",
          label: "Messaging",
          num: "02",
          category: "COMPONENT LIBRARY",
          title: "Messaging",
          description: "Threaded conversation UI designed for glanceability — message bubbles use reduced opacity fills to prevent ghosting.",
          tags: ["COMMUNICATION", "GLANCEABLE"],
        },
        {
          src: "/manus-storage/rayban-weather-card_278dff57.webp",
          alt: "Ray-Ban Meta Display — Widgets component",
          label: "Widgets",
          num: "03",
          category: "COMPONENT LIBRARY",
          title: "Widgets",
          description: "Ambient information panels — weather, time, and activity — rendered at 40% opacity to blend with the real world.",
          tags: ["AMBIENT", "ALWAYS-ON"],
        },
        {
          src: "/manus-storage/rb-card-notifications_4cf7b852.webp",
          alt: "Ray-Ban Meta Display — Notifications component",
          label: "Notifications",
          num: "04",
          category: "COMPONENT LIBRARY",
          title: "Notifications",
          description: "Interruptive alerts with a strict 3-second auto-dismiss — designed to inform without breaking spatial awareness.",
          tags: ["ALERTS", "INTERRUPTIVE"],
        },
        {
          src: "/manus-storage/rb-card-applauncher_5481304f.webp",
          alt: "Ray-Ban Meta Display — App Launcher component",
          label: "App Launcher",
          num: "05",
          category: "COMPONENT LIBRARY",
          title: "App Launcher",
          description: "A radial app grid that appears on double-tap — icon set uses filled shapes over outlines to survive waveguide diffraction.",
          tags: ["NAVIGATION", "RADIAL"],
        },
        {
          src: "/manus-storage/rb-card-search_80a296ef.webp",
          alt: "Ray-Ban Meta Display — Search component",
          label: "Search",
          num: "06",
          category: "COMPONENT LIBRARY",
          title: "Search",
          description: "Voice-first search with radial category pills — designed for one-handed temple-tap selection without looking down.",
          tags: ["VOICE", "NAVIGATION"],
        },
        {
          src: "/manus-storage/rb-card-ambient_6345664a.webp",
          alt: "Ray-Ban Meta Display — Ambient component",
          label: "Ambient",
          num: "07",
          category: "COMPONENT LIBRARY",
          title: "Ambient",
          description: "Always-on glanceable layer — weather, music, and navigation composited at low opacity so the real world stays primary.",
          tags: ["ALWAYS-ON", "GLANCEABLE"],
        },
        {
          src: "/manus-storage/rb-card-liveai_65d7a71b.webp",
          alt: "Ray-Ban Meta Display — Live AI component",
          label: "Live AI",
          num: "08",
          category: "COMPONENT LIBRARY",
          title: "Live AI",
          description: "Persistent AI session indicator — three opacity states signal active, paused, and background modes without occupying prime display real estate.",
          tags: ["AI", "PERSISTENT"],
        },
      ],
    },
    {
      type: "text-block",
      headline: "Three Modes, One System",
      body: "The display needed to remain legible across radically different ambient conditions. We designed three adaptive themes — Day (high ambient light, reduced brightness, increased contrast), Night (low ambient, full brightness, softer gradients), and High-Glare (direct sunlight, maximum contrast, minimal colour). These themes were not separate design files — they were token overrides applied at the OS level, meaning every component automatically adapted without any per-component work.",
    },
    {
      type: "video-break",
      videoSrc: "/manus-storage/rayban-video2_582b87c3.mp4",
      videoLabel: "Ray-Ban Meta — In Use",
      videoCaption: "Adaptive display in real-world conditions",
    },
    {
      type: "closing",
      closingHeadline:
        "A system that ships with the product — and holds up in the real world.",
      closingBody:
        "The Ray-Ban Meta Display Design System launched with the product in 2025. It is the first design system at Meta built explicitly around the constraints of a passthrough optical display, and it has since become the foundation for the broader Wearables Color System.",
      closingMedia: "/manus-storage/01_EMG_Carousel-01_753510fb.webp",
      nextProject: {
        title: "Wearables Color System",
        slug: "wearables-color-system",
      },
    },
  ],
};

export default function RayBanDisplayDS() {
  return <CaseStudyPage data={data} />;
}
