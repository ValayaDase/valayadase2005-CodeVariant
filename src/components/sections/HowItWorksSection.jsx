"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { howItWorksSteps } from "@/data/features";

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-label="How Spotwise Works"
      className="relative w-full py-24 sm:py-32 bg-[#F5F3EC] px-4 sm:px-6 lg:px-8 border-t border-[#E8E0D2]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-sm mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#819477]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#555D50]">
              The 3-Step Routine
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#20231F] leading-tight">
            From cognitive friction to instant flow in three simple steps.
          </h2>

          <p className="mt-5 text-lg text-[#555D50] leading-relaxed">
            Eliminate the cognitive load of choosing where to work. Let telemetry
            guide you directly to your ideal sensory habitat.
          </p>
        </div>

        {/* 3 Step Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 sm:mt-20 relative">
          {howItWorksSteps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative rounded-3xl bg-white border border-[#E8E0D2] p-8 flex flex-col justify-between shadow-[0_10px_30px_rgba(32,35,31,0.04)] hover:shadow-[0_16px_40px_rgba(32,35,31,0.08)] transition-all duration-300"
            >
              <div>
                {/* Step Pill */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-3xl font-serif font-bold text-[#819477]">
                    {item.step}
                  </span>
                  <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-[#F5F3EC] text-[#26382B] border border-[#E8E0D2]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#20231F] tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm text-[#555D50] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#E8E0D2]/60 flex items-center justify-between">
                <span className="text-xs font-medium text-[#819477] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Telemetry Verified</span>
                </span>
                <span className="text-xs text-[#555D50]">Step {index + 1} of 3</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 text-center">
          <a
            href="#final-cta"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#26382B] hover:text-[#819477] transition-colors"
          >
            <span>Ready to reclaim your focus hours?</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
