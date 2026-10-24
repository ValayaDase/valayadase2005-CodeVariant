"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  ArrowDown,
  Radio,
  Volume2,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TurningPointDepth from "@/components/three/TurningPointDepth";

const PLACES = [
  {
    id: "quiet",
    name: "The Solitude Atelier",
    label: "Quiet Sanctuary",
    noise: 36,
    targetDb: "36 dB",
    details: "98% Focus Match · 100% Sockets",
    explanation: "Whisper-quiet acoustic isolation for deep, uninterrupted work.",
    endurance: "4+ Hours Flow",
    color: "#263D31",
    accentGlow: "rgba(38,61,49,0.18)",
    soft: "#E3EBDD",
    icon: MapPin,
    simulationInfo: {
      headline: "🌿 Deep Focus Sanctuary (36 dB)",
      verdict: "Acoustic isolation verified lower than a quiet library. 100% guaranteed table sockets with high-speed fiber.",
      flowScore: "98% Flow Match",
      recommendedFor: "Coding Sprints, Deep Writing, High Cognitive Load",
    },
  },
  {
    id: "caution",
    name: "Amber Courtyard",
    label: "Caution Variable",
    noise: 58,
    targetDb: "58 dB",
    details: "74% Focus Match · Morning Only",
    explanation: "Tranquil in early morning, but acoustics peak rapidly by lunchtime.",
    endurance: "90 Min Windows",
    color: "#986334",
    accentGlow: "rgba(152,99,52,0.18)",
    soft: "#F3E8D9",
    icon: Radio,
    simulationInfo: {
      headline: "☕ Time-Variable Environment (58 dB)",
      verdict: "Gentle morning murmur turns into bustling lunch rush after 12:30 PM. Outlets located along perimeter walls only.",
      flowScore: "74% Flow Match",
      recommendedFor: "Casual Email, Creative Ideation, Morning Coffee Sprints",
    },
  },
  {
    id: "crowded",
    name: "Monocle Commons",
    label: "Crowded Warning",
    noise: 67,
    targetDb: "67 dB",
    details: "41% Focus Match · High Echo",
    explanation: "High acoustic turbulence & frequent espresso grinder interruptions.",
    endurance: "< 35 Min Stays",
    color: "#A15D47",
    accentGlow: "rgba(161,93,71,0.2)",
    soft: "#F1E2DB",
    icon: AlertTriangle,
    simulationInfo: {
      headline: "⚡ High Acoustic Turbulence (67 dB)",
      verdict: "Acoustic echo and clatter break focus every 4 minutes. Seating is unpredictable with zero guaranteed power outlets.",
      flowScore: "41% Flow Match",
      recommendedFor: "Quick Social Catch-ups, Reading for Pleasure, Audiobooks with ANC",
    },
  },
];

function AudioEqualizer({ mode, active }) {
  const heights =
    mode === "quiet"
      ? [3, 7, 4, 8, 5, 7]
      : mode === "caution"
      ? [5, 12, 8, 14, 7, 11]
      : [8, 18, 13, 22, 11, 19];

  const durations =
    mode === "quiet"
      ? [1.2, 0.9, 1.3, 1.0, 1.25, 0.95]
      : mode === "caution"
      ? [0.75, 0.55, 0.85, 0.65, 0.7, 0.6]
      : [0.45, 0.3, 0.5, 0.35, 0.42, 0.32];

  return (
    <div className="flex items-end gap-[2px] h-4 shrink-0" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full bg-current origin-bottom will-change-transform transition-all duration-300"
          style={{
            height: `${h}px`,
            animation: active
              ? `equalizerWave ${durations[i]}s ease-in-out infinite alternate`
              : "none",
            animationDelay: `${i * 110}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function Section03TurningPoint() {
  const sectionRef = useRef(null);
  const [activeMode, setActiveMode] = useState("quiet");

  const activePlace =
    PLACES.find((p) => p.id === activeMode) || PLACES[0];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions;
          const select = gsap.utils.selector(sectionRef);

          if (reduceMotion) {
            return;
          }

          // Main Entrance Sequence matching the website signature style
          const entranceTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 74%",
              toggleActions: "play none none reverse",
            },
          });

          // 1. Signature Masked Word Reveal ("What if you knew")
          entranceTl.fromTo(
            select(".turning-word"),
            {
              yPercent: 120,
              rotateZ: (i) => (i % 2 === 0 ? 3.5 : -3.5),
              opacity: 0,
            },
            {
              yPercent: 0,
              rotateZ: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.07,
              ease: "power3.out",
            },
            0
          );

          // 3. Highlight bar draws under "before you arrived?"
          entranceTl.fromTo(
            select(".headline-highlight"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.85,
              ease: "power2.inOut",
            },
            0.55
          );

          // 4. Subhead Quote and text box reveal
          entranceTl
            .fromTo(
              select(".turning-quote-box"),
              { y: 22, opacity: 0, scale: 0.97 },
              { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "power2.out" },
              0.65
            );

          // 5. Environment Cards Stagger In with Edge Lines and Sheen Sweeps
          entranceTl
            .fromTo(
              select(".environment-card"),
              { y: 40, opacity: 0, scale: 0.96 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.85,
                stagger: 0.12,
                ease: "power3.out",
              },
              0.85
            )
            .fromTo(
              select(".card-edge"),
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.7,
                stagger: 0.12,
                ease: "power2.inOut",
              },
              1.0
            )
            .fromTo(
              select(".card-sheen"),
              { xPercent: -110 },
              {
                xPercent: 420,
                duration: 0.95,
                stagger: 0.12,
                ease: "power2.inOut",
              },
              1.05
            );

          // 6. Active Telemetry Inspection Panel
          entranceTl.fromTo(
            select(".telemetry-panel"),
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
            1.25
          );

          // 7. Footer CTA fade up
          entranceTl.fromTo(
            select(".turning-footer"),
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
            1.4
          );
        }
      );
    }, sectionRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="turning-point"
      ref={sectionRef}
      className="relative z-20 isolate flex min-h-[96svh] w-full flex-col items-center justify-center overflow-hidden border-t border-[#E3E0D7] bg-[#F4F1E8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Dynamic Keyframes for Sound Equalizer and Shimmer */}
      <style jsx global>{`
        @keyframes equalizerWave {
          0% {
            transform: scaleY(0.35);
          }
          100% {
            transform: scaleY(1.35);
          }
        }
        @keyframes textGradientShimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      {/* 3D Acoustic Wave Topography (Mode-reactive Interactive Three.js Canvas) */}
      <TurningPointDepth activeMode={activeMode} />

      {/* Soft warm ivory radial halo to guarantee crystal-clear typography readability */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(244,241,232,0.94) 0%, rgba(244,241,232,0.7) 38%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-5xl">
        <header className="turning-header mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Headline with signature luxury masked word animation */}
          <h2 className="font-editorial text-[clamp(2.35rem,6.2vw,5rem)] leading-[1.05] tracking-tight text-[#252B26]">
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="inline-block overflow-hidden py-[0.06em] -my-[0.06em]">
                <span className="turning-word inline-block mr-[0.22em]">What</span>
              </span>
              <span className="inline-block overflow-hidden py-[0.06em] -my-[0.06em]">
                <span className="turning-word inline-block mr-[0.22em]">if</span>
              </span>
              <span className="inline-block overflow-hidden py-[0.06em] -my-[0.06em]">
                <span className="turning-word inline-block mr-[0.22em]">you</span>
              </span>
              <span className="inline-block overflow-hidden py-[0.06em] -my-[0.06em]">
                <span className="turning-word inline-block">knew</span>
              </span>
            </span>

            <span className="-mt-[0.06em] block overflow-hidden pb-[0.18em]">
              <span className="inline-block overflow-hidden py-[0.06em] -my-[0.06em]">
                <span
                  className="turning-word relative inline-block italic font-bold"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #4A6347 0%, #768F66 35%, #263D31 70%, #4A6347 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "textGradientShimmer 5s ease-in-out infinite",
                  }}
                >
                  <span className="relative z-10">before you arrived?</span>
                  <span
                    className="headline-highlight absolute bottom-[0.04em] left-0 right-0 h-[0.15em] rounded-full bg-[#819478]/35 origin-left"
                    aria-hidden="true"
                  />
                </span>
              </span>
            </span>
          </h2>

          {/* Editorial Subhead Interactive Quote Box */}
          <div className="turning-quote-box mt-4 max-w-2xl mx-auto rounded-2xl border border-[#819478]/30 bg-[#FCFBF7]/90 backdrop-blur-md p-4 sm:p-5 shadow-sm">
            <p className="font-editorial text-lg sm:text-2xl leading-relaxed text-[#263D31]">
              <span className="font-serif text-[#819478] text-2xl sm:text-3xl leading-none select-none mr-1.5 font-bold">“</span>
              What if you could choose a place based on the environment you actually need?
              <span className="font-serif text-[#819478] text-2xl sm:text-3xl leading-none select-none ml-1.5 font-bold">”</span>
            </p>

            <div className="mt-3 pt-3 border-t border-[#E3E0D7]/80 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-[#75806B]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#819478] animate-pulse" />
                Click below to simulate real-time acoustic telemetry
              </span>

              <span className="font-bold uppercase tracking-wider text-[#263D31] bg-[#E3EBDD] px-2.5 py-0.5 rounded-full">
                Interactive Acoustic Engine
              </span>
            </div>
          </div>
        </header>

        {/* 3 Core Environment Conditions with Interactive State */}
        <div className="environment-stage relative mt-9 sm:mt-11">
          <div className="relative grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 lg:gap-5">
            {PLACES.map((place) => {
              const Icon = place.icon;
              const isSelected = activeMode === place.id;
              const currentDb = place.noise;

              return (
                <article
                  key={place.id}
                  onClick={() => setActiveMode(place.id)}
                  className={`environment-card min-w-0 cursor-pointer transition-all duration-300 transform ${
                    isSelected
                      ? "scale-[1.02] -translate-y-1"
                      : "hover:-translate-y-1 opacity-90 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`environment-surface relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#FCFBF7]/95 p-5 text-left transition-all duration-300 ${
                      isSelected
                        ? "shadow-[0_16px_36px_rgba(38,61,49,0.12)] ring-2"
                        : "shadow-[0_8px_24px_rgba(38,61,49,0.05)] hover:shadow-[0_12px_28px_rgba(38,61,49,0.08)]"
                    }`}
                    style={{
                      borderColor: isSelected ? place.color : `${place.color}35`,
                      outlineColor: place.color,
                      boxShadow: isSelected
                        ? `0 18px 38px ${place.accentGlow}`
                        : undefined,
                    }}
                  >
                    {/* Top color border line */}
                    <span
                      className="card-edge absolute inset-x-0 top-0 h-[3px] origin-left"
                      style={{
                        backgroundColor: place.color,
                      }}
                      aria-hidden="true"
                    />

                    {/* Ambient sheen sweep during reveal */}
                    <span
                      className="card-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[#E3EBDD]/70 to-transparent"
                      style={{
                        transform: "translateX(-110%) skewX(-18deg)",
                      }}
                      aria-hidden="true"
                    />

                    <div>
                      {/* Card Top: Icon, Label, and Active Ping */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span
                          className="condition-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs"
                          style={{
                            backgroundColor: place.soft,
                            color: place.color,
                          }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>

                        {isSelected ? (
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider text-white"
                            style={{ backgroundColor: place.color }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            Simulating
                          </span>
                        ) : (
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#919989]">
                            Click to test
                          </span>
                        )}
                      </div>

                      {/* Decibel Header with Live Equalizer */}
                      <div className="flex items-center justify-between gap-2 border-b border-[#E3E0D7]/70 pb-3 mb-3">
                        <div>
                          <p
                            className="font-mono text-[9px] font-bold uppercase tracking-[0.14em]"
                            style={{ color: place.color }}
                          >
                            {place.label}
                          </p>
                          <h3 className="mt-0.5 font-editorial text-2xl leading-tight text-[#252B26]">
                            {place.name}
                          </h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                            style={{ backgroundColor: place.soft, color: place.color }}
                          >
                            <span className="font-editorial text-xl font-bold leading-none">
                              {currentDb} dB
                            </span>
                            <AudioEqualizer mode={place.id} active={isSelected} />
                          </div>
                        </div>
                      </div>

                      {/* Details & Endurance Metric */}
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#525E4B]">
                          <Zap className="h-3 w-3 text-[#819478]" />
                          <span>{place.details}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#7B8471]">
                          <Clock className="h-3 w-3 text-[#819478]" />
                          <span>Cognitive Flow: <strong className="text-[#252B26]">{place.endurance}</strong></span>
                        </div>
                      </div>

                      <p className="border-t border-[#E3E7DA] pt-3 text-xs leading-relaxed text-[#6E7A65]">
                        {place.explanation}
                      </p>
                    </div>

                    {/* Progress Bar of Focus Match */}
                    <div className="mt-4 pt-3 border-t border-[#E3E0D7]/60">
                      <div className="flex justify-between items-center text-[9px] font-mono mb-1 text-[#7B8471]">
                        <span>Acoustic Compatibility</span>
                        <span className="font-bold text-[#252B26]">
                          {place.id === "quiet" ? "98%" : place.id === "caution" ? "74%" : "41%"}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#E5E5DC] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: place.id === "quiet" ? "98%" : place.id === "caution" ? "74%" : "41%",
                            backgroundColor: place.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Live Acoustic Telemetry Inspection Panel */}
        <div className="telemetry-panel mt-6 rounded-2xl border border-[#819478]/35 bg-[#FCFBF7]/95 p-4 sm:p-5 shadow-sm backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs text-white"
                style={{ backgroundColor: activePlace.color }}
              >
                <Volume2 className="h-5 w-5" />
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#252B26]">
                    {activePlace.simulationInfo.headline}
                  </h4>
                  <span
                    className="font-mono text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: activePlace.color }}
                  >
                    {activePlace.simulationInfo.flowScore}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#55634E] leading-relaxed mt-1">
                  {activePlace.simulationInfo.verdict}
                </p>

                <p className="text-[11px] font-mono text-[#7B8471] mt-1.5">
                  Optimal tasks: <strong className="text-[#263D31]">{activePlace.simulationInfo.recommendedFor}</strong>
                </p>
              </div>
            </div>

            <div className="shrink-0 self-start md:self-center">
              <a
                href="#discovery"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-full bg-[#263D31] text-[#FCFBF7] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#819478] hover:text-[#252B26] transition-all shadow-sm group"
              >
                <span>Find On Live Map</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="turning-footer mt-8 flex flex-col items-center text-center sm:mt-9">
          <p className="mb-4 max-w-xl text-[9px] font-mono uppercase tracking-[0.14em] text-[#7B8471]">
            Real-time sensory telemetry mapped across 340+ verified spaces in NYC
          </p>

          <a
            href="#discovery"
            className="turning-cta group inline-flex items-center space-x-2 rounded-full bg-[#263D31] px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-[#F4F1E8] shadow-md transition-all duration-300 hover:bg-[#819478] hover:text-[#252B26] hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#819478]"
          >
            <span>Explore Discovery Map</span>

            <ArrowDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transform-none" />
          </a>
        </footer>
      </div>
    </section>
  );
}