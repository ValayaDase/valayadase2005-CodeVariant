"use client";

import { useState, useMemo, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  GripVertical,
  Navigation,
} from "lucide-react";
import {
  AnimatedVolume,
  AnimatedCrowd,
  AnimatedWifi,
  AnimatedZap,
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

const cardEntranceVariants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
  },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: Math.min(i * 0.085, 0.85),
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25 },
  },
};

export default function VenueCard({
  venue,
  suitability,
  selectedDay = "Monday",
  selectedTime = "morning",
  cardType = "venue", // "venue" | "saved_venue"
  isSelected = false,
  onSelect,
  index = 0,
}) {
  const { userLocation } = useUserLocation();
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef(null);

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
      variants={prefersReducedMotion ? reducedMotionVariants : cardEntranceVariants}
      initial="hidden"
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
                <div className="relative w-full aspect-[16/9] bg-[#E8E0D2] overflow-hidden">
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
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E0D2] text-xs font-semibold text-[#20231F] shadow-xs">
                      {venue.categoryLabel}
                    </span>
                  </div>

                  {/* Canvas Protocol Drag Indicator & Saved status badge */}
                  <div
                    className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border text-[#20231F] text-xs font-semibold shadow-xs transition-all ${
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
                  <div className="absolute bottom-3 left-3 z-10 text-[11px] font-medium text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <span>{selectedDay} {selectedTime}: {timeSlotData.status}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6">
                  {/* Title & Neighborhood */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2
                        className={`text-lg font-serif font-bold tracking-tight transition-colors duration-250 ${
                          isHovered && !isDragging ? "text-[#26382B]" : "text-[#20231F]"
                        }`}
                      >
                        <Link href={`/places/${venue.id}`}>{venue.name}</Link>
                      </h2>
                      <p className="text-xs text-[#555D50] flex flex-wrap items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#819477]" />
                        <span>{venue.neighborhood} · {venue.budget}</span>
                        {distanceKm !== null ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-[#26382B] bg-[#EBF0E9] px-2 py-0.5 rounded-full ml-1">
                            <Navigation className="w-2.5 h-2.5 text-[#819477]" />
                            <span>{formattedDistance.text}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#819477]/80 ml-1">
                            · Enable location for distance
                          </span>
                        )}
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

                  {/* Description snippet */}
                  <p className="mt-3 text-xs text-[#555D50] line-clamp-2 leading-relaxed">
                    {venue.description}
                  </p>

                  {/* Telemetry Micro-Pills with Live Animated Micro-Icons */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E8E0D2]/70 text-xs text-[#555D50]">
                    <div
                      className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors duration-250 ${
                        isHovered && !isDragging ? "bg-[#EBF0E9]/90" : "bg-[#F5F3EC]/70"
                      }`}
                    >
                      <AnimatedVolume size={15} color="#819477" />
                      <span className="truncate">
                        {timeSlotData.decibels} dB · {timeSlotData.noise}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors duration-250 ${
                        isHovered && !isDragging ? "bg-[#EBF0E9]/90" : "bg-[#F5F3EC]/70"
                      }`}
                    >
                      <AnimatedCrowd size={15} color="#819477" />
                      <span className="truncate">{timeSlotData.crowd}% Crowd</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors duration-250 ${
                        isHovered && !isDragging ? "bg-[#EBF0E9]/90" : "bg-[#F5F3EC]/70"
                      }`}
                    >
                      <AnimatedWifi size={15} color="#819477" />
                      <span className="truncate">{venue.wifiSpeed}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 p-2 rounded-xl transition-colors duration-250 ${
                        isHovered && !isDragging ? "bg-[#EBF0E9]/90" : "bg-[#F5F3EC]/70"
                      }`}
                    >
                      <AnimatedZap size={15} color="#819477" />
                      <span className="truncate">{venue.outletsAvailability}</span>
                    </div>
                  </div>

                  {/* Suitability Match Reasons Teaser */}
                  {suitability?.matchReasons?.[0] && (
                    <div
                      className={`mt-3 text-[11px] text-[#26382B] bg-[#EBF0E9] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-250 ${
                        isHovered && !isDragging ? "bg-[#DFE7DD] translate-y-[-1px]" : ""
                      }`}
                    >
                      <AnimatedSparkles size={14} color="#819477" className="shrink-0" />
                      <span className="truncate">{suitability.matchReasons[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center justify-between border-t border-[#E8E0D2]/60 text-xs">
                <span
                  className={`text-[10px] uppercase tracking-wider transition-colors duration-250 ${
                    isHovered && !isDragging ? "text-[#26382B] font-medium" : "text-[#555D50]/80"
                  }`}
                >
                  {venue.provenance}
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
