"use client";

import SmoothScrollProvider from "@/components/common/SmoothScrollProvider";
import Section01Hero from "@/components/sections/Section01Hero";
import Section02Problem from "@/components/sections/Section02Problem";
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
      <main className="w-full min-h-screen bg-[#F4F1E8] text-[#252B26] overflow-x-clip selection:bg-[#263D31] selection:text-[#F4F1E8]">
        {/* Hero & Problem Transition Wrapper: Hero sticks ONLY while Section 02 slides over it */}
        <div id="hero-problem-wrapper" className="relative w-full">
          {/* Section 01 — Hero: Show the Problem Immediately */}
          <Section01Hero />

          {/* Section 02 — The Problem: Pinned Bottom-to-Top Reveal (4 Core Frictions) */}
          <Section02Problem />
        </div>

        {/* Section 03 — The Turning Point: What if you knew before you arrived? */}
        <Section03TurningPoint />

        {/* Sections 04 & 05 — Cinematic Map Reveal & Discovery Map with Fixed Left Sidebar */}
        <Section04And05Discovery />

        {/* Section 06 — Quiet When: Time-Based Discovery */}
        <Section06QuietWhen />

        {/* Section 07 — Focus Fit: Not Just Nearby, Right For You */}
        <Section07FocusFitScore />

        {/* Section 08 — Community Intelligence: Better Information Powered by People */}
        <Section08CommunityIntelligence />

        {/* Section 09 — Compare and Choose: Choose with Confidence */}
        <Section09CompareAndChoose />

        {/* Sections 10 & 11 — The Resolution & Premium Lenval-Inspired Interactive Wordmark Footer */}
        <Section10ResolutionAndFooter />
      </main>
    </SmoothScrollProvider>
  );
}
