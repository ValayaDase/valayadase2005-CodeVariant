"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import IntroSection from "@/components/intro/IntroSection";
import SpotwiseHero from "@/components/hero/SpotwiseHero";
import Navbar from "@/components/layout/Navbar";

export default function LandingExperience() {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll progress within this 200vh sequence
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero overlaps intro: slides up from below viewport (100% -> 0%)
  const heroY = useTransform(
    scrollYProgress,
    [0.05, 0.75],
    shouldReduceMotion ? ["0%", "0%"] : ["100%", "0%"]
  );

  // Intro stays behind and gently softens
  const introOpacity = useTransform(
    scrollYProgress,
    [0, 0.5],
    shouldReduceMotion ? [1, 1] : [1, 0.15]
  );

  const introScale = useTransform(
    scrollYProgress,
    [0, 0.55],
    shouldReduceMotion ? [1, 1] : [1, 0.94]
  );

  // Navbar slides down from above after hero begins entry
  const navbarY = useTransform(
    scrollYProgress,
    [0.35, 0.7],
    shouldReduceMotion ? ["0%", "0%"] : ["-100%", "0%"]
  );

  const navbarOpacity = useTransform(
    scrollYProgress,
    [0.3, 0.55],
    shouldReduceMotion ? [1, 1] : [0, 1]
  );

  // Smooth programmatic scroll when user clicks "Scroll to discover"
  const handleScrollToHero = () => {
    if (typeof window !== "undefined") {
      const targetY = window.innerHeight * 1.15;
      window.scrollTo({
        top: targetY,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#F5F3EC]"
      id="landing-experience"
    >
      {/* Global Navbar fixed on screen, controlled by scroll progress */}
      <Navbar
        style={{
          y: navbarY,
          opacity: navbarOpacity,
        }}
      />

      {/* Sticky Viewport Housing the Overlap Transition */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        {/* Stage 1: Intro Screen (Behind, z-0) */}
        <motion.div
          style={{
            opacity: introOpacity,
            scale: introScale,
          }}
          className="absolute inset-0 w-full h-full z-0 flex items-center justify-center will-change-transform"
        >
          <IntroSection onScrollClick={handleScrollToHero} />
        </motion.div>

        {/* Stage 2: Spotwise Hero (Sliding up from below, z-10) */}
        <motion.div
          style={{
            y: heroY,
          }}
          className="absolute inset-0 w-full h-full z-10 overflow-y-auto bg-[#F5F3EC] shadow-[-10px_-15px_40px_rgba(32,35,31,0.06)] flex items-center will-change-transform"
        >
          <SpotwiseHero />
        </motion.div>
      </div>
    </div>
  );
}
