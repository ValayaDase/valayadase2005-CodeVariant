"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Calendar, BarChart3, Sun, Moon, Sparkles, ShieldCheck, Wifi, Users, Zap, CheckCircle2 } from "lucide-react";
import { SPACES_DATA, HOURLY_DAYS } from "@/data/spacesData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Section06QuietWhen() {
  const [selectedDay, setSelectedDay] = useState("Wednesday");
  const [selectedHourIndex, setSelectedHourIndex] = useState(1); // 10:00 AM
  const [selectedSpaceId, setSelectedSpaceId] = useState("solitude-atelier");
  const [telemetryMode, setTelemetryMode] = useState("community"); // 'community' | 'model'

  const sectionRef = useRef(null);
  const chartRef = useRef(null);

  const currentSpace =
    SPACES_DATA.find((s) => s.id === selectedSpaceId) || SPACES_DATA[0];

  const hourlyData = currentSpace.hourlyProfile;
  const currentSlot = hourlyData[selectedHourIndex];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 1024;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Pinned storytelling progression through time intervals
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 20%",
        end: "+=120%",
        onUpdate: (self) => {
          // Smoothly advance time slot based on scroll progress if user hasn't manually pinned
          const p = self.progress;
          const index = Math.min(
            hourlyData.length - 1,
            Math.floor(p * hourlyData.length)
          );
          setSelectedHourIndex(index);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [hourlyData.length]);

  return (
    <section
      id="quiet-when"
      ref={sectionRef}
      className="relative w-full bg-[#F4F1E8] py-24 px-6 sm:px-8 lg:px-12 border-t border-[#E3E0D7]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header matching Master Prompt verbatim */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E3EBDD] border border-[#819478]/30 w-fit mb-4">
            <Clock className="w-3.5 h-3.5 text-[#263D31]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#263D31] font-semibold">
              Section 06 · Quiet When
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#252B26] tracking-tight leading-[1.08] mb-4">
            The right place. <br />
            <span className="text-[#263D31] italic">At the right time.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6C7168] leading-relaxed">
            A sanctuary at 9:00 AM can become a bustling hub by 1:00 PM. Spotwise maps the hourly acoustic curvature so you always arrive inside the sweet spot.
          </p>
        </div>

        {/* Interactive Main Dashboard Card */}
        <div className="glass-ivory rounded-3xl p-6 sm:p-10 border border-[#E3E0D7] shadow-xl">
          {/* Top Bar Controls: Space Picker + Mode Toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-[#E3E0D7] gap-4">
            <div>
              <p className="text-xs font-mono uppercase text-[#6C7168] tracking-wider font-semibold">
                Examining Workspace
              </p>
              <select
                value={selectedSpaceId}
                onChange={(e) => setSelectedSpaceId(e.target.value)}
                className="font-editorial text-2xl text-[#252B26] bg-transparent border-b border-[#263D31]/40 focus:outline-none cursor-pointer pr-4 py-1 mt-1 font-semibold"
              >
                {SPACES_DATA.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Telemetry vs Estimate Toggle */}
            <div className="flex items-center space-x-2 bg-[#F4F1E8] p-1.5 rounded-full border border-[#E3E0D7] self-start md:self-auto">
              <button
                onClick={() => setTelemetryMode("community")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  telemetryMode === "community"
                    ? "bg-[#263D31] text-[#F4F1E8] font-bold shadow-sm"
                    : "text-[#6C7168] hover:text-[#252B26]"
                }`}
              >
                Verified Sensors
              </button>
              <button
                onClick={() => setTelemetryMode("model")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  telemetryMode === "model"
                    ? "bg-[#263D31] text-[#F4F1E8] font-bold shadow-sm"
                    : "text-[#6C7168] hover:text-[#252B26]"
                }`}
              >
                Predictive Pattern
              </button>
            </div>
          </div>

          {/* Day Selector Pills */}
          <div className="pt-8 mb-8">
            <p className="text-xs font-mono uppercase text-[#6C7168] tracking-wider mb-3 font-semibold">
              Select Day of Week
            </p>
            <div className="flex flex-wrap gap-2">
              {HOURLY_DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                    selectedDay === day
                      ? "bg-[#263D31] text-[#F4F1E8] font-bold shadow-sm"
                      : "bg-[#F4F1E8] text-[#252B26] hover:bg-[#E3EBDD]"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Hourly Chart Visualizer */}
          <div ref={chartRef} className="bg-[#FCFBF7] p-6 sm:p-8 rounded-3xl border border-[#E3E0D7] mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3E0D7] gap-3">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-[#C58C5A]" />
                <span className="text-xs font-mono uppercase text-[#252B26] font-bold">
                  Hourly Acoustic & Occupancy Profile ({selectedDay})
                </span>
              </div>
              <span className="text-xs font-mono text-[#263D31] flex items-center space-x-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#263D31]" />
                <span>{currentSpace.dataSource}</span>
              </span>
            </div>

            {/* The Hourly Acoustic Bars */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-8 pb-3 border-b border-[#E3E0D7]">
              {hourlyData.map((slot, index) => {
                const isSelected = selectedHourIndex === index;
                const heightPercent = Math.max(
                  25,
                  Math.min(100, ((slot.noise - 25) / 50) * 100)
                );

                return (
                  <div
                    key={slot.hour}
                    onClick={() => setSelectedHourIndex(index)}
                    className="flex flex-col items-center h-full justify-end cursor-pointer group"
                  >
                    {/* Floating dB indicator */}
                    <span
                      className={`text-[10px] font-mono font-bold mb-1 transition-all ${
                        isSelected
                          ? "text-[#263D31] scale-110 font-extrabold"
                          : "text-[#6C7168] opacity-75 group-hover:opacity-100"
                      }`}
                    >
                      {slot.noise} dB
                    </span>

                    {/* Bar */}
                    <div
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative ${
                        isSelected
                          ? "bg-[#263D31] ring-2 ring-[#819478] shadow-md"
                          : slot.status === "quiet"
                          ? "bg-[#263D31]/70 hover:bg-[#263D31]"
                          : slot.status === "caution"
                          ? "bg-[#C58C5A]/80 hover:bg-[#C58C5A]"
                          : "bg-[#B86E52]/80 hover:bg-[#B86E52]"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {isSelected && (
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Hour label */}
                    <span
                      className={`text-[11px] font-mono mt-3 transition-colors ${
                        isSelected
                          ? "text-[#263D31] font-bold"
                          : "text-[#6C7168]"
                      }`}
                    >
                      {slot.hour}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Hour Telemetry Breakdown Narrative */}
            <div className="mt-6 pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#819478] font-bold">
                  Time Window: {currentSlot.hour} ({selectedDay})
                </span>
                <p className="font-editorial text-2xl text-[#252B26] mt-0.5">
                  {currentSlot.noise <= 38
                    ? "Optimal Focus Window: Quiet & Uninterrupted Flow"
                    : currentSlot.noise <= 52
                    ? "Moderate Ambient Hum: Suitable for Creative & Reading Work"
                    : "Peak Hour: Higher Background Noise and Occupancy"}
                </p>
              </div>

              <div className="flex items-center space-x-6 text-sm font-mono">
                <div>
                  <p className="text-[10px] uppercase text-[#6C7168]">Acoustic Level</p>
                  <p className="text-xl font-bold text-[#263D31]">
                    {currentSlot.noise} dB
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[#6C7168]">Expected Crowd</p>
                  <p className="text-xl font-bold text-[#263D31]">
                    {currentSlot.crowd}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[#6C7168]">Wi-Fi & Sockets</p>
                  <p className="text-xl font-bold text-[#263D31]">
                    {currentSpace.wifiSpeed.split(" ")[0]} Mbps
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[#6C7168]">Suitability</p>
                  <p
                    className={`text-xl font-bold ${
                      currentSlot.status === "quiet"
                        ? "text-[#263D31]"
                        : currentSlot.status === "caution"
                        ? "text-[#C58C5A]"
                        : "text-[#B86E52]"
                    }`}
                  >
                    {currentSlot.status === "quiet" ? "Serene" : currentSlot.status === "caution" ? "Caution" : "Crowded"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
