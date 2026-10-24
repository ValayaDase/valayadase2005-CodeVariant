"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Crosshair,
  AlertCircle,
  Map as MapIcon,
  CheckCircle2,
} from "lucide-react";
import {
  calculateDistanceKm,
  formatDistance,
  getDirectionsUrl,
  useUserLocation,
} from "@/lib/location";
import InteractiveMapEngine from "./InteractiveMapEngine";

export default function VenueDetailLocationSection({ venue }) {
  const {
    userLocation,
    hasLocation,
    status: locationStatus,
    errorMessage: locationError,
    requestCurrentLocation,
    setManualDistrict,
    isManual,
  } = useUserLocation();

  // Straight-line distance calculation from user's origin to this venue
  const distanceKm = useMemo(() => {
    if (!venue?.coordinates || !userLocation?.lat || !userLocation?.lng) {
      return null;
    }
    return calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      venue.coordinates.lat,
      venue.coordinates.lng
    );
  }, [venue, userLocation]);

  const formattedDistance = formatDistance(distanceKm, { labelType: "straight-line" });
  const directionsUrl = getDirectionsUrl(venue.coordinates, userLocation);

  return (
    <section
      aria-label="Venue Geographic Location and Sensory Telemetry"
      className="rounded-3xl bg-white border border-[#E8E0D2] overflow-hidden shadow-[0_4px_24px_rgba(32,35,31,0.04)]"
    >
      {/* Section Header */}
      <div className="p-6 sm:p-8 border-b border-[#E8E0D2]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477]">
              <Compass className="w-3.5 h-3.5" />
              <span>Geographic Telemetry & Navigation</span>
            </span>
            {hasLocation && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-semibold text-emerald-800">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Origin Active</span>
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
            Location & Distance
          </h2>
          <p className="mt-1 flex min-w-0 items-start gap-1.5 text-xs leading-relaxed text-[#555D50] sm:text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#819477]" />
            <span className="min-w-0 break-words" aria-label={`Full address for ${venue.name}`}>{venue.address}</span>
          </p>
        </div>

        {/* Quick External Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FAF8F3] hover:bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#20231F] transition-all"
          >
            <MapIcon className="w-3.5 h-3.5 text-[#819477]" />
            <span>Full Discovery Map</span>
          </Link>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions</span>
            <ExternalLink className="w-3 h-3 text-[#819477]" />
          </a>
        </div>
      </div>

      {/* Distance Banner / Geolocation Prompt Strip */}
      <div className="px-6 py-4 bg-[#FAF8F3] border-b border-[#E8E0D2]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white border border-[#E8E0D2] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 text-[#819477]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#819477]">
              Geodesic Telemetry
            </span>
            <p className="font-serif font-bold text-sm text-[#20231F]">
              {hasLocation ? (
                <>
                  <span className="font-mono text-base text-[#26382B]">{formattedDistance.text}</span>
                  <span className="font-normal text-xs text-[#555D50] ml-1.5">
                    from {userLocation.label}
                  </span>
                </>
              ) : (
                <span className="text-[#555D50] font-normal">
                  Enable location to calculate accurate straight-line distance to {venue.name}.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Location Action Trigger */}
        {!hasLocation ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
            {locationError && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <AlertCircle className="w-3 h-3 text-amber-700 shrink-0" />
                <span>{locationError}</span>
              </span>
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={requestCurrentLocation}
                disabled={locationStatus === "requesting"}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Crosshair className="w-3.5 h-3.5 text-[#819477]" />
                <span>{locationStatus === "requesting" ? "Locating…" : "Use Browser Location"}</span>
              </button>
              <button
                type="button"
                onClick={() => setManualDistrict("bloomsbury")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-medium text-[#20231F] transition-colors"
              >
                <span>Pick District</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[#555D50]">
            Origin Source: <strong>{isManual ? "Manual District Preference" : "Browser GPS"}</strong>
          </div>
        )}
      </div>

      {/* Interactive Map Canvas */}
      <div className="p-4 sm:p-6">
        <InteractiveMapEngine
          mode="detail"
          focusVenue={venue}
          height="420px"
          showToolbar={true}
        />
      </div>

      {/* Coordinates Verification Footer */}
      <div className="px-6 py-3.5 bg-[#FAF8F3] border-t border-[#E8E0D2]/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#555D50]">
        <div className="flex items-center gap-3">
          <span>
            Latitude: <strong className="font-mono">{venue.coordinates?.lat}</strong>
          </span>
          <span>
            Longitude: <strong className="font-mono">{venue.coordinates?.lng}</strong>
          </span>
        </div>
        <div className="italic text-[#819477]">
          Straight-line spherical calculations powered by Haversine engine
        </div>
      </div>
    </section>
  );
}
