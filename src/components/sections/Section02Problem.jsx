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

const DESKTOP_QUERY = "(min-width: 1024px)";

function SectionHeader() {
  return (
    <div>
      <div className="mb-2.5 inline-flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#819478]" />
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#819478]">
          The Invisible Frictions
        </span>
      </div>

      <h2 className="font-editorial text-3xl leading-[1.1] tracking-tight text-[#252B26] lg:text-[clamp(2rem,3vw,3rem)]">
        A place can look perfect.
        <span className="mt-1 block italic text-[#718665]">
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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#7E8478]">
          Diagnostic observation
        </span>

        <span className="font-mono text-[7px] uppercase tracking-wider text-[#8A8F83]">
          Illustrative scenario
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-[#E3E0D7] pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${problem.statusAccent}18`,
              color: problem.statusAccent,
            }}
          >
            <Icon className="h-4 w-4" />
          </span>

          <p className="text-[11px] font-medium leading-relaxed text-[#454D43]">
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
          <div key={item.label} className="telemetry-item min-w-0">
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
        {
          desktop: DESKTOP_QUERY,
          compact: "(max-width: 1023px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions;

          if (reduceMotion) return;

          if (desktop) {
            const cards = Array.from(
              stageRef.current.querySelectorAll(".split-card")
            );

            const chapterMarkers = [];
            const hold = { value: 0 };

            let lastChapter = -1;

            const setProgress = gsap.quickSetter(
              progressRef.current,
              "scaleX"
            );

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

              // Keep the image layer full-size throughout the split.
              gsap.set(card.querySelector(".split-visual"), {
                clipPath: "inset(0% 0% 0% 0% round 24px)",
              });

              gsap.set(card.querySelector(".scene-image"), {
                xPercent: 0,
                scale: 1.06,
                transformOrigin: "center center",
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
                y: 10,
              });
            });

            const timeline = gsap.timeline({
              onUpdate: () => {
                const time = timeline.time();

                let chapter = 0;

                chapterMarkers.forEach((marker) => {
                  if (time >= marker.time) {
                    chapter = marker.chapter;
                  }
                });

                if (chapter !== lastChapter) {
                  lastChapter = chapter;
                  setActiveChapter(chapter);
                }

                setProgress(timeline.progress());
              },
              scrollTrigger: {
                trigger: desktopRef.current,
                start: "top top",
                end: () => `+=${window.innerHeight * 5.5}`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            const addSplitReveal = (card, start) => {
              const visual = card.querySelector(".split-visual");
              const narrative = card.querySelector(".split-narrative");
              const introElements = card.querySelectorAll(".scene-intro, .scene-overlay");
              const image = card.querySelector(".scene-image");
              const status = card.querySelector(".scene-status");
              const top = card.querySelector(".scene-top");

              timeline
                .to(
                  introElements,
                  {
                    autoAlpha: 0,
                    y: -12,
                    duration: 0.45,
                    ease: "power2.inOut",
                  },
                  start
                )
                .to(
                  visual,
                  {
                    clipPath:
                      "inset(0% 0% 0% 52% round 24px)",
                    duration: 1.4,
                    ease: "power2.inOut",
                  },
                  start + 0.08
                )
                .to(
                  image,
                  {
                    xPercent: 26,
                    scale: 1,
                    duration: 1.55,
                    ease: "power2.inOut",
                  },
                  start + 0.08
                )
                .fromTo(
                  top,
                  {
                    left: "20px",
                  },
                  {
                    left: "calc(52% + 20px)",
                    duration: 1.4,
                    ease: "power2.inOut",
                    immediateRender: false,
                  },
                  start + 0.08
                )
                .to(
                  narrative,
                  {
                    autoAlpha: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1.1,
                    ease: "power2.inOut",
                  },
                  start + 0.25
                )
                .fromTo(
                  card.querySelectorAll(".story-reveal"),
                  {
                    x: -14,
                    opacity: 0,
                  },
                  {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power3.out",
                    immediateRender: false,
                  },
                  start + 0.6
                )
                .fromTo(
                  card.querySelector(".metric-reveal"),
                  {
                    y: 8,
                    opacity: 0,
                  },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    immediateRender: false,
                  },
                  start + 1
                )
                .fromTo(
                  card.querySelectorAll(".telemetry-item"),
                  {
                    y: 8,
                    opacity: 0,
                  },
                  {
                    y: 0,
                    opacity: 1,
                    duration: 0.55,
                    stagger: 0.08,
                    ease: "power3.out",
                    immediateRender: false,
                  },
                  start + 1.1
                )
                .to(
                  status,
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power3.out",
                  },
                  start + 1.05
                );
            };

            // First image has a short establishing moment.
            timeline.to(hold, {
              value: 1,
              duration: 0.4,
              ease: "none",
            });

            addSplitReveal(cards[0], 0.4);

            timeline.to(hold, {
              value: 2,
              duration: 0.85,
              ease: "none",
            });

            cards.forEach((card, index) => {
              if (index === 0) return;

              const previous = cards[index - 1];
              const transitionStart = timeline.duration();

              chapterMarkers.push({
                chapter: index,
                time: transitionStart + 0.6,
              });

              // Preserve bottom-to-top card transitions.
              timeline
                .to(
                  previous,
                  {
                    yPercent: -100,
                    autoAlpha: 0,
                    duration: 1.2,
                    ease: "power2.inOut",
                  },
                  transitionStart
                )
                .to(
                  card,
                  {
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: 1.2,
                    ease: "power2.inOut",
                  },
                  transitionStart
                );

              addSplitReveal(
                card,
                transitionStart + 1.45
              );

              timeline.to(hold, {
                value: index + 3,
                duration: 0.85,
                ease: "none",
              });
            });

            return;
          }

          // Mobile and short-height screen animations.
          const mobileCards =
            triggerRef.current.querySelectorAll(".mobile-story-card");

          mobileCards.forEach((card) => {
            const frame = card.querySelector(".mobile-story-image");
            const image = card.querySelector(".mobile-parallax-image");
            const chapter = card.querySelector(".mobile-chapter-number");
            const copy = card.querySelector(".mobile-card-copy");

            gsap.fromTo(
              frame,
              {
                clipPath: "inset(7% 5% 7% 5% round 28px)",
              },
              {
                clipPath: "inset(0% 0% 0% 0% round 0px)",
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top 95%",
                  end: "top 40%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              }
            );

            gsap.fromTo(
              image,
              {
                scale: 1.14,
                yPercent: 2,
              },
              {
                scale: 1.08,
                yPercent: -2,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              }
            );

            gsap.fromTo(
              chapter,
              {
                y: 18,
                opacity: 0.3,
              },
              {
                y: 0,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top 85%",
                  end: "top 35%",
                  scrub: 0.65,
                },
              }
            );

            gsap.fromTo(
              Array.from(copy.children),
              {
                y: 18,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: copy,
                  start: "top 92%",
                  toggleActions: "play none none reverse",
                },
              }
            );
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
      {/* Desktop pinned story */}
      <div
        ref={desktopRef}
        className="desktop-story relative h-[100svh] overflow-hidden px-6 py-4 xl:px-14 xl:py-7"
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          <header className="flex shrink-0 items-end justify-between gap-6 border-b border-[#DFDDD3] pb-3 xl:pb-5">
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
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeChapter === index
                          ? "w-7 bg-[#263D31]"
                          : "w-2 bg-[#DADDD1]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Bottom-to-top card stage */}
          <div
            ref={stageRef}
            className="relative my-3 min-h-0 flex-1 overflow-hidden rounded-[26px] xl:my-5"
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
                  {/* Story panel */}
                  <div
                    className="split-narrative absolute inset-y-0 left-0 w-[52%] overflow-y-auto overscroll-contain"
                    style={{
                      opacity: 0,
                      visibility: "hidden",
                    }}
                  >
                    <div className="flex min-h-full flex-col justify-center py-5 pl-5 pr-7 xl:pl-7 xl:pr-10">
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
                        style={{
                          color: problem.statusAccent,
                        }}
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
                  </div>

                  {/* Full-size visual layer, revealed using clipping */}
                  <div className="split-visual absolute inset-0 z-10 overflow-hidden rounded-[24px] bg-[#1B2D23]">
                    <Image
                      src={problem.image}
                      alt={problem.title}
                      fill
                      className="scene-image object-cover"
                      sizes="(min-width: 1024px) 90vw, 100vw"
                    />

                    {/* Feathered vignette: deep contrast behind text, multi-stop organic blur-fade toward center with zero hard lines */}
                    <div
                      className="scene-overlay pointer-events-none absolute inset-0 z-[5]"
                      style={{
                        background: `
                          radial-gradient(ellipse 95% 85% at 0% 100%, rgba(7, 15, 10, 0.95) 0%, rgba(7, 15, 10, 0.88) 25%, rgba(7, 15, 10, 0.55) 50%, rgba(7, 15, 10, 0.18) 72%, transparent 92%),
                          linear-gradient(90deg, rgba(7, 15, 10, 0.93) 0%, rgba(7, 15, 10, 0.88) 18%, rgba(7, 15, 10, 0.72) 30%, rgba(7, 15, 10, 0.44) 44%, rgba(7, 15, 10, 0.20) 56%, rgba(7, 15, 10, 0.06) 66%, rgba(7, 15, 10, 0.01) 74%, transparent 82%)
                        `,
                      }}
                    />

                    <div className="scene-top absolute left-5 right-5 top-5 flex items-center justify-between gap-3 z-20">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-[#101D15]/60 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[#FCFBF7] backdrop-blur-md shadow-sm">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{
                            backgroundColor: problem.statusAccent,
                          }}
                        />
                        Field story {problem.number}
                      </span>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#101D15]/50 text-white backdrop-blur-md shadow-sm">
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Chapter opening text — strictly confined to left column (max 48% width) */}
                    <div className="scene-intro absolute bottom-0 left-0 w-full sm:w-[60%] lg:w-[48%] p-8 xl:p-10 pt-28 z-20">
                      <div className="mb-4 flex items-end gap-5">
                        <span className="font-editorial text-[clamp(5rem,10vw,9rem)] leading-[0.8] tracking-tighter text-[#FCFBF7] drop-shadow-[0_6px_24px_rgba(0,0,0,0.9)]">
                          {problem.number}
                        </span>

                        <span className="mb-2 h-[1.5px] w-16 bg-[#819478] shadow-sm" />
                      </div>

                      <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#E3EBDD] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                        First impressions don&apos;t tell the whole story
                      </p>

                      <h3
                        className="max-w-xl font-editorial text-3xl leading-tight text-[#FCFBF7] xl:text-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                        aria-hidden="true"
                      >
                        {problem.title}
                      </h3>
                    </div>

                    {/* Status within the final right-hand image area */}
                    <div
                      className="scene-status absolute bottom-5 right-5 rounded-2xl border border-white/20 bg-[#14231A]/60 p-4 backdrop-blur-md"
                      style={{
                        left: "calc(52% + 20px)",
                        opacity: 0,
                        visibility: "hidden",
                      }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
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

          {/* Fixed story footer */}
          <footer className="shrink-0">
            <div className="mb-4 h-px overflow-hidden bg-[#DCDDD2]">
              <div
                ref={progressRef}
                className="h-full w-full origin-left bg-[#819478]"
                style={{
                  transform: "scaleX(0)",
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DADDD1] text-[#819478]">
                  <ArrowDown className="h-3 w-3" />
                </span>

                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#71796B]">
                  Scroll to see beyond the first impression
                </span>
              </div>

              <a
                href="#turning-point"
                className="group flex shrink-0 items-center gap-2 font-mono text-[10px] font-semibold text-[#263D31]"
              >
                <span>Next: The Turning Point</span>

                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
              </a>
            </div>
          </footer>
        </div>
      </div>

      {/* Animated mobile and compact-screen story */}
      <div className="stacked-story px-5 py-12 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <SectionHeader />

          <div className="mt-9 space-y-8">
            {PROBLEMS.map((problem) => {
              const Icon = problem.icon;

              return (
                <article
                  key={problem.id}
                  className="mobile-story-card overflow-hidden rounded-[26px] border border-[#DEDCD2] bg-[#FCFBF7] shadow-[0_10px_30px_rgba(38,61,49,0.05)]"
                >
                  <div className="mobile-story-image relative aspect-[16/11] overflow-hidden bg-[#263D31]">
                    <Image
                      src={problem.image}
                      alt={problem.title}
                      fill
                      className="mobile-parallax-image object-cover"
                      sizes="(min-width: 768px) 672px, 100vw"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0E1A13]/95 via-[#14231A]/55 to-[#14231A]/20" />

                    <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
                      <span className="rounded-full border border-white/20 bg-[#14231A]/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white backdrop-blur-md">
                        Chapter {problem.number} / 04
                      </span>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#14231A]/35 text-white backdrop-blur-md">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <span className="mobile-chapter-number font-editorial text-7xl leading-none tracking-tighter text-white/95 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
                        {problem.number}
                      </span>

                      <span className="mb-1 max-w-[150px] text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.14em] text-[#E3EBDD] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Behind the first impression
                      </span>
                    </div>
                  </div>

                  <div className="mobile-card-copy p-5 sm:p-6">
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
            className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-[#DADDD1] bg-[#EAEDE3]/40 px-5 py-4 font-mono text-xs text-[#263D31]"
          >
            <span>Next: The Turning Point</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
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

        .split-narrative {
          scrollbar-width: thin;
          scrollbar-color: #c6ccbc transparent;
        }

        @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
          .desktop-story {
            display: block;
          }

          .stacked-story {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .desktop-story {
            display: none;
          }

          .stacked-story {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}
