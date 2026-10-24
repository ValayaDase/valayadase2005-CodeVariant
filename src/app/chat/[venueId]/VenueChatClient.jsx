"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import VenueChat from "@/components/app/VenueChat";
import { getVenueById } from "@/lib/discovery/venue-data";

export default function VenueChatClient({ venueId }) {
  const [venue] = useState(() => (venueId ? getVenueById(venueId) : null));
  const venueName = venue?.name || "Workspace";

  return (
    <AppShell
      title={`${venueName} Channel`}
      subtitle="Real-time peer chat & verified room conditions"
    >
      <div className="space-y-6 text-left max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/places/${venueId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#555D50] hover:text-[#26382B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {venueName} Overview</span>
          </Link>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#819477] px-3 py-1 rounded-full bg-white border border-[#E8E0D2]">
            Shared Venue Chat
          </span>
        </div>

        {/* Venue Chat Component */}
        <VenueChat venueId={venueId} venueName={venueName} />

        {/* Information Notice */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E0D2] text-xs text-[#555D50] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#819477] shrink-0" />
            <span>
              Messages are saved to the Spotwise database and shared with people in this venue chat. Guest names are demo identities.
            </span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
