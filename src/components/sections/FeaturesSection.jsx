"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Clock,
  Users2,
  Cpu,
  CheckCircle,
  ArrowRight,
  Sliders,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { coreFeatures } from "@/data/features";

export default function FeaturesSection() {
  const [activeFeatureId, setActiveFeatureId] = useState(coreFeatures[0].id);

  const activeFeature =
    coreFeatures.find((f) => f.id === activeFeatureId) || coreFeatures[0];

  const iconMap = {
    "space-discovery": Compass,
    "quiet-when": Clock,
    "community-intelligence": Users2,
    "suitability-engine": Cpu,
  };

  return (
    <section
      id="features"
      aria-label="Core Spotwise Features"
      className="relative w-full py-24 sm:py-32 bg-[#F5F3EC] px-4 sm:px-6 lg:px-8 border-t border-[#E8E0D2]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-sm mb-6">
            <Sliders className="w-3.5 h-3.5 text-[#819477]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#555D50]">
              The Core Engine
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#20231F] leading-tight">
            Designed for the sensory-sensitive, built for peak output.
          </h2>

          <p className="mt-5 text-lg text-[#555D50] leading-relaxed">
            Spotwise replaces vague Google Maps star ratings with calibrated
            acoustic data, live desk density, and task-matched recommendations.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {coreFeatures.map((feature) => {
            const Icon = iconMap[feature.id] || Compass;
            const isActive = feature.id === activeFeatureId;

            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeatureId(feature.id)}
                type="button"
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-[#819477] ${
                  isActive
                    ? "bg-[#26382B] text-[#F5F3EC] border-[#26382B] shadow-sm"
                    : "bg-white text-[#20231F] border-[#E8E0D2] hover:bg-[#FAF8F3] hover:border-[#819477]"
                }`}
                aria-selected={isActive}
                role="tab"
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#819477]" : "text-[#819477]"
                  }`}
                />
                <span>{feature.title}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Deep-Dive Card */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl bg-white border border-[#E8E0D2] p-8 sm:p-12 shadow-[0_16px_50px_rgba(32,35,31,0.06)] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* Left Column: Narrative & Metrics */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#819477] mb-2">
                  <Activity className="w-3.5 h-3.5" />
                  <span>{activeFeature.tagline}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#20231F] tracking-tight">
                  {activeFeature.title}
                </h3>

                <p className="mt-4 text-base sm:text-lg text-[#555D50] leading-relaxed">
                  {activeFeature.description}
                </p>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#E8E0D2]">
                  {activeFeature.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[#F5F3EC]/80 border border-[#E8E0D2]/60"
                    >
                      <p className="text-xs text-[#555D50] font-medium">
                        {metric.label}
                      </p>
                      <p className="text-base sm:text-lg font-serif font-bold text-[#26382B] mt-1">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#26382B] hover:text-[#819477] transition-colors"
                  >
                    <span>See workflow details</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: Telemetry Simulation Graphic */}
              <div className="lg:col-span-5 bg-[#F5F3EC] rounded-2xl p-6 sm:p-8 border border-[#E8E0D2] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#555D50]">
                    Telemetry Engine Output
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#819477] font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Calibrated</span>
                  </span>
                </div>

                <div className="my-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#20231F] mb-1.5">
                      <span>Ambient Noise Threshold</span>
                      <span className="text-[#819477] font-semibold">28 dB (Whisper)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white border border-[#E8E0D2] overflow-hidden">
                      <div className="h-full bg-[#819477] rounded-full w-[28%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#20231F] mb-1.5">
                      <span>Seating Occupancy</span>
                      <span className="text-[#819477] font-semibold">18% (Desks Open)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white border border-[#E8E0D2] overflow-hidden">
                      <div className="h-full bg-[#26382B] rounded-full w-[18%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-[#20231F] mb-1.5">
                      <span>Ergonomic Lumbar Score</span>
                      <span className="text-[#819477] font-semibold">9.4 / 10</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white border border-[#E8E0D2] overflow-hidden">
                      <div className="h-full bg-[#819477] rounded-full w-[94%]" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8E0D2] text-xs text-[#555D50] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#819477] shrink-0" />
                  <span>{activeFeature.highlight}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
