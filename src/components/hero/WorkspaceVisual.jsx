"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import DiscoveryCard from "./DiscoveryCard";

export default function WorkspaceVisual() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Decorative backdrop accents */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#E8E0D2]/50 via-transparent to-[#819477]/15 rounded-3xl -z-10 blur-xl transform -rotate-1 pointer-events-none" />

      {/* Main Editorial Workspace Photograph Container */}
      <div className="relative rounded-3xl overflow-hidden bg-[#E8E0D2] border border-[#E8E0D2] shadow-[0_20px_50px_rgba(32,35,31,0.09)] aspect-[4/3] sm:aspect-[14/11] lg:aspect-[4/3]">
        {!imgError ? (
          <Image
            src="/images/hero/workspace.jpg"
            alt="Quiet modern atelier workspace with natural sunlight, oak tables, and calm productivity"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Graceful aesthetic fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#E8E0D2] text-[#20231F]">
            <Sparkles className="w-12 h-12 text-[#819477] mb-3" />
            <p className="font-serif text-lg font-medium text-center">
              Curated Scandinavian Work Atelier
            </p>
            <p className="text-xs text-[#555D50] mt-1 text-center">
              Sensory-calibrated workspace visual
            </p>
          </div>
        )}

        {/* Top Floating Badge on Image */}
        <div className="absolute top-4 left-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E0D2] text-xs font-medium text-[#20231F] shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-[#819477]" />
            <span>Botanical Atelier & Cowork</span>
          </div>
        </div>

        {/* Ambient Overlay gradient for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20231F]/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Layered Floating Discovery Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-6 lg:-mt-24 lg:ml-8 lg:mr-4 relative z-20"
      >
        <DiscoveryCard />
      </motion.div>
    </div>
  );
}
