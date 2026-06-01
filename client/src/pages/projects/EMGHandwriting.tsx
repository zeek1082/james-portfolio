import CaseStudyPage, { CaseStudyData } from "../../components/CaseStudyPage";

const data: CaseStudyData = {
  slug: "emg-handwriting",
  title: "EMG Handwriting",
  category: "Neural Input",
  year: "2026",
  role: "Design Lead",
  accentColor: "#3A5C7C",
  sections: [
    {
      type: "video-hero",
      // TODO: swap with EMG hero video
      videoSrc: "/manus-storage/emg_66e3f127.mov",
      heroTitle: "EMG Handwriting",
      heroCategory: "Neural Input",
      heroYear: "2026",
      heroRole: "Design Lead",
    },
    {
      type: "overview",
      overviewHeadline:
        "The first text input that lives in your muscles, not your fingers.",
      overviewBody:
        "The Meta Neural Band tracks the electromyographic signals of your forearm muscles — the same signals your brain sends when you move your hand — and translates them into gestures and text input without requiring you to touch anything. EMG Handwriting is the first-of-its-kind experience that lets you write messages by moving your fingers through the air, as if holding an invisible pen. I led the design team responsible for the components, patterns, and interactions that powered this feature — working in close partnership with UXR and the Inputs engineering team across many iterations shaped by dogfooding feedback from our early pilot program.",
      overviewTags: [
        "Neural Input",
        "EMG",
        "Gesture Design",
        "UXR",
        "Wearable OS",
        "Pilot Testing",
      ],
    },
    {
      type: "image-full",
      image: "/manus-storage/acrossthesystem-v2_edbcec87.webp",
      imageAlt: "EMG Handwriting — Messaging, Contact Search, and Notifications across the system",
    },
    {
      type: "text-block",
      headline: "Designing Without a Screen",
      body: "Most input design starts with a surface — a keyboard, a touchscreen, a trackpad. EMG Handwriting had none of these. The input surface was invisible: the space in front of the user's body, sensed through muscle signals rather than touch. This required us to rethink every assumption about feedback, discoverability, and error recovery.",
    },
    {
      type: "gif-pair",
      gifLeft: "/manus-storage/emg-gif-1_5216af5b.mp4",
      gifRight: "/manus-storage/emg-gif-2_c162db15.mp4",
      gifLeftAlt: "EMG Handwriting — gesture input in action",
      gifRightAlt: "EMG Handwriting — character recognition feedback",
    },
    {
      type: "text-block",
      headline: "A Team Built for Uncharted Territory",
      body: "My team owned the full design layer of EMG Handwriting — every component, pattern, and interaction that a user would encounter. We didn't work in isolation: the process was deeply collaborative, with UXR embedded from day one and the Inputs engineering team as a constant partner. What made this project different was the feedback loop. Through Meta's internal dogfooding pilot, we had real users wearing the Neural Band daily and reporting back. Each pilot round surfaced new edge cases — ambiguous gestures, fatigue patterns, confidence thresholds — and we iterated rapidly in response. By the time we shipped, the design had gone through many rounds of evidence-based refinement.",
    },

    {
      type: "image-full-right",
      image: "/manus-storage/ga-beta-v25_8273812a.webp",
      imageAlt: "EMG Handwriting — Messaging and Search Contacts entry points",
    },
    {
      type: "text-block",
      headline: "Making the Invisible Visible",
      body: "The biggest design challenge was feedback. When you press a key on a keyboard, you feel it, hear it, and see the character appear. With EMG handwriting, the only feedback channel we had was the display. We designed a real-time character preview system that showed users what the model was reading as they wrote, with a confidence indicator that helped them understand when to slow down or repeat a stroke. This single feature reduced error rates by 34% in user testing.",
    },
    {
      type: "closing",
      closingHeadline:
        "Shipped to users in spring 2026. The first text input that utilizes precise muscle movements",
      closingBody:
        "EMG Handwriting launched as part of the Meta Neural Band release in spring 2026. It is the first consumer product to offer EMG-based text input, and it represents a new paradigm for how we interact with wearable devices.",
      closingMedia: "/manus-storage/emg_f3fed8a6.mov",
      nextProject: {
        title: "AI-Powered Smartwatch",
        slug: "ai-smartwatch",
      },
    },
  ],
};

export default function EMGHandwriting() {
  return <CaseStudyPage data={data} />;
}
