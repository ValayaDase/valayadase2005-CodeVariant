"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import {
  AnimatedScale,
  AnimatedVolume,
  AnimatedWifi,
  AnimatedZap,
  AnimatedSparkles,
  AnimatedArrowRight,
} from "@/components/common";
import { useCanvas } from "./CanvasContext";
import DraggableCard from "./DraggableCard";
import ActionZone from "./ActionZone";

export default function ComparisonDrawer() {
  const {
    comparisonList,
    isComparingOpen,
    setIsComparingOpen,
    handleClearCompare,
  } = useCanvas();

  if (!isComparingOpen && comparisonList.length === 0) return null;

  return (
    <AnimatePresence>
      {isComparingOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsComparingOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-5xl rounded-t-3xl bg-white border-t border-x border-[#E8E0D2] shadow-[0_-12px_40px_rgba(32,35,31,0.18)] max-h-[85vh] overflow-y-auto pointer-events-auto p-6 sm:p-8 space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#26382B] text-white flex items-center justify-center">
                  <AnimatedScale size={20} className="text-[#819477]" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#20231F]">
                    Venue Comparison Canvas ({comparisonList.length}/3)
                  </h3>
                  <p className="text-xs text-[#555D50]">
                    Side-by-side acoustic and ergonomic telemetry comparison.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {comparisonList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCompare}
                    className="text-xs text-[#555D50] hover:text-red-700 underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsComparingOpen(false)}
                  className="p-2 rounded-full hover:bg-[#F5F3EC] text-[#555D50] hover:text-[#20231F] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* If 0 items */}
            {comparisonList.length === 0 ? (
              <div className="p-12 text-center text-[#555D50]">
                <AnimatedScale size={40} className="text-[#819477] mx-auto mb-2" />
                <p className="text-sm font-semibold">No venues in comparison canvas yet</p>
                <p className="text-xs mt-1">
                  Drag any venue card and drop it onto the &quot;Compare Spaces&quot; zone to inspect telemetry differences.
                </p>
              </div>
            ) : (
              <>
                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {comparisonList.map((venue) => (
                    <DraggableCard
                      key={venue.id}
                      id={`compare-${venue.id}`}
                      type="venue"
                      item={venue}
                      handleLabel="Drag to Remove Zone"
                      className="rounded-3xl border border-[#E8E0D2] overflow-hidden bg-[#FAF8F3] flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="relative w-full h-36 bg-[#E8E0D2] overflow-hidden">
                          {venue.image ? (
                            <Image
                              src={venue.image}
                              alt={venue.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <AnimatedSparkles size={32} className="text-[#819477]" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#20231F]">
                            {venue.categoryLabel}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 space-y-3">
                          <div>
                            <h4 className="font-serif font-bold text-[#20231F] text-base">
                              {venue.name}
                            </h4>
                            <p className="text-xs text-[#555D50] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-[#819477]" />
                              <span>{venue.neighborhood} · {venue.budget}</span>
                            </p>
                          </div>

                          {/* Telemetry specs comparison */}
                          <div className="space-y-1.5 pt-2 border-t border-[#E8E0D2]/70 text-xs text-[#555D50]">
                            <div className="flex items-center justify-between p-2 rounded-xl bg-white">
                              <span className="flex items-center gap-1.5">
                                <AnimatedVolume size={14} className="text-[#819477]" />
                                Noise:
                              </span>
                              <strong className="text-[#20231F]">
                                {venue.baseDecibels || 35} dB ({venue.noiseLevel})
                              </strong>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl bg-white">
                              <span className="flex items-center gap-1.5">
                                <AnimatedWifi size={14} className="text-[#819477]" />
                                Wi-Fi:
                              </span>
                              <strong className="text-[#20231F]">{venue.wifiSpeed}</strong>
                            </div>

                            <div className="flex items-center justify-between p-2 rounded-xl bg-white">
                              <span className="flex items-center gap-1.5">
                                <AnimatedZap size={14} className="text-[#819477]" />
                                Outlets:
                              </span>
                              <strong className="text-[#20231F] truncate max-w-[120px]">
                                {venue.outletsAvailability}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-2 border-t border-[#E8E0D2] flex items-center justify-between text-xs">
                        <Link
                          href={`/places/${venue.id}`}
                          className="font-semibold text-[#26382B] hover:text-[#819477] flex items-center gap-1"
                        >
                          View Details <AnimatedArrowRight size={12} className="text-[#819477]" />
                        </Link>
                      </div>
                    </DraggableCard>
                  ))}
                </div>

                {/* Designated Drop Zone to Remove from Comparison */}
                <div className="pt-2">
                  <ActionZone
                    id="remove-compare"
                    title="Remove from Comparison Canvas"
                    description="Drag any compared venue card above and drop it here to remove"
                    accepts={["venue"]}
                    variant="danger"
                    compact
                  />
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
