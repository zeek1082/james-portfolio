/*
 * DESIGN: "Signal in the Dark" — Home Page
 * Assembles: FixedBackground → Navigation → Hero → Marquee → Work → About → Contact
 * FixedBackground: Foudre-style fixed layer that morphs color as sections enter viewport.
 * Lenis smooth scroll. GSAP ScrollTrigger parallax + text reveals.
 */

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import WorkSection from "@/components/WorkSection";
import VideoBreakSection from "@/components/VideoBreakSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import FixedBackground from "@/components/FixedBackground";

const marqueeItems = [
  "Wearable Design System",
  "Ray-Ban Meta",
  "Spatial AR",
  "Meta AI Motion",
  "AI Identity",
  "Day 0 Experience",
  "Design Systems",
  "Wearable OS",
  "Spatial Computing",
  "Product Design",
];

export default function Home() {
  useSmoothScroll();

  return (
    <div
      style={{
        // No background here — FixedBackground handles it
        backgroundColor: "transparent",
        minHeight: "100vh",
        color: "#0E0C0A",
        cursor: "none",
        position: "relative",
      }}
    >
      {/* Fixed background layer — morphs color on scroll (Foudre-style) */}
      <FixedBackground />

      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <HeroSection />
      <VideoBreakSection />
      <WorkSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
