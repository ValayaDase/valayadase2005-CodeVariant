"use client";

import Image from "next/image";
import { ArrowUpRight, Compass, ShieldCheck, Volume2, Sparkles, Heart } from "lucide-react";
import InteractiveWaveTitle from "@/components/footer/InteractiveWaveTitle";

export default function Section10ResolutionAndFooter() {
  return (
    <section id="resolution" className="relative w-full bg-[#263D31] text-[#F4F1E8] overflow-hidden">
      {/* 1. THE RESOLUTION BANNER */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-20 border-b border-[#819478]/25">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Narrative */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#819478]/20 border border-[#819478]/30 w-fit mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#E3EBDD]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#E3EBDD] font-semibold">
                Section 10 · The Resolution
              </span>
            </div>

            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6">
              Less searching. <br />
              <span className="italic text-[#E3EBDD]">More focusing.</span>
            </h2>

            <p className="text-base sm:text-lg text-[#F4F1E8]/75 max-w-xl font-normal leading-relaxed mb-10">
              When the uncertainty of noise, seating, and connectivity is removed, work ceases to be a battle against your environment. Find your quiet place, settle in, and create your best work.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#discovery"
                className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full bg-[#F4F1E8] text-[#263D31] text-xs font-mono uppercase tracking-widest font-bold hover:bg-[#E3EBDD] transition-all duration-300 shadow-xl group"
              >
                <span>Explore quiet places</span>
                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
              </a>

              <a
                href="#hero"
                className="inline-flex items-center space-x-2 px-7 py-4 rounded-full border border-[#819478]/50 text-[#F4F1E8] text-xs font-mono uppercase tracking-widest hover:border-[#F4F1E8] transition-all duration-300"
              >
                <span>Back to the beginning</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#819478]" />
              </a>
            </div>
          </div>

          {/* Right Photograph of Deep Focused Serenity */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-[#819478]/30 shadow-2xl">
              <Image
                src="/images/story/serene-resolution.jpg"
                alt="Architectural sunlit quiet workspace with oak tables and greenery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263D31]/40 via-transparent to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute bottom-5 left-5 right-5 glass-dark px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-mono text-[#F4F1E8]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#648568] animate-pulse" />
                  <span>State Achieved: Deep Cognitive Flow</span>
                </div>
                <span className="text-[#819478]">34 dB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. THE EDITORIAL WATER-WAVE FOOTER (USER'S EXACT REFERENCE INSPIRATION) */}
      <footer className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-14">
        {/* Massive Interactive Water Wave Canvas Title */}
        <div className="mb-14">
          <InteractiveWaveTitle />
        </div>

        {/* Editorial Links Columns (matching luxury architectural design) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-12 border-t border-[#819478]/25 text-sm">
          {/* Column 1: Exploration */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#819478] mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 font-editorial text-lg text-[#F4F1E8]">
              <li>
                <a href="#hero" className="hover:text-[#819478] transition-colors">
                  The Search
                </a>
              </li>
              <li>
                <a href="#friction" className="hover:text-[#819478] transition-colors">
                  The Friction
                </a>
              </li>
              <li>
                <a href="#turning-point" className="hover:text-[#819478] transition-colors">
                  The Turning Point
                </a>
              </li>
              <li>
                <a href="#discovery" className="hover:text-[#819478] transition-colors">
                  Discovery Map
                </a>
              </li>
              <li>
                <a href="#quiet-when" className="hover:text-[#819478] transition-colors">
                  Quiet When
                </a>
              </li>
              <li>
                <a href="#compare" className="hover:text-[#819478] transition-colors">
                  Compare & Choose
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Spotwise Telemetry */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#819478] mb-4">
              Telemetry Standards
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-[#F4F1E8]/80">
              <li className="hover:text-white transition-colors">
                ISO 3382-2 Reverberation Metric
              </li>
              <li className="hover:text-white transition-colors">
                Live Acoustic Decibel Arrays
              </li>
              <li className="hover:text-white transition-colors">
                Predictive Occupancy Forecasting
              </li>
              <li className="hover:text-white transition-colors">
                Fiber Latency Verification
              </li>
              <li className="hover:text-white transition-colors">
                Community Verification Protocol
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct Channels */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#819478] mb-4">
              Coordinates
            </p>
            <div className="space-y-3 text-xs font-mono text-[#F4F1E8]/80">
              <p>
                <span className="text-[#819478]">M.</span> hello@spotwise.place
              </p>
              <p>
                <span className="text-[#819478]">T.</span> +1 (212) 555-0198
              </p>
              <p className="pt-2 text-[11px] text-[#819478]">
                Sensory Nodes deployed across:
                <br />
                New York · London · Tokyo · Berlin
              </p>
            </div>
          </div>

          {/* Column 4: Operational System Status */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#819478] mb-4">
              System Network
            </p>
            <div className="glass-dark p-4 rounded-2xl border border-[#819478]/30 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#648568] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#648568]"></span>
                </span>
                <span className="text-xs font-mono font-bold text-[#E3EBDD]">
                  Nodes Operational
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#F4F1E8]/70">
                24 telemetry hubs transmitting live acoustic telemetry.
              </p>
              <div className="pt-2 border-t border-[#819478]/30 flex justify-between text-[10px] font-mono text-[#819478]">
                <span>Acoustic Avg: 41 dB</span>
                <span>Latency: 4ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Line */}
        <div className="pt-8 border-t border-[#819478]/25 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#819478] gap-4">
          <p>© 2026 SPOTWISE INC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-[#F4F1E8] transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#" className="hover:text-[#F4F1E8] transition-colors">
              TERMS OF USE
            </a>
            <a href="#" className="hover:text-[#F4F1E8] transition-colors">
              METHODOLOGY
            </a>
          </div>
          <p className="text-[11px] tracking-widest uppercase text-[#E3EBDD]/60">
            FROM CHAOS TO CLARITY
          </p>
        </div>
      </footer>
    </section>
  );
}
