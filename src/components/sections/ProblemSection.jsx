"use client";

import { motion } from "framer-motion";
import { VolumeX, BatteryWarning, Users, ArrowDown, AlertCircle } from "lucide-react";
import { problemStatements } from "@/data/features";

export default function ProblemSection() {
  const iconMap = {
    "decibel-roulette": VolumeX,
    "phantom-outlets": BatteryWarning,
    "peak-squeeze": Users,
  };

  return (
    <section
      id="problem"
      aria-label="The Problem Statement"
      className="relative w-full py-24 sm:py-32 bg-[#F5F3EC] px-4 sm:px-6 lg:px-8 border-t border-[#E8E0D2]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-sm mb-6">
            <AlertCircle className="w-3.5 h-3.5 text-[#819477]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#555D50]">
              The Remote Dilemma
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#20231F] leading-tight">
            The modern nomad&apos;s daily gamble: why finding focus is broken.
          </h2>

          <p className="mt-5 text-lg text-[#555D50] leading-relaxed">
            Working remotely shouldn&apos;t mean spending your morning scouting
            three different cafes, straining over blenders, or fighting for the
            single functioning power socket.
          </p>
        </div>

        {/* 3 Core Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-18">
          {problemStatements.map((item, index) => {
            const Icon = iconMap[item.id] || AlertCircle;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="rounded-3xl bg-white border border-[#E8E0D2] p-7 sm:p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(32,35,31,0.04)] hover:shadow-[0_16px_40px_rgba(32,35,31,0.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#F5F3EC] border border-[#E8E0D2] flex items-center justify-center text-[#26382B]">
                      <Icon className="w-6 h-6 text-[#26382B]" strokeWidth={2} />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F5F3EC] text-[#819477] border border-[#E8E0D2]">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#20231F] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-[#819477] mt-1">
                    {item.subtitle}
                  </p>

                  <p className="text-sm text-[#555D50] mt-4 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-[#E8E0D2]/70">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#26382B]">
                      {item.stat}
                    </span>
                  </div>
                  <p className="text-xs text-[#555D50] mt-1">{item.statNote}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Transition statement to solutions */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[#555D50]">
            <span>Enter Spotwise: Verified telemetry replaces guesswork</span>
            <ArrowDown className="w-4 h-4 text-[#819477]" />
          </div>
        </div>
      </div>
    </section>
  );
}
