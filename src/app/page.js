import LandingExperience from "@/components/transitions/LandingExperience";
import ProblemSection from "@/components/sections/ProblemSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import FinalCTASection from "@/components/sections/FinalCTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#F5F3EC] text-[#20231F] overflow-x-hidden selection:bg-[#819477] selection:text-white">
      {/* 
        Scroll Experience Container:
        1. Simple elegant Intro screen
        2. Hero slides up and overlaps intro as user scrolls
        3. Navbar slides down from above into fixed header
      */}
      <LandingExperience />

      {/* The Problem Section */}
      <ProblemSection />

      {/* 4 Core Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Final Call to Action */}
      <FinalCTASection />

      {/* Site Footer */}
      <Footer />
    </main>
  );
}
