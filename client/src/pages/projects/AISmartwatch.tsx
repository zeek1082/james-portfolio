import CaseStudyPage, { CaseStudyData } from "../../components/CaseStudyPage";

const data: CaseStudyData = {
  slug: "ai-smartwatch",
  title: "AI Assistant Device",
  category: "AI Systems",
  year: "2025–2026",
  role: "Design Lead",
  accentColor: "#5C3A7C",
  sections: [
    {
      type: "video-hero",
      heroImage: "/manus-storage/ai-smartwatch-hero_954381c0.webp",
      heroTitle: "AI Assistant Device",
      heroCategory: "AI Systems",
      heroYear: "2025–2026",
      heroRole: "Design Lead",
    },
    {
      type: "overview",
      overviewHeadline:
        "A device with no OS — just an AI that learns what you need.",
      overviewBody:
        "The AI Assistant Device doesn't run a traditional operating system. Instead, it runs on an OpenClaw-style AI system that replaces the conventional app model with a set of user-created 'Spaces' — persistent contexts that the AI populates with relevant information, actions, and mini-apps. Users can vibe-code their own apps, personalise their theme, and choose their main agent character.",
      overviewTags: [
        "AI Systems",
        "Design Systems",
        "Vibe Coding",
        "Wearable OS",
        "Agent Design",
        "Web Components",
      ],
    },
    {
      type: "image-full",
      image: "/manus-storage/IDHeroImage(4)_093d8c25.webp",
      imageAlt: "AI Assistant Device — three devices on shelf",
    },
    {
      type: "text-block",
      headline: "The System Language",
      body: "The first design system we built was the 'System Language' — the default visual and interaction language for the AI-native experience. This covered the chat interface, default Spaces (weather, health, calendar, communications), and the agent character. The challenge here was designing for an AI that doesn't have a fixed set of screens — it generates responses dynamically, so the design system needed to define how AI-generated content should look and behave, not just static templates.",
    },
    {
      type: "card-carousel",
      carouselSub: "Interaction Patterns",
      carouselHeadline: "Two Systems. One Experience.",
      carouselLeftHeadline: "Two Systems.\nOne Experience.",
      carouselLeftBody:
        "Every component in the AI Assistant Device system was designed to work both in the default AI experience and in user-created Spaces — with a theming API that let users customise without breaking the system.",
      carouselCards: [
        {
          src: "/manus-storage/Frame2147258658(15)_c361178d.webp",
          alt: "AI Assistant Device — three colorful devices floating",
          label: "Device Variants",
        },
        {
          src: "/manus-storage/Frame2147258658(18)_f30d9f40.webp",
          alt: "AI Assistant Device — music player UI",
          label: "Music Space",
        },
        {
          src: "/manus-storage/Frame2147258658(17)_a97910bb.webp",
          alt: "AI Assistant Device — agent character with Half Marathon notification",
          label: "Agent Character",
        },
        {
          src: "/manus-storage/Frame2147258658(16)_ca983640.webp",
          alt: "AI Assistant Device — Dodgers win notification",
          label: "Live Notifications",
        },
        {
          src: "/manus-storage/Frame2147258658(14)_2b7c4fa9.webp",
          alt: "AI Assistant Device — blue device in marble dish with pearls",
          label: "Lifestyle",
        },
      ],
    },
    {
      type: "text-block",
      headline: "A Design System That Teaches Itself",
      body: "To make the vibe coding experience work reliably, we had to train a custom AI agent on our component library. This meant writing detailed component documentation, building a synthetic dataset of user prompts and correct component outputs, and running multiple fine-tuning rounds. The design team worked directly with the ML team to evaluate outputs and identify failure modes — a new kind of design-ML collaboration that we're calling 'design-in-the-loop' training.",
    },
    {
      type: "image-full-right",
      image: "/manus-storage/___________cc0d6c36.webp",
      imageAlt: "AI Assistant Device — Spaces UI showing weather, health, fitness, calendar, stocks, and running event",
      sectionBg: "#000000",
    },
    {
      type: "closing",
      closingHeadline:
        "A device that adapts to you — not the other way around.",
      closingBody:
        "The AI Assistant Device represents a fundamental rethinking of what a wearable OS can be. By replacing the traditional app model with AI-generated Spaces and user-controlled theming, we created a device that feels genuinely personal from day one.",
      closingMedia: "/manus-storage/260520_coop_lookdev_hw_199_CC1_f435d000.webp",
      nextProject: {
        title: "Design Systems Tooling",
        slug: "ds-tooling",
      },
    },
  ],
};

export default function AISmartwatch() {
  return <CaseStudyPage data={data} />;
}
