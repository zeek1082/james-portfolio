import CaseStudyPage, { CaseStudyData } from "../../components/CaseStudyPage";

const data: CaseStudyData = {
  slug: "wearables-color-system",
  title: "Wearables Color System",
  category: "Design Systems",
  year: "2025",
  role: "Design Lead",
  accentColor: "#7C5C3A",
  sections: [
    {
      type: "video-hero",
      heroImage: "/manus-storage/color-system-hero-v3_b3bfdcdd.webp",
      heroTitle: "Wearables Color System",
      heroCategory: "Design Systems",
      heroYear: "2025",
      heroRole: "Design Lead",
    },
    {
      type: "overview",
      overviewHeadline:
        "One color language. Multiple token mappings. Infinite third-party themes.",
      overviewBody:
        "Meta's wearables family spans smartwatches, phones, and AR display glasses — three fundamentally different display technologies, each with its own color gamut, brightness ceiling, and viewing conditions. We were tasked with building a single color system that could be themed per device, per ambient condition, and per third-party partner — including Spotify, Apple Music, and other app developers building on the platform.",
      overviewTags: [
        "Color Systems",
        "Token Architecture",
        "Cross-Device",
        "Third-Party Theming",
        "Wearable OS",
      ],
    },
    {
      type: "gif-pair",
      gifLeft: "/manus-storage/color-system-anim-1_858a034a.webp",
      gifRight: "/manus-storage/color-system-anim-2_33fdf20a.webp",
      gifLeftAlt: "Wearables Color System — Spotify Escape Hatch theme",
      gifRightAlt: "Wearables Color System — Spotify Palco theme",
    },
    {
      type: "text-block",
      headline: "Three Displays, Three Realities",
      body: "A color that reads as a warm amber on an OLED smartwatch can look washed-out on an LCD phone and completely disappear on a waveguide AR display. We started by profiling each display surface — measuring gamut, white point, maximum brightness, and the perceptual effect of ambient light — and used this data to define a set of 'safe zones' for each surface. These safe zones became the constraints that the token system was built around.",
    },
    {
      type: "scroll-gallery",
      galleryHeadline: "Color Explorations — Every Product Covered",
      galleryImages: [
        { src: "/manus-storage/94841901_89c4741e.webp", alt: "Wearables Color System — token overview" },
        { src: "/manus-storage/94841904_0b037e61.webp", alt: "Wearables Color System — primitive tokens" },
        { src: "/manus-storage/94841905_125081aa.webp", alt: "Wearables Color System — semantic tokens" },
        { src: "/manus-storage/94841906_d5562408.webp", alt: "Wearables Color System — component tokens" },
        { src: "/manus-storage/94841910_769b57be.webp", alt: "Wearables Color System — day mode" },
        { src: "/manus-storage/94841911_a8718721.webp", alt: "Wearables Color System — night mode" },
        { src: "/manus-storage/94841918_4c914b82.webp", alt: "Wearables Color System — high-glare mode" },
        { src: "/manus-storage/94841919_9e02f25b.webp", alt: "Wearables Color System — partner theming" },
        { src: "/manus-storage/94841921_0dcaf775.webp", alt: "Wearables Color System — Spotify theme" },
        { src: "/manus-storage/94841932_ba457733.webp", alt: "Wearables Color System — SDK preview" },
        { src: "/manus-storage/App_Tile_After_e8d8984f.webp", alt: "Wearables Color System — app tile" },
        { src: "/manus-storage/94841873_872c1e90.webp", alt: "Wearables Color System — display surface" },
      ],
    },
    {
      type: "text-block",
      headline: "An Open System for Partners",
      body: "One of the most complex requirements was enabling third-party apps like Spotify and Apple Music to bring their own brand colors into the OS without breaking the system's accessibility or optical safety guarantees. We built a theming SDK that allowed partners to supply a set of brand primitives, which the system would then map to semantic tokens — automatically adjusting for contrast, brightness, and display surface.",
    },
    {
      type: "image-full",
      image: "/manus-storage/94841872_cf72a9b7.webp",
      imageAlt: "Early Color Principles — Color Should Have Purpose, Be Consistent, Be Predictable",
    },
    {
      type: "closing",
      closingHeadline:
        "A color system that scales from a watch face to an AR display — and opens up to the world.",
      closingBody:
        "The Wearables Color System shipped as the foundation for all Meta wearable products in 2025. The third-party theming SDK is available to all developers building on the Meta wearables platform.",
      // TODO: swap with Wearables closing media
      closingMedia: "/manus-storage/color-system-tokens-new_611a9c96.webp",
      nextProject: {
        title: "EMG Handwriting",
        slug: "emg-handwriting",
      },
    },
  ],
};

export default function WearablesColorSystem() {
  return <CaseStudyPage data={data} />;
}
