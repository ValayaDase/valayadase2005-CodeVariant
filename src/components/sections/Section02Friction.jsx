"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { VolumeX, UserX, WifiOff, AlertTriangle, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Section02Friction() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const chapters = [
    {
      id: "noise",
      number: "01",
      badge: "Chapter A · Acoustic Friction",
      title: "Too noisy to concentrate.",
      subtitle:
        "The cafe looked charming online. But between the blasting grinder, conversational reverberations, and hard tile echoes, your thoughts are constantly fractured.",
      image: "/images/story/noisy-cafe.jpg",
      statusAccent: "#C58C5A", // Muted Amber
      statusBadge: "Noise Level: 79 dB (Severe Intrusion)",
      metric: "79 dB",
      metricLabel: "Measured Decibels",
      icon: VolumeX,
      telemetry: [
        { label: "Espresso Grinder Clatter", val: "84 dB Spikes" },
        { label: "Conversational Clutter", val: "Continuous" },
        { label: "Focus Half-Life", val: "3.2 minutes" },
      ],
    },
    {
      id: "seating",
      number: "02",
      badge: "Chapter B · Spatial Friction",
      title: "You arrived. But there is nowhere to sit.",
      subtitle:
        "You packed your bag, navigated traffic, and walked through the door—only to find every single table claimed by single occupants with empty paper cups.",
      image: "/images/story/no-seats.jpg",
      statusAccent: "#B86E52", // Muted Terracotta
      statusBadge: "Occupancy: 96% (Zero Available Outlets)",
      metric: "96%",
      metricLabel: "Seat Occupancy",
      icon: UserX,
      telemetry: [
        { label: "Open Solo Tables", val: "0 available" },
        { label: "Power Socket Access", val: "100% blocked" },
        { label: "Lost Commute Time", val: "35 minutes" },
      ],
    },
    {
      id: "connectivity",
      number: "03",
      badge: "Chapter C · Digital Friction",
      title: "The perfect-looking place. The wrong connection.",
      subtitle:
        "The coffee is great, you snagged a corner stool, but the Wi-Fi repeatedly drops mid-commit. The captive portal demands re-authentication every twenty minutes.",
      image: "/images/story/bad-wifi.jpg",
      statusAccent: "#B86E52",
      statusBadge: "Latency: 480ms (Frequent Packet Loss)",
      metric: "42%",
      metricLabel: "Packet Loss Rate",
      icon: WifiOff,
      telemetry: [
        { label: "Bandwidth Throttling", val: "Active (2 Mbps)" },
        { label: "Cloud Sync Failure", val: "Critical" },
        { label: "Client Call Viability", val: "Impossible" },
      ],
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 1024;
    if (isMobile) return; // Clean vertical flow on mobile

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 0.8,
          pin: true,
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress < 0.33) {
              setActiveChapter(0);
            } else if (progress < 0.66) {
              setActiveChapter(1);
            } else {
              setActiveChapter(2);
            }
          },
        },
      });

      // Animate chapter panels
      timeline
        .to(".chapter-panel-0", { opacity: 1, duration: 1 })
        .to(".chapter-panel-0", { opacity: 0, scale: 0.96, duration: 0.8 }, "+=0.6")
        .fromTo(
          ".chapter-panel-1",
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1 },
          "-=0.4"
        )
        .to(".chapter-panel-1", { opacity: 0, scale: 0.96, duration: 0.8 }, "+=0.6")
        .fromTo(
          ".chapter-panel-2",
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 1 },
          "-=0.4"
        );
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="friction" ref={triggerRef} className="relative w-full bg-[#F4F1E8] border-t border-[#E3E0D7]">
      {/* Desktop Pinned Interactive Storyboard */}
      <div className="hidden lg:block min-h-screen w-full relative overflow-hidden py-16 px-8 lg:px-14">
        <div className="max-w-7xl mx-auto h-full flex flex-col justify-between">
          {/* Section Master Header */}
          <div className="flex items-end justify-between border-b border-[#E3E0D7] pb-6 mb-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C58C5A]/15 border border-[#C58C5A]/30 w-fit mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-[#C58C5A]" />
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C58C5A] font-semibold">
                  Section 02 · The Friction
                </span>
              </div>
              <h2 className="font-editorial text-4xl lg:text-5xl text-[#252B26] tracking-tight">
                A place can look perfect.{" "}
                <span className="italic text-[#C58C5A]">And still be wrong for you.</span>
              </h2>
            </div>

            {/* Chapter Stepper Indicator */}
            <div className="flex items-center space-x-6 font-mono text-sm">
              <span className="text-[#263D31] font-semibold text-lg">
                0{activeChapter + 1} / 03
              </span>
              <div className="flex space-x-2">
                {[0, 1, 2].map((idx) => (
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

          {/* Active Chapter Stage */}
          <div className="relative flex-1 min-h-[520px]">
            {chapters.map((chap, idx) => {
              const Icon = chap.icon;
              return (
                <div
                  key={chap.id}
                  className={`chapter-panel-${idx} absolute inset-0 grid grid-cols-12 gap-12 items-center transition-opacity duration-500 ${
                    idx === activeChapter ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
                  }`}
                >
                  {/* Left Column: Narrative & Metrics */}
                  <div className="col-span-6 flex flex-col justify-center pr-6">
                    <p className="text-xs uppercase tracking-[0.2em] font-mono font-semibold text-[#C58C5A] mb-3">
                      {chap.badge}
                    </p>
                    <h3 className="font-editorial text-4xl lg:text-5xl text-[#252B26] leading-[1.1] mb-5">
                      {chap.title}
                    </h3>
                    <p className="text-base text-[#6C7168] leading-relaxed mb-8">
                      {chap.subtitle}
                    </p>

                    {/* Telemetry Breakdown Card */}
                    <div className="glass-ivory rounded-2xl p-6 border border-[#E3E0D7] shadow-sm">
                      <div className="flex items-center justify-between pb-4 border-b border-[#E3E0D7]">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className="p-2 rounded-xl text-white"
                            style={{ backgroundColor: chap.statusAccent }}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <div>
                            <p className="text-[10px] font-mono uppercase text-[#6C7168]">
                              Acoustic / Spatial Diagnostic
                            </p>
                            <p className="text-sm font-semibold text-[#252B26]">
                              {chap.statusBadge}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-editorial text-2xl text-[#252B26]">{chap.metric}</p>
                          <p className="text-[10px] font-mono text-[#6C7168]">
                            {chap.metricLabel}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 text-xs font-mono">
                        {chap.telemetry.map((t) => (
                          <div key={t.label}>
                            <p className="text-[#6C7168] text-[10px] uppercase">{t.label}</p>
                            <p className="text-[#252B26] font-semibold mt-0.5">{t.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Realistic Photographic Scene */}
                  <div className="col-span-6 relative h-[480px] rounded-2xl overflow-hidden border border-[#E3E0D7] shadow-xl">
                    <Image
                      src={chap.image}
                      alt={chap.title}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#252B26]/40 via-transparent to-transparent pointer-events-none" />

                    {/* Sensor Tag Overlay */}
                    <div className="absolute bottom-5 left-5 right-5 glass-ivory p-3.5 rounded-xl border border-[#E3E0D7] flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-mono text-[#252B26]">
                        <span className="w-2 h-2 rounded-full bg-[#B86E52] animate-pulse" />
                        <span>UNRESOLVED SENSORY CONFLICT DETECTED</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6C7168] uppercase">
                        Real-world failure case
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Narrative Transition Cue */}
          <div className="pt-6 border-t border-[#E3E0D7] flex items-center justify-between text-xs font-mono text-[#6C7168]">
            <span>Continuous Scroll Experience</span>
            <div className="flex items-center space-x-2 text-[#263D31] font-medium">
              <span>Scroll towards clarity</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stacked Story Cards */}
      <div className="lg:hidden py-14 px-6 space-y-12">
        <div className="text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C58C5A]/15 border border-[#C58C5A]/30 w-fit mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-[#C58C5A]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C58C5A] font-semibold">
              Section 02 · The Friction
            </span>
          </div>
          <h2 className="font-editorial text-3xl text-[#252B26]">
            A place can look perfect.{" "}
            <span className="italic text-[#C58C5A]">And still be wrong for you.</span>
          </h2>
        </div>

        {chapters.map((chap) => {
          const Icon = chap.icon;
          return (
            <div
              key={chap.id}
              className="card-ivory rounded-2xl overflow-hidden p-6 border border-[#E3E0D7]"
            >
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-6">
                <Image
                  src={chap.image}
                  alt={chap.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] font-mono font-semibold text-[#C58C5A] mb-2">
                {chap.badge}
              </p>
              <h3 className="font-editorial text-2xl text-[#252B26] mb-3">{chap.title}</h3>
              <p className="text-sm text-[#6C7168] leading-relaxed mb-6">{chap.subtitle}</p>

              <div className="p-4 rounded-xl bg-[#F4F1E8] border border-[#E3E0D7] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-[#B86E52]" />
                  <span className="text-xs font-mono font-semibold text-[#252B26]">
                    {chap.statusBadge}
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
