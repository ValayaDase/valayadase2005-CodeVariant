"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Volume2,
  Users,
  Wifi,
  Zap,
  Bookmark,
  ArrowRight,
  MapPin,
  Sparkles,
} from "lucide-react";
import { toggleSavedVenue, isVenueSaved } from "@/lib/discovery/venue-data";

export default function VenueCard({
  venue,
  suitability,
  selectedDay = "Monday",
  selectedTime = "morning",
}) {
  const [saved, setSaved] = useState(() => isVenueSaved(venue.id));
  const [imgError, setImgError] = useState(false);

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = toggleSavedVenue(venue.id);
    setSaved(updated);
  };

  // Get crowd telemetry for current selected day and timeslot
  const timeSlotData = venue.crowdSchedule?.[selectedDay]?.[selectedTime] || {
    crowd: 30,
    noise: venue.noiseLevel || "Quiet",
    decibels: venue.baseDecibels || 30,
    status: "Estimated Calm",
  };

  return (
    <div className="rounded-3xl bg-white border border-[#E8E0D2] overflow-hidden shadow-[0_4px_24px_rgba(32,35,31,0.04)] hover:shadow-[0_12px_36px_rgba(32,35,31,0.08)] transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Card Image Banner */}
        <div className="relative w-full aspect-[16/9] bg-[#E8E0D2] overflow-hidden">
          {!imgError && venue.image ? (
            <Image
              src={venue.image}
              alt={venue.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#E8E0D2] text-[#555D50]">
              <Sparkles className="w-8 h-8 text-[#819477] mb-1" />
              <span className="text-xs font-semibold">{venue.categoryLabel}</span>
            </div>
          )}

          {/* Top category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E0D2] text-xs font-semibold text-[#20231F] shadow-xs">
              {venue.categoryLabel}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={handleToggleSave}
            aria-label={saved ? "Remove from saved places" : "Save this place"}
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#E8E0D2] flex items-center justify-center text-[#20231F] hover:text-[#26382B] hover:scale-105 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-[#819477]"
          >
            <Bookmark
              className={`w-4 h-4 ${
                saved ? "fill-[#26382B] text-[#26382B]" : "text-[#555D50]"
              }`}
            />
          </button>

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
              <h2 className="text-lg font-serif font-bold text-[#20231F] tracking-tight group-hover:text-[#26382B] transition-colors">
                <Link href={`/places/${venue.id}`}>{venue.name}</Link>
              </h2>
              <p className="text-xs text-[#555D50] flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#819477]" />
                <span>{venue.neighborhood} · {venue.budget}</span>
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

          {/* Telemetry Micro-Pills */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E8E0D2]/70 text-xs text-[#555D50]">
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F5F3EC]/70">
              <Volume2 className="w-3.5 h-3.5 text-[#819477]" />
              <span className="truncate">
                {timeSlotData.decibels} dB · {timeSlotData.noise}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F5F3EC]/70">
              <Users className="w-3.5 h-3.5 text-[#819477]" />
              <span className="truncate">{timeSlotData.crowd}% Crowd</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F5F3EC]/70">
              <Wifi className="w-3.5 h-3.5 text-[#819477]" />
              <span className="truncate">{venue.wifiSpeed}</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#F5F3EC]/70">
              <Zap className="w-3.5 h-3.5 text-[#819477]" />
              <span className="truncate">{venue.outletsAvailability}</span>
            </div>
          </div>

          {/* Suitability Match Reasons Teaser */}
          {suitability?.matchReasons?.[0] && (
            <div className="mt-3 text-[11px] text-[#26382B] bg-[#EBF0E9] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#819477] shrink-0" />
              <span className="truncate">{suitability.matchReasons[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-2 flex items-center justify-between border-t border-[#E8E0D2]/60 text-xs">
        <span className="text-[10px] text-[#555D50]/80 uppercase tracking-wider">
          {venue.provenance}
        </span>
        <Link
          href={`/places/${venue.id}`}
          className="inline-flex items-center gap-1.5 font-semibold text-[#26382B] hover:text-[#819477] transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
