"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Splide,
  SplideSlide,
} from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import {
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  X,
  Volume2,
  Wifi,
  AlertTriangle,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import {
  COMMUNITY_REPORTS,
  SPACES_DATA,
} from "@/data/spacesData";

import "@splidejs/react-splide/css/core";

function FormField({ id, label, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#748069]"
      >
        {label}
      </label>

      {children}
    </div>
  );
}

function ReportCard({ report, isNew, reduceMotion }) {
  const statusColor =
    report.status === "quiet"
      ? "#263D31"
      : report.status === "caution"
        ? "#A87846"
        : report.status === "crowded"
          ? "#AA6952"
          : "#7E8874";

  const statusLabel =
    report.status === "quiet"
      ? "Quiet"
      : report.status === "caution"
        ? "Moderate"
        : report.status === "crowded"
          ? "Busy"
          : "Not reported";

  return (
    <motion.article
      initial={
        isNew && !reduceMotion
          ? {
              opacity: 0,
              y: 15,
              scale: 0.97,
            }
          : false
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: reduceMotion ? 0 : 0.6,
        ease: "easeOut",
      }}
      className={`relative flex h-full min-h-[340px] w-full flex-col rounded-[26px] border bg-[#FCFBF7] p-5 shadow-[0_8px_24px_rgba(38,61,49,0.04)] sm:p-6 ${
        isNew
          ? "border-[#819478] ring-1 ring-[#819478]/30"
          : "border-[#E3E0D7]"
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider"
          style={{
            color: statusColor,
            backgroundColor: `${statusColor}12`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: statusColor }}
          />
          {statusLabel}
        </span>

        {isNew ? (
          <span className="rounded-full bg-[#E3EBDD] px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-wider text-[#263D31]">
            New · Your report
          </span>
        ) : (
          <span className="flex items-center gap-1 font-mono text-[9px] text-[#8C9580]">
            <Clock className="h-3 w-3 shrink-0" />
            {report.timeAgo}
          </span>
        )}
      </div>

      <h3 className="font-editorial text-[23px] leading-tight tracking-tight text-[#252B26]">
        {report.venue}
      </h3>

      <p className="mt-2 text-[10px] leading-relaxed text-[#7B8470]">
        {report.contributor}
      </p>

      <p className="mt-1 font-mono text-[8px] leading-relaxed text-[#617451]">
        {report.badge}
      </p>

      {/* Keyboard focus pauses auto-scroll while reading. */}
      <blockquote
        tabIndex={0}
        aria-label={`Report about ${report.venue}`}
        className="my-5 rounded-md text-sm leading-[1.8] text-[#394534] outline-none focus-visible:ring-2 focus-visible:ring-[#819478]"
      >
        “{report.comment || "No additional note provided."}”
      </blockquote>

      <div className="mt-auto space-y-2 border-t border-[#E3E7DA] pt-4">
        <div className="flex items-start gap-2 text-[10px] leading-relaxed text-[#53634A]">
          <Volume2
            className="mt-0.5 h-3 w-3 shrink-0"
            style={{ color: statusColor }}
          />
          <span>{report.noise || "Noise not reported"}</span>
        </div>

        <div className="flex items-start gap-2 text-[10px] leading-relaxed text-[#7B8470]">
          <Users className="mt-0.5 h-3 w-3 shrink-0" />
          <span>{report.crowd || "Seating not reported"}</span>
        </div>

        {report.wifi && (
          <div className="flex items-start gap-2 text-[10px] leading-relaxed text-[#7B8470]">
            <Wifi className="mt-0.5 h-3 w-3 shrink-0" />
            <span>{report.wifi}</span>
          </div>
        )}

        {report.local && (
          <p className="pt-1 font-mono text-[8px] text-[#8C9580]">
            Added on this page only · Not independently verified
          </p>
        )}
      </div>
    </motion.article>
  );
}

export default function Section08CommunityIntelligence() {
  const carouselRegionRef = useRef(null);
  const splideInstanceRef = useRef(null);
  const modalRef = useRef(null);

  const reduceMotionPreference = useReducedMotion();
  const motionAllowed = reduceMotionPreference === false;

  const [reports, setReports] = useState(() => [
    ...COMMUNITY_REPORTS,
  ]);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [newReportId, setNewReportId] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Form states
  const [venue, setVenue] = useState(
    SPACES_DATA[0]?.name ?? ""
  );

  const [noiseInput, setNoiseInput] = useState("Not reported");
  const [crowdInput, setCrowdInput] = useState("Not reported");
  const [wifiInput, setWifiInput] = useState("Not reported");
  const [commentInput, setCommentInput] = useState("");

  const shouldPlay =
    motionAllowed &&
    !paused &&
    !reportModalOpen &&
    inViewport &&
    documentVisible &&
    reports.length > 1;

  const carouselOptions = useMemo(
    () => ({
      type:
        motionAllowed && reports.length > 1
          ? "loop"
          : "slide",

      // Fixed-width cards on an edge-to-edge track.
      fixedWidth: "420px",
      perPage: 3,
      perMove: 1,
      gap: "24px",

      arrows: false,
      pagination: false,
      drag: "free",
      snap: false,
      focus: 0,
      start: 0,
      trimSpace: false,

      speed: motionAllowed ? 650 : 0,
      keyboard: "focused",
      live: false,

      autoScroll: {
        speed: 0.25,
        autoStart: false,
        pauseOnHover: true,
        pauseOnFocus: true,
      },

      breakpoints: {
        1024: {
          fixedWidth: "360px",
          gap: "18px",
        },
        640: {
          fixedWidth: "86vw",
          gap: "14px",
        },
      },
    }),
    [motionAllowed, reports.length]
  );

  // Rebuild loop clones when a report is added.
  // The newest report is prepended and starts at position zero.
  const carouselKey = `${reports.length}-${
    motionAllowed ? "motion" : "reduced"
  }`;

  useEffect(() => {
    const element = carouselRegionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setDocumentVisible(!document.hidden);
    };

    updateVisibility();

    document.addEventListener(
      "visibilitychange",
      updateVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        updateVisibility
      );
    };
  }, []);

  useEffect(() => {
    const autoScroll =
      splideInstanceRef.current?.Components?.AutoScroll;

    if (!autoScroll) return;

    if (shouldPlay) {
      autoScroll.play();
    } else {
      autoScroll.pause();
    }
  }, [shouldPlay, carouselKey]);

  // Accessible modal behavior.
  useEffect(() => {
    if (!reportModalOpen) return;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => {
      modalRef.current?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setReportModalOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = modalRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), select:not([disabled]), textarea:not([disabled]), input:not([disabled]), a[href]'
        )
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first) {
        event.preventDefault();
        dialog.focus();
        return;
      }

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

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);

      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", onKeyDown);

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus();
      }
    };
  }, [reportModalOpen]);

  function openReportModal() {
    setSubmitted(false);
    setReportModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!venue) return;

    const id =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `report-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const status =
      noiseInput === "Quiet — personal observation"
        ? "quiet"
        : noiseInput === "Moderate — personal observation"
          ? "caution"
          : noiseInput === "Loud — personal observation"
            ? "crowded"
            : "unknown";

    const newReport = {
      id,
      venue,
      contributor: "You",
      badge: "Local page contribution",
      timeAgo: "Just now",
      noise: noiseInput,
      crowd: crowdInput,
      wifi: wifiInput,
      comment:
        commentInput.trim() || "No additional note provided.",
      status,
      local: true,
    };

    setReports((current) => [newReport, ...current]);
    setNewReportId(id);
    setSubmitted(true);
    setReportModalOpen(false);
    setCommentInput("");
  }

  function moveCarousel(direction) {
    splideInstanceRef.current?.go(direction);
  }

  const fieldClass =
    "w-full rounded-xl border border-[#DDE3D3] bg-[#FCFBF7] p-3 text-xs text-[#394534] outline-none focus:border-[#819478] focus:ring-1 focus:ring-[#819478]";

  return (
    <section
      id="community"
      className="relative w-full overflow-hidden border-t border-[#E3E0D7] bg-[#F4F1E8] py-14 sm:py-16 lg:py-20"
    >
      {/* Centred heading */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <header className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#819478]/30 bg-[#E3EBDD] px-3.5 py-1.5">
              <Users className="h-3.5 w-3.5 text-[#263D31]" />

              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#263D31] sm:text-[10px]">
                 Community Intelligence
              </span>
            </div>

            <h2 className="font-editorial text-3xl leading-[1.1] tracking-tight text-[#263D31] sm:text-4xl lg:text-5xl">
              Better information.
              <span className="mt-1 block italic">
                Powered by people.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#6C7168]">
              See what people noticed about noise, seating and Wi-Fi.
              Share your own observation to help others plan.
            </p>
          </div>

          <button
            type="button"
            onClick={openReportModal}
            disabled={!SPACES_DATA.length}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-[#263D31] px-6 py-3.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#F4F1E8] shadow-md transition-colors hover:bg-[#819478] hover:text-[#252B26] disabled:cursor-not-allowed disabled:opacity-50 md:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Submit Telemetry Report</span>
          </button>
        </header>

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] leading-relaxed text-[#7E8873]">
            Sample feed + your local additions · No live sensor or
            verification service connected.
          </p>

          <span className="font-mono text-[9px] uppercase tracking-wider text-[#7E8873]">
            {reports.length} reports
          </span>
        </div>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{
                opacity: 0,
                y: motionAllowed ? 8 : 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: motionAllowed ? 0.25 : 0,
              }}
              className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-[#C9D8BC] bg-[#E3EBDD] px-4 py-3"
              role="status"
            >
              <span className="flex items-start gap-2 text-xs leading-relaxed text-[#263D31]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Your report is first in the carousel. It stays on this
                page until reload.
              </span>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="shrink-0 rounded-full p-1 text-[#536747]"
                aria-label="Dismiss confirmation"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Full-width carousel: outside the centred content container */}
      <div
        ref={carouselRegionRef}
        className="community-carousel-region relative w-full min-w-0"
      >
        {reports.length > 0 ? (
          <Splide
            key={carouselKey}
            options={carouselOptions}
            extensions={{ AutoScroll }}
            aria-label="Community reports"
            onMounted={(instance) => {
              splideInstanceRef.current = instance;

              if (shouldPlay) {
                instance.Components.AutoScroll?.play();
              } else {
                instance.Components.AutoScroll?.pause();
              }
            }}
            onDestroy={(instance) => {
              if (splideInstanceRef.current === instance) {
                splideInstanceRef.current = null;
              }
            }}
          >
            {reports.map((report) => (
              <SplideSlide key={report.id}>
                <ReportCard
                  report={report}
                  isNew={report.id === newReportId}
                  reduceMotion={!motionAllowed}
                />
              </SplideSlide>
            ))}
          </Splide>
        ) : (
          <div className="mx-5 rounded-3xl border border-[#E3E0D7] bg-[#FCFBF7] p-8 text-center sm:mx-8">
            <MessageSquare className="mx-auto mb-3 h-6 w-6 text-[#819478]" />

            <p className="font-editorial text-xl text-[#263D31]">
              Be the first to share an observation.
            </p>
          </div>
        )}
      </div>

      {/* Centred reading controls */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <footer className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-lg text-[10px] leading-relaxed text-[#849077]">
            Hover or focus a report to pause. Swipe or drag to browse.
            Use Pause to read at your own pace.
          </p>

          <div className="flex items-center gap-2">
            {motionAllowed && reports.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setPaused((current) => !current)
                }
                aria-label={
                  paused
                    ? "Resume automatic scrolling"
                    : "Pause automatic scrolling"
                }
                className="mr-1 inline-flex items-center gap-1.5 rounded-full border border-[#D8E0CF] bg-[#FCFBF7] px-3 py-2 text-[10px] text-[#536747] transition-colors hover:bg-[#E3EBDD]"
              >
                {paused ? (
                  <Play className="h-3 w-3" />
                ) : (
                  <Pause className="h-3 w-3" />
                )}

                {paused ? "Resume" : "Pause"}
              </button>
            )}

            <button
              type="button"
              onClick={() => moveCarousel("<")}
              disabled={reports.length < 2}
              aria-label="Previous report"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E0CF] bg-[#FCFBF7] text-[#263D31] transition-colors hover:bg-[#E3EBDD] disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => moveCarousel(">")}
              disabled={reports.length < 2}
              aria-label="Next report"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D8E0CF] bg-[#FCFBF7] text-[#263D31] transition-colors hover:bg-[#E3EBDD] disabled:opacity-40"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </footer>
      </div>

      {/* Submit-report modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: motionAllowed ? 0.2 : 0,
            }}
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-[#252B26]/50 p-4 backdrop-blur-sm sm:p-6"
            onClick={() => setReportModalOpen(false)}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="community-report-title"
              tabIndex={-1}
              initial={
                motionAllowed
                  ? { scale: 0.97, y: 15 }
                  : false
              }
              animate={{
                scale: 1,
                y: 0,
              }}
              exit={
                motionAllowed
                  ? { scale: 0.97, y: 15 }
                  : {}
              }
              transition={{
                duration: motionAllowed ? 0.25 : 0,
                ease: "easeOut",
              }}
              className="max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#E3E0D7] bg-[#FCFBF7] p-5 shadow-2xl outline-none sm:p-7"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#E3E0D7] pb-4">
                <div>
                  <h3
                    id="community-report-title"
                    className="font-editorial text-2xl text-[#263D31]"
                  >
                    Share what you noticed.
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-[#7B8470]">
                    Report only what you observed. Unknown is okay.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="shrink-0 rounded-full p-1.5 text-[#536747] hover:bg-[#E3EBDD]"
                  aria-label="Close report form"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <FormField
                  id="community-venue"
                  label="Place"
                >
                  <select
                    id="community-venue"
                    required
                    value={venue}
                    onChange={(event) =>
                      setVenue(event.target.value)
                    }
                    className={fieldClass}
                  >
                    {SPACES_DATA.map((space) => (
                      <option
                        key={space.id}
                        value={space.name}
                      >
                        {space.name} ({space.neighborhood})
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    id="community-noise"
                    label="How noisy did it feel?"
                  >
                    <select
                      id="community-noise"
                      value={noiseInput}
                      onChange={(event) =>
                        setNoiseInput(event.target.value)
                      }
                      className={fieldClass}
                    >
                      <option value="Not reported">
                        Not sure / Not reported
                      </option>

                      <option value="Quiet — personal observation">
                        Quiet
                      </option>

                      <option value="Moderate — personal observation">
                        Moderate
                      </option>

                      <option value="Loud — personal observation">
                        Loud
                      </option>
                    </select>
                  </FormField>

                  <FormField
                    id="community-seating"
                    label="Seating"
                  >
                    <select
                      id="community-seating"
                      value={crowdInput}
                      onChange={(event) =>
                        setCrowdInput(event.target.value)
                      }
                      className={fieldClass}
                    >
                      <option value="Not reported">
                        Not sure / Not reported
                      </option>

                      <option value="Several seats available — user report">
                        Several seats available
                      </option>

                      <option value="A few seats available — user report">
                        A few seats available
                      </option>

                      <option value="No seats seen available — user report">
                        No seats seen available
                      </option>
                    </select>
                  </FormField>
                </div>

                <FormField
                  id="community-wifi"
                  label="Wi-Fi experience"
                >
                  <select
                    id="community-wifi"
                    value={wifiInput}
                    onChange={(event) =>
                      setWifiInput(event.target.value)
                    }
                    className={fieldClass}
                  >
                    <option value="Not reported">
                      Not tested / Not reported
                    </option>

                    <option value="Wi-Fi worked well — user report">
                      Worked well for me
                    </option>

                    <option value="Wi-Fi felt slow — user report">
                      Felt slow
                    </option>

                    <option value="Wi-Fi disconnected — user report">
                      Disconnected / Unstable
                    </option>
                  </select>
                </FormField>

                <FormField
                  id="community-note"
                  label="Your observation — optional"
                >
                  <textarea
                    id="community-note"
                    rows={3}
                    maxLength={1000}
                    value={commentInput}
                    onChange={(event) =>
                      setCommentInput(event.target.value)
                    }
                    placeholder="For example: The back room was quiet, with two empty tables."
                    className={`${fieldClass} resize-y`}
                  />
                </FormField>

                <div className="flex items-start gap-2 rounded-xl border border-[#819478]/25 bg-[#E3EBDD]/60 p-3">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A87846]" />

                  <p className="text-[10px] leading-relaxed text-[#617451]">
                    Prototype: this adds a report to this page only.
                    It is not sent to a server and will disappear
                    after reload.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!venue}
                  className="w-full rounded-full bg-[#263D31] py-3.5 font-mono text-xs font-semibold uppercase tracking-widest text-[#F4F1E8] shadow-md transition-colors hover:bg-[#819478] hover:text-[#252B26] disabled:opacity-50"
                >
                  Add My Report
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}