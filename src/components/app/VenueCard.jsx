"use client";

import { useState, useMemo, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  GripVertical,
  Navigation,
  Volume2,
  UsersRound,
} from "lucide-react";
import {
  AnimatedSparkles,
  AnimatedBookmark,
  AnimatedArrowRight,
} from "@/components/common";
import { isVenueSaved } from "@/lib/discovery/venue-data";
import { calculateDistanceKm, formatDistance, useUserLocation } from "@/lib/location";
import DraggableCard from "@/components/canvas/DraggableCard";

function subscribeSaved(callback) {
  window.addEventListener("spotwise_saved_changed", callback);
  return () => window.removeEventListener("spotwise_saved_changed", callback);
}

function subscribeTouchMedia(callback) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(hover: none), (pointer: coarse)");
  mq.addEventListener?.("change", callback);
  return () => mq.removeEventListener?.("change", callback);
}

function getIsTouchSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

export default function VenueCard({
  venue,
  suitability,
  selectedDay = "Monday",
  selectedTime = "morning",
  cardType = "venue", // "venue" | "saved_venue"
  isSelected = false,
  onSelect,
  index = 0,
  cinematicEntrance = false,
  entranceDelay = 0,
}) {
  const { userLocation } = useUserLocation();
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef(null);
  const entranceVariants = useMemo(() => ({
    gathered: (i = 0) => ({
      opacity: 0,
      x: i % 2 === 0 ? 16 : -16,
      y: 18,
      scale: 0.88,
    }),
    hidden: { opacity: 0, y: 14, scale: 0.98 },
    visible: (i = 0) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: cinematicEntrance ? 0.54 : 0.26,
        delay: (cinematicEntrance ? entranceDelay : 0) + Math.min(i * (cinematicEntrance ? 0.07 : 0.025), cinematicEntrance ? 0.63 : 0.18),
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }), [cinematicEntrance, entranceDelay]);

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isTouch = useSyncExternalStore(
    subscribeTouchMedia,
    getIsTouchSnapshot,
    () => false
  );

  const saved = useSyncExternalStore(
    subscribeSaved,
    () => isVenueSaved(venue.id),
    () => false
  );

  // Geographic straight-line distance
  const distanceKm = useMemo(() => {
    if (!venue.coordinates || !userLocation?.lat || !userLocation?.lng) return null;
    return calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      venue.coordinates.lat,
      venue.coordinates.lng
    );
  }, [venue.coordinates, userLocation]);

  const formattedDistance = formatDistance(distanceKm, { labelType: "away" });

  // Get crowd telemetry for current selected day and timeslot
  const timeSlotData = venue.crowdSchedule?.[selectedDay]?.[selectedTime] || {
    crowd: 30,
    noise: venue.noiseLevel || "Quiet",
    decibels: venue.baseDecibels || 30,
    status: "Estimated Calm",
  };

  // Subtle 3D tilt calculation (at most 2.2 degrees)
  const handlePointerMove = (e, isDragging) => {
    if (isDragging || isTouch || prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const normX = (x / rect.width) * 2 - 1; // -1 to 1
    const normY = (y / rect.height) * 2 - 1; // -1 to 1

    setTilt({
      rotateX: Math.max(-2.2, Math.min(2.2, -normY * 2.2)),
      rotateY: Math.max(-2.2, Math.min(2.2, normX * 2.2)),
    });
    if (!isHovered) setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      layout="position"
      variants={entranceVariants}
      initial={cinematicEntrance ? "gathered" : "hidden"}
      animate="visible"
      custom={index}
      transition={{
        layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      className="h-full"
    >
      <DraggableCard
        id={venue.id}
        type={cardType}
        item={{
          ...venue,
          fitScore: suitability?.score || 85,
        }}
        showHandle={false}
        className="h-full"
      >
        {({ isDragging }) => {
          const shouldTilt = !isDragging && isHovered && !prefersReducedMotion && !isTouch;
          const shouldLift = !isDragging && isHovered && !prefersReducedMotion;

          const cardTransform = shouldTilt
            ? `perspective(1000px) translateY(-5px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
            : shouldLift
            ? `translateY(-5px)`
            : `translateY(0px)`;

          return (
            <div
              ref={cardRef}
              onPointerMove={(e) => handlePointerMove(e, isDragging)}
              onPointerLeave={handlePointerLeave}
              onMouseEnter={() => !isDragging && setIsHovered(true)}
              onClick={() => onSelect?.(venue.id)}
              className={`h-full flex flex-col justify-between rounded-3xl bg-white border overflow-hidden cursor-pointer select-none ${
                isSelected
                  ? "border-[#26382B] ring-2 ring-[#26382B] shadow-[0_14px_38px_rgba(38,56,43,0.16)]"
                  : isHovered && !isDragging
                  ? "border-[#819477] ring-1 ring-[#819477]/30 shadow-[0_16px_40px_rgba(38,56,43,0.12)]"
                  : "border-[#E8E0D2] shadow-[0_4px_24px_rgba(32,35,31,0.04)]"
              }`}
              style={{
                transform: cardTransform,
                transformStyle: "preserve-3d",
                transition: isDragging
                  ? "none"
                  : isHovered
                  ? "transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease, border-color 250ms ease, ring-color 250ms ease"
                  : "transform 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease, border-color 300ms ease, ring-color 300ms ease",
              }}
            >
              <div>
                {/* Card Image Banner */}
                <div className="relative w-full aspect-[16/7] bg-[#E8E0D2] overflow-hidden">
                  {!imgError && venue.image ? (
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className={`object-cover transition-transform duration-500 ease-out ${
                        isHovered && !isDragging ? "scale-105" : "scale-100"
                      }`}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#E8E0D2] text-[#555D50]">
                      <AnimatedSparkles size={28} color="#819477" className="mb-1" />
                      <span className="text-xs font-semibold">{venue.categoryLabel}</span>
                    </div>
                  )}

                  {/* Top category badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#E8E0D2] bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#20231F] shadow-xs sm:text-xs">
                      {venue.categoryLabel}
                    </span>
                  </div>

                  {/* Canvas Protocol Drag Indicator & Saved status badge */}
                  <div
                    className={`absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border bg-white/90 px-2.5 py-1.5 text-[10px] font-semibold text-[#20231F] shadow-xs backdrop-blur-md transition-all ${
                      isHovered && !isDragging ? "border-[#819477] bg-white" : "border-[#E8E0D2]"
                    }`}
                  >
                    <GripVertical className="w-3.5 h-3.5 text-[#819477]" />
                    <span>{saved ? "Saved · Drag" : "Drag"}</span>
                    {saved && <AnimatedBookmark size={14} isActive={true} color="#26382B" />}
                  </div>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Estimated Slot Badge */}
                  <div className="absolute bottom-2.5 left-3 z-10 rounded-md bg-black/55 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    <span>{selectedDay.slice(0, 3)} · {selectedTime} · {timeSlotData.noise}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Title & Neighborhood */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2
                        className={`line-clamp-1 text-base font-serif font-bold tracking-tight transition-colors duration-250 sm:text-lg ${
                          isHovered && !isDragging ? "text-[#26382B]" : "text-[#20231F]"
                        }`}
                      >
                        <Link href={`/places/${venue.id}`}>{venue.name}</Link>
                      </h2>
                      <p className="text-xs text-[#555D50] flex min-w-0 items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#819477]" />
                        <span className="min-w-0 truncate">{venue.neighborhood} · {venue.budget}</span>
                        {distanceKm !== null ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#26382B] bg-[#EBF0E9] px-2 py-0.5 rounded-full ml-1">
                            <Navigation className="w-2.5 h-2.5 text-[#819477]" />
                            <span>{formattedDistance.text}</span>
                          </span>
                        ) : null}
                      </p>
                    </div>

                    {/* Suitability score badge */}
                    <div className="shrink-0 text-right">
                      <span className="text-lg font-serif font-bold text-[#26382B]">
                        {suitability?.score || 85}%
                      </span>
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#819477]">
                        Fit Score
                      </span>
                    </div>
                  </div>

                  {/* Essential at-a-glance telemetry; full details remain on the venue page. */}
                    <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-[#E8E0D2]/70 text-xs text-[#555D50]">
                    <div
                      className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors duration-250 ${
                        isHovered && !isDragging ? "bg-[#EBF0E9]/90" : "bg-[#F5F3EC]/70"
                      }`}
                    >
                      <Volume2 className="h-[15px] w-[15px] shrink-0 text-[#819477]" />
                      <span className="truncate">
                        {timeSlotData.decibels} dB · {timeSlotData.noise}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors duration-250 ${
                        isHovered && !isDragging ? "bg-[#EBF0E9]/90" : "bg-[#F5F3EC]/70"
                      }`}
                    >
                      <UsersRound className="h-[15px] w-[15px] shrink-0 text-[#819477]" />
                      <span className="truncate">{timeSlotData.crowd}% Crowd</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="px-4 pb-3 pt-2 flex items-center justify-between border-t border-[#E8E0D2]/60 text-xs">
                <span
                  className={`text-[10px] uppercase tracking-wider transition-colors duration-250 ${
                    isHovered && !isDragging ? "text-[#26382B] font-medium" : "text-[#555D50]/80"
                  }`}
                >
                  <span className="line-clamp-1">{venue.provenance}</span>
                </span>
                <Link
                  href={`/places/${venue.id}`}
                  className="inline-flex items-center gap-1.5 font-semibold text-[#26382B] hover:text-[#819477] transition-colors group/link"
                >
                  <span>View Details</span>
                  <AnimatedArrowRight
                    size={15}
                    color={isHovered && !isDragging ? "#26382B" : "#819477"}
                  />
                </Link>
              </div>
            </div>
          );
        }}
      </DraggableCard>
    </motion.div>
  );
}
