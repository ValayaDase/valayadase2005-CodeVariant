"use client";

import {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  Clock,
  Calendar,
  Volume2,
  Users,
  Wifi,
  Zap,
  Check,
  Info,
  ArrowRight,
  MousePointer2,
} from "lucide-react";
import { SPACES_DATA, HOURLY_DAYS } from "@/data/spacesData";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const STATUS_STYLES = {
  quiet: {
    label: "Quiet",
    color: "#263D31",
    background: "#E3EBDD",
  },
  caution: {
    label: "Moderate",
    color: "#986334",
    background: "#F3E8D9",
  },
  crowded: {
    label: "Busy",
    color: "#A15D47",
    background: "#F2E5DF",
  },
  unknown: {
    label: "Unknown",
    color: "#77816E",
    background: "#EDF0E7",
  },
};

function getStatus(slot) {
  if (!slot) return STATUS_STYLES.unknown;

  return STATUS_STYLES[slot.status] ?? STATUS_STYLES.unknown;
}

function numericValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

export default function Section06QuietWhen() {
  const sectionRef = useRef(null);
  const chartRef = useRef(null);
  const selectedBandRef = useRef(null);
  const summaryRef = useRef(null);

  const [selectedSpaceId, setSelectedSpaceId] = useState(
    () =>
      SPACES_DATA.find(
        (space) => space.id === "solitude-atelier"
      )?.id ??
      SPACES_DATA[0]?.id ??
      ""
  );

  const [selectedDay, setSelectedDay] = useState(
    () =>
      HOURLY_DAYS.includes("Wednesday")
        ? "Wednesday"
        : HOURLY_DAYS[0] ?? ""
  );

  const [selectedHourIndex, setSelectedHourIndex] = useState(1);

  const currentSpace =
    SPACES_DATA.find(
      (space) => space.id === selectedSpaceId
    ) ??
    SPACES_DATA[0] ??
    null;

  // Uses your existing hourlyProfile array.
  // No day-specific values are fabricated.
  const hourlyData = useMemo(
    () =>
      Array.isArray(currentSpace?.hourlyProfile)
        ? currentSpace.hourlyProfile
        : [],
    [currentSpace]
  );

  const safeHourIndex = Math.max(
    0,
    Math.min(selectedHourIndex, hourlyData.length - 1)
  );

  const currentSlot = hourlyData[safeHourIndex] ?? null;
  const currentStatus = getStatus(currentSlot);

  const quietestIndex = useMemo(() => {
    let result = -1;
    let lowestNoise = Infinity;

    hourlyData.forEach((slot, index) => {
      const noise = numericValue(slot.noise);

      if (noise !== null && noise < lowestNoise) {
        lowestNoise = noise;
        result = index;
      }
    });

    return result;
  }, [hourlyData]);

  const quietestSlot =
    quietestIndex >= 0 ? hourlyData[quietestIndex] : null;

  const isQuietest =
    quietestIndex >= 0 &&
    safeHourIndex === quietestIndex;

  const selectedNoise = numericValue(currentSlot?.noise);
  const selectedCrowd = numericValue(currentSlot?.crowd);

  // Keep the axis consistent, extending it if the data exceeds 80 dB.
  const chartMaximum = useMemo(() => {
    const values = hourlyData
      .map((slot) => numericValue(slot.noise))
      .filter((value) => value !== null);

    return Math.max(
      80,
      Math.ceil(Math.max(0, ...values) / 20) * 20
    );
  }, [hourlyData]);

  const gridTemplate = `repeat(${Math.max(
    hourlyData.length,
    1
  )}, minmax(58px, 1fr))`;

  const summaryTitle = !currentSlot
    ? "No hourly information available."
    : isQuietest
      ? "The quietest time shown in this profile."
      : currentSlot.status === "quiet"
        ? "A quieter option for focused work."
        : currentSlot.status === "caution"
          ? "Some background activity to consider."
          : currentSlot.status === "crowded"
            ? "A busier time in this profile."
            : "Check the available information before planning.";

  // Section entrance and chart reveal + card-stacking over Section 05
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          const discoveryEl = document.getElementById("discovery");

          if (discoveryEl && sectionRef.current) {
            ScrollTrigger.create({
              trigger: discoveryEl,
              start: "bottom bottom",
              endTrigger: sectionRef.current,
              end: "top top",
              pin: true,
              pinSpacing: false,
              scrub: true,
              animation: gsap.to(discoveryEl, {
                scale: 0.965,
                opacity: 0.8,
                ease: "none",
              }),
            });
          }

          gsap.from(".quiet-heading", {
            y: 22,
            opacity: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              once: true,
            },
          });

          gsap.from(".quiet-dashboard", {
            y: 26,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".quiet-dashboard",
              start: "top 92%",
              once: true,
            },
          });
        }
      );
    }, sectionRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  // Animate bars when a place profile is loaded.
  // Manual hour/day selection does not reset these animations.
  useEffect(() => {
    if (!hourlyData.length) return;

    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.fromTo(
            ".hour-bar",
            {
              scaleY: 0,
              transformOrigin: "center bottom",
            },
            {
              scaleY: 1,
              duration: 0.9,
              stagger: 0.065,
              ease: "power3.out",
              scrollTrigger: {
                trigger: chartRef.current,
                start: "top 90%",
                once: true,
              },
            }
          );
        }
      );
    }, chartRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, [hourlyData]);

  // Sliding selection highlight and readable summary transition.
  useEffect(() => {
    if (!hourlyData.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.to(selectedBandRef.current, {
        left: `${(safeHourIndex / hourlyData.length) * 100}%`,
        duration: reducedMotion ? 0 : 0.45,
        ease: "power3.out",
        overwrite: "auto",
      });

      if (!reducedMotion) {
        gsap.fromTo(
          summaryRef.current,
          {
            y: 7,
            opacity: 0.55,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [safeHourIndex, hourlyData]);

  function handleSpaceChange(event) {
    setSelectedSpaceId(event.target.value);
    setSelectedHourIndex(0);
  }

  if (!currentSpace) {
    return (
      <section
        id="quiet-when"
        className="relative z-20 w-full rounded-t-[28px] sm:rounded-t-[36px] lg:rounded-t-[44px] border-t border-[#E3E0D7] bg-[#F4F1E8] shadow-[0_-24px_50px_rgba(15,28,20,0.35)] px-5 py-14 text-[#263D31]"
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="font-editorial text-3xl">
            Find your quiet window.
          </h2>

          <p className="mt-3 text-sm text-[#6C7168]">
            No place profiles are available yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="quiet-when"
      ref={sectionRef}
      className="relative z-20 w-full overflow-hidden rounded-t-[32px] sm:rounded-t-[44px] lg:rounded-t-[54px] border-t border-[#819478]/40 bg-[#F4F1E8] shadow-[0_-28px_60px_rgba(15,28,20,0.38)] px-5 py-14 text-[#252B26] sm:px-8 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Short, user-friendly introduction */}
        <header className="quiet-heading mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#819478]/30 bg-[#E3EBDD] px-3.5 py-1.5">
              <Clock className="h-3.5 w-3.5 text-[#263D31]" />

              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[#263D31]">
                Hourly Acoustic Forecast · Quiet Windows
              </span>
            </div>

            <h2 className="font-editorial text-3xl leading-tight tracking-tight text-[#263D31] sm:text-4xl lg:text-5xl">
              Find your quiet window.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6C7168] sm:text-base">
              Choose a place and explore its hourly profile.
              Select a time to see noise and crowd information.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[8px] uppercase tracking-wider text-[#7B8470] sm:gap-4 sm:text-[9px]">
            <span>01 Choose a place</span>
            <ArrowRight className="h-3 w-3" />
            <span>02 Explore hours</span>
            <ArrowRight className="h-3 w-3" />
            <span>03 Plan your visit</span>
          </div>
        </header>

        <div className="quiet-dashboard overflow-hidden rounded-[26px] border border-[#DDE2D4] bg-[#FCFBF7] shadow-[0_16px_45px_rgba(38,61,49,0.05)]">
          {/* Place + planning day */}
          <div className="grid gap-5 border-b border-[#E3E7DA] p-5 sm:p-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
            <div className="min-w-0">
              <label
                htmlFor="quiet-place"
                className="mb-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#7B8470]"
              >
                Choose a place
              </label>

              <select
                id="quiet-place"
                value={currentSpace.id}
                onChange={handleSpaceChange}
                className="h-12 w-full rounded-xl border border-[#DCE2D2] bg-[#F4F6EE] px-3 font-editorial text-lg text-[#263D31] outline-none focus:border-[#819478] sm:text-xl"
              >
                {SPACES_DATA.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#7B8470]">
                <Calendar className="h-3 w-3" />
                Your planned day
              </p>

              <div
                className="quiet-scroll overflow-x-auto pb-1"
                tabIndex={0}
                aria-label="Choose your planned day"
              >
                <div className="flex min-w-max gap-1.5">
                  {HOURLY_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={selectedDay === day}
                      onClick={() => setSelectedDay(day)}
                      className={`h-12 rounded-xl px-3 font-mono text-[10px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#819478] ${
                        selectedDay === day
                          ? "bg-[#263D31] text-[#F4F1E8]"
                          : "bg-[#F2F4EC] text-[#67745B] hover:bg-[#E3EBDD]"
                      }`}
                    >
                      <span className="sm:hidden">
                        {day.slice(0, 3)}
                      </span>

                      <span className="hidden sm:inline">
                        {day}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data integrity notice */}
          <div className="flex items-start gap-2 border-b border-[#E3E7DA] bg-[#F4F6EF] px-5 py-3 sm:px-6">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#819478]" />

            <p className="text-[10px] leading-relaxed text-[#77816D]">
              Demo hourly profile—not live sensor readings. Your planned
              day is {selectedDay || "not selected"}. This dataset
              does not provide different hourly values for each day,
              so the profile below remains the same.
            </p>
          </div>

          {hourlyData.length > 0 ? (
            <>
              {/* Chart */}
              <div ref={chartRef} className="p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#263D31]">
                      How does the environment change?
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-[#7B8470]">
                      <MousePointer2 className="h-3 w-3" />
                      Tap or click an hour to explore.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {["quiet", "caution", "crowded"].map(
                      (status) => (
                        <span
                          key={status}
                          className="flex items-center gap-1.5 text-[9px] text-[#748069]"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                STATUS_STYLES[status].color,
                            }}
                          />

                          {STATUS_STYLES[status].label}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div
                  className="quiet-scroll overflow-x-auto pb-2"
                  tabIndex={0}
                  aria-label="Hourly noise chart"
                >
                  <div
                    style={{
                      minWidth: Math.max(
                        420,
                        hourlyData.length * 64
                      ),
                    }}
                  >
                    {/* Chart plotting area */}
                    <div className="relative ml-9 pt-7">
                      <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-7">
                        {[0, 1, 2, 3, 4].map((step) => {
                          const value =
                            chartMaximum -
                            (step * chartMaximum) / 4;

                          return (
                            <div
                              key={step}
                              className="absolute left-0 right-0 border-t border-[#E4E8DC]"
                              style={{
                                top: `${step * 25}%`,
                              }}
                            >
                              <span className="absolute -left-8 -top-1.5 w-6 text-right font-mono text-[8px] text-[#939B89]">
                                {Math.round(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="relative h-[210px] sm:h-[240px]">
                        {/* One persistent sliding highlight */}
                        <div
                          ref={selectedBandRef}
                          className="pointer-events-none absolute inset-y-0 rounded-t-xl bg-[#E3EBDD]/65"
                          style={{
                            left: `${
                              (safeHourIndex / hourlyData.length) *
                              100
                            }%`,
                            width: `${
                              100 / hourlyData.length
                            }%`,
                          }}
                          aria-hidden="true"
                        />

                        <div
                          className="relative grid h-full gap-2 px-1 sm:gap-4"
                          style={{
                            gridTemplateColumns: gridTemplate,
                          }}
                        >
                          {hourlyData.map((slot, index) => {
                            const noise = numericValue(slot.noise);
                            const status = getStatus(slot);

                            const selected =
                              safeHourIndex === index;

                            const barHeight =
                              noise === null
                                ? 3
                                : Math.max(
                                    3,
                                    Math.min(
                                      100,
                                      (noise / chartMaximum) *
                                        100
                                    )
                                  );

                            return (
                              <button
                                key={`${slot.hour}-${index}`}
                                type="button"
                                aria-pressed={selected}
                                aria-label={`${slot.hour}: ${
                                  noise === null
                                    ? "noise unknown"
                                    : `${noise} decibels`
                                }, ${status.label}${
                                  index === quietestIndex
                                    ? ", quietest shown"
                                    : ""
                                }`}
                                onClick={() =>
                                  setSelectedHourIndex(index)
                                }
                                className="group relative flex h-full min-w-0 items-end justify-center rounded-t-xl px-2 outline-none focus-visible:ring-2 focus-visible:ring-[#819478]"
                              >
                                <div
                                  className="relative w-full max-w-[48px]"
                                  style={{
                                    height: `${barHeight}%`,
                                  }}
                                >
                                  <span
                                    className={`absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] ${
                                      selected
                                        ? "font-bold text-[#263D31]"
                                        : "text-[#7B8470]"
                                    }`}
                                  >
                                    {noise === null
                                      ? "—"
                                      : noise}
                                  </span>

                                  <div
                                    className={`hour-bar absolute inset-0 rounded-t-lg ${
                                      selected
                                        ? "ring-2 ring-[#819478] ring-offset-2 ring-offset-[#FCFBF7]"
                                        : ""
                                    }`}
                                    style={{
                                      backgroundColor:
                                        status.color,
                                      opacity: selected
                                        ? 1
                                        : 0.72,
                                    }}
                                  />

                                  {index === quietestIndex && (
                                    <span className="absolute bottom-2 left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-[#FCFBF7]/95 text-[#263D31]">
                                      <Check className="h-2.5 w-2.5" />
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Hour labels */}
                    <div
                      className="ml-9 mt-3 grid gap-2 px-1 sm:gap-4"
                      style={{
                        gridTemplateColumns: gridTemplate,
                      }}
                    >
                      {hourlyData.map((slot, index) => (
                        <button
                          key={`${slot.hour}-label-${index}`}
                          type="button"
                          aria-label={`Select ${slot.hour}`}
                          onClick={() =>
                            setSelectedHourIndex(index)
                          }
                          className={`rounded-md py-1 text-center font-mono text-[10px] outline-none focus-visible:ring-2 focus-visible:ring-[#819478] ${
                            safeHourIndex === index
                              ? "font-bold text-[#263D31]"
                              : "text-[#7B8470]"
                          }`}
                        >
                          {slot.hour}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[9px] text-[#8A9380]">
                    Bar height represents noise in dB on a
                    0–{chartMaximum} scale.
                  </p>

                  {quietestSlot && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedHourIndex(quietestIndex)
                      }
                      className="flex items-center gap-1.5 rounded-full bg-[#E3EBDD] px-3 py-1.5 text-[10px] font-medium text-[#263D31] transition-colors hover:bg-[#D5E0CA]"
                    >
                      <Check className="h-3 w-3" />
                      Quietest shown: {quietestSlot.hour}
                    </button>
                  )}
                </div>
              </div>

              {/* Selected hour explanation */}
              <div className="border-t border-[#E3E7DA] bg-[#F4F6EF] p-5 sm:p-6">
                <div ref={summaryRef}>
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div className="max-w-xl">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#77816D]">
                          Selected time
                        </span>

                        <span
                          className="rounded-full px-2 py-1 text-[8px] font-semibold"
                          style={{
                            color: currentStatus.color,
                            backgroundColor:
                              currentStatus.background,
                          }}
                        >
                          {currentStatus.label}
                        </span>
                      </div>

                      <p className="font-editorial text-3xl tracking-tight text-[#263D31] sm:text-4xl">
                        {currentSlot.hour}
                      </p>

                      <h4 className="mt-2 text-sm font-medium leading-relaxed text-[#53634A]">
                        {summaryTitle}
                      </h4>

                      <p className="mt-1 text-[10px] leading-relaxed text-[#7B8470]">
                        Compare the profile with your activity needs.
                        These sample values do not guarantee current
                        conditions.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 lg:min-w-[280px]">
                      <div className="rounded-2xl border border-[#DDE3D3] bg-[#FCFBF7] p-4">
                        <p className="mb-2 flex items-center gap-1.5 text-[9px] text-[#7B8470]">
                          <Volume2 className="h-3 w-3" />
                          Noise level
                        </p>

                        <p className="font-mono text-xl font-semibold text-[#263D31]">
                          {selectedNoise === null
                            ? "Unknown"
                            : `${selectedNoise} dB`}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#DDE3D3] bg-[#FCFBF7] p-4">
                        <p className="mb-2 flex items-center gap-1.5 text-[9px] text-[#7B8470]">
                          <Users className="h-3 w-3" />
                          Sample crowd
                        </p>

                        <p className="font-mono text-xl font-semibold text-[#263D31]">
                          {selectedCrowd === null
                            ? "Unknown"
                            : `${selectedCrowd}%`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Clock className="mx-auto mb-3 h-6 w-6 text-[#819478]" />

              <p className="font-editorial text-xl text-[#263D31]">
                No hourly profile available.
              </p>

              <p className="mt-2 text-sm text-[#7B8470]">
                Select another place to explore its listed hours.
              </p>
            </div>
          )}

          {/* Facilities and honest source information */}
          <footer className="flex flex-col justify-between gap-4 border-t border-[#E3E7DA] px-5 py-4 sm:px-6 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-[#68765D]">
              <span className="flex items-center gap-1.5">
                <Wifi className="h-3.5 w-3.5 text-[#819478]" />
                {currentSpace.wifiSpeed || "Wi-Fi unknown"}
              </span>

              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-[#819478]" />
                {currentSpace.hasOutlets
                  ? "Table outlets listed"
                  : "Outlet access not guaranteed"}
              </span>
            </div>

            <p className="max-w-md text-[9px] leading-relaxed text-[#858E7A]">
              Source label: {currentSpace.dataSource || "Not provided"}
              {" · "}
              Demonstration profile, not verified live telemetry.
            </p>
          </footer>
        </div>
      </div>

    </section>
  );
}