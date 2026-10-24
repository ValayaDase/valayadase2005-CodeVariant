"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Compass, ArrowRight } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import VenueCard from "@/components/app/VenueCard";
import { getSavedVenues } from "@/lib/discovery/venue-data";
import { calculateSuitability } from "@/lib/scoring/suitability";

export default function SavedPlacesPage() {
  const [savedVenues] = useState(() => getSavedVenues());

  return (
    <AppShell
      title="Saved Places"
      subtitle="Your personal collection of bookmarked focus sanctuaries."
    >
      <div className="space-y-6 text-left">
        {/* Header summary */}
        <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477] mb-2">
              <Bookmark className="w-3.5 h-3.5" />
              <span>Personal Focus Sanctuary Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
              Saved Workspaces ({savedVenues.length})
            </h1>
            <p className="text-xs sm:text-sm text-[#555D50] mt-1">
              Easily revisit quiet spots you&apos;ve bookmarked for your next deep-work session.
            </p>
          </div>

          <Link
            href="/discover"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-all shadow-sm"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore More Spots</span>
          </Link>
        </div>

        {/* Results / Empty state */}
        {savedVenues.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-12 text-center my-8 shadow-xs">
            <Bookmark className="w-12 h-12 text-[#819477] mx-auto mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#20231F]">
              No saved spaces yet
            </h3>
            <p className="text-xs sm:text-sm text-[#555D50] max-w-md mx-auto mt-2 leading-relaxed">
              When exploring the discovery directory, tap the bookmark icon on any
              venue card to save it here for fast access.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26382B] text-[#F5F3EC] text-xs font-semibold hover:bg-[#20231F] transition-colors"
            >
              <span>Browse Spaces Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedVenues.map((venue) => {
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
                  suitability={suitability}
                />
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
