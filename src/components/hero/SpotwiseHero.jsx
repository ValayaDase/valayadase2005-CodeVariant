"use client";

import HeroContent from "./HeroContent";
import WorkspaceVisual from "./WorkspaceVisual";

export default function SpotwiseHero() {
  return (
    <section
      id="hero-section"
      aria-label="Spotwise Main Hero"
      className="w-full min-h-screen flex items-center justify-center bg-[#F5F3EC] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Hero Editorial Copy & CTAs */}
          <div className="lg:col-span-6 xl:col-span-6">
            <HeroContent />
          </div>

          {/* Right Column: High-Res Workspace Photography + Floating Discovery Card */}
          <div className="lg:col-span-6 xl:col-span-6">
            <WorkspaceVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
