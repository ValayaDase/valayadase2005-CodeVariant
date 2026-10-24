"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { VolumeX, UserX, WifiOff, ClockAlert, AlertTriangle, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Section02Problem() {
  const triggerRef = useRef(null);
  const stageRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const problems = [
    {
      id: "noise",
      number: "01",
      badge: "Problem 01 · Acoustic Friction",
      title: "Too noisy for focused work.",
      subtitle:
        "The cafe looked serene online. But between grinding burrs, echoing hard tiles, and ringing cellphones, your cognitive focus is fractured every three minutes.",
      image: "/images/story/noisy-cafe.jpg",
      statusAccent: "#C58C5A", // Amber
      statusBadge: "Noise Level: 79 dB (Severe Intrusion)",
      metric: "79 dB",
      metricLabel: "Measured Decibels",
      icon: VolumeX,
      telemetry: [
        { label: "Espresso Grinder", val: "84 dB Spikes" },
        { label: "Conversational Clutter", val: "Continuous" },
        { label: "Focus Half-Life", val: "3.2 minutes" },
      ],
    },
    {
      id: "seating",
      number: "02",
      badge: "Problem 02 · Spatial Friction",
      title: "Too crowded to find a seat.",
      subtitle:
        "You packed your bag, braved cross-town transit, and walked inside—only to find every single desk claimed by single occupants with empty paper cups.",
      image: "/images/story/no-seats.jpg",
      statusAccent: "#B86E52", // Terracotta
      statusBadge: "Occupancy: 96% (Zero Available Outlets)",
      metric: "96%",
      metricLabel: "Seat Occupancy",
      icon: UserX,
      telemetry: [
        { label: "Open Solo Tables", val: "0 Available" },
        { label: "Power Socket Access", val: "100% Blocked" },
        { label: "Wasted Commute", val: "35 Minutes" },
      ],
    },
    {
      id: "connectivity",
      number: "03",
      badge: "Problem 03 · Digital Friction",
      title: "Unreliable Wi-Fi or connectivity.",
      subtitle:
        "You managed to grab a stool, but the Wi-Fi repeatedly drops mid-commit. The captive portal demands re-authentication every fifteen minutes, terminating your calls.",
      image: "/images/story/bad-wifi.jpg",
      statusAccent: "#B86E52", // Terracotta
      statusBadge: "Latency: 480ms (High Packet Loss)",
      metric: "42%",
      metricLabel: "Packet Loss Rate",
      icon: WifiOff,
      telemetry: [
        { label: "Bandwidth Throttling", val: "Active (2 Mbps)" },
        { label: "Cloud Sync Failure", val: "Critical" },
        { label: "Client Video Viability", val: "Failing" },
      ],
    },
    {
      id: "environment",
      number: "04",
      badge: "Problem 04 · Temporal & Activity Mismatch",
      title: "The wrong environment for the intended activity or time.",
      subtitle:
        "A space that was quiet at 8:30 AM transforms into a noisy lunch venue by noon. The atmosphere, lighting, and acoustic tempo do not match what your work requires.",
      image: "/images/hero/workspace.jpg",
      statusAccent: "#C58C5A", // Amber
      statusBadge: "Temporal Drift: High Risk After 11:30",
      metric: "11:30 AM",
      metricLabel: "Quiet Window Closes",
      icon: ClockAlert,
      telemetry: [
        { label: "Acoustic Shift", val: "+26 dB Surge" },
        { label: "Activity Clash", val: "Meetings vs Focus" },
        { label: "Predictability", val: "Unreliable" },
      ],
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 1024;
    if (isMobile) return; // Clean vertical flow on mobile

    const ctx = gsap.context(() => {
      // Pinned bottom-to-top reveal animation for the 4 problems
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=320%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.25) setActiveChapter(0);
            else if (p < 0.5) setActiveChapter(1);
            else if (p < 0.75) setActiveChapter(2);
            else setActiveChapter(3);
          },
        },
      });

      // Chapter 0 is initially in position.
      // Transition Chapter 0 UP out while Chapter 1 enters from BOTTOM (y: 100% -> 0)
      timeline
        .to(".problem-card-0", { yPercent: -100, opacity: 0, duration: 1, ease: "power2.inOut" }, 0.5)
        .fromTo(
          ".problem-card-1",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
          0.5
        )
        // Transition Chapter 1 UP out while Chapter 2 enters from BOTTOM
        .to(".problem-card-1", { yPercent: -100, opacity: 0, duration: 1, ease: "power2.inOut" }, 1.5)
        .fromTo(
          ".problem-card-2",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
          1.5
        )
        // Transition Chapter 2 UP out while Chapter 3 enters from BOTTOM
        .to(".problem-card-2", { yPercent: -100, opacity: 0, duration: 1, ease: "power2.inOut" }, 2.5)
        .fromTo(
          ".problem-card-3",
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut" },
          2.5
        );
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem" ref={triggerRef} className="relative w-full bg-[#F4F1E8] border-t border-[#E3E0D7]">
      {/* Desktop Pinned Interactive Storyboard with Bottom-to-Top Reveal */}
      <div className="hidden lg:block min-h-screen w-full relative overflow-hidden py-14 px-8 lg:px-14">
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-between">
          {/* Section Master Header */}
          <div className="flex items-end justify-between border-b border-[#E3E0D7] pb-5 mb-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C58C5A]/15 border border-[#C58C5A]/30 w-fit mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C58C5A]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C58C5A] font-semibold">
                  Section 02 · The Problem
                </span>
              </div>
              <h2 className="font-editorial text-4xl lg:text-5xl text-[#252B26] tracking-tight">
                A place can look perfect.{" "}
                <span className="italic text-[#C58C5A]">And still be wrong for you.</span>
              </h2>
            </div>

            {/* Chapter Stepper Indicator (4 Chapters) */}
            <div className="flex items-center space-x-6 font-mono text-sm">
              <span className="text-[#263D31] font-semibold text-lg">
                0{activeChapter + 1} / 04
              </span>
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map((idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 transition-all duration-300 rounded-full ${
                      activeChapter === idx ? "w-8 bg-[#263D31]" : "w-2 bg-[#E3E0D7]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Active Chapter Stage (Bottom-to-Top Container) */}
          <div ref={stageRef} className="relative flex-1 min-h-[520px] overflow-hidden rounded-3xl">
            {problems.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  className={`problem-card-${idx} absolute inset-0 grid grid-cols-12 gap-10 items-center will-change-transform ${
                    idx === 0 ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  style={{
                    transform: idx === 0 ? "translate3d(0, 0%, 0)" : "translate3d(0, 100%, 0)",
                  }}
                >
                  {/* Left Column: Narrative & Metrics */}
                  <div className="col-span-6 flex flex-col justify-center pr-6">
                    <p className="text-xs uppercase tracking-[0.2em] font-mono font-semibold text-[#C58C5A] mb-3">
                      {p.badge}
                    </p>
                    <h3 className="font-editorial text-3xl lg:text-[2.75rem] text-[#252B26] leading-[1.1] mb-5">
                      {p.title}
                    </h3>
                    <p className="text-base text-[#6C7168] leading-relaxed mb-7">
                      {p.subtitle}
                    </p>

                    {/* Telemetry Diagnostic Card */}
                    <div className="glass-ivory rounded-2xl p-6 border border-[#E3E0D7] shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-[#E3E0D7]">
                        <div className="flex items-center space-x-3">
                          <span
                            className="p-2.5 rounded-xl text-white shadow-sm"
                            style={{ backgroundColor: p.statusAccent }}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <p className="text-[10px] font-mono uppercase text-[#6C7168]">
                              Diagnostic Observation
                            </p>
                            <p className="text-sm font-semibold text-[#252B26]">
                              {p.statusBadge}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-editorial text-2xl text-[#252B26]">{p.metric}</p>
                          <p className="text-[10px] font-mono text-[#6C7168]">
                            {p.metricLabel}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 text-xs font-mono">
                        {p.telemetry.map((t) => (
                          <div key={t.label}>
                            <p className="text-[#6C7168] text-[10px] uppercase">{t.label}</p>
                            <p className="text-[#252B26] font-semibold mt-0.5">{t.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Realistic Photographic Scene */}
                  <div className="col-span-6 relative h-[460px] rounded-3xl overflow-hidden border border-[#E3E0D7] shadow-xl">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#252B26]/40 via-transparent to-transparent pointer-events-none" />

                    {/* Sensor Tag Overlay */}
                    <div className="absolute bottom-5 left-5 right-5 glass-ivory p-3.5 rounded-2xl border border-[#E3E0D7] flex items-center justify-between shadow-md">
                      <div className="flex items-center space-x-2 text-xs font-mono text-[#252B26]">
                        <span className="w-2 h-2 rounded-full bg-[#B86E52] animate-pulse" />
                        <span>FAILURE CASE DETECTED ON ARRIVAL</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6C7168] uppercase font-bold">
                        Unresolved Friction
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Narrative Transition Cue */}
          <div className="pt-5 border-t border-[#E3E0D7] flex items-center justify-between text-xs font-mono text-[#6C7168]">
            <span className="tracking-wider uppercase">Scroll reveals each problem from bottom to top</span>
            <a href="#turning-point" className="flex items-center space-x-2 text-[#263D31] font-semibold hover:underline">
              <span>Next: The Turning Point</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Story Cards */}
      <div className="lg:hidden py-14 px-6 space-y-12">
        <div className="text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C58C5A]/15 border border-[#C58C5A]/30 w-fit mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-[#C58C5A]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C58C5A] font-semibold">
              Section 02 · The Problem
            </span>
          </div>
          <h2 className="font-editorial text-3xl text-[#252B26]">
            A place can look perfect.{" "}
            <span className="italic text-[#C58C5A]">And still be wrong for you.</span>
          </h2>
        </div>

        {problems.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="card-ivory rounded-3xl overflow-hidden p-6 border border-[#E3E0D7] shadow-sm"
            >
              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-[#E3E0D7]">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] font-mono font-semibold text-[#C58C5A] mb-2">
                {p.badge}
              </p>
              <h3 className="font-editorial text-2xl text-[#252B26] mb-3">{p.title}</h3>
              <p className="text-sm text-[#6C7168] leading-relaxed mb-6">{p.subtitle}</p>

              <div className="p-4 rounded-xl bg-[#F4F1E8] border border-[#E3E0D7] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-[#B86E52]" />
                  <span className="text-xs font-mono font-semibold text-[#252B26]">
                    {p.statusBadge}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
