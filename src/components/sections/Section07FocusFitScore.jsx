"use client";

import {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import {
  Award,
  ShieldCheck,
  ArrowRight,
  Zap,
  Wifi,
  Volume2,
  Users,
  Eye,
  Sliders,
  Info,
  Check,
} from "lucide-react";
import { SPACES_DATA } from "@/data/spacesData";
import { gsap } from "gsap";

const CANDIDATES = SPACES_DATA.slice(0, 4);

const FACTORS = [
  {
    key: "acoustics",
    label: "Quiet environment",
    icon: Volume2,
    color: "#263D31",
    note: "Used in the fit calculation",
  },
  {
    key: "connectivity",
    label: "Wi-Fi quality",
    icon: Wifi,
    color: "#60774F",
    note: "Used in the fit calculation",
  },
  {
    key: "seating",
    label: "Seating",
    icon: Users,
    color: "#819478",
    note: "Additional place information",
  },
  {
    key: "ergonomics",
    label: "Comfort & ergonomics",
    icon: Zap,
    color: "#B38860",
    note: "Additional place information",
  },
  {
    key: "naturalLight",
    label: "Natural light",
    icon: Eye,
    color: "#819478",
    note: "Additional place information",
  },
];

function getFactor(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.min(100, number))
    : null;
}

function AnimatedGauge({ score, revealed }) {
  const ringRef = useRef(null);
  const numberRef = useRef(null);
  const valueRef = useRef({ value: 0 });

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const target = revealed && score !== null ? score : 0;
    const duration = reduceMotion ? 0 : 0.8;

    const ringTween = gsap.to(ringRef.current, {
      strokeDashoffset: 100 - target,
      duration,
      ease: "power3.out",
      overwrite: "auto",
    });

    const numberTween = gsap.to(valueRef.current, {
      value: target,
      duration,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: () => {
        if (!numberRef.current) return;

        numberRef.current.textContent =
          score === null
            ? "—"
            : String(Math.round(valueRef.current.value));
      },
    });

    return () => {
      ringTween.kill();
      numberTween.kill();
    };
  }, [score, revealed]);

  return (
    <div
      className="relative flex h-36 w-36 shrink-0 items-center justify-center sm:h-40 sm:w-40"
      role="img"
      aria-label={
        score === null
          ? "Fit score unavailable"
          : `Illustrative fit score: ${score} out of 100`
      }
    >
      <svg
        viewBox="0 0 160 160"
        className="absolute inset-0 h-full w-full -rotate-90"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="80"
          cy="80"
          r="66"
          stroke="#E3EBDD"
          strokeWidth="8"
        />

        <circle
          ref={ringRef}
          cx="80"
          cy="80"
          r="66"
          pathLength="100"
          stroke="#263D31"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset="100"
        />
      </svg>

      <div className="text-center" aria-hidden="true">
        <div className="flex items-baseline justify-center">
          <span
            ref={numberRef}
            className="font-editorial text-5xl tracking-tight text-[#263D31]"
          >
            0
          </span>

          {score !== null && (
            <span className="ml-0.5 text-sm text-[#819478]">
              /100
            </span>
          )}
        </div>

        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#7A8470]">
          Demo fit score
        </p>
      </div>
    </div>
  );
}

function FactorBar({ factor, value, revealed }) {
  const fillRef = useRef(null);
  const Icon = factor.icon;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const tween = gsap.to(fillRef.current, {
      scaleX: revealed && value !== null ? value / 100 : 0,
      duration: reduceMotion ? 0 : 0.75,
      ease: "power3.out",
      overwrite: "auto",
    });

    return () => tween.kill();
  }, [value, revealed]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="flex min-w-0 items-center gap-2 text-xs text-[#45513E]">
          <Icon
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: factor.color }}
          />
          {factor.label}
        </span>

        <span className="shrink-0 font-mono text-[10px] font-semibold text-[#263D31]">
          {value === null ? "Unknown" : `${value}/100`}
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-[#E8EDDF]"
        role="meter"
        aria-label={factor.label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value ?? undefined}
        aria-valuetext={
          value === null ? "Unknown" : `${value} out of 100`
        }
      >
        <div
          ref={fillRef}
          className="h-full w-full origin-left rounded-full"
          style={{
            backgroundColor: factor.color,
            transform: "scaleX(0)",
          }}
        />
      </div>

      <p className="mt-1.5 text-[9px] text-[#929A88]">
        {factor.note}
      </p>
    </div>
  );
}

function PrioritySlider({
  id,
  title,
  description,
  icon: Icon,
  value,
  onChange,
}) {
  return (
    <div className="rounded-2xl border border-[#E0E5D6] bg-[#FCFBF7] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="flex items-center gap-2 text-xs font-medium text-[#45513E]"
        >
          <Icon className="h-3.5 w-3.5 text-[#819478]" />
          {title}
        </label>

        <span className="rounded-full bg-[#E3EBDD] px-2 py-1 font-mono text-[9px] font-semibold text-[#263D31]">
          {value}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="w-full cursor-pointer accent-[#263D31]"
      />

      <div className="mt-1 flex justify-between font-mono text-[7px] uppercase tracking-wider text-[#929A88]">
        <span>Less important</span>
        <span>Essential</span>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-[#7B8471]">
        {description}
      </p>
    </div>
  );
}

export default function Section07FocusFitScore() {
  const sectionRef = useRef(null);
  const photoFrameRef = useRef(null);
  const photoLayerRef = useRef(null);
  const detailsRef = useRef(null);

  const [revealed, setRevealed] = useState(false);

  const [activeSpaceId, setActiveSpaceId] = useState(
    () =>
      CANDIDATES.find(
        (space) => space.id === "solitude-atelier"
      )?.id ??
      CANDIDATES[0]?.id ??
      ""
  );

  const [noisePriority, setNoisePriority] = useState(85);
  const [speedPriority, setSpeedPriority] = useState(80);
  const [socketPriority, setSocketPriority] = useState(90);

  const scoredSpaces = useMemo(() => {
    return CANDIDATES.map((space) => {
      const acoustics = getFactor(space.factors?.acoustics);
      const connectivity = getFactor(
        space.factors?.connectivity
      );

      // Preserves the original illustrative outlet rule:
      // listed outlets = 100, otherwise = 40.
      // A missing value remains unknown.
      const power =
        typeof space.hasOutlets === "boolean"
          ? space.hasOutlets
            ? 100
            : 40
          : null;

      const components = [
        {
          key: "quiet",
          label: "Quiet",
          value: acoustics,
          weight: noisePriority * 0.4,
        },
        {
          key: "wifi",
          label: "Wi-Fi",
          value: connectivity,
          weight: speedPriority * 0.3,
        },
        {
          key: "power",
          label: "Power",
          value: power,
          weight: socketPriority * 0.3,
        },
      ];

      const available = components.filter(
        (item) => item.value !== null && item.weight > 0
      );

      const totalWeight = available.reduce(
        (total, item) => total + item.weight,
        0
      );

      const score =
        totalWeight > 0
          ? Math.round(
            available.reduce(
              (total, item) =>
                total + item.value * item.weight,
              0
            ) / totalWeight
          )
          : null;

      return {
        ...space,
        dynamicScore: score,
        scoreComponents: components.map((item) => ({
          ...item,
          share:
            totalWeight > 0 &&
              item.value !== null &&
              item.weight > 0
              ? (item.weight / totalWeight) * 100
              : 0,
        })),
      };
    });
  }, [noisePriority, speedPriority, socketPriority]);

  const activeSpace =
    scoredSpaces.find(
      (space) => space.id === activeSpaceId
    ) ??
    scoredSpaces[0] ??
    null;

  const highestScore = Math.max(
    -1,
    ...scoredSpaces.map((space) => space.dynamicScore ?? -1)
  );

  // Entrance animation without ScrollTrigger.
  useEffect(() => {
    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      media.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (context.conditions.reduceMotion) {
            setRevealed(true);
            return;
          }

          gsap.set(".fit-enter", {
            y: 24,
            opacity: 0,
          });

          const observer = new IntersectionObserver(
            ([entry]) => {
              if (!entry.isIntersecting) return;

              setRevealed(true);

              context.add(() => {
                gsap.to(".fit-enter", {
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  stagger: 0.12,
                  ease: "power3.out",
                });
              });

              observer.disconnect();
            },
            {
              threshold: 0,
              rootMargin: "0px 0px -60px 0px",
            }
          );

          observer.observe(sectionRef.current);

          return () => observer.disconnect();
        }
      );
    }, sectionRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  // Subtle photo-only scroll parallax.
  // No pinning and no changes to the user's selection.
  useEffect(() => {
    const media = gsap.matchMedia();

    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const frameElement = photoFrameRef.current;
        const layer = photoLayerRef.current;

        if (!frameElement || !layer) return;

        let visible = false;
        let frame = 0;

        const render = () => {
          frame = 0;

          if (!visible || document.hidden) return;

          const rect = frameElement.getBoundingClientRect();

          const progress = gsap.utils.clamp(
            0,
            1,
            (window.innerHeight - rect.top) /
            (window.innerHeight + rect.height)
          );

          gsap.set(layer, {
            y: (progress - 0.5) * -24,
          });
        };

        const requestRender = () => {
          if (!visible || document.hidden || frame) return;

          frame = requestAnimationFrame(render);
        };

        const observer = new IntersectionObserver(
          ([entry]) => {
            visible = entry.isIntersecting;

            if (visible) {
              requestRender();
            } else if (frame) {
              cancelAnimationFrame(frame);
              frame = 0;
            }
          },
          { rootMargin: "80px" }
        );

        observer.observe(frameElement);

        window.addEventListener("scroll", requestRender, {
          passive: true,
        });

        window.addEventListener("resize", requestRender);

        document.addEventListener(
          "visibilitychange",
          requestRender
        );

        return () => {
          observer.disconnect();

          window.removeEventListener(
            "scroll",
            requestRender
          );

          window.removeEventListener(
            "resize",
            requestRender
          );

          document.removeEventListener(
            "visibilitychange",
            requestRender
          );

          if (frame) cancelAnimationFrame(frame);

          gsap.set(layer, {
            clearProps: "transform",
          });
        };
      }
    );

    return () => media.revert();
  }, []);

  // Place-change transition, independent of slider updates.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const targets = detailsRef.current?.querySelectorAll(
      ".place-detail"
    );

    if (!targets?.length) return;

    const tween = gsap.fromTo(
      targets,
      {
        y: 8,
        opacity: 0.4,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        overwrite: "auto",
      }
    );

    return () => tween.kill();
  }, [activeSpaceId]);

  if (!activeSpace) {
    return (
      <section
        id="focus-fit"
        className="bg-[#FCFBF7] px-5 py-14 text-[#263D31]"
      >
        <h2 className="font-editorial text-3xl">
          Find a place that fits you.
        </h2>

        <p className="mt-3 text-sm text-[#6C7168]">
          No place data is available yet.
        </p>
      </section>
    );
  }

  return (
    <section
      id="focus-fit"
      ref={sectionRef}
      className="relative w-full overflow-hidden border-t border-[#E3E0D7] bg-[#FCFBF7] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Short editorial introduction */}
        <header className="fit-enter mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#819478]/30 bg-[#E3EBDD] px-3.5 py-1.5">
              <Award className="h-3.5 w-3.5 text-[#263D31]" />

              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[#263D31]">
                Section 07 · Focus Fit
              </span>
            </div>

            <h2 className="font-editorial text-3xl leading-tight tracking-tight text-[#263D31] sm:text-4xl lg:text-5xl">
              Not just nearby.
              <span className="ml-2 italic text-[#819478]">
                Right for you.
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6C7168] sm:text-base">
              Tell us what matters most. See how each place matches
              your priorities—and understand why.
            </p>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#DFE5D6] px-3 py-2 text-[9px] text-[#7B8470]">
            <Info className="h-3 w-3" />
            Illustrative scoring · Not a guarantee
          </span>
        </header>

        {/* Interactive priorities */}
        <div className="fit-enter mb-6 rounded-[24px] border border-[#DDE3D4] bg-[#F4F6EE] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-[#263D31]" />

              <h3 className="text-xs font-semibold text-[#263D31]">
                01 · What matters to you?
              </h3>
            </div>

            <p className="text-[10px] text-[#849077]">
              Move a slider to update the scores.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <PrioritySlider
              id="focus-noise-priority"
              title="A quiet environment"
              description="Give quieter surroundings more influence."
              icon={Volume2}
              value={noisePriority}
              onChange={setNoisePriority}
            />

            <PrioritySlider
              id="focus-wifi-priority"
              title="Reliable Wi-Fi"
              description="Give the connectivity factor more influence."
              icon={Wifi}
              value={speedPriority}
              onChange={setSpeedPriority}
            />

            <PrioritySlider
              id="focus-power-priority"
              title="Power outlets"
              description="Give listed outlet availability more influence."
              icon={Zap}
              value={socketPriority}
              onChange={setSocketPriority}
            />
          </div>

          {noisePriority + speedPriority + socketPriority === 0 && (
            <p className="mt-3 text-xs text-[#986334]" role="status">
              Increase at least one priority to calculate a score.
            </p>
          )}
        </div>

        {/* Place picker */}
        <div className="fit-enter mb-6">
          <p className="mb-3 text-xs font-semibold text-[#263D31]">
            02 · Choose a place to understand its fit
          </p>

          <div
            className="fit-scroll overflow-x-auto pb-2"
            tabIndex={0}
            aria-label="Choose a place"
          >
            <div className="flex min-w-max gap-2">
              {scoredSpaces.map((space) => {
                const selected = activeSpace.id === space.id;

                const best =
                  space.dynamicScore !== null &&
                  space.dynamicScore === highestScore;

                return (
                  <button
                    key={space.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveSpaceId(space.id)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#819478] ${selected
                        ? "border-[#263D31] bg-[#263D31] text-[#F4F1E8]"
                        : "border-[#DFE5D6] bg-[#FCFBF7] text-[#53604A] hover:bg-[#EFF3E8]"
                      }`}
                  >
                    <span>
                      <span className="block text-xs font-medium">
                        {space.name}
                      </span>

                      <span
                        className={`mt-1 block text-[8px] ${selected
                            ? "text-[#C7D4BB]"
                            : "text-[#89947D]"
                          }`}
                      >
                        {best
                          ? "Highest demo score in this set"
                          : space.category}
                      </span>
                    </span>

                    <span
                      className={`rounded-full px-2 py-1 font-mono text-[10px] ${selected
                          ? "bg-white/15"
                          : "bg-[#E3EBDD]"
                        }`}
                    >
                      {space.dynamicScore === null
                        ? "—"
                        : `${space.dynamicScore}/100`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Photo + score + explanation */}
        <div className="fit-enter grid items-stretch gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[26px] border border-[#DDE3D4] bg-[#F4F6EE]">
            <div
              ref={photoFrameRef}
              className="relative aspect-[16/10] overflow-hidden bg-[#E3EBDD]"
            >
              <div
                ref={photoLayerRef}
                className="absolute -inset-y-5 inset-x-0"
              >
                <Image
                  key={activeSpace.id}
                  src={activeSpace.image}
                  alt={activeSpace.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#183022]/70 via-transparent to-transparent" />

              <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-[#FCFBF7]/95 px-3 py-1.5 font-mono text-[9px] text-[#263D31]">
                {activeSpace.noiseLevel} dB · Demo value
              </span>

              <div className="absolute bottom-5 left-5 right-5">
                <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.16em] text-[#D1DEC5]">
                  {activeSpace.category}
                </p>

                <h3 className="font-editorial text-3xl leading-tight text-white">
                  {activeSpace.name}
                </h3>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 p-5 text-center sm:flex-row sm:gap-4 sm:text-left">
              <AnimatedGauge
                score={activeSpace.dynamicScore}
                revealed={revealed}
              />

              <div ref={detailsRef} className="min-w-0">
                <p className="place-detail text-sm font-semibold text-[#263D31]">
                  Your current fit
                </p>

                <p className="place-detail mt-2 text-xs leading-relaxed text-[#738067]">
                  Based on your quiet, Wi-Fi and outlet priorities.
                  This is a demo ranking score, not a probability
                  that a visit will meet your needs.
                </p>

                <p className="place-detail mt-3 font-mono text-[9px] leading-relaxed text-[#849077]">
                  {activeSpace.hours} · {activeSpace.budget}
                </p>
              </div>
            </div>
          </div>

          {/* Transparent explanation */}
          <div className="flex flex-col rounded-[26px] border border-[#DDE3D4] bg-[#FCFBF7] p-5 sm:p-7">
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#819478]">
              03 · Understand the result
            </p>

            <h3 className="font-editorial text-2xl tracking-tight text-[#263D31] sm:text-3xl">
              Why this place?
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#7B8470]">
              These are the listed factor scores. Your sliders change
              their influence—not the underlying place data.
            </p>

            <div className="mt-6 space-y-5">
              {FACTORS.map((factor) => (
                <FactorBar
                  key={factor.key}
                  factor={factor}
                  value={getFactor(
                    activeSpace.factors?.[factor.key]
                  )}
                  revealed={revealed}
                />
              ))}
            </div>

            {/* Normalized priority contribution */}
            <div className="mt-6 rounded-2xl bg-[#F4F6EE] p-4">
              <p className="mb-3 text-[10px] font-semibold text-[#53634A]">
                Your current weighting
              </p>

              <div className="flex flex-wrap gap-2">
                {activeSpace.scoreComponents.map((component) => (
                  <span
                    key={component.key}
                    className="rounded-full border border-[#DBE3D0] bg-[#FCFBF7] px-2.5 py-1.5 font-mono text-[9px] text-[#68775B]"
                  >
                    {component.label}:{" "}
                    {component.value === null
                      ? "Unknown"
                      : `${Math.round(component.share)}%`}
                  </span>
                ))}
              </div>

              <p className="mt-3 text-[9px] leading-relaxed text-[#8A947F]">
                Demo formula: quiet × 40%, Wi-Fi × 30%, power × 30%,
                adjusted by your priorities and normalized. Power uses
                100 for listed outlets and 40 otherwise. Unknown inputs
                are excluded.
              </p>
            </div>
          </div>
        </div>

        {/* Context and CTA */}
        <footer className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-[#E0E5D7] bg-[#F4F6EE] p-4 sm:p-5 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="flex items-center gap-1.5 text-[10px] font-semibold text-[#53634A]">
              <Check className="h-3.5 w-3.5 shrink-0" />
              Place notes
            </p>

            <p className="mt-1 text-xs leading-relaxed text-[#7B8470]">
              {activeSpace.rationale || "No additional notes available."}
            </p>
          </div>

          <a
            href="#compare"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#263D31] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#F4F1E8] shadow-sm transition-colors hover:bg-[#819478] hover:text-[#252B26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#819478] lg:self-center"
          >
            <span>Compare places</span>

            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </a>
        </footer>
      </div>

    </section>
  );
}