"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { AnimatedSparkles, AnimatedScale } from "@/components/common";
import ActionZone from "./ActionZone";
import { useCanvas } from "./CanvasContext";

export default function ActionCanvasDock({
  mode = "discover", // "discover" | "saved" | "places"
  className = "",
}) {
  const {
    savedIds,
    comparisonList,
    isDragging,
    isComparingOpen,
    setIsComparingOpen,
  } = useCanvas();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const compactViewport = window.matchMedia("(max-width: 767px), (max-height: 760px)");
    const syncDockToViewport = () => setCollapsed(compactViewport.matches);
    syncDockToViewport();
    compactViewport.addEventListener("change", syncDockToViewport);
    return () => compactViewport.removeEventListener("change", syncDockToViewport);
  }, []);

  return (
    <aside
      aria-label="Canvas Protocol Action Dock"
      className={`fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-2 right-2 z-40 max-h-[55dvh] overflow-y-auto sm:bottom-4 sm:left-6 sm:right-6 md:left-1/2 md:max-w-4xl md:-translate-x-1/2 ${className}`}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`rounded-3xl bg-white/95 backdrop-blur-xl border-2 transition-all duration-300 shadow-[0_16px_40px_rgba(32,35,31,0.14)] ${
          isDragging
            ? "border-[#26382B] ring-4 ring-[#819477]/30 scale-[1.01]"
            : "border-[#E8E0D2]"
        } p-3 sm:p-4`}
      >
        {/* Dock Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-[#E8E0D2]/70 text-xs">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-serif font-bold text-[#20231F] flex items-center gap-1.5">
              <AnimatedSparkles size={16} className="text-[#819477]" />
              Canvas Protocol Dock
            </span>
            <span className="hidden sm:inline text-[11px] text-[#555D50]">
              — Drag any card below to trigger primary actions
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Compare Drawer Quick Toggle */}
            {comparisonList.length > 0 && (
              <button
                type="button"
                onClick={() => setIsComparingOpen(!isComparingOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF0E9] hover:bg-[#819477]/20 text-[#26382B] text-[11px] font-semibold transition-colors"
              >
                <AnimatedScale size={14} className="text-[#819477]" />
                <span>Comparing ({comparisonList.length}/3)</span>
              </button>
            )}

            {/* Collapse/Expand toggle */}
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-[#555D50] hover:text-[#20231F] hover:bg-[#F5F3EC] transition-colors"
              title={collapsed ? "Expand Canvas Action Dock" : "Minimize Canvas Action Dock"}
            >
              {collapsed ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Action Zones Grid */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-1.5 pt-1 sm:gap-3">
                {mode === "saved" ? (
                  /* Saved Places Page Mode: Release, View Information, Compare */
                  <>
                    <ActionZone
                      id="remove-saved"
                      title="Release Sanctuary"
                      description="Drop card to remove from saved places"
                      accepts={["venue", "saved_venue"]}
                      variant="danger"
                      countBadge={savedIds.size}
                      compact
                    />
                    <ActionZone
                      id="view-details"
                      title="View Information"
                      description="Drop card to inspect full telemetry & details"
                      accepts={["venue", "saved_venue"]}
                      variant="secondary"
                      compact
                    />
                    <ActionZone
                      id="compare-spaces"
                      title="Compare Spaces"
                      description="Drop to compare telemetry side-by-side"
                      accepts={["venue", "saved_venue"]}
                      variant="secondary"
                      countBadge={`${comparisonList.length}/3`}
                      compact
                    />
                  </>
                ) : (
                  /* Discover / Places Mode: Save Sanctuary, View Information, Compare */
                  <>
                    <ActionZone
                      id="save-space"
                      title="Save Sanctuary"
                      description="Drop card to save to personal library"
                      accepts={["venue", "saved_venue"]}
                      variant="primary"
                      countBadge={savedIds.size}
                      compact
                    />
                    <ActionZone
                      id="view-details"
                      title="View Information"
                      description="Drop card to inspect full telemetry & details"
                      accepts={["venue", "saved_venue"]}
                      variant="secondary"
                      compact
                    />
                    <ActionZone
                      id="compare-spaces"
                      title="Compare Spaces"
                      description="Drop to compare telemetry side-by-side"
                      accepts={["venue", "saved_venue"]}
                      variant="secondary"
                      countBadge={`${comparisonList.length}/3`}
                      compact
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </aside>
  );
}
