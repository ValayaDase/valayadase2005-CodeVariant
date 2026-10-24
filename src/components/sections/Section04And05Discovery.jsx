"use client";

import { useState, useMemo } from "react";
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
  Check,
  Bookmark,
  Share2,
} from "lucide-react";
import { SPACES_DATA } from "@/data/spacesData";
import InteractiveLeafletMap from "@/components/map/InteractiveLeafletMap";

export default function Section04And05Discovery() {
  const [selectedActivity, setSelectedActivity] = useState("All");
  const [maxNoise, setMaxNoise] = useState(70);
  const [requireOutlets, setRequireOutlets] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(SPACES_DATA[0]);
  const [detailOpen, setDetailOpen] = useState(false);

  const activities = [
    "All",
    "Deep Work",
    "Reading & Writing",
    "Remote Calls",
    "Study Sprint",
  ];

  // Filter logic
  const filteredSpaces = useMemo(() => {
    return SPACES_DATA.filter((space) => {
      if (
        selectedActivity !== "All" &&
        !space.activityFit.includes(selectedActivity)
      ) {
        return false;
      }
      if (space.noiseLevel > maxNoise) {
        return false;
      }
      if (requireOutlets && !space.outlets.toLowerCase().includes("guaranteed")) {
        return false;
      }
      return true;
    });
  }, [selectedActivity, maxNoise, requireOutlets]);

  const handleCardClick = (space) => {
    setSelectedSpace(space);
    setDetailOpen(true);
  };

  return (
    <section
      id="discovery"
      className="relative w-full bg-[#FCFBF7] py-24 px-6 sm:px-8 lg:px-12 border-t border-[#E3E0D7]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section 04 Reveal Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E3EBDD] border border-[#819478]/30 w-fit mb-4">
            <Compass className="w-3.5 h-3.5 text-[#263D31]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#263D31] font-semibold">
              Sections 04 & 05 · Meet Spotwise & Discovery Workspace
            </span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#252B26] tracking-tight leading-[1.08] mb-4">
            Not just nearby. <br />
            <span className="text-[#263D31] italic">Right for your focus.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#6C7168] leading-relaxed">
            Discover cafés, silent libraries, and architectural reading rooms based on real-time acoustic telemetry, crowd forecasts, and socket availability.
          </p>
        </div>

        {/* Discovery Workspace Layout: Left Sidebar + Right Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filter Controls & Match Cards */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Filter Bar Panel */}
            <div className="glass-ivory p-6 rounded-2xl border border-[#E3E0D7] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E0D7] mb-5">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#263D31] font-semibold">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Telemetry Filters</span>
                </div>
                <span className="text-[11px] font-mono text-[#819478] font-medium">
                  {filteredSpaces.length} spots match
                </span>
              </div>

              {/* Activity Selector */}
              <div className="mb-5">
                <label className="block text-[11px] font-mono uppercase text-[#6C7168] tracking-wider mb-2">
                  Primary Intent / Activity
                </label>
                <div className="flex flex-wrap gap-2">
                  {activities.map((act) => (
                    <button
                      key={act}
                      onClick={() => setSelectedActivity(act)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedActivity === act
                          ? "bg-[#263D31] text-[#F4F1E8] shadow-sm"
                          : "bg-[#F4F1E8] text-[#252B26] hover:bg-[#E3EBDD]"
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Noise Slider */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-mono uppercase text-[#6C7168] tracking-wider">
                    Max Noise Threshold
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
                <div className="flex justify-between text-[10px] font-mono text-[#92958D] mt-1">
                  <span>30 dB (Library)</span>
                  <span>55 dB (Moderate)</span>
                  <span>75 dB (Loud)</span>
                </div>
              </div>

              {/* Toggle for Outlets */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-[#252B26]">
                  Guaranteed Table Socket Only
                </span>
                <button
                  onClick={() => setRequireOutlets(!requireOutlets)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    requireOutlets ? "bg-[#263D31]" : "bg-[#E3E0D7]"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      requireOutlets ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* List of Matched Cards */}
            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredSpaces.map((space) => {
                const isSelected = selectedSpace?.id === space.id;
                return (
                  <div
                    key={space.id}
                    onClick={() => handleCardClick(space)}
                    className={`card-ivory p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "border-[#263D31] bg-[#F4F1E8] shadow-md ring-1 ring-[#263D31]"
                        : "border-[#E3E0D7] hover:border-[#819478]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              space.status === "quiet"
                                ? "bg-[#648568]"
                                : space.status === "crowded"
                                ? "bg-[#B86E52]"
                                : "bg-[#92958D]"
                            }`}
                          />
                          <p className="font-editorial text-lg text-[#252B26] font-semibold">
                            {space.name}
                          </p>
                        </div>
                        <p className="text-xs text-[#6C7168] mt-0.5">
                          {space.category} · {space.neighborhood}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#E3EBDD] text-[#263D31] font-mono text-xs font-bold">
                          {space.noiseLevel} dB
                        </span>
                        <p className="text-[10px] font-mono text-[#6C7168] mt-0.5">
                          {space.focusScore}% Focus Fit
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#E3E0D7]/60 flex items-center justify-between text-xs text-[#6C7168]">
                      <span className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-[#819478]" />
                        <span>{space.outlets.split("(")[0]}</span>
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
                <div className="p-8 text-center glass-ivory rounded-xl border border-[#E3E0D7]">
                  <p className="font-editorial text-lg text-[#252B26]">
                    No spaces match these strict criteria.
                  </p>
                  <p className="text-xs text-[#6C7168] mt-1">
                    Try loosening the noise threshold or activity filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Real Leaflet Map */}
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

      {/* Selected Place Detail Panel (Motion for React Modal) */}
      <AnimatePresence>
        {detailOpen && selectedSpace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#252B26]/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="glass-ivory max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-[#E3E0D7]"
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#252B26]/80 via-[#252B26]/20 to-transparent" />

                <button
                  onClick={() => setDetailOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-[#FCFBF7]/90 text-[#252B26] hover:bg-[#F4F1E8] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#E3EBDD]">
                      {selectedSpace.category}
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl text-white">
                      {selectedSpace.name}
                    </h3>
                    <p className="text-xs text-white/80 flex items-center space-x-1 mt-1 font-mono">
                      <MapPin className="w-3 h-3 text-[#819478]" />
                      <span>{selectedSpace.neighborhood} · Hours: {selectedSpace.hours}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-[#648568] text-white text-xs font-mono font-bold">
                      {selectedSpace.focusScore}% Focus Fit
                    </span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-5">
                <p className="text-sm text-[#252B26] leading-relaxed">
                  {selectedSpace.description}
                </p>

                {/* Telemetry Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Volume2 className="w-3.5 h-3.5 text-[#648568]" />
                      <span>Noise Level</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.noiseLevel} dB
                    </p>
                    <p className="text-[10px] text-[#819478]">{selectedSpace.noiseLabel}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Users className="w-3.5 h-3.5 text-[#648568]" />
                      <span>Occupancy</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.crowdLevel}%
                    </p>
                    <p className="text-[10px] text-[#819478]">{selectedSpace.crowdLabel}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Wifi className="w-3.5 h-3.5 text-[#648568]" />
                      <span>Speed</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.wifiSpeed.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-[#819478]">Ping {selectedSpace.wifiLatency}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4F1E8] border border-[#E3E0D7]">
                    <div className="flex items-center space-x-1.5 text-xs text-[#6C7168] mb-1">
                      <Zap className="w-3.5 h-3.5 text-[#648568]" />
                      <span>Power</span>
                    </div>
                    <p className="font-mono font-bold text-base text-[#252B26]">
                      {selectedSpace.outlets.includes("Guaranteed") ? "100%" : "70%"}
                    </p>
                    <p className="text-[10px] text-[#819478]">USB-C + AC</p>
                  </div>
                </div>

                {/* Focus Fit Factor Breakdown */}
                <div className="p-4 rounded-xl bg-[#E3EBDD]/50 border border-[#819478]/30">
                  <p className="text-xs font-mono uppercase tracking-wider text-[#263D31] font-bold mb-2">
                    Why this matches you:
                  </p>
                  <p className="text-xs text-[#263D31]/80 leading-relaxed">
                    {selectedSpace.rationale}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E3E0D7]">
                  <a
                    href="#quiet-when"
                    onClick={() => setDetailOpen(false)}
                    className="text-xs font-mono text-[#263D31] hover:underline flex items-center space-x-1"
                  >
                    <span>View Hourly Quiet Telemetry</span>
                    <Clock className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => alert("Added to your saved quiet list!")}
                      className="px-4 py-2 rounded-full border border-[#E3E0D7] bg-[#FCFBF7] text-xs font-medium text-[#252B26] hover:border-[#263D31]"
                    >
                      Save Place
                    </button>
                    <a
                      href={`https://maps.google.com/?q=${selectedSpace.lat},${selectedSpace.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-medium uppercase tracking-wider hover:bg-[#819478] hover:text-[#252B26]"
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
