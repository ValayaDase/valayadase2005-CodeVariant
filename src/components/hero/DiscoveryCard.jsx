"use client";

import { motion } from "framer-motion";
import {
  Volume2,
  Users,
  Wifi,
  Zap,
  SunMedium,
  CheckCircle2,
  Info,
} from "lucide-react";
import { sampleVenue } from "@/data/features";

export default function DiscoveryCard({ className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E0D2] shadow-[0_16px_40px_rgba(32,35,31,0.08)] p-5 sm:p-6 text-[#20231F] ${className}`}
      id="discovery-card"
    >
      {/* Card Header & Simulated Status */}
      <div className="flex items-start justify-between gap-3 border-b border-[#E8E0D2] pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#819477] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#819477]"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#819477]">
              Live Telemetry Stream
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-[#20231F] mt-1 tracking-tight">
            {sampleVenue.name}
          </h2>
          <p className="text-xs text-[#555D50]">
            {sampleVenue.neighborhood} · {sampleVenue.distance}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#26382B] text-[#F5F3EC] shadow-sm shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#819477]" />
          <span>{sampleVenue.statusBadge}</span>
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 my-4">
        {/* Metric 1: Quietness / Acoustic */}
        <div className="p-3 rounded-xl bg-[#F5F3EC]/80 border border-[#E8E0D2]/70">
          <div className="flex items-center gap-2 text-xs font-medium text-[#555D50]">
            <Volume2 className="w-3.5 h-3.5 text-[#819477]" />
            <span>Acoustic Profile</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#26382B]">
              {sampleVenue.decibels}
            </span>
            <span className="text-xs font-semibold text-[#819477]">dB</span>
          </div>
          <p className="text-[11px] text-[#555D50] mt-0.5 truncate">
            {sampleVenue.decibelLabel}
          </p>
        </div>

        {/* Metric 2: Crowd Level */}
        <div className="p-3 rounded-xl bg-[#F5F3EC]/80 border border-[#E8E0D2]/70">
          <div className="flex items-center gap-2 text-xs font-medium text-[#555D50]">
            <Users className="w-3.5 h-3.5 text-[#819477]" />
            <span>Crowd Density</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-serif font-bold text-[#26382B]">
              {sampleVenue.crowdLevel}%
            </span>
            <span className="text-xs font-semibold text-[#819477]">Cap.</span>
          </div>
          <p className="text-[11px] text-[#555D50] mt-0.5 truncate">
            {sampleVenue.crowdLabel}
          </p>
        </div>

        {/* Metric 3: Fiber Wi-Fi */}
        <div className="p-3 rounded-xl bg-[#F5F3EC]/80 border border-[#E8E0D2]/70">
          <div className="flex items-center gap-2 text-xs font-medium text-[#555D50]">
            <Wifi className="w-3.5 h-3.5 text-[#819477]" />
            <span>Fiber Wi-Fi</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-serif font-bold text-[#20231F]">
              {sampleVenue.wifiSpeed}
            </span>
          </div>
          <p className="text-[11px] text-[#555D50] mt-0.5 truncate">
            {sampleVenue.wifiType}
          </p>
        </div>

        {/* Metric 4: Power Outlets */}
        <div className="p-3 rounded-xl bg-[#F5F3EC]/80 border border-[#E8E0D2]/70">
          <div className="flex items-center gap-2 text-xs font-medium text-[#555D50]">
            <Zap className="w-3.5 h-3.5 text-[#819477]" />
            <span>Power Outlets</span>
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-serif font-bold text-[#20231F]">
              {sampleVenue.powerAvailability}
            </span>
          </div>
          <p className="text-[11px] text-[#555D50] mt-0.5 truncate">
            {sampleVenue.seatingType}
          </p>
        </div>
      </div>

      {/* Subtle Sensory Details Bar */}
      <div className="flex items-center justify-between text-xs text-[#555D50] pt-2 border-t border-[#E8E0D2]/60 px-1">
        <div className="flex items-center gap-1.5">
          <SunMedium className="w-3.5 h-3.5 text-[#819477]" />
          <span>{sampleVenue.daylightRating}</span>
        </div>
        <span className="text-[#819477] font-semibold">Quiet Score {sampleVenue.quietScore}</span>
      </div>

      {/* Clear sample disclosure requirement */}
      <div className="mt-3 pt-2 border-t border-dashed border-[#E8E0D2] flex items-center gap-1.5 text-[10px] text-[#555D50]/80">
        <Info className="w-3 h-3 text-[#819477] shrink-0" />
        <span>{sampleVenue.sampleNotice}</span>
      </div>
    </motion.div>
  );
}
