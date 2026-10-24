"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Crosshair,
  Maximize2,
  Navigation,
  MapPin,
  Volume2,
  Wifi,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronDown,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  calculateDistanceKm,
  formatDistance,
  useUserLocation,
  CURATED_DISTRICTS,
} from "@/lib/location";
import { createVenueDivIcon, createUserLocationDivIcon } from "./map-marker-utils";

export default function InteractiveMapEngine({
  venues = [],
  selectedVenueId = null,
  onSelectVenue = null,
  mode = "discover", // "discover" | "detail"
  focusVenue = null, // specific venue when mode === 'detail'
  className = "",
  height = "560px",
  showToolbar = true,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const connectionLineRef = useRef(null);
  const leafletModuleRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState("");
  const [tileTheme, setTileTheme] = useState("warm"); // 'warm' | 'clean'
  const [districtModalOpen, setDistrictModalOpen] = useState(false);
  const [previewVenue, setPreviewVenue] = useState(null);

  const {
    userLocation,
    status: locationStatus,
    errorMessage: locationError,
    requestCurrentLocation,
    setManualDistrict,
    clearLocation,
    hasLocation,
    isManual,
  } = useUserLocation();

  // Active venue for preview
  const activeVenue = useMemo(() => {
    if (mode === "detail" && focusVenue) return focusVenue;
    if (previewVenue) return previewVenue;
    if (selectedVenueId) {
      return venues.find((v) => v.id === selectedVenueId) || null;
    }
    return null;
  }, [mode, focusVenue, previewVenue, selectedVenueId, venues]);

  // Compute straight-line distance to active venue
  const activeDistance = useMemo(() => {
    if (!activeVenue?.coordinates || !userLocation) return null;
    return calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      activeVenue.coordinates.lat,
      activeVenue.coordinates.lng
    );
  }, [activeVenue, userLocation]);

  // Center coordinates calculation
  const defaultCenter = useMemo(() => {
    if (mode === "detail" && focusVenue?.coordinates) {
      return [focusVenue.coordinates.lat, focusVenue.coordinates.lng];
    }
    if (selectedVenueId) {
      const v = venues.find((item) => item.id === selectedVenueId);
      if (v?.coordinates) return [v.coordinates.lat, v.coordinates.lng];
    }
    if (userLocation?.lat && userLocation?.lng) {
      return [userLocation.lat, userLocation.lng];
    }
    return [51.5135, -0.108]; // Central London
  }, [mode, focusVenue, selectedVenueId, venues, userLocation]);

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    let isMounted = true;
    let resizeObserver;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      try {
        const leafletModule = await import("leaflet");
        if (!isMounted || !mapContainerRef.current) return;
        const L = leafletModule.default || leafletModule;
        leafletModuleRef.current = L;

        // Clean up previous instance
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
          center: defaultCenter,
          zoom: mode === "detail" ? 15 : 13,
          zoomControl: false, // We render premium custom zoom controls
          scrollWheelZoom: true,
          fadeAnimation: true,
          attributionControl: true,
        });

        // Set attribution prefix
        map.attributionControl.setPrefix(
          '<a href="https://leafletjs.com" title="Leaflet interactive maps" target="_blank" rel="noopener">Leaflet</a>'
        );

        // Standard OpenStreetMap tiles (legitimate, zero watermark, visible attribution)
        const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        const attribution =
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors';

        const tileLayer = L.tileLayer(tileUrl, {
          attribution,
          maxZoom: 19,
          subdomains: ["a", "b", "c"],
        }).addTo(map);

        map._spotwiseTileLayer = tileLayer;
        mapInstanceRef.current = map;

        if (typeof ResizeObserver !== "undefined") {
          resizeObserver = new ResizeObserver(() => map.invalidateSize());
          resizeObserver.observe(mapContainerRef.current);
        }
        requestAnimationFrame(() => {
          if (isMounted && mapInstanceRef.current === map) map.invalidateSize(true);
        });

        // Apply initial warm ivory botanical filter
        const tilePane = map.getPane("tilePane");
        if (tilePane) {
          tilePane.style.filter =
            tileTheme === "warm"
              ? "sepia(20%) saturate(88%) contrast(98%) brightness(101%)"
              : "none";
        }

        if (isMounted) {
          setMapError("");
          setMapLoaded(true);
        }
      } catch (err) {
        console.warn("Leaflet map initialization failed:", err);
        if (isMounted) setMapError("The map could not load. Check your connection and refresh the page.");
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Adjust tile warmth filter dynamically
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapLoaded) return;
    const tilePane = map.getPane("tilePane");
    if (tilePane) {
      tilePane.style.filter =
        tileTheme === "warm"
          ? "sepia(20%) saturate(88%) contrast(98%) brightness(101%)"
          : "none";
    }
  }, [tileTheme, mapLoaded]);

  // 3. Render and Update Venue Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletModuleRef.current;
    if (!map || !L || !mapLoaded) return;

    // Clear previous venue markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const venueList = mode === "detail" && focusVenue ? [focusVenue] : venues;

    venueList.forEach((venue) => {
      if (!venue.coordinates?.lat || !venue.coordinates?.lng) return;

      const isSelected = venue.id === selectedVenueId;
      const customIcon = createVenueDivIcon(L, venue, {
        isSelected,
        fitScore: venue.fitScore || null,
      });

      const marker = L.marker([venue.coordinates.lat, venue.coordinates.lng], {
        icon: customIcon,
        title: venue.name,
        zIndexOffset: isSelected ? 1000 : 100,
        riseOnHover: true,
      }).addTo(map);

      marker.on("click", () => {
        setPreviewVenue(venue);
        if (onSelectVenue) onSelectVenue(venue.id);
        map.flyTo([venue.coordinates.lat, venue.coordinates.lng], 14, {
          duration: 0.8,
          easeLinearity: 0.25,
        });
      });

      markersRef.current[venue.id] = marker;
    });

    // In detail mode, center directly on focus venue
    if (mode === "detail" && focusVenue?.coordinates) {
      map.setView([focusVenue.coordinates.lat, focusVenue.coordinates.lng], 15);
    }
  }, [venues, selectedVenueId, mode, focusVenue, mapLoaded, onSelectVenue]);

  // 3b. Fly to venue when selected externally (e.g. card click)
  useEffect(() => {
    if (!selectedVenueId || mode !== "discover" || !mapLoaded) return;
    const targetVenue = venues.find((v) => v.id === selectedVenueId);
    if (!targetVenue?.coordinates?.lat || !targetVenue?.coordinates?.lng) return;
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([targetVenue.coordinates.lat, targetVenue.coordinates.lng], 14, {
        duration: 0.8,
        easeLinearity: 0.25,
      });
    }
  }, [selectedVenueId, venues, mode, mapLoaded]);

  // 4. Render User Location Marker and Accuracy Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletModuleRef.current;
    if (!map || !L || !mapLoaded) return;

    // Remove old user marker and circle
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove();
      accuracyCircleRef.current = null;
    }

    if (userLocation?.lat && userLocation?.lng) {
      const userIcon = createUserLocationDivIcon(L, {
        accuracy: userLocation.accuracy,
        isManual,
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
        zIndexOffset: 1200,
        title: userLocation.label || "Your Location",
      }).addTo(map);

      // Add soft botanical accuracy circle
      if (userLocation.accuracy && userLocation.accuracy < 1000) {
        accuracyCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
          radius: userLocation.accuracy,
          color: isManual ? "#C58C5A" : "#819477",
          fillColor: isManual ? "#C58C5A" : "#819477",
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: "4, 6",
        }).addTo(map);
      }
    }
  }, [userLocation, isManual, mapLoaded]);

  // 5. In Detail Mode: Render Geodesic Line Connecting User and Venue
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletModuleRef.current;
    if (!map || !L || !mapLoaded) return;

    if (connectionLineRef.current) {
      connectionLineRef.current.remove();
      connectionLineRef.current = null;
    }

    if (
      mode === "detail" &&
      focusVenue?.coordinates &&
      userLocation?.lat &&
      userLocation?.lng
    ) {
      const lineCoords = [
        [userLocation.lat, userLocation.lng],
        [focusVenue.coordinates.lat, focusVenue.coordinates.lng],
      ];

      connectionLineRef.current = L.polyline(lineCoords, {
        color: "#26382B",
        weight: 3,
        dashArray: "6, 8",
        opacity: 0.8,
      }).addTo(map);

      // Fit map to show both user and venue
      map.fitBounds(L.latLngBounds(lineCoords), {
        padding: [60, 60],
        maxZoom: 16,
      });
    }
  }, [mode, focusVenue, userLocation, mapLoaded]);

  // Map Controls
  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  }, []);

  const handleFitAllVenues = useCallback(() => {
    const map = mapInstanceRef.current;
    const L = leafletModuleRef.current;
    if (!map || !L) return;

    const coords = (mode === "detail" && focusVenue ? [focusVenue] : venues)
      .filter((v) => v.coordinates?.lat && v.coordinates?.lng)
      .map((v) => [v.coordinates.lat, v.coordinates.lng]);

    if (userLocation?.lat && userLocation?.lng) {
      coords.push([userLocation.lat, userLocation.lng]);
    }

    if (coords.length > 0) {
      map.fitBounds(L.latLngBounds(coords), {
        padding: [50, 50],
        maxZoom: 15,
      });
    }
  }, [venues, mode, focusVenue, userLocation]);

  const handleRecenterOnUser = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation?.lat && userLocation?.lng) {
      map.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1 });
    } else {
      requestCurrentLocation();
    }
  }, [userLocation, requestCurrentLocation]);

  const handleRecenterOnVenue = useCallback(() => {
    const map = mapInstanceRef.current;
    const venue = mode === "detail" ? focusVenue : activeVenue;
    if (map && venue?.coordinates) {
      map.flyTo([venue.coordinates.lat, venue.coordinates.lng], 15, { duration: 1 });
    }
  }, [mode, focusVenue, activeVenue]);

  return (
    <div
      className={`relative w-full rounded-3xl bg-white border border-[#E8E0D2] overflow-hidden shadow-[0_8px_30px_rgba(32,35,31,0.06)] ${className}`}
      style={{ height }}
    >
      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Top Floating Map Header / Toolbar */}
      {showToolbar && (
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Status Badge */}
          <div className="pointer-events-auto inline-flex max-w-full items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E0D2] text-xs font-semibold text-[#20231F] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#819477] animate-pulse" />
            <Compass className="w-3.5 h-3.5 text-[#819477]" />
            <span className="truncate max-w-[54vw] sm:max-w-none">
              {mode === "detail"
                ? `Sensory Telemetry Map · ${focusVenue?.name || "Sanctuary"}`
                : `Interactive Map Engine · ${venues.length} Sanctuaries`}
            </span>
          </div>

          {/* Theme & District Origin Pill */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTileTheme((prev) => (prev === "warm" ? "clean" : "warm"))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E0D2] hover:bg-[#F5F3EC] text-xs font-medium text-[#20231F] shadow-xs transition-colors"
              title="Toggle Map Style"
            >
              <Layers className="w-3.5 h-3.5 text-[#819477]" />
              <span className="hidden sm:inline">Theme:</span>
              <span className="font-semibold">{tileTheme === "warm" ? "Warm Ivory" : "Clean"}</span>
            </button>

            <button
              type="button"
              onClick={() => setDistrictModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E0D2] hover:bg-[#F5F3EC] text-xs font-medium text-[#20231F] shadow-xs transition-colors"
              title="Select manual starting district"
            >
              <MapPin className="w-3.5 h-3.5 text-[#819477]" />
              <span className="hidden sm:inline">Origin:</span>
              <span className="font-semibold truncate max-w-[120px]">
                {hasLocation ? (isManual ? userLocation.label.split("&")[0] : "GPS Active") : "Set District"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#555D50]" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Map Navigation Controls (Right Edge) */}
      <div className="absolute right-4 top-16 sm:top-20 z-20 flex flex-col gap-2 pointer-events-auto">
        {/* Locate Me Button */}
        <button
          type="button"
          onClick={handleRecenterOnUser}
          className={`w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E0D2] shadow-md flex items-center justify-center transition-all ${
            hasLocation
              ? "text-[#26382B] hover:bg-[#EBF0E9]"
              : "text-[#555D50] hover:text-[#26382B] hover:bg-white"
          }`}
          title={hasLocation ? "Recenter on your location" : "Enable browser geolocation"}
          aria-label="Locate me on map"
        >
          {locationStatus === "requesting" ? (
            <Loader2 className="w-4 h-4 text-[#819477] animate-spin" />
          ) : (
            <Crosshair
              className={`w-4 h-4 ${hasLocation ? "text-emerald-700 stroke-[2.4]" : "text-[#555D50]"}`}
            />
          )}
        </button>

        {/* Fit All Venues Button */}
        <button
          type="button"
          onClick={handleFitAllVenues}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E0D2] shadow-md flex items-center justify-center text-[#555D50] hover:text-[#26382B] hover:bg-[#F5F3EC] transition-all"
          title="Fit all sanctuaries in view"
          aria-label="Fit all sanctuaries in view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Zoom In */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E0D2] shadow-md flex items-center justify-center text-base font-bold text-[#20231F] hover:bg-[#F5F3EC] transition-all"
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E8E0D2] shadow-md flex items-center justify-center text-base font-bold text-[#20231F] hover:bg-[#F5F3EC] transition-all"
          title="Zoom out"
          aria-label="Zoom out"
        >
          &minus;
        </button>

        {/* Recenter on Venue (in detail mode) */}
        {mode === "detail" && (
          <button
            type="button"
            onClick={handleRecenterOnVenue}
            className="w-10 h-10 rounded-2xl bg-[#26382B] text-[#F5F3EC] shadow-md flex items-center justify-center hover:bg-[#20231F] transition-all"
            title="Recenter on venue"
            aria-label="Recenter on venue"
          >
            <Navigation className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Geolocation Notice Banner (Shows error or prompt if denied/unavailable) */}
      {locationError && (
        <div className="absolute top-16 left-4 right-16 sm:right-auto sm:max-w-md z-20 pointer-events-auto">
          <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-amber-300 p-3 shadow-md flex items-start gap-2.5 text-xs text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Location Notice</p>
              <p className="text-[11px] text-[#555D50] mt-0.5">{locationError}</p>
            </div>
            <button
              type="button"
              onClick={() => setDistrictModalOpen(true)}
              className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] shrink-0"
            >
              Choose District
            </button>
          </div>
        </div>
      )}

      {/* Floating Selected Venue Preview Card (Bottom Left) */}
      {activeVenue && mode === "discover" && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 pointer-events-auto">
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#E8E0D2] shadow-[0_12px_40px_rgba(32,35,31,0.18)] p-4 text-left transition-all">
            <div className="flex items-start gap-3">
              {/* Photo Thumbnail */}
              <div className="relative w-16 h-16 rounded-2xl bg-[#E8E0D2] overflow-hidden shrink-0">
                {activeVenue.image ? (
                  <Image
                    src={activeVenue.image}
                    alt={activeVenue.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#555D50]">
                    <Sparkles className="w-6 h-6 text-[#819477]" />
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#819477]">
                    {activeVenue.categoryLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewVenue(null)}
                    className="p-1 rounded-full text-[#555D50] hover:text-[#20231F] hover:bg-[#F5F3EC]"
                    aria-label="Close preview"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-serif font-bold text-[#20231F] truncate mt-0.5">
                  <Link href={`/places/${activeVenue.id}`} className="hover:text-[#26382B]">
                    {activeVenue.name}
                  </Link>
                </h4>

                <p className="text-xs text-[#555D50] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#819477]" />
                  <span>{activeVenue.neighborhood}</span>
                  {activeDistance !== null && (
                    <span className="font-mono text-[#26382B] font-semibold ml-1">
                      · {formatDistance(activeDistance).text}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Telemetry Micro-Row */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-[#E8E0D2]/70 text-[11px] text-[#555D50]">
              <div className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#819477]" />
                <span>{activeVenue.baseDecibels} dB · {activeVenue.noiseLevel}</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-[#819477]" />
                <span>{activeVenue.wifiSpeed}</span>
              </div>
              <Link
                href={`/places/${activeVenue.id}`}
                className="inline-flex items-center gap-1 font-semibold text-[#26382B] hover:text-[#819477] ml-auto"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Manual District Selection Modal / Popover */}
      {districtModalOpen && (
        <div
          className="absolute inset-0 z-50 bg-[#20231F]/40 backdrop-blur-xs flex items-center justify-center p-4 pointer-events-auto"
          onClick={() => setDistrictModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white border border-[#E8E0D2] shadow-2xl p-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#E8E0D2]">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#20231F]">
                  Select Starting Location
                </h3>
                <p className="text-xs text-[#555D50] mt-0.5">
                  Choose your neighborhood to compute accurate straight-line distances.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDistrictModalOpen(false)}
                className="p-1 rounded-full text-[#555D50] hover:text-[#20231F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS Trigger Button */}
            <div className="my-4">
              <button
                type="button"
                onClick={() => {
                  requestCurrentLocation();
                  setDistrictModalOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Crosshair className="w-4 h-4 text-[#819477]" />
                <span>Use My Exact Browser Location (GPS)</span>
              </button>
            </div>

            <div className="text-[11px] uppercase tracking-wider font-semibold text-[#819477] mb-2">
              Or Select a Curated District:
            </div>

            {/* District Grid */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {CURATED_DISTRICTS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setManualDistrict(d.id);
                    setDistrictModalOpen(false);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([d.lat, d.lng], 14, { duration: 1 });
                    }
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                    userLocation?.districtId === d.id
                      ? "border-[#26382B] bg-[#EBF0E9]"
                      : "border-[#E8E0D2] hover:border-[#819477] hover:bg-[#FAF8F3]"
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-serif font-bold text-[#20231F]">{d.name}</h5>
                    <p className="text-[11px] text-[#555D50]">{d.description}</p>
                  </div>
                  {userLocation?.districtId === d.id && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#26382B] text-white">
                      Active
                    </span>
                  )}
                </button>
              ))}
            </div>

            {hasLocation && (
              <div className="mt-4 pt-3 border-t border-[#E8E0D2] flex justify-between items-center text-xs">
                <span className="text-[#555D50]">
                  Active: <strong>{userLocation.label}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearLocation();
                    setDistrictModalOpen(false);
                  }}
                  className="text-red-600 hover:underline font-semibold"
                >
                  Clear Origin
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initial Map Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#F5F3EC]">
          <div className="flex flex-col items-center gap-2">
            {mapError ? (
              <>
                <AlertCircle className="w-8 h-8 text-amber-700" />
                <span role="status" className="max-w-sm px-4 text-center text-xs font-semibold text-[#20231F]">
                  {mapError}
                </span>
              </>
            ) : (
              <>
                <Loader2 className="w-8 h-8 text-[#819477] animate-spin" />
                <span className="text-xs font-serif font-bold text-[#20231F]">
                  Initializing Interactive Map Engine…
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
