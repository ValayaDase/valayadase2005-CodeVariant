"use client";

import React from "react";
import InteractiveMapEngine from "@/components/map/InteractiveMapEngine";

export default function VenueMap({
  venues = [],
  selectedVenueId = null,
  onSelectVenue = null,
  height = "560px",
  className = "",
}) {
  return (
    <InteractiveMapEngine
      venues={venues}
      selectedVenueId={selectedVenueId}
      onSelectVenue={onSelectVenue}
      height={height}
      className={className}
      mode="discover"
      showToolbar={true}
    />
  );
}
