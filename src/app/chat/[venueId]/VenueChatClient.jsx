"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, ShieldCheck } from "lucide-react";
import AppShell from "@/components/app/AppShell";
import VenueChat from "@/components/app/VenueChat";
import { getVenueById } from "@/lib/discovery/venue-data";

export default function VenueChatClient({ venueId }) {
  const [venue] = useState(() => (venueId ? getVenueById(venueId) : null));
  const venueName = venue?.name || "Workspace";

  return (
    <AppShell
      title={`${venueName} Channel`}
      subtitle="Shared venue chat with automatic refresh"
    >
      <div className="space-y-6 text-left max-w-6xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/places/${venueId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#555D50] hover:text-[#26382B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {venueName} Overview</span>
          </Link>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#819477] px-3.5 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-xs flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#819477]" />
            <span>Shared Venue Chat</span>
          </span>
        </div>

        {/* Venue Chat Component */}
        <VenueChat key={venueId} venue={venue} venueId={venueId} venueName={venueName} />

        
      </div>
    </AppShell>
  );
}
