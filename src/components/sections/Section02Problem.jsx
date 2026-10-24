"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  VolumeX,
  UserX,
  WifiOff,
  ClockAlert,
  AlertTriangle,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PROBLEMS = [
  {
    id: "noise",
    number: "01",
    badge: "Problem 01 · Acoustic Friction",
    title: "Too noisy for focused work.",
    subtitle:
      "The cafe looked serene online. But between grinding burrs, echoing hard tiles, and ringing cellphones, your cognitive focus is fractured every three minutes.",
    image: "/images/story/noisy-cafe.jpg",
    statusAccent: "#C58C5A",
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
    statusAccent: "#B86E52",
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
    statusAccent: "#B86E52",
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
    statusAccent: "#C58C5A",
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

function SectionHeader() {
  return (
    <div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C58C5A]/30 bg-[#C58C5A]/10 px-3 py-1.5">
        <AlertTriangle className="h-3 w-3 text-[#AD764C]" />

        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#AD764C]">
          Section 02 · The Problem
        </span>
      </div>

      <h2 className="font-editorial text-3xl leading-[1.1] tracking-tight text-[#252B26] lg:text-[clamp(2rem,3vw,3rem)]">
        A place can look perfect.
        <span className="mt-1 block italic text-[#B68155]">
          And still be wrong for you.
        </span>
      </h2>
    </div>
  );
}

function Diagnostics({ problem }) {
  const Icon = problem.icon;

  return (
    <div className="diagnostics rounded-2xl border border-[#E3E0D7] bg-[#FCFBF7] p-4 shadow-[0_8px_25px_rgba(38,61,49,0.04)] xl:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#7E8478]">
          Diagnostic observation
        </span>

        <span className="font-mono text-[7px] uppercase tracking-wider text-[#8A8F83]">
          Illustrative scenario
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 border-b border-[#E3E0D7] pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${problem.statusAccent}18`,
              color: problem.statusAccent,
            }}
          >
            <Icon className="h-4 w-4" />
          </span>

          <p className="text-xs font-medium leading-relaxed text-[#454D43]">
            {problem.statusBadge}
          </p>
        </div>

        <div className="metric-reveal shrink-0 text-right">
          <p
            className="font-editorial text-2xl leading-none xl:text-3xl"
            style={{ color: problem.statusAccent }}
          >
            {problem.metric}
          </p>

          <p className="mt-1.5 max-w-[90px] font-mono text-[8px] uppercase leading-relaxed tracking-wider text-[#7E8478]">
            {problem.metricLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-4">
        {problem.telemetry.map((item) => (
          <div key={item.label} className="telemetry-item">
            <p className="font-mono text-[8px] uppercase leading-relaxed tracking-wider text-[#7E8478]">
              {item.label}
            </p>

            <p className="mt-1 text-[10px] font-semibold leading-relaxed text-[#394536]">
              {item.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Section02Problem() {
  const triggerRef = useRef(null);
  const desktopRef = useRef(null);
  const stageRef = useRef(null);
  const progressRef = useRef(null);

  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      media.add(
        "(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)",
        () => {
          const cards = Array.from(
            stageRef.current.querySelectorAll(".split-card")
          );

          const chapterMarkers = [];
          const hold = { value: 0 };

          let lastChapter = -1;

          gsap.set(progressRef.current, {
            scaleX: 0,
            transformOrigin: "left center",
          });

          cards.forEach((card, index) => {
            gsap.set(card, {
              yPercent: index === 0 ? 0 : 100,
              autoAlpha: index === 0 ? 1 : 0,
              zIndex: index + 1,
            });

            gsap.set(card.querySelector(".split-visual"), {
              left: "0%",
              width: "100%",
            });

            gsap.set(card.querySelector(".split-narrative"), {
              autoAlpha: 0,
              clipPath: "inset(0% 100% 0% 0%)",
            });

            gsap.set(card.querySelector(".scene-intro"), {
              autoAlpha: 1,
              y: 0,
            });

            gsap.set(card.querySelector(".scene-status"), {
              autoAlpha: 0,
              y: 12,
            });
          });

          const timeline = gsap.timeline({
            onUpdate: () => {
              const time = timeline.time();

              let chapter = 0;

              chapterMarkers.forEach((marker) => {
                if (time >= marker.time) chapter = marker.chapter;
              });

              if (chapter !== lastChapter) {
                lastChapter = chapter;
                setActiveChapter(chapter);
              }

              gsap.set(progressRef.current, {
                scaleX: timeline.progress(),
              });
            },
            scrollTrigger: {
              trigger: desktopRef.current,
              start: "top top",
              end: () => `+=${window.innerHeight * 5}`,
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          const addSplitReveal = (card, start) => {
            const visual = card.querySelector(".split-visual");
            const narrative = card.querySelector(".split-narrative");
            const intro = card.querySelector(".scene-intro");
            const image = card.querySelector(".scene-image");
            const status = card.querySelector(".scene-status");

            // First see the place; then uncover its story.
            timeline
              .to(
                intro,
                {
                  autoAlpha: 0,
                  y: -18,
                  duration: 0.35,
                  ease: "power2.in",
                },
                start
              )
              .to(
                visual,
                {
                  left: "52%",
                  width: "48%",
                  duration: 1.1,
                  ease: "power3.inOut",
                },
                start + 0.08
              )
              .to(
                narrative,
                {
                  autoAlpha: 1,
                  clipPath: "inset(0% 0% 0% 0%)",
                  duration: 0.95,
                  ease: "power3.inOut",
                },
                start + 0.2
              )
              .fromTo(
                image,
                {
                  scale: 1.08,
                },
                {
                  scale: 1,
                  duration: 1.2,
                  ease: "power2.out",
                  immediateRender: false,
                },
                start
              )
              .fromTo(
                card.querySelectorAll(".story-reveal"),
                {
                  x: -20,
                  opacity: 0,
                },
                {
                  x: 0,
                  opacity: 1,
                  duration: 0.65,
                  stagger: 0.09,
                  ease: "power3.out",
                  immediateRender: false,
                },
                start + 0.45
              )
              .fromTo(
                card.querySelector(".metric-reveal"),
                {
                  y: 12,
                  opacity: 0,
                },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  ease: "power3.out",
                  immediateRender: false,
                },
                start + 0.85
              )
              .fromTo(
                card.querySelectorAll(".telemetry-item"),
                {
                  y: 10,
                  opacity: 0,
                },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.45,
                  stagger: 0.08,
                  ease: "power2.out",
                  immediateRender: false,
                },
                start + 0.95
              )
              .to(
                status,
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.6,
                  ease: "power3.out",
                },
                start + 0.8
              );
          };

          // Chapter 01 starts as a full-image scene.
          timeline.to(hold, {
            value: 1,
            duration: 0.35,
            ease: "none",
          });

          addSplitReveal(cards[0], 0.35);

          timeline.to(hold, {
            value: 2,
            duration: 0.9,
            ease: "none",
          });

          cards.forEach((card, index) => {
            if (index === 0) return;

            const previous = cards[index - 1];
            const transitionStart = timeline.duration();

            chapterMarkers.push({
              chapter: index,
              time: transitionStart + 0.5,
            });

            // Preserve the original bottom-to-top card movement.
            timeline
              .to(
                previous,
                {
                  yPercent: -100,
                  autoAlpha: 0,
                  duration: 1,
                  ease: "power2.inOut",
                },
                transitionStart
              )
              .to(
                card,
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 1,
                  ease: "power2.inOut",
                },
                transitionStart
              );

            // Brief full-photo moment before the split transformation.
            const splitStart = transitionStart + 1.25;

            addSplitReveal(card, splitStart);

            // Reading space after all details have appeared.
            timeline.to(hold, {
              value: index + 3,
              duration: 0.9,
              ease: "none",
            });
          });
        }
      );
    }, triggerRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="problem"
      ref={triggerRef}
      className="relative z-20 w-full rounded-t-[28px] border-t border-[#E3E0D7] bg-[#F4F1E8] shadow-[0_-24px_50px_rgba(15,28,20,0.35)] sm:rounded-t-[36px]"
    >
      {/* Desktop cinematic story */}
      <div
        ref={desktopRef}
        className="desktop-story relative h-[100svh] overflow-hidden px-8 py-7 xl:px-14 xl:py-9"
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          {/* Stable section header */}
          <header className="flex shrink-0 items-end justify-between gap-8 border-b border-[#DFDDD3] pb-5">
            <SectionHeader />

            <div className="shrink-0 pb-1 text-right">
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.18em] text-[#7D8377]">
                Four places. Four frictions.
              </p>

              <div className="flex items-center justify-end gap-4">
                <span className="font-mono text-lg text-[#263D31]">
                  <span className="font-semibold">
                    {String(activeChapter + 1).padStart(2, "0")}
                  </span>

                  <span className="text-[#9B9F93]"> / 04</span>
                </span>

                <div className="flex gap-1.5">
                  {PROBLEMS.map((problem, index) => (
                    <span
                      key={problem.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${activeChapter === index
                          ? "w-7 bg-[#263D31]"
                          : "w-2 bg-[#DADDD1]"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Vertical card stage */}
          <div
            ref={stageRef}
            className="relative my-5 min-h-0 flex-1 overflow-hidden rounded-[26px]"
          >
            {PROBLEMS.map((problem, index) => {
              const Icon = problem.icon;

              return (
                <article
                  key={problem.id}
                  className="split-card absolute inset-0 overflow-hidden rounded-[26px] border border-[#DEDCD1] bg-[#F4F1E8]"
                  aria-hidden={activeChapter !== index}
                  style={{
                    opacity: index === 0 ? 1 : 0,
                    visibility: index === 0 ? "visible" : "hidden",
                  }}
                >
                  {/* Narrative revealed behind the moving image */}
                  <div
                    className="split-narrative absolute inset-y-0 left-0 flex w-[52%] flex-col justify-center py-5 pl-5 pr-7 xl:pl-7 xl:pr-10"
                    style={{
                      opacity: 0,
                      visibility: "hidden",
                    }}
                  >
                    <div className="story-reveal mb-3 flex items-center gap-3">
                      <span
                        className="h-px w-7"
                        style={{
                          backgroundColor: problem.statusAccent,
                        }}
                      />

                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7D8377]">
                        Behind the first impression
                      </span>
                    </div>

                    <p
                      className="story-reveal mb-2 font-mono text-[9px] font-semibold uppercase leading-relaxed tracking-[0.12em]"
                      style={{ color: problem.statusAccent }}
                    >
                      {problem.badge}
                    </p>

                    <h3 className="story-reveal mb-4 font-editorial text-[clamp(1.65rem,2.65vw,2.65rem)] leading-[1.08] tracking-tight text-[#252B26]">
                      {problem.title}
                    </h3>

                    <p className="story-reveal mb-5 text-[13px] leading-[1.8] text-[#6C7168] xl:text-sm">
                      {problem.subtitle}
                    </p>

                    <div className="story-reveal">
                      <Diagnostics problem={problem} />
                    </div>
                  </div>

                  {/* Starts full-width, then transforms into the right panel */}
                  <div className="split-visual absolute inset-y-0 left-0 z-10 w-full overflow-hidden rounded-[24px] bg-[#263D31]">
                    <Image
                      src={problem.image}
                      alt={problem.title}
                      fill
                      className="scene-image object-cover"
                      sizes="(min-width: 1024px) 90vw, 100vw"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14231A]/90 via-[#14231A]/10 to-[#14231A]/30" />

                    <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#14231A]/35 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white backdrop-blur-md">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: problem.statusAccent,
                          }}
                        />
                        Field story {problem.number}
                      </span>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#14231A]/30 text-white backdrop-blur-md">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Full-image opening chapter title */}
                    <div className="scene-intro absolute bottom-0 left-0 right-0 p-8 xl:p-10">
                      <div className="mb-4 flex items-end gap-5">
                        <span className="font-editorial text-[clamp(5rem,10vw,9rem)] leading-[0.8] tracking-tighter text-[#FCFBF7]/90">
                          {problem.number}
                        </span>

                        <span className="mb-1 h-px w-16 bg-[#D4AA85]" />
                      </div>

                      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AA85]">
                        First impressions don&apos;t tell the whole story
                      </p>

                      <h3
                        className="max-w-2xl font-editorial text-3xl leading-tight text-[#FCFBF7] xl:text-4xl"
                        aria-hidden="true"
                      >
                        {problem.title}
                      </h3>
                    </div>

                    {/* Remains on the final split image */}
                    <div
                      className="scene-status absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-[#14231A]/60 p-4 backdrop-blur-md"
                      style={{
                        opacity: 0,
                        visibility: "hidden",
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: problem.statusAccent,
                          }}
                        />

                        <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#E6EADD]">
                          Unresolved friction
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed text-white/85">
                        {problem.statusBadge}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Scroll progress */}
          <footer className="shrink-0">
            <div className="mb-4 h-px overflow-hidden bg-[#DCDDD2]">
              <div
                ref={progressRef}
                className="h-full w-full origin-left bg-[#B68155]"
                style={{
                  transform: "scaleX(0)",
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DADDD1] text-[#819478]">
                  <ArrowDown className="h-3 w-3" />
                </span>

                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#71796B]">
                  Scroll to see beyond the first impression
                </span>
              </div>

              <a
                href="#turning-point"
                className="group flex items-center gap-2 font-mono text-[10px] font-semibold text-[#263D31]"
              >
                <span>Next: The Turning Point</span>

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile / short-screen / reduced-motion layout */}
      <div className="stacked-story px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <SectionHeader />

          <div className="mt-9 space-y-8">
            {PROBLEMS.map((problem) => {
              const Icon = problem.icon;

              return (
                <article
                  key={problem.id}
                  className="overflow-hidden rounded-[26px] border border-[#DEDCD2] bg-[#FCFBF7] shadow-sm"
                >
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#263D31]">
                    <Image
                      src={problem.image}
                      alt={problem.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 672px, 100vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#14231A]/80 via-transparent to-transparent" />

                    <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                      <span className="rounded-full border border-white/20 bg-[#14231A]/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur-md">
                        Chapter {problem.number} / 04
                      </span>

                      <Icon className="h-4 w-4 text-white" />
                    </div>

                    <span className="absolute bottom-4 left-5 font-editorial text-7xl leading-none text-white/85">
                      {problem.number}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p
                      className="mb-2 font-mono text-[9px] font-semibold uppercase leading-relaxed tracking-[0.12em]"
                      style={{
                        color: problem.statusAccent,
                      }}
                    >
                      {problem.badge}
                    </p>

                    <h3 className="mb-3 font-editorial text-2xl leading-tight tracking-tight text-[#252B26] sm:text-3xl">
                      {problem.title}
                    </h3>

                    <p className="mb-5 text-sm leading-relaxed text-[#6C7168]">
                      {problem.subtitle}
                    </p>

                    <Diagnostics problem={problem} />
                  </div>
                </article>
              );
            })}
          </div>

          <a
            href="#turning-point"
            className="mt-8 flex items-center justify-between rounded-2xl border border-[#DADDD1] px-5 py-4 font-mono text-xs text-[#263D31]"
          >
            <span>Next: The Turning Point</span>

            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <style jsx>{`
        .desktop-story {
          display: none;
        }

        .stacked-story {
          display: block;
        }

        @media (min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference) {
          .desktop-story {
            display: block;
          }

          .stacked-story {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}