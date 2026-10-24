"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Filter,
  Volume2,
  Users,
  Zap,
  Wifi,
  Clock,
  MapPin,
  X,
  ExternalLink,
  Search,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { SPACES_DATA } from "@/data/spacesData";
import InteractiveLeafletMap from "@/components/map/InteractiveLeafletMap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Section04And05Discovery() {
  const sectionRef = useRef(null);
  const zoomHeaderRef = useRef(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [maxNoise, setMaxNoise] = useState(70);
  const [maxCrowd, setMaxCrowd] = useState(100);
  const [selectedBudget, setSelectedBudget] = useState("All");
  const [minWifi, setMinWifi] = useState("All");
  const [requireOutlets, setRequireOutlets] = useState(false);

  // Selection & Modal States
  const [selectedSpace, setSelectedSpace] = useState(SPACES_DATA[0]);
  const [detailOpen, setDetailOpen] = useState(false);

  const activities = [
    "All",
    "Deep Work",
    "Reading & Writing",
    "Remote Calls",
    "Study Sprint",
  ];

  const budgets = ["All", "$", "$$", "$$$"];
  const wifiOptions = ["All", "High-speed (>200 Mbps)", "Low-latency Fiber"];

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedActivity("All");
    setMaxNoise(70);
    setMaxCrowd(100);
    setSelectedBudget("All");
    setMinWifi("All");
    setRequireOutlets(false);
  };

  // Filter logic
  const filteredSpaces = useMemo(() => {
    return SPACES_DATA.filter((space) => {
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = space.name.toLowerCase().includes(query);
        const matchesNeighborhood = space.neighborhood.toLowerCase().includes(query);
        const matchesCategory = space.category.toLowerCase().includes(query);
        if (!matchesName && !matchesNeighborhood && !matchesCategory) return false;
      }

      // Activity
      if (selectedActivity !== "All" && !space.activityFit.includes(selectedActivity)) {
        return false;
      }

      // Max noise
      if (space.noiseLevel > maxNoise) {
        return false;
      }

      // Max crowd
      if (space.crowdLevel > maxCrowd) {
        return false;
      }

      // Budget
      if (selectedBudget !== "All" && space.budget !== selectedBudget) {
        return false;
      }

      // Guaranteed Outlets
      if (requireOutlets && !space.hasOutlets) {
        return false;
      }

      // Wifi requirement
      if (minWifi === "High-speed (>200 Mbps)") {
        const speedNum = parseInt(space.wifiSpeed);
        if (isNaN(speedNum) || speedNum < 200) return false;
      } else if (minWifi === "Low-latency Fiber") {
        if (!space.wifiSpeed.toLowerCase().includes("fiber") && parseInt(space.wifiLatency) > 10) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchQuery,
    selectedActivity,
    maxNoise,
    maxCrowd,
    selectedBudget,
    minWifi,
    requireOutlets,
  ]);

  const handleCardClick = (space) => {
    setSelectedSpace(space);
    setDetailOpen(true);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Progressive map reveal zoom effect header
      gsap.fromTo(
        zoomHeaderRef.current,
        { scale: 0.94, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: zoomHeaderRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="discovery"
      ref={sectionRef}
      className="relative w-full bg-[#FCFBF7] py-24 px-6 sm:px-8 lg:px-12 border-t border-[#E3E0D7]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section 04: Progressive Map Reveal Header matching Master Prompt */}
        <div ref={zoomHeaderRef} className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E3EBDD] border border-[#819478]/30 w-fit mb-4">
            <Compass className="w-3.5 h-3.5 text-[#263D31]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#263D31] font-semibold">
              Sections 04 & 05 · Meet Spotwise & Discovery Workspace
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#252B26] tracking-tight leading-[1.08] mb-4">
            Meet Spotwise. <br />
            <span className="text-[#263D31] italic">Find the right space at the right time.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6C7168] leading-relaxed">
            From regional overview to neighbourhood acoustics. Use the left telemetry panel to filter verified quiet sanctuaries, crowd patterns, and power outlets in real time.
          </p>

          <div className="mt-3 inline-flex items-center space-x-2 text-xs font-mono text-[#819478]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#819478]" />
            <span>Demonstration Telemetry Dataset · Real-world NYC Geographic Coordinates</span>
          </div>
        </div>

        {/* Section 05: Discovery Workspace with Fixed/Sticky Left Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* Left Column: Fixed / Sticky Control Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col space-y-6 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
            {/* Filter Control Box */}
            <div className="glass-ivory p-6 rounded-3xl border border-[#E3E0D7] shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E0D7] mb-5">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#263D31] font-bold">
                  <Filter className="w-3.5 h-3.5 text-[#263D31]" />
                  <span>Telemetry Controls</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono text-[#263D31] font-semibold bg-[#E3EBDD] px-2 py-0.5 rounded-full">
                    {filteredSpaces.length} spots match
                  </span>
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-mono text-[#6C7168] hover:text-[#263D31] flex items-center space-x-1"
                    title="Reset all filters"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* 1. Location Search */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono uppercase text-[#6C7168] tracking-wider mb-1.5 font-semibold">
                  Location / Neighborhood Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#819478] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, district, or style..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E3E0D7] bg-[#FCFBF7] text-xs font-mono text-[#252B26] focus:outline-none focus:border-[#263D31]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6C7168] hover:text-[#252B26]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Activity Preference */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono uppercase text-[#6C7168] tracking-wider mb-1.5 font-semibold">
                  Intended Activity
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {activities.map((act) => (
                    <button
                      key={act}
                      onClick={() => setSelectedActivity(act)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        selectedActivity === act
                          ? "bg-[#263D31] text-[#F4F1E8] shadow-sm font-semibold"
                          : "bg-[#F4F1E8] text-[#252B26] hover:bg-[#E3EBDD]"
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Noise Tolerance Slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono uppercase text-[#6C7168] tracking-wider font-semibold">
                    Max Noise Tolerance
                  </span>
                  <span className="text-xs font-mono font-bold text-[#263D31]">
                    &le; {maxNoise} dB
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="75"
                  value={maxNoise}
                  onChange={(e) => setMaxNoise(Number(e.target.value))}
                  className="w-full accent-[#263D31] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-[#92958D] mt-0.5">
                  <span>30 dB (Silent)</span>
                  <span>50 dB (Whisper)</span>
                  <span>75 dB (Loud)</span>
                </div>
              </div>

              {/* 4. Crowd Preference Slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono uppercase text-[#6C7168] tracking-wider font-semibold">
                    Max Occupancy / Crowd
                  </span>
                  <span className="text-xs font-mono font-bold text-[#263D31]">
                    &le; {maxCrowd}%
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={maxCrowd}
                  onChange={(e) => setMaxCrowd(Number(e.target.value))}
                  className="w-full accent-[#263D31] cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-[#92958D] mt-0.5">
                  <span>20% (Empty)</span>
                  <span>60% (Moderate)</span>
                  <span>100% (Any)</span>
                </div>
              </div>

              {/* 5. Budget Preference */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono uppercase text-[#6C7168] tracking-wider mb-1.5 font-semibold">
                  Budget Level
                </label>
                <div className="flex gap-2">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBudget(b)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-mono transition-all ${
                        selectedBudget === b
                          ? "bg-[#263D31] text-[#F4F1E8] font-bold"
                          : "bg-[#F4F1E8] text-[#252B26] hover:bg-[#E3EBDD]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Wi-Fi Requirement */}
              <div className="mb-4">
                <label className="block text-[10px] font-mono uppercase text-[#6C7168] tracking-wider mb-1.5 font-semibold">
                  Wi-Fi Requirement
                </label>
                <select
                  value={minWifi}
                  onChange={(e) => setMinWifi(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[#E3E0D7] bg-[#FCFBF7] text-xs font-mono text-[#252B26] focus:outline-none"
                >
                  {wifiOptions.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              {/* 7. Guaranteed Table Outlets Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E3E0D7]/70">
                <div>
                  <span className="text-xs font-mono font-semibold text-[#252B26] block">
                    Guaranteed Table Sockets
                  </span>
                  <span className="text-[10px] font-mono text-[#6C7168]">
                    100W USB-C & AC at desk
                  </span>
                </div>
                <button
                  onClick={() => setRequireOutlets(!requireOutlets)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    requireOutlets ? "bg-[#263D31]" : "bg-[#E3E0D7]"
                  }`}
                  aria-label="Toggle guaranteed table sockets"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      requireOutlets ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Matched Spaces Cards List */}
            <div className="space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#6C7168] font-bold px-1">
                Matched Spaces ({filteredSpaces.length})
              </p>

              {filteredSpaces.map((space) => {
                const isSelected = selectedSpace?.id === space.id;
                const statusColor =
                  space.status === "quiet"
                    ? "bg-[#263D31]"
                    : space.status === "caution"
                    ? "bg-[#C58C5A]"
                    : space.status === "crowded"
                    ? "bg-[#B86E52]"
                    : "bg-[#92958D]";

                return (
                  <div
                    key={space.id}
                    onClick={() => handleCardClick(space)}
                    className={`card-ivory p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "border-[#263D31] bg-[#F4F1E8] shadow-md ring-1 ring-[#263D31]"
                        : "border-[#E3E0D7] hover:border-[#819478]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
                          <p className="font-editorial text-lg text-[#252B26] font-semibold">
                            {space.name}
                          </p>
                        </div>
                        <p className="text-xs text-[#6C7168] mt-0.5">
                          {space.category} · {space.neighborhood}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#E3EBDD] text-[#263D31] font-mono text-xs font-bold">
                          {space.noiseLevel} dB
                        </span>
                        <p className="text-[10px] font-mono text-[#6C7168] mt-0.5">
                          {space.focusScore}% Match
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#E3E0D7]/60 flex items-center justify-between text-xs text-[#6C7168]">
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-[#819478]" />
                        <span>{space.hasOutlets ? "Guaranteed Sockets" : "Perimeter Only"}</span>
                      </span>
                      <span className="flex items-center space-x-1 font-mono">
                        <Wifi className="w-3 h-3 text-[#819478]" />
                        <span>{space.wifiSpeed.split(" ")[0]} Mbps</span>
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredSpaces.length === 0 && (
                <div className="p-8 text-center glass-ivory rounded-2xl border border-[#E3E0D7]">
                  <p className="font-editorial text-lg text-[#252B26]">
                    No spaces match these strict criteria.
                  </p>
                  <p className="text-xs text-[#6C7168] mt-1 mb-4">
                    Try loosening the noise threshold or activity filter.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-mono uppercase tracking-wider"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Genuine Interactive Leaflet Map */}
          <div className="lg:col-span-7 h-full">
            <InteractiveLeafletMap
              spaces={filteredSpaces}
              selectedSpace={selectedSpace}
              onSelectSpace={(space) => {
                setSelectedSpace(space);
                setDetailOpen(true);
              }}
            />
          </div>
        </div>
      </div>

      {/* Selected Place Detail Modal (Motion for React) */}
      <AnimatePresence>
        {detailOpen && selectedSpace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#252B26]/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="glass-ivory max-w-2xl w-full rounded-3xl overflow-hidden shadow-2xl border border-[#E3E0D7]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo & Header */}
              <div className="relative w-full h-56 sm:h-64">
                <Image
                  src={selectedSpace.image}
                  alt={selectedSpace.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#252B26]/85 via-[#252B26]/30 to-transparent" />

                <button
                  onClick={() => setDetailOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#FCFBF7]/90 text-[#252B26] hover:bg-[#F4F1E8] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#E3EBDD] font-bold">
                      {selectedSpace.category}
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl text-white">
                      {selectedSpace.name}
                    </h3>
                    <p className="text-xs text-white/80 flex items-center space-x-1 mt-1 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-[#819478]" />
                      <span>{selectedSpace.neighborhood} · Hours: {selectedSpace.hours}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3.5 py-1 rounded-full bg-[#263D31] border border-[#819478]/40 text-[#E3EBDD] text-xs font-mono font-bold">
                      {selectedSpace.focusScore}% Focus Fit
                    </span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-7 space-y-5">
                <p className="text-sm text-[#252B26] leading-relaxed">
                  {selectedSpace.description}
                </p>

                {/* Telemetry Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Volume2 className="w-3.5 h-3.5 text-[#263D31]" />
                      <span>Decibel Level</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.noiseLevel} dB
                    </p>
                    <p className="text-[10px] text-[#819478] font-mono">{selectedSpace.noiseLabel}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Users className="w-3.5 h-3.5 text-[#263D31]" />
                      <span>Occupancy</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.crowdLevel}%
                    </p>
                    <p className="text-[10px] text-[#819478] font-mono">{selectedSpace.crowdLabel}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Wifi className="w-3.5 h-3.5 text-[#263D31]" />
                      <span>Throughput</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.wifiSpeed.split(" ")[0]} Mbps
                    </p>
                    <p className="text-[10px] text-[#819478] font-mono">Ping {selectedSpace.wifiLatency}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Zap className="w-3.5 h-3.5 text-[#263D31]" />
                      <span>Power Density</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.hasOutlets ? "100%" : "35%"}
                    </p>
                    <p className="text-[10px] text-[#819478] font-mono">USB-C + AC</p>
                  </div>
                </div>

                {/* Focus Fit Factor Breakdown */}
                <div className="p-4 rounded-2xl bg-[#E3EBDD]/50 border border-[#819478]/30">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#263D31]" />
                    <p className="text-xs font-mono uppercase tracking-wider text-[#263D31] font-bold">
                      Recommendation Rationale:
                    </p>
                  </div>
                  <p className="text-xs text-[#263D31]/85 leading-relaxed font-mono">
                    {selectedSpace.rationale}
                  </p>
                </div>

                {/* Honest Source / Freshness Indicator */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6C7168] pt-1">
                  <span>Data Source: {selectedSpace.dataSource}</span>
                  <span className="text-[#263D31] font-bold">{selectedSpace.statusLabel}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E3E0D7]">
                  <a
                    href="#quiet-when"
                    onClick={() => setDetailOpen(false)}
                    className="text-xs font-mono text-[#263D31] hover:underline flex items-center space-x-1 font-semibold"
                  >
                    <span>View Hourly Quiet Telemetry</span>
                    <Clock className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => alert(`Saved "${selectedSpace.name}" to your quiet list!`)}
                      className="px-4 py-2 rounded-full border border-[#E3E0D7] bg-[#FCFBF7] text-xs font-mono uppercase font-semibold text-[#252B26] hover:border-[#263D31]"
                    >
                      Save Place
                    </button>
                    <a
                      href={`https://maps.google.com/?q=${selectedSpace.lat},${selectedSpace.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-mono uppercase tracking-wider hover:bg-[#819478] hover:text-[#252B26] shadow-sm font-semibold"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
