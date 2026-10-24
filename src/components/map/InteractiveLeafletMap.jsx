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
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
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

        // CartoDB Positron / OSM light tile layer styled for Warm Ivory & Sage palette
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
            ? "#263D31"
            : space.status === "crowded"
            ? "#B86E52"
            : space.status === "caution"
            ? "#C58C5A"
            : "#92958D";

        const ringColor =
          space.status === "quiet"
            ? "#819478"
            : space.status === "crowded"
            ? "#E89B82"
            : space.status === "caution"
            ? "#E8BE92"
            : "#C5C7C1";

        const customIcon = L.divIcon({
          className: "custom-leaflet-marker",
          html: `
            <div style="
              background-color: ${color};
              width: ${isSelected ? "42px" : "32px"};
              height: ${isSelected ? "42px" : "32px"};
              border-radius: 9999px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              box-shadow: 0 6px 18px rgba(38,61,49,0.32);
              border: 3px solid ${isSelected ? "#FCFBF7" : ringColor};
              transform: translate(-50%, -50%);
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              cursor: pointer;
            ">
              <span style="
                color: #FCFBF7;
                font-family: monospace;
                font-size: ${isSelected ? "11px" : "10px"};
                font-weight: 700;
                line-height: 1;
              ">
                ${space.noiseLevel}
              </span>
              <span style="
                color: #E3EBDD;
                font-family: monospace;
                font-size: 7px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 1px;
              ">
                dB
              </span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
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
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[660px] rounded-3xl overflow-hidden border border-[#E3E0D7] shadow-2xl">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{ minHeight: "560px" }}
        data-lenis-prevent
      />

      {/* Floating Status System Legend */}
      <div className="absolute top-4 right-4 z-[400] glass-ivory px-4 py-3.5 rounded-2xl border border-[#E3E0D7] shadow-lg flex flex-col space-y-2 text-xs font-mono">
        <p className="text-[10px] uppercase tracking-wider text-[#6C7168] font-bold border-b border-[#E3E0D7] pb-1.5">
          Acoustic & Space Telemetry
        </p>
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#263D31]" />
          <span className="text-[#252B26] font-medium">Quiet Sanctuary (&lt;45 dB)</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C58C5A]" />
          <span className="text-[#252B26] font-medium">Caution / Variable (45–60 dB)</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B86E52]" />
          <span className="text-[#252B26] font-medium">Crowded / Loud (&gt;60 dB)</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#92958D]" />
          <span className="text-[#252B26] font-medium">Syncing / Calibrating</span>
        </div>
      </div>
    </div>
  );
}
