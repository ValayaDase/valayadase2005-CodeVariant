"use client";

import { motion } from "framer-motion";
import { Compass, ChevronDown, Sparkles } from "lucide-react";

export default function IntroSection({ onScrollClick }) {
  return (
    <section
      aria-label="Welcome to Spotwise"
      className="relative w-full h-full min-h-screen flex flex-col justify-between items-center px-6 sm:px-8 lg:px-12 py-12 md:py-16 bg-[#F5F3EC] text-[#20231F] select-none"
    >
      {/* Top Brand Mark */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center gap-2.5 pt-4"
      >
        <div className="w-8 h-8 rounded-full bg-[#26382B] flex items-center justify-center text-[#F5F3EC] shadow-sm">
          <Compass className="w-4 h-4 text-[#F5F3EC]" strokeWidth={2.2} />
        </div>
        <div className="flex items-baseline">
          <span className="text-xl font-semibold tracking-tight text-[#20231F]">
            Spotwise
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#819477] ml-1 mb-0.5 inline-block" />
        </div>
      </motion.div>

      {/* Center Editorial Headline and Narrative */}
      <div className="max-w-3xl mx-auto text-center my-auto py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-[#E8E0D2] shadow-sm mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#819477]" />
          <span className="text-xs uppercase tracking-widest font-semibold text-[#555D50]">
            The Sensory Space Discovery Engine
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight text-[#20231F] leading-[1.12]"
        >
          Finding your place to focus shouldn&apos;t be hard.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
          className="mt-6 sm:mt-8 text-lg sm:text-xl text-[#555D50] leading-relaxed max-w-2xl mx-auto font-sans font-normal"
        >
          Escape the noisy cafe roulette, dead power outlets, and midday crowd
          scramble. We map quiet atmospheres, ergonomic seating, and verified
          connectivity so you can do your life&apos;s best work.
        </motion.p>
      </div>

      {/* Subtle Scroll to Discover Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
        className="pb-4"
      >
        <button
          type="button"
          onClick={onScrollClick}
          className="group flex flex-col items-center gap-2 text-[#555D50] hover:text-[#20231F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#819477] rounded-full p-2"
          aria-label="Scroll to discover the hero section"
        >
          <span className="text-xs uppercase tracking-widest font-semibold text-[#819477] group-hover:text-[#26382B] transition-colors">
            Scroll to discover
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-[#819477]/40 flex items-start justify-center p-1.5 group-hover:border-[#26382B] transition-colors">
            <motion.div
              animate={{
                y: [0, 14, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 rounded-full bg-[#819477] group-hover:bg-[#26382B]"
            />
          </div>
          <ChevronDown className="w-4 h-4 text-[#819477] group-hover:text-[#26382B] transition-transform duration-200 group-hover:translate-y-0.5" />
        </button>
      </motion.div>
    </section>
  );
}
