"use client";

import { useEffect, useRef } from "react";
import {
  Sparkles,
  MapPin,
  ArrowDown,
  Radio,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PLACES = [
  {
    id: "quiet",
    name: "The Solitude Atelier",
    label: "Quiet Sanctuary",
    noise: "36 dB",
    details: "98% Focus Match · 100% Sockets",
    explanation: "A quieter setting for focused work.",
    color: "#263D31",
    soft: "#E3EBDD",
    icon: MapPin,
  },
  {
    id: "caution",
    name: "Amber Courtyard",
    label: "Caution Variable",
    noise: "58 dB",
    details: "74% Focus Match · Morning Only",
    explanation: "Suitability can change with the time.",
    color: "#986334",
    soft: "#F3E8D9",
    icon: Radio,
  },
  {
    id: "crowded",
    name: "Monocle Commons",
    label: "Crowded Warning",
    noise: "67 dB",
    details: "89% Occupancy · High Echo",
    explanation: "A busier setting may interrupt focus.",
    color: "#A15D47",
    soft: "#F1E2DB",
    icon: MapPin,
  },
];

// Deterministic decorative points, not geographic locations.
const SIGNAL_POINTS = Array.from({ length: 21 }, (_, index) => ({
  x: 95 + (index % 7) * 135,
  y: 130 + Math.floor(index / 7) * 165,
  offsetX: ((index * 37) % 110) - 55,
  offsetY: ((index * 23) % 90) - 45,
}));

function EnvironmentCard({ place }) {
  const Icon = place.icon;

  return (
    <article className="environment-card min-w-0">
      {/* Entrance transforms remain separate from hover transforms. */}
      <div
        className="environment-surface relative flex h-full overflow-hidden rounded-2xl border bg-[#FCFBF7]/95 p-5 text-left shadow-[0_8px_24px_rgba(38,61,49,0.05)] transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(38,61,49,0.09)]"
        style={{
          borderColor: `${place.color}40`,
        }}
      >
        <span
          className="card-edge absolute inset-x-0 top-0 h-[2px] origin-left"
          style={{
            backgroundColor: place.color,
          }}
          aria-hidden="true"
        />

        {/* One restrained sweep during reveal, not a looping effect. */}
        <span
          className="card-sheen pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-[#E3EBDD]/70 to-transparent"
          style={{
            transform: "translateX(-110%) skewX(-18deg)",
          }}
          aria-hidden="true"
        />

        <div className="relative flex w-full items-start gap-3.5">
          <span
            className="condition-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: place.soft,
              color: place.color,
            }}
          >
            <Icon className="h-4 w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <p
              className="font-mono text-[9px] font-semibold uppercase leading-relaxed tracking-[0.1em]"
              style={{
                color: place.color,
              }}
            >
              {place.label} · {place.noise}
            </p>

            <h3 className="mt-1.5 font-editorial text-xl leading-tight tracking-tight text-[#252B26]">
              {place.name}
            </h3>

            <p className="mt-2 font-mono text-[10px] leading-relaxed text-[#6C7168]">
              {place.details}
            </p>

            <p className="mt-3 border-t border-[#E3E7DA] pt-3 text-xs leading-relaxed text-[#7A8370]">
              {place.explanation}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Section03TurningPoint() {
  const sectionRef = useRef(null);

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

          // No hidden initial JSX states:
          // content stays readable when motion is disabled.
          if (reduceMotion) return;

          const header = select(".turning-header")[0];
          const stage = select(".environment-stage")[0];
          const cards = select(".environment-card");
          const points = select(".signal-point");

          // 1. UNcertainty -> organized background points.
          const background = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 95%",
              end: "center center",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          points.forEach((point, index) => {
            const settings = SIGNAL_POINTS[index];

            background.fromTo(
              point,
              {
                x: settings.offsetX,
                y: settings.offsetY,
                opacity: 0.04,
              },
              {
                x: 0,
                y: 0,
                opacity: 0.24,
                duration: 1,
                ease: "power2.out",
              },
              index * 0.012
            );
          });

          background.fromTo(
            select(".signal-line"),
            {
              strokeDashoffset: 1,
              opacity: 0,
            },
            {
              strokeDashoffset: 0,
              opacity: 0.28,
              duration: 1.15,
              ease: "none",
            },
            0.2
          );

          // 2. Question revealed through two clean masks.
          const headline = gsap.timeline({
            scrollTrigger: {
              trigger: header,
              start: "top 92%",
              end: "top 38%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          headline
            .from(
              select(".turning-badge"),
              {
                y: 10,
                opacity: 0.35,
                duration: 0.5,
                ease: "power2.out",
              },
              0
            )
            .fromTo(
              select(".headline-line"),
              {
                yPercent: 108,
                opacity: 0,
              },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.95,
                stagger: 0.1,
                ease: "power3.out",
              },
              0.05
            )
            .from(
              select(".headline-highlight"),
              {
                scaleX: 0,
                transformOrigin: "left center",
                duration: 0.7,
                ease: "power2.inOut",
              },
              0.55
            )
            .from(
              select(".turning-copy"),
              {
                y: 12,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
              },
              0.4
            );

          // 3. Environment information appears in a connected sequence.
          if (desktop) {
            const reveal = gsap.timeline({
              scrollTrigger: {
                trigger: stage,
                start: "top 94%",
                end: "top 44%",
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            });

            reveal.fromTo(
              select(".card-connector"),
              {
                strokeDashoffset: 1,
                opacity: 0,
              },
              {
                strokeDashoffset: 0,
                opacity: 0.55,
                duration: 1.3,
                ease: "none",
              },
              0
            );

            cards.forEach((card, index) => {
              const start = index * 0.25;

              reveal
                .fromTo(
                  card,
                  {
                    y: 22,
                    scale: 0.98,
                    opacity: 0,
                  },
                  {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                  },
                  start
                )
                .from(
                  card.querySelector(".card-edge"),
                  {
                    scaleX: 0,
                    duration: 0.65,
                    ease: "power2.inOut",
                  },
                  start + 0.15
                )
                .fromTo(
                  card.querySelector(".card-sheen"),
                  {
                    xPercent: -110,
                    skewX: -18,
                  },
                  {
                    xPercent: 420,
                    skewX: -18,
                    duration: 0.9,
                    ease: "power2.inOut",
                  },
                  start + 0.2
                );
            });
          } else {
            cards.forEach((card) => {
              const reveal = gsap.timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 94%",
                  toggleActions: "play none none reverse",
                },
              });

              reveal
                .from(
                  card,
                  {
                    y: 20,
                    opacity: 0,
                    duration: 0.75,
                    ease: "power3.out",
                  },
                  0
                )
                .from(
                  card.querySelector(".card-edge"),
                  {
                    scaleX: 0,
                    duration: 0.6,
                    ease: "power2.inOut",
                  },
                  0.15
                )
                .fromTo(
                  card.querySelector(".card-sheen"),
                  {
                    xPercent: -110,
                    skewX: -18,
                  },
                  {
                    xPercent: 420,
                    skewX: -18,
                    duration: 0.9,
                    ease: "power2.inOut",
                  },
                  0.15
                );
            });
          }

          // 4. Same CTA, subtle reveal, always clickable.
          gsap.fromTo(
            select(".turning-cta"),
            {
              y: 10,
              opacity: 0.7,
            },
            {
              y: 0,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: select(".turning-footer")[0],
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
      {/* Light atmospheric background. No canvas or Three.js. */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(227,235,221,0.95) 0%, rgba(244,241,232,0.7) 48%, #FCFBF7 100%)",
        }}
        aria-hidden="true"
      />

      {/* Abstract coordinate illustration, not a real map. */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full text-[#819478]"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="signal-line"
          d="M-50 430 C170 430 160 180 360 240 S620 470 770 300 S930 150 1080 180"
          stroke="currentColor"
          strokeWidth="0.8"
          pathLength="1"
          strokeDasharray="1"
          opacity="0.18"
        />

        {SIGNAL_POINTS.map((point, index) => (
          <circle
            key={index}
            className="signal-point"
            cx={point.x}
            cy={point.y}
            r={index % 4 === 0 ? 2.5 : 1.5}
            fill="currentColor"
            opacity="0.16"
          />
        ))}
      </svg>

      {/* Quiet centre for readable text */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(244,241,232,0.94) 0%, rgba(244,241,232,0.65) 28%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-5xl">
        <header className="turning-header mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="turning-badge mb-5 inline-flex items-center gap-2 rounded-full border border-[#819478]/40 bg-[#FCFBF7] px-3.5 py-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#263D31]" />

            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#263D31] sm:text-[11px] sm:tracking-[0.22em]">
              Section 03 · The Turning Point
            </span>
          </div>

          <h2 className="font-editorial text-[clamp(2.25rem,5.8vw,4.5rem)] leading-[1.08] tracking-tight text-[#252B26]">
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="headline-line block">
                What if you knew
              </span>
            </span>

            <span className="-mt-[0.08em] block overflow-hidden pb-[0.16em]">
              <span className="headline-line relative inline-block italic text-[#60774F]">
                <span
                  className="headline-highlight absolute bottom-[0.02em] left-0 right-0 h-[0.13em] rounded-full bg-[#CCD9BF]/70"
                  aria-hidden="true"
                />

                <span className="relative">
                  before you arrived?
                </span>
              </span>
            </span>
          </h2>

          <p className="turning-copy mt-3 max-w-2xl font-editorial text-lg leading-relaxed text-[#263D31]/80 sm:text-2xl">
            “What if you could choose a place based on the environment
            you actually need?”
          </p>
        </header>

        {/* Original three-card structure */}
        <div className="environment-stage relative mt-9 sm:mt-11">
          <svg
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -top-5 left-0 hidden h-12 w-full md:block"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className="card-connector"
              d="M165 65 C270 5 390 5 500 65 C610 5 730 5 835 65"
              stroke="#819478"
              strokeWidth="1"
              pathLength="1"
              strokeDasharray="1"
              opacity="0.4"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="relative grid grid-cols-1 items-stretch gap-4 md:grid-cols-3 lg:gap-5">
            {PLACES.map((place) => (
              <EnvironmentCard key={place.id} place={place} />
            ))}
          </div>
        </div>

        <footer className="turning-footer mt-7 flex flex-col items-center text-center sm:mt-8">
          <p className="mb-5 max-w-xl text-[9px] leading-relaxed text-[#7B8471]">
            Illustrative places and values—not live noise, occupancy
            or suitability readings.
          </p>

          {/* Original CTA style and target */}
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