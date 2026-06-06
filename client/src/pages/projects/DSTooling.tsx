import CaseStudyPage, { CaseStudyData } from "../../components/CaseStudyPage";

const data: CaseStudyData = {
  slug: "ds-tooling",
  title: "AI-Powered Design Tooling",
  category: "Tooling & AI",
  year: "2025",
  role: "Design Lead",
  accentColor: "#7C3A3A",
  sections: [
    {
      type: "video-hero",
      videoSrc: "/manus-storage/ScreenRecording2026-06-01at9.20.30AM_d00a73eb.mov",
      heroTitle: "AI-Powered Design Tooling",
      heroCategory: "Tooling & AI",
      heroYear: "2025",
      heroRole: "Design Lead",
    },
    {
      type: "overview",
      overviewHeadline:
        "What if your design system could lint itself, document itself, and build with you?",
      overviewBody:
        "The goal of this project was to explore how AI-powered tooling could make our design systems team dramatically more efficient. We built a suite of tools ranging from automated design system linters that catch token misuse in Figma files, to a full AI-powered design tool that lets designers work directly with web components and use an AI assistant to vibe-code with them.",
      overviewTags: [
        "AI Tooling",
        "Design Systems",
        "Figma Plugins",
        "Linting",
        "Web Components",
        "Vibe Coding",
      ],
    },
    {
      type: "video-break",
      videoSrc: "/manus-storage/ScreenRecording2026-06-01at9.34.37AM_97703554.mov",
      videoScale: 0.82,
      videoLabel: "DS Tooling — Linter in Action",
      videoCaption: "Automated design system linting catching token misuse in real time",
    },
    {
      type: "text-block",
      headline: "Where Time Was Being Lost",
      body: "We started by auditing how our design systems team spent their time. The findings were stark: a significant portion of every sprint was spent on reactive work — catching token misuse in design files, answering questions about which component to use, and manually updating documentation after system changes. These were all tasks that, in theory, a well-designed tool could handle automatically. We set out to build that tool.",
    },
    {
      type: "video-grid",
      videoGridItems: [
        { src: "/manus-storage/ScreenRecording2026-06-01at10.08.18AM_8039411c.mov" },
        { src: "/manus-storage/ScreenRecording2026-06-01at9.31.19AM_914a3df9.mov" },
        { src: "/manus-storage/ScreenRecording2026-06-01at9.28.48AM_9961ded8.mov" },
        { src: "/manus-storage/ScreenRecording2026-06-01at9.27.38AM_bfb771a9.mov" },
      ],
    },
    {
      type: "text-block",
      headline: "Designing with Web Components",
      body: "The most ambitious tool we built was a design environment where designers work directly with web components rather than static Figma layers. Components render live in the canvas, respond to real data, and can be themed using the same token system that ships to production. An AI assistant sits alongside the canvas — designers can describe what they want to build in natural language, and the assistant generates the component composition, applies the right tokens, and explains its choices.",
    },
    {
      type: "video-break",
      videoSrc: "/manus-storage/grove_e765600d.mov",
      videoLabel: "DS Tooling — In Use",
      videoCaption: "AI-assisted design with live web components",
    },
    {
      type: "closing",
      closingHeadline:
        "A suite of tools that gave the team back the time to do their best work.",
      closingBody:
        "The AI-Powered Design Tooling suite shipped internally in 2025 and is now used by every designer working on Meta's wearables products. The linter has caught thousands of token violations, the AI docs have eliminated the documentation backlog, and the vibe IDE has become the primary design environment for new component development.",
      closingMedia: "/manus-storage/Screenshot2026-03-25at10.56.46AM1_f69286d0.webp",
      nextProject: {
        title: "Ray-Ban Meta Display Design System",
        slug: "rayban-display-ds",
      },
    },
  ],
};

export default function DSTooling() {
  return <CaseStudyPage data={data} />;
}
