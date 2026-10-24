"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X, ArrowUpRight, Scale, Volume2, Wifi, Zap, Clock, ShieldCheck } from "lucide-react";
import { SPACES_DATA } from "@/data/spacesData";

export default function Section09CompareAndChoose() {
  const comparisonSpaces = SPACES_DATA.slice(0, 3);
  const [selectedCol, setSelectedCol] = useState(0);

  const criteria = [
    { label: "Focus Fit Score", key: "focusScore", format: (v) => `${v}% Match` },
    { label: "Measured Noise (dB)", key: "noiseLevel", format: (v) => `${v} dB · Ambient` },
    { label: "Peak Quiet Window", key: "hours", format: () => "08:00 – 14:00" },
    { label: "Solo Table Outlets", key: "outlets", format: (v) => v.split("(")[0] },
    { label: "Fiber Wi-Fi Latency", key: "wifiLatency", format: (v) => `< ${v}` },
    { label: "Occupancy Risk", key: "crowdLevel", format: (v) => `${v}% Max Expected` },
    { label: "Cost & Policy", key: "budget", format: (v) => `${v} · Walk-ins Welcome` },
  ];

  return (
    <section
      id="compare"
      className="relative w-full bg-[#FCFBF7] py-24 px-6 sm:px-8 lg:px-12 border-t border-[#E3E0D7]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E3EBDD] border border-[#819478]/30 w-fit mb-4">
            <Scale className="w-3.5 h-3.5 text-[#263D31]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#263D31] font-semibold">
              Section 09 · Multi-Space Decision Matrix
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#252B26] tracking-tight leading-[1.08] mb-4">
            Choose with <br />
            <span className="text-[#263D31] italic">absolute confidence.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6C7168] leading-relaxed">
            Eliminate morning uncertainty. Compare sensory attributes side-by-side and select the environment calibrated to your day.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto pb-6">
          <div className="min-w-[720px] bg-[#F4F1E8] rounded-3xl p-6 sm:p-8 border border-[#E3E0D7] shadow-lg">
            {/* Table Header: Venues */}
            <div className="grid grid-cols-4 gap-4 pb-6 border-b border-[#E3E0D7] items-end">
              <div className="col-span-1">
                <p className="text-xs font-mono uppercase tracking-wider text-[#6C7168]">
                  Telemetry Variable
                </p>
                <p className="font-editorial text-xl text-[#252B26] mt-1">
                  Space Profiles
                </p>
              </div>

              {comparisonSpaces.map((space, idx) => (
                <div
                  key={space.id}
                  onClick={() => setSelectedCol(idx)}
                  className={`p-4 rounded-2xl transition-all cursor-pointer ${
                    selectedCol === idx
                      ? "bg-[#FCFBF7] border-2 border-[#263D31] shadow-md"
                      : "hover:bg-[#E3EBDD]/60"
                  }`}
                >
                  <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 border border-[#E3E0D7]">
                    <Image
                      src={space.image}
                      alt={space.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#819478] font-bold">
                    {space.category.split("&")[0]}
                  </span>
                  <h3 className="font-editorial text-lg text-[#252B26] font-bold truncate">
                    {space.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-[#263D31] text-white text-[11px] font-mono font-bold">
                      {space.focusScore}% Match
                    </span>
                    <span className="text-xs font-mono font-semibold text-[#648568]">
                      {space.noiseLevel} dB
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Criteria Rows */}
            <div className="divide-y divide-[#E3E0D7]/70">
              {criteria.map((c) => (
                <div key={c.label} className="grid grid-cols-4 gap-4 py-4 items-center">
                  <div className="col-span-1 font-mono text-xs text-[#6C7168] font-medium">
                    {c.label}
                  </div>
                  {comparisonSpaces.map((space, idx) => {
                    const val = space[c.key];
                    const formatted = c.format ? c.format(val) : val;
                    const isSelected = selectedCol === idx;

                    return (
                      <div
                        key={space.id}
                        className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors ${
                          isSelected
                            ? "bg-[#FCFBF7] text-[#263D31] font-bold"
                            : "text-[#252B26]"
                        }`}
                      >
                        {formatted}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-[#E3E0D7] items-center">
              <div className="col-span-1 text-xs font-mono text-[#6C7168]">
                Ready to focus?
              </div>
              {comparisonSpaces.map((space, idx) => (
                <div key={space.id}>
                  <a
                    href="#discovery"
                    className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-mono uppercase tracking-wider hover:bg-[#819478] hover:text-[#252B26] transition-all shadow-sm"
                  >
                    <span>Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
