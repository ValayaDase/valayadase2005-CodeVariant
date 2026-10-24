"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Compass,
  Map as MapIcon,
  List,
  Sparkles,
  MapPin,
  ArrowUpDown,
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import DiscoveryFilters from "@/components/app/DiscoveryFilters";
import VenueCard from "@/components/app/VenueCard";
import VenueMap from "@/components/app/VenueMap";
import { getAllVenues, getUserPreferences } from "@/lib/discovery/venue-data";
import { calculateSuitability } from "@/lib/scoring/suitability";
import { CurtainReveal, RevealItem, StaggerGrid } from "@/components/motion/MotionPrimitives";
import {
  CanvasProvider,
  ActionCanvasDock,
  ComparisonDrawer,
  DropFeedbackToast,
} from "@/components/canvas";

export default function DiscoverPage() {
  const [allVenues, setAllVenues] = useState(() => getAllVenues());
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'
  const [sortBy, setSortBy] = useState("score"); // 'score', 'noise', 'crowd', 'name'
  const [selectedLocation, setSelectedLocation] = useState("London (All Districts)");
  const [selectedVenueId, setSelectedVenueId] = useState(null);
  const [cinematicEntranceComplete, setCinematicEntranceComplete] = useState(false);

  // Initialize filters from saved preferences or neutral defaults
  const [filters, setFilters] = useState(() => {
    const prefs = getUserPreferences();
    return {
      searchQuery: "",
      activity: prefs.activity || "Deep Work",
      noisePreference: prefs.noisePreference || "Any",
      budget: prefs.budget || "Any",
      day: "Monday",
      time: "morning",
      requiredFacilities: Array.isArray(prefs.requiredFacilities)
        ? prefs.requiredFacilities
        : [],
    };
  });

  useEffect(() => {
    const handleUpdate = () => {
      setAllVenues(getAllVenues());
    };
    window.addEventListener("spotwise_reports_changed", handleUpdate);
    return () => {
      window.removeEventListener("spotwise_reports_changed", handleUpdate);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setCinematicEntranceComplete(true), 1900);
    return () => window.clearTimeout(timer);
  }, []);

  const handleResetFilters = () => {
    setCinematicEntranceComplete(true);
    setFilters({
      searchQuery: "",
      activity: "Deep Work",
      noisePreference: "Any",
      budget: "Any",
      day: "Monday",
      time: "morning",
      requiredFacilities: [],
    });
  };

  // Compute suitability scores and filter matches
  const { processedVenues, suitabilityMap, insights } = useMemo(() => {
    const sMap = {};

    let filtered = allVenues.filter((venue) => {
      // 1. Text Search Filter
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesName = venue.name.toLowerCase().includes(q);
        const matchesArea = venue.neighborhood.toLowerCase().includes(q);
        const matchesDesc = venue.description.toLowerCase().includes(q);
        if (!matchesName && !matchesArea && !matchesDesc) return false;
      }

      // 2. Strict Noise Preference Filter (if specified and not 'Any')
      if (filters.noisePreference && filters.noisePreference !== "Any") {
        if (filters.noisePreference === "Quiet" && venue.noiseLevel !== "Quiet") {
          return false;
        }
      }

      // 3. Strict Budget Filter (if specified and not 'Any')
      if (filters.budget && filters.budget !== "Any") {
        const hierarchy = { Free: 0, $: 1, "$$": 2, "$$$": 3 };
        const maxBudget = hierarchy[filters.budget] ?? 3;
        const venueBudget = hierarchy[venue.budget] ?? 2;
        if (venueBudget > maxBudget) return false;
      }

      // 4. Required Facilities Filter
      if (filters.requiredFacilities && filters.requiredFacilities.length > 0) {
        const hasAll = filters.requiredFacilities.every((fac) =>
          venue.facilities?.includes(fac)
        );
        if (!hasAll) return false;
      }

      // Compute suitability score for remaining
      sMap[venue.id] = calculateSuitability(venue, filters);
      return true;
    });

    // Sort venues
    filtered.sort((a, b) => {
      if (sortBy === "score") {
        const scoreA = sMap[a.id]?.score ?? 0;
        const scoreB = sMap[b.id]?.score ?? 0;
        return scoreB - scoreA;
      }
      if (sortBy === "noise") {
        return (a.baseDecibels || 35) - (b.baseDecibels || 35);
      }
      if (sortBy === "crowd") {
        const crowdA = a.crowdSchedule?.[filters.day]?.[filters.time]?.crowd ?? 50;
        const crowdB = b.crowdSchedule?.[filters.day]?.[filters.time]?.crowd ?? 50;
        return crowdA - crowdB;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    // Calculate quick insights dynamically
    const quietCount = filtered.filter((v) => v.noiseLevel === "Quiet").length;
    const lowCrowdCount = filtered.filter((v) => {
      const crowd = v.crowdSchedule?.[filters.day]?.[filters.time]?.crowd ?? 50;
      return crowd <= 35;
    }).length;
    const avgDecibels =
      filtered.length > 0
        ? Math.round(
            filtered.reduce((acc, v) => acc + (v.baseDecibels || 30), 0) /
              filtered.length
          )
        : 30;

    return {
      processedVenues: filtered,
      suitabilityMap: sMap,
      insights: {
        total: filtered.length,
        quietCount,
        lowCrowdCount,
        avgDecibels,
      },
    };
  }, [allVenues, filters, sortBy]);

  return (
    <CanvasProvider initialPage="discover">
      <AppShell
        title="Workspace Discovery"
        subtitle="Find places that match your focus state, sensory needs, and schedule."
      >
        <div className="space-y-6 text-left pb-36">
          {/* Welcome Header & Location Selector */}
          <CurtainReveal delay={0} className="rounded-3xl">
            <div className="grid gap-4 rounded-3xl border border-[#E8E0D2] bg-white p-5 shadow-[0_4px_24px_rgba(32,35,31,0.04)] sm:p-6 md:grid-cols-[minmax(0,1fr)_15rem] md:items-center md:gap-6">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <RevealItem delay={0.08}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E0D2] bg-[#F5F3EC] px-3 py-1 text-xs font-semibold text-[#819477]">
                      <Sparkles className="h-3.5 w-3.5 text-[#819477]" />
                      <span>Sensory Match Engine Active</span>
                    </span>
                  </RevealItem>
                  <RevealItem delay={0.15}>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#26382B] px-3 py-1 text-xs font-semibold text-[#F5F3EC]">
                      <span>Canvas Protocol Active</span>
                    </span>
                  </RevealItem>
                </div>
                <RevealItem delay={0.2}>
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-[#20231F] sm:text-3xl lg:text-4xl">
                    Find your next focus spot.
                  </h1>
                </RevealItem>
                <RevealItem delay={0.28}>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#555D50]">
                    Save a place, open its full profile, or compare spaces from the Canvas Action Dock.
                  </p>
                </RevealItem>
              </div>

              <RevealItem delay={0.36} className="w-full">
                <div className="flex flex-col gap-1.5 rounded-2xl border border-[#E8E0D2] bg-[#F5F3EC]/80 p-4">
                  <label htmlFor="search-region" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#555D50]">
                    <MapPin className="h-3.5 w-3.5 text-[#819477]" />
                    <span>Current Search Region</span>
                  </label>
                  <select
                    id="search-region"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E0D2] bg-white px-3 py-2 text-xs font-semibold text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
                  >
                    <option value="London (All Districts)">London (All Districts)</option>
                    <option value="Greenwich & Maritime">Greenwich &amp; Maritime</option>
                    <option value="Bloomsbury Academic">Bloomsbury Academic</option>
                    <option value="Shoreditch & Farringdon">Shoreditch &amp; Farringdon</option>
                    <option value="Fitzrovia & Soho">Fitzrovia &amp; Soho</option>
                  </select>
                </div>
              </RevealItem>
            </div>
          </CurtainReveal>

        {/* Discovery Filter Controls */}
        <CurtainReveal delay={0.12} className="rounded-3xl">
        <DiscoveryFilters
          filters={filters}
          onChange={(nextFilters) => {
            setCinematicEntranceComplete(true);
            setFilters(nextFilters);
          }}
          onReset={handleResetFilters}
          totalMatches={processedVenues.length}
        />
        </CurtainReveal>

        {/* Dynamic Quick Insights Cards */}
        <CurtainReveal delay={0.28} className="rounded-2xl">
        <StaggerGrid delay={0.34} className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E0D2] shadow-xs">
            <p className="text-xs font-medium text-[#555D50]">Matching Sanctuaries</p>
            <p className="text-2xl font-serif font-bold text-[#26382B] mt-1">
              {insights.total}
            </p>
            <p className="text-[11px] text-[#819477] mt-0.5">Verified focus places</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E0D2] shadow-xs">
            <p className="text-xs font-medium text-[#555D50]">Quiet-Calibrated</p>
            <p className="text-2xl font-serif font-bold text-[#26382B] mt-1">
              {insights.quietCount}
            </p>
            <p className="text-[11px] text-[#819477] mt-0.5">&lt;35 dB Whisper zones</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E0D2] shadow-xs">
            <p className="text-xs font-medium text-[#555D50]">
              Low Crowd ({filters.day})
            </p>
            <p className="text-2xl font-serif font-bold text-[#26382B] mt-1">
              {insights.lowCrowdCount}
            </p>
            <p className="text-[11px] text-[#819477] mt-0.5">Plentiful open desks</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8E0D2] shadow-xs">
            <p className="text-xs font-medium text-[#555D50]">Average Decibels</p>
            <p className="text-2xl font-serif font-bold text-[#26382B] mt-1">
              {insights.avgDecibels} dB
            </p>
            <p className="text-[11px] text-[#819477] mt-0.5">Across current matches</p>
          </div>
        </StaggerGrid>
        </CurtainReveal>

        {/* View Controls & Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-[#20231F]">
              Showing {processedVenues.length} spaces
            </span>
            <span className="text-xs text-[#555D50]">
              for {filters.activity} on {filters.day} {filters.time}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-[#555D50]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#819477]" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="max-w-[min(13rem,55vw)] bg-white py-1 px-2.5 rounded-lg border border-[#E8E0D2] font-semibold text-[#20231F] focus:outline-none"
              >
                <option value="score">Focus Fit (Highest)</option>
                <option value="noise">Noise (Quietest)</option>
                <option value="crowd">Crowd (Least full)</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>

            {/* List / Map Toggle */}
            <div className="inline-flex rounded-xl bg-white p-1 border border-[#E8E0D2] shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-[#26382B] text-[#F5F3EC]"
                    : "text-[#555D50] hover:text-[#20231F]"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "map"
                    ? "bg-[#26382B] text-[#F5F3EC]"
                    : "text-[#555D50] hover:text-[#20231F]"
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results View: List or Map */}
        {processedVenues.length === 0 ? (
          /* Empty State */
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-12 text-center my-8 shadow-xs">
            <Compass className="w-12 h-12 text-[#819477] mx-auto mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#20231F]">
              No matching work spots found
            </h3>
            <p className="text-xs sm:text-sm text-[#555D50] max-w-md mx-auto mt-2 leading-relaxed">
              We couldn&apos;t find any venues meeting all your strict filters.
              Try broadening your noise preference or removing some required facilities.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26382B] text-[#F5F3EC] text-xs font-semibold hover:bg-[#20231F] transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "list" ? (
          /* Grid of Venue Cards */
          <CurtainReveal delay={0.42} className="rounded-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedVenues.map((venue, index) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                index={index}
                suitability={suitabilityMap[venue.id]}
                selectedDay={filters.day}
                selectedTime={filters.time}
                isSelected={selectedVenueId === venue.id}
                onSelect={setSelectedVenueId}
                cinematicEntrance={!cinematicEntranceComplete}
                entranceDelay={cinematicEntranceComplete ? 0 : 0.38}
              />
            ))}
          </div>
          </CurtainReveal>
        ) : (
          /* Map View */
          <div className="space-y-6">
            <VenueMap
              venues={processedVenues}
              selectedVenueId={selectedVenueId}
              onSelectVenue={setSelectedVenueId}
            />
            {/* Accompanying condensed cards below map */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedVenues.map((venue, index) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  index={index}
                  suitability={suitabilityMap[venue.id]}
                  selectedDay={filters.day}
                  selectedTime={filters.time}
                  isSelected={selectedVenueId === venue.id}
                  onSelect={setSelectedVenueId}
                  cinematicEntrance={!cinematicEntranceComplete}
                  entranceDelay={cinematicEntranceComplete ? 0 : 0.38}
                />
              ))}
            </div>
          </div>
        )}
        </div>

        {/* Canvas Protocol Dock & Overlays */}
        <ActionCanvasDock mode="discover" />
        <ComparisonDrawer />
        <DropFeedbackToast />
      </AppShell>
    </CanvasProvider>
  );
}
