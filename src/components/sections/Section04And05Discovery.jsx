"use client";

import {
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Compass,
  Filter,
  Volume2,
  Users,
  Zap,
  Wifi,
  Clock,
  MapPin,
  X,
  ExternalLink,
  Search,
  RotateCcw,
  CheckCircle2,
  ArrowDown,
} from "lucide-react";
import { SPACES_DATA } from "@/data/spacesData";
import InteractiveLeafletMap from "@/components/map/InteractiveLeafletMap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ACTIVITIES = [
  "All",
  "Deep Work",
  "Reading & Writing",
  "Remote Calls",
  "Study Sprint",
];

const BUDGETS = ["All", "$", "$$", "$$$"];

const WIFI_OPTIONS = [
  "All",
  "High-speed (>200 Mbps)",
  "Low-latency Fiber",
];

function FilterGroup({ title, children, className = "" }) {
  return (
    <div className={`shrink-0 ${className}`}>
      <p className="mb-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#77816D]">
        {title}
      </p>

      {children}
    </div>
  );
}

function Metric({ icon: Icon, label, value, description }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#E3E0D7] bg-[#F4F1E8] p-3.5">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-[#6C7168]">
        <Icon className="h-3.5 w-3.5 shrink-0 text-[#263D31]" />
        <span>{label}</span>
      </div>

      <p className="break-words font-mono text-sm font-bold text-[#252B26]">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-relaxed text-[#718465]">
        {description}
      </p>
    </div>
  );
}

export default function Section04And05Discovery() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const mapFrameRef = useRef(null);
  const mapHostRef = useRef(null);
  const controlsRef = useRef(null);
  const hintRef = useRef(null);
  const modalRef = useRef(null);

  const reduceModalMotion = useReducedMotion();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [maxNoise, setMaxNoise] = useState(70);
  const [maxCrowd, setMaxCrowd] = useState(100);
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [minWifi, setMinWifi] = useState("All");
  const [requireOutlets, setRequireOutlets] = useState(false);

  // Selection and modal
  const [selectedSpace, setSelectedSpace] = useState(
    SPACES_DATA[0] ?? null
  );

  const [detailOpen, setDetailOpen] = useState(false);

  // Enable interactions only after the map expansion finishes.
  const [workspaceReady, setWorkspaceReady] = useState(false);

  // Reset all filters.
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedActivity("All");
    setMaxNoise(70);
    setMaxCrowd(100);
    setSelectedBudget("All");
    setMinWifi("All");
    setRequireOutlets(false);
  };

  const filteredSpaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return SPACES_DATA.filter((space) => {
      if (query) {
        const searchableText = [
          space.name,
          space.neighborhood,
          space.category,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      if (
        selectedActivity !== "All" &&
        !space.activityFit?.includes(selectedActivity)
      ) {
        return false;
      }

      if (space.noiseLevel > maxNoise) {
        return false;
      }

      if (space.crowdLevel > maxCrowd) {
        return false;
      }

      if (
        selectedBudget !== "All" &&
        space.budget !== selectedBudget
      ) {
        return false;
      }

      if (requireOutlets && !space.hasOutlets) {
        return false;
      }

      if (minWifi === "High-speed (>200 Mbps)") {
        const speed = Number.parseFloat(space.wifiSpeed);

        if (!Number.isFinite(speed) || speed <= 200) {
          return false;
        }
      }

      if (minWifi === "Low-latency Fiber") {
        const isFiber = String(space.wifiSpeed ?? "")
          .toLowerCase()
          .includes("fiber");

        const latency = Number.parseFloat(space.wifiLatency);

        // Preserves your existing fiber-or-low-latency behavior.
        if (
          !isFiber &&
          (!Number.isFinite(latency) || latency > 10)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchQuery,
    selectedActivity,
    maxNoise,
    maxCrowd,
    selectedBudget,
    minWifi,
    requireOutlets,
  ]);

  // Keep the selected marker consistent with filtered results.
  useEffect(() => {
    setSelectedSpace((current) => {
      const matchingSelection = filteredSpaces.find(
        (space) => space.id === current?.id
      );

      return matchingSelection ?? filteredSpaces[0] ?? null;
    });
  }, [filteredSpaces]);

  const handleCardClick = (space) => {
    setSelectedSpace(space);
    setDetailOpen(true);
  };

  // Avoid keyboard interaction with the map during expansion.
  useEffect(() => {
    if (mapHostRef.current) {
      mapHostRef.current.inert = !workspaceReady;
    }

    if (controlsRef.current) {
      controlsRef.current.inert = !workspaceReady;
    }
  }, [workspaceReady]);

  // Scroll-driven map expansion.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    const ctx = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
          shortScreen: "(max-height: 599px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const {
            desktop,
            shortScreen,
            reduceMotion,
          } = context.conditions;

          let lastReady = null;

          const updateReady = (ready) => {
            if (lastReady === ready) return;

            lastReady = ready;
            setWorkspaceReady(ready);
          };

          if (reduceMotion) {
            gsap.set(mapFrameRef.current, {
              clearProps: "transform,opacity",
            });

            gsap.set(controlsRef.current, {
              autoAlpha: 1,
              y: 0,
            });

            gsap.set(hintRef.current, {
              autoAlpha: 0,
            });

            updateReady(true);
            return;
          }

          if (!desktop) {
            // Keep small screen scrolling completely natural, fluid and unpinned
            gsap.set(mapFrameRef.current, {
              scale: 1,
              y: 0,
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(38,61,49,0.08)",
            });

            gsap.set(controlsRef.current, {
              autoAlpha: 1,
              y: 0,
            });

            gsap.set(hintRef.current, {
              autoAlpha: 0,
            });

            updateReady(true);
            return;
          }

          updateReady(false);

          const timeline = gsap.timeline({
            onUpdate: () => {
              updateReady(timeline.time() >= 1);
            },
            scrollTrigger: {
              trigger: stageRef.current,
              start: shortScreen ? "top 85%" : "top top",
              end: shortScreen
                ? "top 10%"
                : () =>
                  `+=${Math.round(
                    window.innerHeight * (desktop ? 0.9 : 0.6)
                  )}`,
              pin: !shortScreen,
              scrub: desktop ? 0.65 : 0.4,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline
            .fromTo(
              mapFrameRef.current,
              {
                scale: desktop ? 0.55 : 0.8,
                y: 0,
                transformOrigin: "50% 50%",
                borderRadius: desktop ? 36 : 28,
                boxShadow:
                  "0 10px 30px rgba(38,61,49,0.08)",
              },
              {
                scale: 1,
                y: 0,
                borderRadius: desktop ? 24 : 20,
                boxShadow:
                  "0 16px 45px rgba(38,61,49,0.1)",
                duration: 1,
                ease: "power2.inOut",
              },
              0
            )
            .fromTo(
              hintRef.current,
              {
                autoAlpha: 1,
              },
              {
                autoAlpha: 0,
                duration: 0.25,
                ease: "none",
              },
              0.1
            )
            .fromTo(
              controlsRef.current,
              {
                autoAlpha: 0,
                y: 18,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                ease: "power3.out",
              },
              1
            );
        }
      );
    }, sectionRef);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, []);

  // Modal: Escape, focus management, and body-scroll lock.
  useEffect(() => {
    if (!detailOpen) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      modalRef.current?.focus();
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDetailOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = modalRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]'
        )
      );

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialog)
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === dialog)
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frame);

      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleKeyDown);

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [detailOpen]);

  return (
    <section
      id="discovery"
      ref={sectionRef}
      className="sticky bottom-0 z-10 w-full border-t border-[#E3E0D7] bg-[#FCFBF7] text-[#252B26]"
    >
      {/* Short heading + near-full-view map */}
      <div
        ref={stageRef}
        className="relative flex min-h-[100svh] w-full flex-col justify-center px-3 py-4 sm:px-5 lg:px-7"
      >
        <header className="mb-3 sm:mb-4 flex flex-col items-center text-center px-4 w-full">
          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight text-[#263D31]">
            Find your work or study spot.
          </h2>

          <p className="mt-1.5 max-w-lg text-xs sm:text-sm leading-relaxed text-[#7A8470]">
            Explore the map. Filter places to fit your plans.
          </p>
        </header>

        {/* Map frame scales; its layout dimensions remain fixed. */}
        <div
          ref={mapFrameRef}
          className="relative isolate h-[78svh] min-h-[300px] w-full overflow-hidden rounded-[24px] border border-[#819478]/25 bg-[#E3EBDD] sm:h-[83svh]"
        >
          <div
            ref={mapHostRef}
            className="discovery-map-host absolute inset-0 z-0 h-full w-full"
          >
            <InteractiveLeafletMap
              spaces={filteredSpaces}
              selectedSpace={selectedSpace}
              onSelectSpace={handleCardClick}
            />
          </div>

          {/* Allows normal page scroll during map expansion. */}
          {!workspaceReady && (
            <div
              className="absolute inset-0 z-10"
              aria-hidden="true"
            />
          )}

          {/* Small-map scroll cue */}
          <div
            ref={hintRef}
            className="pointer-events-none absolute bottom-7 left-1/2 z-30 -translate-x-1/2"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-[#819478]/30 bg-[#FCFBF7]/95 px-4 py-2 shadow-sm">
              <ArrowDown className="h-3 w-3 text-[#263D31]" />

              <span className="font-mono text-[9px] uppercase tracking-wider text-[#263D31]">
                Scroll to explore
              </span>
            </div>
          </div>

          {/* Compact floating filters INSIDE the map */}
          <div
            ref={controlsRef}
            className="absolute bottom-2 left-2 right-2 sm:bottom-6 sm:left-5 sm:right-5 z-20 overflow-hidden rounded-xl sm:rounded-2xl border border-[#DDE3D4] bg-[#FCFBF7]/95 backdrop-blur-md shadow-[0_8px_25px_rgba(38,61,49,0.12)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#E3E0D7]/80 px-2.5 py-1.5 sm:px-3 sm:py-2">
              <div className="flex items-center gap-1.5 font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-[#263D31]">
                <Filter className="h-3 w-3" />
                <span>Telemetry Controls</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className="font-mono text-[8px] sm:text-[9px] text-[#708060]"
                  role="status"
                >
                  {filteredSpaces.length} spots
                </span>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 font-mono text-[8px] sm:text-[9px] text-[#6C7168] hover:text-[#263D31]"
                  aria-label="Reset all map filters"
                >
                  <RotateCcw className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div
              className="controls-scroll overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]"
              tabIndex={0}
              aria-label="Scroll horizontally for more map filters"
            >
              <div className="flex w-max min-w-full items-start gap-3 sm:gap-4 px-2.5 py-2 sm:px-3 sm:py-2.5">
                {/* Search */}
                <FilterGroup
                  title="Search places"
                  className="w-[165px] sm:w-[210px]"
                >
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-3 w-3 sm:h-3.5 sm:w-3.5 -translate-y-1/2 text-[#819478]" />

                    <input
                      type="search"
                      aria-label="Search places by name, neighborhood or category"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                      placeholder="Name or district..."
                      className="h-8 sm:h-9 w-full rounded-lg border border-[#E3E0D7] bg-[#F7F8F2] pl-7 sm:pl-8 pr-2 font-mono text-[9px] sm:text-[10px] text-[#252B26] outline-none focus:border-[#819478]"
                    />
                  </div>
                </FilterGroup>

                {/* Activity */}
                <FilterGroup title="Activity">
                  <select
                    aria-label="Intended activity"
                    value={selectedActivity}
                    onChange={(event) =>
                      setSelectedActivity(event.target.value)
                    }
                    className="h-8 sm:h-9 w-[130px] sm:w-[155px] rounded-lg border border-[#E3E0D7] bg-[#F7F8F2] px-2 font-mono text-[9px] sm:text-[10px] text-[#252B26] outline-none focus:border-[#819478]"
                  >
                    {ACTIVITIES.map((activity) => (
                      <option key={activity} value={activity}>
                        {activity}
                      </option>
                    ))}
                  </select>
                </FilterGroup>

                {/* Noise */}
                <FilterGroup
                  title={`Noise ≤ ${maxNoise} dB`}
                  className="w-[115px] sm:w-[135px]"
                >
                  <div className="flex h-8 sm:h-9 items-center">
                    <input
                      type="range"
                      aria-label="Maximum noise level"
                      min="30"
                      max="75"
                      value={maxNoise}
                      onChange={(event) =>
                        setMaxNoise(Number(event.target.value))
                      }
                      className="w-full cursor-pointer accent-[#263D31]"
                    />
                  </div>
                </FilterGroup>

                {/* Crowd */}
                <FilterGroup
                  title={`Crowd ≤ ${maxCrowd}%`}
                  className="w-[115px] sm:w-[135px]"
                >
                  <div className="flex h-8 sm:h-9 items-center">
                    <input
                      type="range"
                      aria-label="Maximum crowd level"
                      min="20"
                      max="100"
                      step="5"
                      value={maxCrowd}
                      onChange={(event) =>
                        setMaxCrowd(Number(event.target.value))
                      }
                      className="w-full cursor-pointer accent-[#263D31]"
                    />
                  </div>
                </FilterGroup>

                {/* Budget */}
                <FilterGroup title="Budget">
                  <select
                    aria-label="Budget level"
                    value={selectedBudget}
                    onChange={(event) =>
                      setSelectedBudget(event.target.value)
                    }
                    className="h-8 sm:h-9 w-[75px] sm:w-[85px] rounded-lg border border-[#E3E0D7] bg-[#F7F8F2] px-2 font-mono text-[9px] sm:text-[10px] text-[#252B26] outline-none focus:border-[#819478]"
                  >
                    {BUDGETS.map((budget) => (
                      <option key={budget} value={budget}>
                        {budget}
                      </option>
                    ))}
                  </select>
                </FilterGroup>

                {/* Wi-Fi */}
                <FilterGroup title="Wi-Fi">
                  <select
                    aria-label="Wi-Fi requirement"
                    value={minWifi}
                    onChange={(event) =>
                      setMinWifi(event.target.value)
                    }
                    className="h-8 sm:h-9 w-[155px] sm:w-[190px] rounded-lg border border-[#E3E0D7] bg-[#F7F8F2] px-2 font-mono text-[9px] sm:text-[10px] text-[#252B26] outline-none focus:border-[#819478]"
                  >
                    {WIFI_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </FilterGroup>

                {/* Outlets */}
                <FilterGroup title="Outlets">
                  <button
                    type="button"
                    aria-pressed={requireOutlets}
                    onClick={() =>
                      setRequireOutlets((current) => !current)
                    }
                    className={`inline-flex h-8 sm:h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 sm:px-3 font-mono text-[9px] sm:text-[10px] transition-colors ${
                      requireOutlets
                        ? "bg-[#263D31] text-[#F4F1E8]"
                        : "bg-[#E3EBDD] text-[#263D31]"
                    }`}
                  >
                    <Zap className="h-3 w-3" />
                    {requireOutlets ? "Required" : "Any"}
                  </button>
                </FilterGroup>
              </div>
            </div>

            <p className="border-t border-[#E3E0D7]/60 px-2.5 py-0.5 font-mono text-[6.5px] sm:text-[7px] tracking-wide text-[#849079]">
              Demo telemetry · Real NYC map coordinates
            </p>
          </div>
        </div>
      </div>

      {/* Matched spaces */}
      <div className="px-5 pb-16 pt-6 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-editorial text-2xl text-[#263D31] sm:text-3xl">
              Matched spaces
            </h3>

            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7B8470]">
              {filteredSpaces.length} results
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSpaces.map((space) => {
              const selected =
                selectedSpace?.id === space.id;

              const statusColor =
                space.status === "quiet"
                  ? "bg-[#263D31]"
                  : space.status === "caution"
                    ? "bg-[#C58C5A]"
                    : space.status === "crowded"
                      ? "bg-[#B86E52]"
                      : "bg-[#92958D]";

              return (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => handleCardClick(space)}
                  className={`rounded-2xl border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#819478] ${selected
                      ? "border-[#263D31] bg-[#F4F1E8] shadow-sm"
                      : "border-[#E3E0D7] bg-[#FCFBF7] hover:border-[#819478]"
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-start gap-2">
                        <span
                          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${statusColor}`}
                        />

                        <p className="font-editorial text-xl leading-tight text-[#252B26]">
                          {space.name}
                        </p>
                      </div>

                      <p className="mt-1 text-xs text-[#6C7168]">
                        {space.category} · {space.neighborhood}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-block rounded-full bg-[#E3EBDD] px-2.5 py-1 font-mono text-[10px] font-bold text-[#263D31]">
                        {space.noiseLevel} dB
                      </span>

                      <p className="mt-1 font-mono text-[9px] text-[#6C7168]">
                        {space.focusScore}% Match
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E3E0D7]/70 pt-3 text-[10px] text-[#6C7168]">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 shrink-0 text-[#819478]" />

                      {space.hasOutlets
                        ? "Table outlets listed"
                        : "Limited / other outlet access"}
                    </span>

                    <span className="flex items-center gap-1">
                      <Wifi className="h-3 w-3 shrink-0 text-[#819478]" />
                      {space.wifiSpeed}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredSpaces.length === 0 && (
            <div className="rounded-2xl border border-[#E3E0D7] bg-[#F4F1E8] p-8 text-center">
              <p className="font-editorial text-xl">
                No spaces match these criteria.
              </p>

              <p className="mb-5 mt-2 text-sm text-[#6C7168]">
                Try adjusting your noise, activity or facility filters.
              </p>

              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-full bg-[#263D31] px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-[#F4F1E8] transition-colors hover:bg-[#819478] hover:text-[#252B26]"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Place detail modal */}
      <AnimatePresence>
        {detailOpen && selectedSpace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: reduceModalMotion ? 0 : 0.2,
            }}
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-[#252B26]/50 p-4 backdrop-blur-sm sm:p-6"
            onClick={() => setDetailOpen(false)}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="spotwise-place-title"
              tabIndex={-1}
              initial={
                reduceModalMotion
                  ? { opacity: 1 }
                  : { scale: 0.97, y: 16 }
              }
              animate={{
                scale: 1,
                y: 0,
                opacity: 1,
              }}
              exit={
                reduceModalMotion
                  ? { opacity: 0 }
                  : {
                    scale: 0.97,
                    y: 16,
                    opacity: 0,
                  }
              }
              transition={{
                duration: reduceModalMotion ? 0 : 0.25,
                ease: "easeOut",
              }}
              className="max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#E3E0D7] bg-[#FCFBF7] shadow-2xl outline-none"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative h-56 w-full sm:h-64">
                <Image
                  src={selectedSpace.image}
                  alt={selectedSpace.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 672px, 100vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#252B26]/90 via-[#252B26]/30 to-transparent" />

                <button
                  type="button"
                  onClick={() => setDetailOpen(false)}
                  className="absolute right-4 top-4 rounded-full bg-[#FCFBF7]/95 p-2 text-[#252B26] transition-colors hover:bg-[#E3EBDD]"
                  aria-label="Close place details"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="absolute bottom-5 left-5 right-5 text-white sm:left-6 sm:right-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#E3EBDD]">
                    {selectedSpace.category}
                  </p>

                  <h3
                    id="spotwise-place-title"
                    className="mt-1 font-editorial text-2xl sm:text-3xl"
                  >
                    {selectedSpace.name}
                  </h3>

                  <p className="mt-2 flex items-start gap-1.5 text-xs text-white/80">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                    <span>
                      {selectedSpace.neighborhood} · Hours:{" "}
                      {selectedSpace.hours}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#E3EBDD] px-3 py-1 font-mono text-[10px] font-bold text-[#263D31]">
                    {selectedSpace.focusScore}% Focus Fit
                  </span>

                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#7B8470]">
                    Demo dataset
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-[#252B26]">
                  {selectedSpace.description}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric
                    icon={Volume2}
                    label="Noise"
                    value={`${selectedSpace.noiseLevel} dB`}
                    description={selectedSpace.noiseLabel}
                  />

                  <Metric
                    icon={Users}
                    label="Occupancy"
                    value={`${selectedSpace.crowdLevel}%`}
                    description={selectedSpace.crowdLabel}
                  />

                  <Metric
                    icon={Wifi}
                    label="Wi-Fi"
                    value={selectedSpace.wifiSpeed}
                    description={`Ping ${selectedSpace.wifiLatency}`}
                  />

                  <Metric
                    icon={Zap}
                    label="Outlets"
                    value={
                      selectedSpace.hasOutlets
                        ? "Available"
                        : "Limited"
                    }
                    description="Listed facility information"
                  />
                </div>

                <div className="rounded-2xl border border-[#819478]/30 bg-[#E3EBDD]/50 p-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#263D31]" />

                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#263D31]">
                      Recommendation rationale
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed text-[#263D31]/85">
                    {selectedSpace.rationale}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[#6C7168]">
                  <span>
                    Data source: {selectedSpace.dataSource}
                  </span>

                  <span className="font-semibold text-[#263D31]">
                    {selectedSpace.statusLabel}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#E3E0D7] pt-4">
                  <a
                    href="#quiet-when"
                    onClick={() => setDetailOpen(false)}
                    className="flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#263D31] hover:underline"
                  >
                    <span>View Hourly Quiet Telemetry</span>
                    <Clock className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${selectedSpace.lat},${selectedSpace.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#263D31] px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#F4F1E8] shadow-sm transition-colors hover:bg-[#819478] hover:text-[#252B26]"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .controls-scroll {
          scrollbar-width: thin;
          scrollbar-color: #becab1 #f4f1e8;
        }

        .controls-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .controls-scroll::-webkit-scrollbar-track {
          background: #f4f1e8;
        }

        .controls-scroll::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: #becab1;
        }

        .discovery-map-host > :global(div) {
          height: 100% !important;
          min-height: 0 !important;
        }

        .discovery-map-host :global(.leaflet-container) {
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>
    </section>
  );
}
