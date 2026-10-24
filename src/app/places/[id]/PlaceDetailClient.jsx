"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Bookmark,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import AppShell from "@/components/app/AppShell";
import SuitabilityScore from "@/components/app/SuitabilityScore";
import QuietWhenPanel from "@/components/app/QuietWhenPanel";
import CommunityReportForm from "@/components/app/CommunityReportForm";
import {
  getVenueById,
  getUserPreferences,
} from "@/lib/discovery/venue-data";
import { backendRequest, getDemoUserId } from "@/lib/backend";
import { calculateSuitability } from "@/lib/scoring/suitability";
import LoadingLottie from "@/components/common/LoadingLottie";

export default function PlaceDetailClient({ id }) {
  const [venue, setVenue] = useState(() => (id ? getVenueById(id) : null));
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const userId = getDemoUserId();
    backendRequest(`/api/saved/${userId}`)
      .then(({ venueIds }) => active && setSaved(venueIds.includes(id)))
      .catch(() => active && setSaveError("Saved places are unavailable while the backend is offline."));
    backendRequest(`/api/venues/${id}/reports`)
      .then(({ reports }) => {
        if (!active || !reports.length) return;
        setVenue((current) => current ? ({
          ...current,
          sampleReports: reports.map((report) => ({
            id: report._id,
            author: "Spotwise guest",
            timestamp: new Date(report.createdAt).toLocaleString(),
            crowd: report.crowd,
            noise: report.noise,
            wifi: report.wifi,
            outlets: report.outlets,
            note: report.note,
          })),
        }) : current);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [id]);

  const handleToggleSave = async () => {
    if (!venue) return;
    setSaveError("");
    try {
      const nextSaved = !saved;
      await backendRequest(`/api/saved/${venue.id}`, {
        method: "PUT",
        body: JSON.stringify({ userId: getDemoUserId(), saved: nextSaved }),
      });
      setSaved(nextSaved);
    } catch {
      setSaveError("Could not update saved places. Check that the backend and database are running.");
    }
  };

  const handleReportSaved = async () => {
    try {
      const { reports } = await backendRequest(`/api/venues/${venue.id}/reports`);
      setVenue((current) => current ? ({
        ...current,
        sampleReports: reports.map((report) => ({
          id: report._id,
          author: "Spotwise guest",
          timestamp: new Date(report.createdAt).toLocaleString(),
          crowd: report.crowd,
          noise: report.noise,
          wifi: report.wifi,
          outlets: report.outlets,
          note: report.note,
        })),
      }) : current);
    } catch {
      setSaveError("Report saved, but the report history could not refresh.");
    }
    setShowReportModal(false);
  };

  if (!venue) {
    return (
      <AppShell title="Venue Profile" subtitle="Loading sanctuary details...">
        <div className="py-20 text-center flex items-center justify-center">
          <LoadingLottie size="lg" />
        </div>
      </AppShell>
    );
  }

  const prefs = getUserPreferences();
  const suitability = calculateSuitability(venue, {
    activity: prefs.activity || "Deep Work",
    noisePreference: prefs.noisePreference || "Any",
    day: prefs.defaultDay || "Monday",
    time: prefs.defaultTime || "morning",
    budget: prefs.budget || "Any",
    requiredFacilities: Array.isArray(prefs.requiredFacilities)
      ? prefs.requiredFacilities
      : [],
  });

  return (
    <AppShell
      title={venue.name}
      subtitle={`${venue.categoryLabel} in ${venue.neighborhood}`}
    >
      <div className="space-y-8 text-left max-w-6xl mx-auto">
        {/* Back Link */}
        <div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#555D50] hover:text-[#26382B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery Directory</span>
          </Link>
        </div>

        {/* Hero Banner Card */}
        <div className="rounded-3xl bg-white border border-[#E8E0D2] overflow-hidden shadow-[0_8px_30px_rgba(32,35,31,0.06)]">
          <div className="relative w-full h-64 sm:h-80 lg:h-96 bg-[#E8E0D2] overflow-hidden">
            {!imgError && venue.image ? (
              <Image
                src={venue.image}
                alt={venue.name}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 text-[#555D50]">
                <Sparkles className="w-12 h-12 text-[#819477] mb-2" />
                <h2 className="text-2xl font-serif font-bold text-[#20231F]">
                  {venue.name}
                </h2>
                <p className="text-xs text-[#555D50] mt-1">
                  Sensory-verified workspace
                </p>
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E0D2] text-xs font-semibold text-[#20231F] shadow-sm">
                {venue.categoryLabel}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-[#26382B]/90 backdrop-blur-md text-xs font-medium text-[#F5F3EC]">
                {venue.provenance}
              </span>
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-6 left-6 right-6 z-10 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white drop-shadow-sm">
                  {venue.name}
                </h1>
                <p className="text-xs sm:text-sm text-[#F5F3EC]/90 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#819477]" />
                  <span>{venue.address}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                    saved
                      ? "bg-white text-[#26382B]"
                      : "bg-white/80 hover:bg-white text-[#20231F]"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      saved ? "fill-[#26382B] text-[#26382B]" : ""
                    }`}
                  />
                  <span>{saved ? "Saved" : "Save Place"}</span>
                </button>

                <Link
                  href={`/chat/${venue.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Channel Chat</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Narrative, Facilities, and Community Telemetry */}
          <div className="lg:col-span-7 space-y-8">
            {/* Description & Atmosphere */}
            <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)]">
              <h2 className="text-lg font-serif font-bold text-[#20231F] mb-3">
                Workspace Atmosphere
              </h2>
              <p className="text-sm text-[#555D50] leading-relaxed">
                {venue.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#E8E0D2]/70 text-xs">
                <div className="p-3 rounded-xl bg-[#F5F3EC]/70">
                  <span className="text-[#555D50] block text-[11px]">Wi-Fi Speed</span>
                  <span className="font-bold text-[#20231F] mt-0.5 block">
                    {venue.wifiSpeed}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F3EC]/70">
                  <span className="text-[#555D50] block text-[11px]">Power Outlets</span>
                  <span className="font-bold text-[#20231F] mt-0.5 block">
                    {venue.outletsAvailability}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F5F3EC]/70">
                  <span className="text-[#555D50] block text-[11px]">Natural Daylight</span>
                  <span className="font-bold text-[#20231F] mt-0.5 block truncate">
                    {venue.naturalLight}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Facilities Checklist */}
            <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)]">
              <h2 className="text-lg font-serif font-bold text-[#20231F] mb-4">
                Verified Amenities &amp; Equipment
              </h2>
              <div className="grid grid-cols-2 gap-3 text-xs text-[#20231F]">
                {(venue.facilities || []).map((fac) => (
                  <div
                    key={fac}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F3EC]/60 border border-[#E8E0D2]/60"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#819477] shrink-0" />
                    <span className="capitalize font-medium">
                      {fac.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Reports History */}
            <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)]">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#20231F]">
                    Community Telemetry Feed
                  </h2>
                  <p className="text-xs text-[#555D50] mt-0.5">
                    Recent reports shared by the Spotwise community
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="px-3 py-1.5 rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-colors"
                >
                  + Submit Report
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {(venue.sampleReports || []).map((rep) => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E0D2] text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#20231F]">
                        {rep.author}
                      </span>
                      <span className="text-[#819477] text-[11px]">
                        {rep.timestamp}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] text-[#555D50]">
                      <span className="px-2 py-0.5 rounded bg-white border border-[#E8E0D2]">
                        Noise: <strong>{rep.noise}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#E8E0D2]">
                        Crowd: <strong>{rep.crowd}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#E8E0D2]">
                        Wi-Fi: <strong>{rep.wifi}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#E8E0D2]">
                        Outlets: <strong>{rep.outlets}</strong>
                      </span>
                    </div>

                    {rep.note && (
                      <p className="text-[#20231F] italic pt-1">
                        &ldquo;{rep.note}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Suitability Score Breakdown & Quick Links */}
          <div className="lg:col-span-5 space-y-6">
            <SuitabilityScore suitability={suitability} />

            {/* Quick Action: Open Venue Chat */}
            <div className="p-6 rounded-3xl bg-[#26382B] text-[#F5F3EC] text-left shadow-md flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#819477] font-semibold">
                  Live Venue Channel
                </span>
                <h3 className="text-xl font-serif font-bold mt-1">
                  Chat with focused peers at {venue.name}
                </h3>
                <p className="text-xs text-[#F5F3EC]/80 mt-2 leading-relaxed">
                  Ask about current noise levels, desk availability, or share tips in real time.
                </p>
              </div>

              <Link
                href={`/chat/${venue.id}`}
                className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white hover:bg-[#FAF8F3] text-[#26382B] text-xs font-semibold transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#819477]" />
                <span>Open {venue.name} Chat</span>
              </Link>
            </div>
          </div>
        </div>
        {saveError && <p role="status" className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">{saveError}</p>}

        {/* Quiet When Full Hourly Telemetry Curve */}
        <QuietWhenPanel
          crowdSchedule={venue.crowdSchedule}
          venueName={venue.name}
        />

        {/* Report Submission Modal / Section */}
        {showReportModal && (
          <div className="pt-4">
            <CommunityReportForm
              venueId={venue.id}
              venueName={venue.name}
              onReportSubmitted={handleReportSaved}
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
