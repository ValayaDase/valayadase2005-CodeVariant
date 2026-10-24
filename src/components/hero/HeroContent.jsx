"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, VolumeX, Wifi, Zap } from "lucide-react";

export default function HeroContent() {
  const quickPills = [
    { icon: VolumeX, label: "Under 35 dB" },
    { icon: Zap, label: "Power at every desk" },
    { icon: Wifi, label: "Fiber 200+ Mbps" },
  ];

  return (
    <div className="flex flex-col justify-center text-left max-w-xl">
      {/* Category Pill */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-sm w-fit mb-6"
      >
        <span className="w-2 h-2 rounded-full bg-[#819477]" />
        <span className="text-xs uppercase tracking-widest font-semibold text-[#555D50]">
          Acoustic & Sensory Intelligence
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight text-[#20231F] leading-[1.12]"
      >
        Choose your spot wisely.
      </motion.h1>

      {/* Supporting Text */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-6 text-lg text-[#555D50] leading-relaxed font-sans"
      >
        Discover productive places tailored to your sensory profile. Filter by
        real-time noise levels, predicted crowd density, verified power
        availability, and ergonomic atmosphere before leaving your door.
      </motion.p>

      {/* Quick Sensory Filter Pills */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-2.5 mt-6"
      >
        {quickPills.map((pill) => {
          const Icon = pill.icon;
          return (
            <span
              key={pill.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-[#E8E0D2] text-xs font-medium text-[#20231F]"
            >
              <Icon className="w-3.5 h-3.5 text-[#819477]" />
              <span>{pill.label}</span>
            </span>
          );
        })}
      </motion.div>

      {/* Primary & Secondary Call To Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5"
      >
        <a
          href="#features"
          className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-base font-medium transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#819477]"
        >
          <span>Discover your spot</span>
          <ArrowRight className="w-4 h-4" />
        </a>

        <a
          href="#how-it-works"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#FAF8F3] text-[#20231F] border border-[#E8E0D2] text-base font-medium transition-all duration-200 hover:border-[#819477] focus:outline-none focus:ring-2 focus:ring-[#819477]"
        >
          <Play className="w-3.5 h-3.5 text-[#819477] fill-[#819477]" />
          <span>Explore how it works</span>
        </a>
      </motion.div>

      {/* Social Trust Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="mt-10 pt-6 border-t border-[#E8E0D2] grid grid-cols-3 gap-4"
      >
        <div>
          <p className="text-xl sm:text-2xl font-serif font-bold text-[#26382B]">
            340+
          </p>
          <p className="text-xs text-[#555D50] mt-0.5">Sensory-mapped venues</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-serif font-bold text-[#26382B]">
            &lt;35 dB
          </p>
          <p className="text-xs text-[#555D50] mt-0.5">Quiet zone benchmark</p>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-serif font-bold text-[#26382B]">
            99.2%
          </p>
          <p className="text-xs text-[#555D50] mt-0.5">Plug certainty score</p>
        </div>
      </motion.div>
    </div>
  );
}
