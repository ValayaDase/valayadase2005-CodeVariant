"use client";

import Navbar from "@/components/layout/Navbar";
import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";
import Section01Hero from "@/components/sections/Section01Hero";
import Section02Friction from "@/components/sections/Section02Friction";
import Section03TurningPoint from "@/components/sections/Section03TurningPoint";
import Section04And05Discovery from "@/components/sections/Section04And05Discovery";
import Section06QuietWhen from "@/components/sections/Section06QuietWhen";
import Section07FocusFitScore from "@/components/sections/Section07FocusFitScore";
import Section08CommunityIntelligence from "@/components/sections/Section08CommunityIntelligence";
import Section09CompareAndChoose from "@/components/sections/Section09CompareAndChoose";
import Section10ResolutionAndFooter from "@/components/sections/Section10ResolutionAndFooter";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <main className="w-full min-h-screen bg-[#F4F1E8] text-[#252B26] overflow-x-hidden selection:bg-[#263D31] selection:text-[#F4F1E8]">
        {/* Fixed Editorial Navigation Header */}
        <Navbar />

        {/* Section 01 — The Opening: "The Search" */}
        <Section01Hero />

        {/* Section 02 — The Friction: "The Wrong Place" (Pinned 3-chapter GSAP timeline) */}
        <Section02Friction />

        {/* Section 03 — The Turning Point: "What If?" (Chaos to clarity spatial shift) */}
        <Section03TurningPoint />

        {/* Sections 04 & 05 — The Reveal: "Meet Spotwise" & Discovery Workspace (Leaflet map + Filter sidebar) */}
        <Section04And05Discovery />

        {/* Section 06 — Quiet When (Temporal 24-hr predictive acoustic timeline) */}
        <Section06QuietWhen />

        {/* Section 07 — Focus Fit Score (Algorithmic compatibility engine) */}
        <Section07FocusFitScore />

        {/* Section 08 — Community Intelligence (Live ground truth & report modal) */}
        <Section08CommunityIntelligence />

        {/* Section 09 — Compare and Choose (Multi-space decision matrix) */}
        <Section09CompareAndChoose />

        {/* Section 10 — The Resolution & Interactive Fluid Wave Footer */}
        <Section10ResolutionAndFooter />
      </main>
    </SmoothScrollProvider>
  );
}
