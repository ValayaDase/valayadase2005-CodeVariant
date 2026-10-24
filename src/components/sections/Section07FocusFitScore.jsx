"use client";

import { useState } from "react";
import Image from "next/image";
import { Award, CheckCircle, ShieldCheck, ArrowRight, Zap, Wifi, Volume2, Users, Eye } from "lucide-react";
import { SPACES_DATA } from "@/data/spacesData";

export default function Section07FocusFitScore() {
  const [activeSpaceId, setActiveSpaceId] = useState("solitude-atelier");
  const activeSpace =
    SPACES_DATA.find((s) => s.id === activeSpaceId) || SPACES_DATA[0];

  const candidateSpaces = SPACES_DATA.slice(0, 3);

  return (
    <section
      id="focus-fit"
      className="relative w-full bg-[#FCFBF7] py-24 px-6 sm:px-8 lg:px-12 border-t border-[#E3E0D7]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E3EBDD] border border-[#819478]/30 w-fit mb-4">
            <Award className="w-3.5 h-3.5 text-[#263D31]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#263D31] font-semibold">
              Section 07 · The Focus Fit Engine
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#252B26] tracking-tight leading-[1.08] mb-4">
            Not just the closest place. <br />
            <span className="text-[#263D31] italic">The right fit for you.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6C7168] leading-relaxed">
            Geographic proximity is meaningless if the acoustics break your flow. Spotwise computes a multi-parametric suitability index weighted across five physiological variables.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {candidateSpaces.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSpaceId(s.id)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono transition-all flex items-center space-x-2.5 ${
                activeSpaceId === s.id
                  ? "bg-[#263D31] text-[#F4F1E8] shadow-md font-bold"
                  : "glass-ivory text-[#252B26] hover:bg-[#E3EBDD]"
              }`}
            >
              <span>{s.name}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px]">
                {s.focusScore}%
              </span>
            </button>
          ))}
        </div>

        {/* Main Score Breakdown Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Visual Card & Big Score Radial */}
          <div className="lg:col-span-5 glass-ivory rounded-3xl p-8 border border-[#E3E0D7] flex flex-col justify-between shadow-xl">
            <div>
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-[#E3E0D7]">
                <Image
                  src={activeSpace.image}
                  alt={activeSpace.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 glass-ivory px-3 py-1 rounded-full text-xs font-mono font-bold text-[#263D31]">
                  {activeSpace.noiseLevel} dB Measured
                </div>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs font-mono uppercase text-[#819478] tracking-widest">
                  Computed Compatibility
                </span>
                <span className="text-xs font-mono text-[#648568] flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Telemetry Verified</span>
                </span>
              </div>

              <div className="flex items-center space-x-6 my-4">
                <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-[#E3EBDD] border-4 border-[#648568] shadow-inner">
                  <span className="font-editorial text-4xl font-bold text-[#263D31]">
                    {activeSpace.focusScore}%
                  </span>
                </div>
                <div>
                  <h3 className="font-editorial text-2xl text-[#252B26]">
                    {activeSpace.name}
                  </h3>
                  <p className="text-xs text-[#6C7168] mt-1">{activeSpace.category}</p>
                  <p className="text-xs font-mono text-[#819478] mt-1">
                    {activeSpace.hours} · {activeSpace.budget}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E3E0D7] mt-6">
              <p className="text-xs text-[#6C7168] leading-relaxed font-mono">
                {activeSpace.rationale}
              </p>
            </div>
          </div>

          {/* Right Column: Quantitative Telemetry Breakdown Bars */}
          <div className="lg:col-span-7 card-ivory rounded-3xl p-8 sm:p-10 border border-[#E3E0D7] flex flex-col justify-between shadow-xl">
            <div>
              <h4 className="font-editorial text-2xl sm:text-3xl text-[#252B26] mb-2">
                Five-Vector Focus Weighting
              </h4>
              <p className="text-xs text-[#6C7168] font-mono uppercase tracking-wider mb-8">
                Breakdown of telemetry points calibrated for prolonged concentration
              </p>

              {/* Vector Bars */}
              <div className="space-y-6">
                {/* 1. Acoustic Attenuation */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="flex items-center space-x-2 text-[#252B26] font-semibold">
                      <Volume2 className="w-4 h-4 text-[#648568]" />
                      <span>Acoustic Attenuation (&lt;40 dB Reverberation)</span>
                    </span>
                    <span className="font-bold text-[#263D31]">
                      {activeSpace.factors.acoustics}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E3EBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#263D31] rounded-full transition-all duration-700"
                      style={{ width: `${activeSpace.factors.acoustics}%` }}
                    />
                  </div>
                </div>

                {/* 2. Seating Predictability */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="flex items-center space-x-2 text-[#252B26] font-semibold">
                      <Users className="w-4 h-4 text-[#819478]" />
                      <span>Seating Predictability & Solo Table Availability</span>
                    </span>
                    <span className="font-bold text-[#263D31]">
                      {activeSpace.factors.seating}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E3EBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#648568] rounded-full transition-all duration-700"
                      style={{ width: `${activeSpace.factors.seating}%` }}
                    />
                  </div>
                </div>

                {/* 3. Fiber Line Consistency */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="flex items-center space-x-2 text-[#252B26] font-semibold">
                      <Wifi className="w-4 h-4 text-[#819478]" />
                      <span>Wi-Fi Throughput & Low Packet Latency</span>
                    </span>
                    <span className="font-bold text-[#263D31]">
                      {activeSpace.factors.connectivity}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E3EBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#263D31] rounded-full transition-all duration-700"
                      style={{ width: `${activeSpace.factors.connectivity}%` }}
                    />
                  </div>
                </div>

                {/* 4. Ergonomics & Outlets */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="flex items-center space-x-2 text-[#252B26] font-semibold">
                      <Zap className="w-4 h-4 text-[#C58C5A]" />
                      <span>Power Outlet Density & Desk Ergonomics</span>
                    </span>
                    <span className="font-bold text-[#263D31]">
                      {activeSpace.factors.ergonomics}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E3EBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#819478] rounded-full transition-all duration-700"
                      style={{ width: `${activeSpace.factors.ergonomics}%` }}
                    />
                  </div>
                </div>

                {/* 5. Natural Lumens */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono mb-2">
                    <span className="flex items-center space-x-2 text-[#252B26] font-semibold">
                      <Eye className="w-4 h-4 text-[#819478]" />
                      <span>Natural Circadian Lumens (Window Aperture)</span>
                    </span>
                    <span className="font-bold text-[#263D31]">
                      {activeSpace.factors.naturalLight}/100
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#E3EBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#648568] rounded-full transition-all duration-700"
                      style={{ width: `${activeSpace.factors.naturalLight}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E3E0D7] flex items-center justify-between">
              <span className="text-xs font-mono text-[#6C7168]">
                Scores recalibrated hourly from acoustic telemetry
              </span>
              <a
                href="#compare"
                className="inline-flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#263D31] font-bold hover:text-[#819478]"
              >
                <span>Compare against other spots</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
