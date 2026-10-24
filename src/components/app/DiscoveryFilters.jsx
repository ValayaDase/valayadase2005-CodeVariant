"use client";

import { Search, RotateCcw } from "lucide-react";
import { RevealItem } from "@/components/motion/MotionPrimitives";

export const ACTIVITY_OPTIONS = ["Deep Work", "Studying", "Meeting", "Casual Work"];
export const DAY_OPTIONS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const TIME_SLOTS = [
  { id: "morning", label: "Morning (8am-12pm)" },
  { id: "afternoon", label: "Afternoon (12pm-5pm)" },
  { id: "evening", label: "Evening (5pm-9pm)" },
  { id: "night", label: "Night (9pm-12am)" },
];
export const NOISE_OPTIONS = ["Any", "Quiet", "Moderate", "Lively"];
export const BUDGET_OPTIONS = ["Any", "Free", "$", "$$", "$$$"];

export const FACILITY_FILTERS = [
  { id: "wifi", label: "Fiber Wi-Fi" },
  { id: "power_outlets", label: "Power Outlets" },
  { id: "ergonomic_seating", label: "Ergonomic Chairs" },
  { id: "quiet_zone", label: "Quiet Zone" },
  { id: "coffee", label: "Coffee & Tea" },
  { id: "soundproof_booths", label: "Call Pods" },
  { id: "outdoor_terrace", label: "Terrace" },
];

export default function DiscoveryFilters({
  filters,
  onChange,
  onReset,
}) {
  const handleTextChange = (e) => {
    onChange({ ...filters, searchQuery: e.target.value });
  };

  const handleFacilityToggle = (facilityId) => {
    const current = filters.requiredFacilities || [];
    const next = current.includes(facilityId)
      ? current.filter((f) => f !== facilityId)
      : [...current, facilityId];
    onChange({ ...filters, requiredFacilities: next });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D2] p-5 sm:p-6 shadow-[0_4px_24px_rgba(32,35,31,0.04)] space-y-5">
      {/* Top Search & Primary Filters Row */}
      <RevealItem delay={0.08}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Search Query Input */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#819477]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery || ""}
            onChange={handleTextChange}
            placeholder="Search venue name, area (e.g. Greenwich, Bloomsbury)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] placeholder-[#555D50]/60 focus:outline-none focus:ring-2 focus:ring-[#819477]/40 focus:bg-white transition-all"
          />
        </div>

        {/* Activity Selector */}
        <div className="md:col-span-3">
          <select
            value={filters.activity}
            onChange={(e) => onChange({ ...filters, activity: e.target.value })}
            className="w-full py-2.5 px-3 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40 focus:bg-white transition-all cursor-pointer"
            aria-label="Filter by activity"
          >
            {ACTIVITY_OPTIONS.map((act) => (
              <option key={act} value={act}>
                Activity: {act}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selector */}
        <div className="md:col-span-2">
          <select
            value={filters.day}
            onChange={(e) => onChange({ ...filters, day: e.target.value })}
            className="w-full py-2.5 px-3 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40 focus:bg-white transition-all cursor-pointer"
            aria-label="Intended visit day"
          >
            {DAY_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Time Slot Selector */}
        <div className="md:col-span-2">
          <select
            value={filters.time}
            onChange={(e) => onChange({ ...filters, time: e.target.value })}
            className="w-full py-2.5 px-3 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm font-medium text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40 focus:bg-white transition-all cursor-pointer"
            aria-label="Intended visit time"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      </RevealItem>

      {/* Secondary Criteria: Noise, Budget & Facilities */}
      <RevealItem delay={0.2}>
      <div className="pt-4 border-t border-[#E8E0D2] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Quick Noise & Budget Pill Groups */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Noise level selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555D50] mr-1">
              Noise:
            </span>
            <div className="inline-flex rounded-xl bg-[#F5F3EC] p-0.5 border border-[#E8E0D2]">
              {NOISE_OPTIONS.map((noise) => (
                <button
                  key={noise}
                  type="button"
                  onClick={() => onChange({ ...filters, noisePreference: noise })}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    filters.noisePreference === noise
                      ? "bg-[#26382B] text-[#F5F3EC] shadow-xs"
                      : "text-[#555D50] hover:text-[#20231F]"
                  }`}
                >
                  {noise}
                </button>
              ))}
            </div>
          </div>

          {/* Budget selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#555D50] mr-1">
              Budget:
            </span>
            <div className="inline-flex rounded-xl bg-[#F5F3EC] p-0.5 border border-[#E8E0D2]">
              {BUDGET_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onChange({ ...filters, budget: b })}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    filters.budget === b
                      ? "bg-[#26382B] text-[#F5F3EC] shadow-xs"
                      : "text-[#555D50] hover:text-[#20231F]"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Reset Button */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#555D50] hover:text-[#20231F] hover:bg-[#F5F3EC] border border-transparent hover:border-[#E8E0D2] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
      </RevealItem>

      {/* Facilities Multi-Select Chips */}
      <RevealItem delay={0.32}>
      <div className="pt-3 border-t border-dashed border-[#E8E0D2] flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-[#555D50] mr-1">
          Required Facilities:
        </span>
        {FACILITY_FILTERS.map((fac) => {
          const isSelected = (filters.requiredFacilities || []).includes(fac.id);
          return (
            <button
              key={fac.id}
              type="button"
              onClick={() => handleFacilityToggle(fac.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isSelected
                  ? "bg-[#819477] text-white border-[#819477] shadow-xs"
                  : "bg-white text-[#555D50] border-[#E8E0D2] hover:border-[#819477] hover:text-[#20231F]"
              }`}
            >
              {isSelected ? "✓ " : "+ "}
              {fac.label}
            </button>
          );
        })}
      </div>
      </RevealItem>
    </div>
  );
}
