"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AnimatedBookmark,
  AnimatedCompass,
  AnimatedArrowRight,
} from "@/components/common";
import AppShell from "@/components/app/AppShell";
import VenueCard from "@/components/app/VenueCard";
import { CurtainReveal } from "@/components/motion/MotionPrimitives";
import { calculateSuitability } from "@/lib/scoring/suitability";
import { backendRequest, getDemoUserId } from "@/lib/backend";
import { getAllVenues, getSavedVenueIds } from "@/lib/discovery/venue-data";
import {
  CanvasProvider,
  ActionCanvasDock,
  ComparisonDrawer,
  DropFeedbackToast,
} from "@/components/canvas";

export default function SavedPlacesPage() {
  const [savedVenues, setSavedVenues] = useState(() => {
    const localSaved = new Set(getSavedVenueIds());
    const all = getAllVenues();
    return all.filter((venue) => localSaved.has(venue.id));
  });
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    backendRequest(`/api/saved/${getDemoUserId()}`)
      .then(({ venueIds }) => {
        if (Array.isArray(venueIds)) {
          const saved = new Set(venueIds);
          setSavedVenues(getAllVenues().filter((venue) => saved.has(venue.id)));
        }
      })
      .catch(() => setBackendError("Saved places could not be loaded from the backend."));

    const handleSavedChange = () => {
      const localSaved = new Set(getSavedVenueIds());
      const all = getAllVenues();
      setSavedVenues(all.filter((venue) => localSaved.has(venue.id)));
    };

    window.addEventListener("spotwise_saved_changed", handleSavedChange);
    return () => {
      window.removeEventListener("spotwise_saved_changed", handleSavedChange);
    };
  }, []);

  return (
    <CanvasProvider initialPage="saved">
      <AppShell
        title="Saved Places"
        subtitle="Your personal collection of bookmarked focus sanctuaries."
      >
        <div className="space-y-6 text-left pb-36">
          {backendError && (
            <p role="status" className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">
              {backendError}
            </p>
          )}

          {/* Header summary */}
          <CurtainReveal className="rounded-3xl" delay={0.04}>
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477]">
                  <AnimatedBookmark size={14} isSaved className="text-[#819477]" />
                  <span>Personal Focus Sanctuary Library</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26382B] text-xs font-semibold text-[#F5F3EC]">
                  <span>Canvas Protocol Active</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
                Saved Workspaces ({savedVenues.length})
              </h1>
              <p className="text-xs sm:text-sm text-[#555D50] mt-1">
                Drag any card down to the Canvas Action Dock to Release from Saved, Plan a Session, or Compare telemetry.
              </p>
            </div>

            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-all shadow-sm shrink-0 self-start sm:self-auto"
            >
              <AnimatedCompass size={16} className="text-[#F5F3EC]" />
              <span>Explore More Spots</span>
            </Link>
          </div>
          </CurtainReveal>

          {/* Results / Empty state */}
          <CurtainReveal className="rounded-3xl" delay={0.14}>
          {savedVenues.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#E8E0D2] p-12 text-center my-8 shadow-xs">
              <AnimatedBookmark size={48} className="text-[#819477] mx-auto mb-3" />
              <h3 className="text-xl font-serif font-bold text-[#20231F]">
                No saved spaces yet
              </h3>
              <p className="text-xs sm:text-sm text-[#555D50] max-w-md mx-auto mt-2 leading-relaxed">
                When exploring the discovery directory, drag any workspace card into the &quot;Save Sanctuary&quot; zone to keep it in your personal collection.
              </p>
              <Link
                href="/discover"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26382B] text-[#F5F3EC] text-xs font-semibold hover:bg-[#20231F] transition-colors"
              >
                <span>Browse Spaces Now</span>
                <AnimatedArrowRight size={16} className="text-[#F5F3EC]" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedVenues.map((venue, index) => {
                const suitability = calculateSuitability(venue, {
                  activity: "Deep Work",
                  noisePreference: "Quiet",
                  day: "Monday",
                  time: "morning",
                });
                return (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    index={index}
                    suitability={suitability}
                    cardType="saved_venue"
                  />
                );
              })}
            </div>
          )}
          </CurtainReveal>
        </div>

        {/* Canvas Protocol Dock & Overlays */}
        <ActionCanvasDock mode="saved" />
        <ComparisonDrawer />
        <DropFeedbackToast />
      </AppShell>
    </CanvasProvider>
  );
}
