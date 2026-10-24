"use client";

import { useState } from "react";
import { Clock, Volume2, ShieldCheck } from "lucide-react";
import { DAY_OPTIONS, TIME_SLOTS } from "./DiscoveryFilters";

export default function QuietWhenPanel({
  crowdSchedule = {},
  initialDay = "Monday",
  venueName = "This Venue",
}) {
  const [activeDay, setActiveDay] = useState(initialDay);

  const dayData = crowdSchedule[activeDay] || {};

  return (
    <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] text-left">
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-[#E8E0D2]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477] mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Quiet When™ Telemetry Forecast</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#20231F] tracking-tight">
            Hourly Acoustic &amp; Crowd Timeline
          </h2>
          <p className="text-xs text-[#555D50] mt-1">
            Predictive quiet windows based on historical telemetry for {venueName}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[11px] font-semibold text-[#819477] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EBF0E9] border border-[#E8E0D2]">
            Deterministic Demo Curves
          </span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex overflow-x-auto gap-2 py-4 border-b border-[#E8E0D2]/70 no-scrollbar">
        {DAY_OPTIONS.map((day) => {
          const isActive = day === activeDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border ${
                isActive
                  ? "bg-[#26382B] text-[#F5F3EC] border-[#26382B] shadow-xs"
                  : "liquid-hover bg-white text-[#555D50] border-[#E8E0D2] hover:bg-[#FAF8F3] hover:text-[#20231F]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 4 Timeslot Timeline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {TIME_SLOTS.map((slot) => {
          const slotTelemetry = dayData[slot.id];
          const hasData = Boolean(slotTelemetry);
          const crowd = slotTelemetry?.crowd ?? 0;
          const decibels = slotTelemetry?.decibels ?? 35;
          const status = slotTelemetry?.status || "Unknown";

          // Color scale for crowd
          let barColor = "bg-[#819477]";
          if (crowd > 65) barColor = "bg-[#26382B]";
          else if (crowd > 40) barColor = "bg-[#819477]";

          return (
            <div
              key={slot.id}
              className="p-4 rounded-2xl bg-[#F5F3EC]/70 border border-[#E8E0D2] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#20231F] mb-1">
                  <span>{slot.label.split(" ")[0]}</span>
                  <span className="text-[11px] text-[#819477]">
                    {hasData ? "Estimated" : "Unknown"}
                  </span>
                </div>
                <p className="text-[11px] text-[#555D50] mb-3">
                  {slot.label.split("(")[1]?.replace(")", "") || ""}
                </p>

                {hasData ? (
                  <>
                    <div className="flex items-baseline justify-between text-xs mb-1.5">
                      <span className="text-[#555D50]">Capacity:</span>
                      <span className="font-serif font-bold text-[#20231F]">
                        {crowd}% Full
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white border border-[#E8E0D2] overflow-hidden mb-3">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${crowd}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8E0D2]/60">
                      <span className="flex items-center gap-1 text-[#819477] font-medium">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{decibels} dB</span>
                      </span>
                      <span className="font-semibold text-[#20231F] text-[11px]">
                        {status}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-[#555D50]">
                    <span>No verified schedule</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory footer */}
      <div className="mt-6 pt-4 border-t border-[#E8E0D2]/70 flex flex-wrap items-center justify-between gap-2 text-xs text-[#555D50]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#819477]" />
          <span>Acoustic readings derived from historical visitor check-ins &amp; noise telemetry</span>
        </div>
        <span className="font-semibold text-[#26382B]">
          {activeDay} Morning is typically the quietest window
        </span>
      </div>
    </div>
  );
}
