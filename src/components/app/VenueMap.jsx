"use client";

import { useEffect, useRef, useState } from "react";
import { Compass } from "lucide-react";
import LoadingLottie from "@/components/common/LoadingLottie";

export default function VenueMap({ venues = [], onSelectVenue, selectedVenueId }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      try {
        const L = (await import("leaflet")).default;
        // Inject Leaflet CSS if not already injected
        if (!document.getElementById("leaflet-css")) {
          const link = document.createElement("link");
          link.id = "leaflet-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(link);
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Center around Central / East London venues
        const map = L.map(mapContainerRef.current, {
          center: [51.513, -0.1],
          zoom: 12,
          scrollWheelZoom: false,
        });

        // Add OpenStreetMap tile layer with attribution
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Spotwise Sensory Telemetry',
          maxZoom: 18,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Custom Marker Icon Generator
        venues.forEach((venue) => {
          if (!venue.coordinates?.lat || !venue.coordinates?.lng) return;

          const isSelected = venue.id === selectedVenueId;
          const markerHtml = `
            <div style="
              background: ${isSelected ? "#26382B" : "#FFFFFF"};
              color: ${isSelected ? "#F5F3EC" : "#20231F"};
              border: 2px solid ${isSelected ? "#819477" : "#E8E0D2"};
              border-radius: 9999px;
              padding: 4px 8px;
              font-family: var(--font-sans, sans-serif);
              font-size: 11px;
              font-weight: 600;
              box-shadow: 0 4px 12px rgba(32,35,31,0.15);
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 4px;
              cursor: pointer;
            ">
              <span style="width: 6px; height: 6px; border-radius: 50%; background: #819477;"></span>
              <span>${venue.name.split(" ")[0]}</span>
              <span style="color: #819477; font-size: 10px;">${venue.baseDecibels}dB</span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: markerHtml,
            className: "spotwise-map-marker",
            iconSize: [80, 28],
            iconAnchor: [40, 14],
          });

          const marker = L.marker([venue.coordinates.lat, venue.coordinates.lng], {
            icon: customIcon,
          }).addTo(map);

          const popupContent = `
            <div style="font-family: var(--font-sans, sans-serif); padding: 4px; min-width: 180px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #819477;">
                ${venue.categoryLabel}
              </span>
              <h4 style="margin: 2px 0 4px 0; font-size: 14px; font-weight: bold; color: #20231F;">
                ${venue.name}
              </h4>
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #555D50;">
                ${venue.neighborhood} · ${venue.noiseLevel} (${venue.baseDecibels} dB)
              </p>
              <a href="/places/${venue.id}" style="
                display: inline-block;
                padding: 4px 10px;
                background: #26382B;
                color: #F5F3EC;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 600;
                text-decoration: none;
              ">
                View Details &rarr;
              </a>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on("click", () => {
            if (onSelectVenue) onSelectVenue(venue.id);
          });

          markersRef.current[venue.id] = marker;
        });

        if (isMounted) setMapLoaded(true);
      } catch (err) {
        console.warn("Failed to initialize Leaflet map:", err);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [venues, selectedVenueId, onSelectVenue]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl bg-white border border-[#E8E0D2] overflow-hidden shadow-[0_4px_24px_rgba(32,35,31,0.04)]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Map Overlay Banner */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E0D2] shadow-sm text-xs font-semibold text-[#20231F]">
          <Compass className="w-3.5 h-3.5 text-[#819477]" />
          <span>Interactive Map · OpenStreetMap Telemetry</span>
        </div>
      </div>

      {/* Fallback loading indicator */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#F5F3EC]">
          <LoadingLottie size="lg" />
        </div>
      )}
    </div>
  );
}
