"use client";

import { useEffect, useRef } from "react";
import {
  Sparkles,
  MapPin,
  ArrowDown,
  Radio,
  Volume2,
  Plug,
  Clock3,
  Users,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TurningPointDepth from "@/components/three/TurningPointDepth";

const PLACES = [
  {
    id: "quiet",
    name: "The Solitude Atelier",
    label: "Quiet Sanctuary",
    noise: "36 dB",
    details: "98% Focus Match · 100% Sockets",
    description: "A quieter setting for focused work.",
    accent: "#263D31",
    soft: "#E3EBDD",
    icon: MapPin,
    detailIcon: Plug,
  },
  {
    id: "variable",
    name: "Amber Courtyard",
    label: "Caution Variable",
    noise: "58 dB",
    details: "74% Focus Match · Morning Only",
    description: "Conditions can change with the time.",
    accent: "#986334",
    soft: "#F3E9DA",
    icon: Radio,
    detailIcon: Clock3,
  },
  {
    id: "crowded",
    name: "Monocle Commons",
    label: "Crowded Warning",
    noise: "67 dB",
    details: "89% Occupancy · High Echo",
    description: "A busier setting may interrupt focus.",
    accent: "#A15D47",
    soft: "#F2E5DF",
    icon: Users,
    detailIcon: Users,
  },
];

function createContour(radius, phase) {
  const points = [];

  for (let i = 0; i < 90; i += 1) {
    const angle = (i / 90) * Math.PI * 2;

    const offset =
      1 +
      Math.sin(angle * 3 + phase) * 0.07 +
      Math.cos(angle * 5 - phase) * 0.035;

    const x = 500 + Math.cos(angle) * radius * offset;
    const y = 300 + Math.sin(angle) * radius * 0.56 * offset;

    points.push(
      `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`
    );
  }

  return `${points.join(" ")} Z`;
}

const CONTOURS = Array.from({ length: 8 }, (_, index) =>
  createContour(85 + index * 47, index * 0.12)
);

function PlaceCard({ place, index }) {
  const Icon = place.icon;
  const DetailIcon = place.detailIcon;

  return (
    <article className="place-card relative min-w-0 pl-10 md:pl-0">
      {/* Coordinate node */}
      <div className="absolute left-0 top-6 flex h-7 w-7 items-center justify-center md:relative md:left-auto md:top-auto md:mx-auto md:mb-4">
        <span
          className="node-halo absolute inset-0 rounded-full border opacity-40"
          style={{
            borderColor: place.accent,
            backgroundColor: place.soft,
          }}
          aria-hidden="true"
        />

        <span
          className="coordinate-dot relative h-2 w-2 rounded-full"
          style={{ backgroundColor: place.accent }}
          aria-hidden="true"
        />
      </div>

      <div className="card-shell h-full">
        <div
          className="relative h-full overflow-hidden rounded-[22px] border bg-[#FCFBF7]/95 p-5 shadow-[0_10px_28px_rgba(38,61,49,0.05)] sm:p-6"
          style={{
            borderColor: `${place.accent}35`,
          }}
        >
          <div
            className="card-accent absolute inset-x-0 top-0 h-[2px] origin-left"
            style={{ backgroundColor: place.accent }}
            aria-hidden="true"
          />

          <div className="mb-4 flex items-center justify-between">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                color: place.accent,
                backgroundColor: place.soft,
              }}
            >
              <Icon className="h-4 w-4" />
            </span>

            <span className="font-mono text-[8px] tracking-[0.12em] text-[#929A88]">
              NODE 0{index + 1}
            </span>
          </div>

          <p
            className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: place.accent }}
          >
            {place.label}
          </p>

          <h3 className="font-editorial text-[23px] leading-tight tracking-tight text-[#252B26]">
            {place.name}
          </h3>

          <div className="my-4 flex items-center justify-between gap-3 rounded-xl bg-[#F2F5ED] px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[#78836D]">
              <Volume2 className="h-3 w-3" />

              <span className="font-mono text-[8px] uppercase tracking-wider">
                Demo noise
              </span>
            </span>

            <span
              className="font-editorial text-2xl"
              style={{ color: place.accent }}
            >
              {place.noise}
            </span>
          </div>

          <p className="flex items-start gap-2 text-[10px] leading-relaxed text-[#68755D]">
            <DetailIcon className="mt-0.5 h-3 w-3 shrink-0" />
            <span>{place.details}</span>
          </p>

          <p className="mt-3 border-t border-[#E4E8DB] pt-3 text-xs leading-relaxed text-[#7B8471]">
            {place.description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function Section03TurningPoint() {
  const sectionRef = useRef(null);
  const depthProgressRef = useRef({ value: 0 });
  const depthApiRef = useRef(null);

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
          const { desktop, reduceMotion } = context.conditions;
          const select = gsap.utils.selector(sectionRef);

          if (reduceMotion) return;

          const header = gsap.timeline({
            scrollTrigger: {
              trigger: ".turning-header",
              start: "top 90%",
              end: "top 35%",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });

          header
            .from(
              select(".turning-badge"),
              {
                y: 10,
                opacity: 0.3,
                duration: 0.5,
                ease: "power2.out",
              },
              0
            )
            .fromTo(
              select(".title-line"),
              {
                yPercent: 108,
                opacity: 0,
              },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.9,
                stagger: 0.1,
                ease: "power3.out",
              },
              0.05
            )
            .from(
              select(".turning-copy"),
              {
                y: 12,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
              },
              0.35
            );

          gsap.fromTo(
            select(".contour-fallback"),
            {
              scale: 0.92,
              opacity: 0.1,
            },
            {
              scale: 1.06,
              opacity: 0.22,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
            }
          );

          // Updates the optional Three.js layer without React rerenders.
          gsap.fromTo(
            depthProgressRef.current,
            { value: 0 },
            {
              value: 1,
              ease: "none",
              onUpdate: () => {
                depthApiRef.current?.render();
              },
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
                invalidateOnRefresh: true,
              },
            }
          );

          const cards = select(".place-card");

          if (desktop) {
            const connection = gsap.timeline({
              scrollTrigger: {
                trigger: ".coordinates-stage",
                start: "top 92%",
                end: "top 35%",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });

            connection.fromTo(
              select(".desktop-connector"),
              {
                strokeDashoffset: 1,
              },
              {
                strokeDashoffset: 0,
                duration: 1.3,
                ease: "none",
              },
              0
            );

            cards.forEach((card, index) => {
              const start = index * 0.33;

              connection
                .fromTo(
                  card.querySelector(".coordinate-dot"),
                  { scale: 0.3, opacity: 0 },
                  {
                    scale: 1,
                    opacity: 1,
                    duration: 0.35,
                    ease: "power2.out",
                  },
                  start
                )
                .fromTo(
                  card.querySelector(".node-halo"),
                  { scale: 0.6, opacity: 0 },
                  {
                    scale: 1,
                    opacity: 0.4,
                    duration: 0.5,
                    ease: "power2.out",
                  },
                  start
                )
                .fromTo(
                  card.querySelector(".card-shell"),
                  { y: 20, scale: 0.98, opacity: 0 },
                  {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power3.out",
                  },
                  start + 0.08
                );
            });
          } else {
            gsap.from(
              select(".mobile-connector"),
              {
                scaleY: 0,
                transformOrigin: "top center",
                ease: "none",
                scrollTrigger: {
                  trigger: ".coordinates-stage",
                  start: "top 85%",
                  end: "bottom 65%",
                  scrub: 0.65,
                },
              }
            );

            cards.forEach((card) => {
              const reveal = gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 93%",
                  toggleActions: "play none none reverse",
                },
              });

              reveal
                .from(card.querySelector(".card-shell"), {
                  y: 20,
                  opacity: 0,
                  duration: 0.75,
                  ease: "power3.out",
                })
                .from(
                  card.querySelector(".coordinate-dot"),
                  {
                    scale: 0,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.out",
                  },
                  0
                )
                .from(
                  card.querySelector(".card-accent"),
                  {
                    scaleX: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                  },
                  0.15
                );
            });
          }

          // The original CTA remains visible and clickable.
          gsap.fromTo(
            select(".turning-cta"),
            { y: 10, opacity: 0.7 },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".turning-footer",
                start: "top 98%",
                end: "top 82%",
                scrub: 0.4,
              },
            }
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
      className="relative z-20 isolate flex min-h-[92svh] w-full flex-col items-center justify-center overflow-hidden border-t border-[#E3E0D7] bg-[#F4F1E8] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      {/* Optional terrain enhancement, never a functional map */}
      <TurningPointDepth
        progressRef={depthProgressRef}
        apiRef={depthApiRef}
      />

      {/* Always available on mobile and when WebGL is unavailable */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid slice"
          className="contour-fallback h-full w-full text-[#819478] opacity-15"
          fill="none"
        >
          {CONTOURS.map((path, index) => (
            <path
              key={index}
              d={path}
              stroke="currentColor"
              strokeWidth={index % 3 === 0 ? 1 : 0.65}
            />
          ))}
        </svg>
      </div>

      {/* Keeps text readable over the terrain; always light */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(244,241,232,0.92) 0%, rgba(244,241,232,0.72) 30%, rgba(244,241,232,0.8) 70%, rgba(244,241,232,0.96) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl">
        <header className="turning-header mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="turning-badge mb-5 inline-flex items-center gap-2 rounded-full border border-[#819478]/40 bg-[#FCFBF7] px-3.5 py-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#263D31]" />

            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#263D31] sm:text-[11px] sm:tracking-[0.22em]">
              Section 03 · The Turning Point
            </span>
          </div>

          <h2 className="font-editorial text-[clamp(2.25rem,5.8vw,4.5rem)] leading-[1.08] tracking-tight text-[#252B26]">
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="title-line block">
                What if you knew
              </span>
            </span>

            <span className="-mt-[0.08em] block overflow-hidden pb-[0.15em]">
              <span className="title-line block italic text-[#60774F]">
                before you arrived?
              </span>
            </span>
          </h2>

          <p className="turning-copy mt-3 max-w-2xl font-editorial text-lg leading-relaxed text-[#263D31]/80 sm:text-2xl">
            “What if you could choose a place based on the environment
            you actually need?”
          </p>
        </header>

        <div className="coordinates-stage relative mt-8 sm:mt-10">
          {/* Desktop connection between the three nodes */}
          <svg
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-7 w-full md:block"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="desktop-connector"
              d="M166 30 C270 5 390 55 500 30 S720 5 834 30"
              stroke="#819478"
              strokeWidth="1.2"
              pathLength="1"
              strokeDasharray="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Mobile connection along the stacked cards */}
          <div
            className="mobile-connector pointer-events-none absolute bottom-7 left-[13px] top-7 w-px bg-[#819478]/40 md:hidden"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3 md:gap-4 lg:gap-5">
            {PLACES.map((place, index) => (
              <PlaceCard
                key={place.id}
                place={place}
                index={index}
              />
            ))}
          </div>
        </div>

        <footer className="turning-footer mt-7 flex flex-col items-center text-center sm:mt-8">
          <p className="mb-5 text-[9px] leading-relaxed text-[#7B8471]">
            Illustrative places and values—not live noise, occupancy
            or suitability readings.
          </p>

          {/* Original button treatment preserved */}
          <a
            href="#discovery"
            className="turning-cta group inline-flex items-center space-x-2 rounded-full bg-[#263D31] px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-[#F4F1E8] shadow-md transition-colors duration-300 hover:bg-[#819478] hover:text-[#252B26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#819478]"
          >
            <span>Reveal Live Map Discovery</span>

            <ArrowDown className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transform-none" />
          </a>
        </footer>
      </div>
    </section>
  );
}