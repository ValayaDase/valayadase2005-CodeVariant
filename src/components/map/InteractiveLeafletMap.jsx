"use client";

import { useEffect, useRef, useState } from "react";

export default function InteractiveLeafletMap({
  spaces,
  selectedSpace,
  onSelectSpace,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    let map = mapInstanceRef.current;
    let L;

    // Dynamically import Leaflet in browser only
    import("leaflet").then((leafletModule) => {
      L = leafletModule.default || leafletModule;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        // Initialize Leaflet Map centered around NYC coordinates
        map = L.map(mapContainerRef.current, {
          center: [40.7148, -74.004],
          zoom: 14,
          zoomControl: true,
          scrollWheelZoom: true,
        });

        // CartoDB Positron / OSM light tile layer perfectly styled for Warm Ivory & Sage
        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: "abcd",
            maxZoom: 19,
          }
        ).addTo(map);

        mapInstanceRef.current = map;
      }

      if (!map) return;

      // Clear existing markers
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      // Add custom SVG markers for each space
      spaces.forEach((space) => {
        const isSelected = selectedSpace?.id === space.id;

        const color =
          space.status === "quiet"
            ? "#648568"
            : space.status === "crowded"
            ? "#B86E52"
            : "#92958D";

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              background-color: ${color};
              width: ${isSelected ? "38px" : "30px"};
              height: ${isSelected ? "38px" : "30px"};
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 14px rgba(0,0,0,0.25);
              border: 3px solid #FCFBF7;
              transform: translate(-50%, -50%);
              transition: all 0.25s ease;
              cursor: pointer;
            ">
              <span style="
                color: #FCFBF7;
                font-family: monospace;
                font-size: ${isSelected ? "11px" : "9px"};
                font-weight: 700;
              ">
                ${space.noiseLevel}
              </span>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([space.lat, space.lng], { icon: customIcon }).addTo(
          map
        );

        marker.on("click", () => {
          onSelectSpace(space);
          map.flyTo([space.lat, space.lng], 15, { duration: 0.8 });
        });

        markersRef.current[space.id] = marker;
      });

      // Fly to selected space if changed externally
      if (selectedSpace) {
        map.flyTo([selectedSpace.lat, selectedSpace.lng], 15, { duration: 0.8 });
      }
    });

    return () => {
      // Map cleanup handled on container unmount
    };
  }, [isMounted, spaces, selectedSpace, onSelectSpace]);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[620px] rounded-2xl overflow-hidden border border-[#E3E0D7] shadow-xl">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: "520px" }}
        data-lenis-prevent
      />

      {/* Floating Status System Legend */}
      <div className="absolute top-4 right-4 z-[400] glass-ivory px-4 py-3 rounded-xl border border-[#E3E0D7] shadow-md flex flex-col space-y-1.5 text-xs font-mono">
        <p className="text-[10px] uppercase tracking-wider text-[#6C7168] font-bold border-b border-[#E3E0D7] pb-1">
          Acoustic Status System
        </p>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#648568]" />
          <span className="text-[#252B26]">Quiet (&lt;45 dB)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B86E52]" />
          <span className="text-[#252B26]">Crowded (&gt;65 dB)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#92958D]" />
          <span className="text-[#252B26]">Syncing / Unknown</span>
        </div>
      </div>
    </div>
  );
}
