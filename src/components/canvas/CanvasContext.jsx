"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import {
  Bookmark,
  Sparkles,
  CheckCircle2,
  MapPin,
  Volume2,
  Wifi,
} from "lucide-react";
import {
  getSavedVenueIds,
  saveVenueId,
  removeSavedVenueId,
  saveUserPreferences,
  DEFAULT_PREFERENCES,
} from "@/lib/discovery/venue-data";
import { backendRequest, getDemoUserId } from "@/lib/backend";

const CanvasContext = createContext(null);

export function useCanvas() {
  const ctx = useContext(CanvasContext);
  if (!ctx) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return ctx;
}

export function CanvasProvider({ children }) {
  const router = useRouter();
  const [activeDragItem, setActiveDragItem] = useState(null);
  const [activeOverZoneId, setActiveOverZoneId] = useState(null);
  // Keep the server render and first browser render identical. Browser storage
  // is loaded after hydration in the effect below.
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [comparisonList, setComparisonList] = useState([]);
  const [isComparingOpen, setIsComparingOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const undoStackRef = useRef([]);

  // Sync saved places with backend and custom events
  useEffect(() => {
    let isMounted = true;
    const localSavedTimer = setTimeout(() => {
      if (isMounted) setSavedIds(new Set(getSavedVenueIds()));
    }, 0);
    const userId = getDemoUserId();
    backendRequest(`/api/saved/${userId}`)
      .then(({ venueIds }) => {
        if (isMounted && Array.isArray(venueIds)) {
          setSavedIds(new Set(venueIds));
          venueIds.forEach((id) => saveVenueId(id));
        }
      })
      .catch(() => {
        // Fallback to local storage if offline
      });

    const handleSavedChange = () => {
      setSavedIds(new Set(getSavedVenueIds()));
    };

    window.addEventListener("spotwise_saved_changed", handleSavedChange);

    return () => {
      isMounted = false;
      clearTimeout(localSavedTimer);
      window.removeEventListener("spotwise_saved_changed", handleSavedChange);
    };
  }, []);

  const showToast = useCallback((message, { type = "success", undoAction = null, duration = 4500 } = {}) => {
    const id = `toast-${Date.now()}`;
    setToast({ id, message, type, undoAction });
    if (duration > 0) {
      setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  // Save Sanctuary action
  const handleSaveVenue = useCallback(async (venue) => {
    if (!venue?.id) return;
    const prevSaved = savedIds.has(venue.id);
    if (prevSaved) {
      showToast(`${venue.name} is already in your saved sanctuary list.`, { type: "info" });
      return;
    }

    // Optimistic update
    saveVenueId(venue.id);
    setSavedIds((prev) => new Set([...prev, venue.id]));

    // Record undo
    undoStackRef.current.push({
      action: "save",
      venue,
      revert: async () => {
        removeSavedVenueId(venue.id);
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(venue.id);
          return next;
        });
        try {
          await backendRequest(`/api/saved/${venue.id}`, {
            method: "PUT",
            body: JSON.stringify({ userId: getDemoUserId(), saved: false }),
          });
        } catch {
          // ignore rollback error
        }
      },
    });

    try {
      await backendRequest(`/api/saved/${venue.id}`, {
        method: "PUT",
        body: JSON.stringify({ userId: getDemoUserId(), saved: true }),
      });
      showToast(`Saved ${venue.name} to your focus library.`, {
        undoAction: () => {
          const last = undoStackRef.current.pop();
          if (last?.revert) last.revert();
          showToast(`Removed ${venue.name} from saved sanctuaries.`);
        },
      });
    } catch {
      showToast(`Saved locally. (Backend sync pending).`, { type: "info" });
    }
  }, [savedIds, showToast]);

  // Remove Saved Sanctuary action
  const handleRemoveSavedVenue = useCallback(async (venue) => {
    if (!venue?.id) return;
    removeSavedVenueId(venue.id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(venue.id);
      return next;
    });

    // Record undo
    undoStackRef.current.push({
      action: "remove_saved",
      venue,
      revert: async () => {
        saveVenueId(venue.id);
        setSavedIds((prev) => new Set([...prev, venue.id]));
        try {
          await backendRequest(`/api/saved/${venue.id}`, {
            method: "PUT",
            body: JSON.stringify({ userId: getDemoUserId(), saved: true }),
          });
        } catch {
          // ignore rollback error
        }
      },
    });

    try {
      await backendRequest(`/api/saved/${venue.id}`, {
        method: "PUT",
        body: JSON.stringify({ userId: getDemoUserId(), saved: false }),
      });
      showToast(`Released ${venue.name} from your saved sanctuaries.`, {
        undoAction: () => {
          const last = undoStackRef.current.pop();
          if (last?.revert) last.revert();
          showToast(`Restored ${venue.name} to saved sanctuaries.`);
        },
      });
    } catch {
      showToast(`Removed locally. (Backend sync pending).`, { type: "info" });
    }
  }, [showToast]);

  // Comparison actions
  const handleAddToCompare = useCallback((venue) => {
    if (!venue?.id) return;
    setComparisonList((prev) => {
      if (prev.some((v) => v.id === venue.id)) {
        showToast(`${venue.name} is already in comparison.`, { type: "info" });
        return prev;
      }
      if (prev.length >= 3) {
        showToast("Maximum 3 venues can be compared side-by-side.", { type: "warning" });
        return prev;
      }
      const next = [...prev, venue];
      showToast(`Added ${venue.name} to comparison canvas (${next.length}/3).`);
      setIsComparingOpen(true);
      return next;
    });
  }, [showToast]);

  const handleRemoveFromCompare = useCallback((venueId) => {
    setComparisonList((prev) => prev.filter((v) => v.id !== venueId));
    showToast("Removed venue from comparison tray.");
  }, [showToast]);

  const handleClearCompare = useCallback(() => {
    setComparisonList([]);
    setIsComparingOpen(false);
  }, []);

  // Report submission action (from canvas drop)
  const handleSubmitReport = useCallback(async (reportData, { venueId, venueName, onSuccess, onError }) => {
    try {
      const res = await backendRequest(`/api/venues/${venueId}/reports`, {
        method: "POST",
        body: JSON.stringify(reportData),
      });
      showToast(`Sensory report for ${venueName} published to Spotwise network!`);
      if (onSuccess) onSuccess(res?.report);
      return res;
    } catch (err) {
      const msg = err.message || "Failed to submit sensory report.";
      showToast(msg, { type: "error" });
      if (onError) onError(err);
      throw err;
    }
  }, [showToast]);

  // Preferences action (from canvas drop)
  const handleSavePreferences = useCallback((prefs) => {
    saveUserPreferences(prefs);
    showToast("Personal focus thresholds saved and active in Discovery!");
  }, [showToast]);

  const handleResetPreferences = useCallback(() => {
    saveUserPreferences(DEFAULT_PREFERENCES);
    showToast("Focus preferences reset to neutral defaults.");
  }, [showToast]);

  // DnD Sensor Configuration
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Requires 8px movement before initiating drag to avoid conflicting with clicks
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 180,
      tolerance: 6,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragItem(active.data.current || null);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    setActiveOverZoneId(over ? over.id : null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveDragItem(null);
    setActiveOverZoneId(null);

    if (!over || !active?.data?.current) return;

    const dragData = active.data.current; // { type, item }
    const dropZoneId = over.id;

    // Dispatch action based on zone and item type
    switch (dropZoneId) {
      case "save-space":
        if (dragData.type === "venue" || dragData.type === "saved_venue") {
          handleSaveVenue(dragData.item);
        }
        break;

      case "view-details":
        if (dragData.type === "venue" || dragData.type === "saved_venue") {
          if (dragData.item?.id) {
            showToast(`Opening information for ${dragData.item.name}...`, { type: "info", duration: 1500 });
            router.push(`/places/${dragData.item.id}`);
          }
        }
        break;

      case "remove-saved":
        if (dragData.type === "venue" || dragData.type === "saved_venue") {
          handleRemoveSavedVenue(dragData.item);
        }
        break;

      case "compare-spaces":
        if (dragData.type === "venue" || dragData.type === "saved_venue") {
          handleAddToCompare(dragData.item);
        }
        break;

      case "remove-compare":
        if (dragData.type === "venue") {
          handleRemoveFromCompare(dragData.item.id);
        }
        break;

      case "submit-report":
        if (dragData.type === "report") {
          if (dragData.onSubmit) {
            dragData.onSubmit();
          }
        }
        break;

      case "save-preferences":
        if (dragData.type === "preferences") {
          handleSavePreferences(dragData.item);
          if (dragData.onSuccess) dragData.onSuccess();
        }
        break;

      case "reset-preferences":
        if (dragData.type === "preferences") {
          handleResetPreferences();
          if (dragData.onReset) dragData.onReset();
        }
        break;

      default:
        break;
    }
  };

  const handleDragCancel = () => {
    setActiveDragItem(null);
    setActiveOverZoneId(null);
  };

  const value = {
    activeDragItem,
    activeOverZoneId,
    isDragging: Boolean(activeDragItem),
    savedIds,
    comparisonList,
    isComparingOpen,
    setIsComparingOpen,
    toast,
    showToast,
    dismissToast,
    handleSaveVenue,
    handleRemoveSavedVenue,
    handleAddToCompare,
    handleRemoveFromCompare,
    handleClearCompare,
    handleSubmitReport,
    handleSavePreferences,
    handleResetPreferences,
  };

  return (
    <CanvasContext.Provider value={value}>
      <DndContext
        id="spotwise-action-canvas"
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {children}

        {/* Global Drag Overlay preview following pointer */}
        <DragOverlay dropAnimation={{ duration: 250, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeDragItem ? (
            activeDragItem.type === "venue" || activeDragItem.type === "saved_venue" ? (
              /* High-fidelity full card representation while dragging */
              <motion.div
                initial={{ scale: 0.98, opacity: 0.95 }}
                animate={{ scale: 1.02, opacity: 1, rotate: 1.5 }}
                className="w-80 sm:w-96 rounded-3xl bg-white border-2 border-[#819477] overflow-hidden shadow-[0_25px_60px_rgba(38,56,43,0.35)] pointer-events-none z-50 text-left"
              >
                {/* Image Banner */}
                <div className="relative w-full aspect-[16/9] bg-[#E8E0D2] overflow-hidden">
                  {activeDragItem.item?.image ? (
                    <Image
                      src={activeDragItem.item.image}
                      alt={activeDragItem.item.name || "Venue"}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#E8E0D2] text-[#555D50]">
                      <Sparkles className="w-8 h-8 text-[#819477] mb-1" />
                      <span className="text-xs font-semibold">{activeDragItem.item?.categoryLabel}</span>
                    </div>
                  )}

                  {/* Top category badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E8E0D2] text-xs font-semibold text-[#20231F] shadow-xs">
                      {activeDragItem.item?.categoryLabel || "Workspace"}
                    </span>
                  </div>

                  {/* Active Drag Pill */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26382B] text-white text-xs font-semibold shadow-md">
                      <Sparkles className="w-3.5 h-3.5 text-[#819477]" />
                      <span>Dragging Sanctuary</span>
                    </span>
                  </div>

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Bottom Noise/Wi-Fi banner */}
                  <div className="absolute bottom-3 left-3 z-10 text-[11px] font-medium text-white bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <span>{activeDragItem.item?.noiseLevel || "Quiet"} · {activeDragItem.item?.wifiSpeed || "Fast Wi-Fi"}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#20231F] leading-tight">
                        {activeDragItem.item?.name}
                      </h3>
                      <p className="text-xs text-[#555D50] flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#819477]" />
                        <span>{activeDragItem.item?.neighborhood} {activeDragItem.item?.budget ? `· ${activeDragItem.item.budget}` : ""}</span>
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-base font-serif font-bold text-[#26382B]">
                        {activeDragItem.item?.fitScore || 85}%
                      </span>
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-[#819477]">
                        Fit Score
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#555D50] line-clamp-2 leading-relaxed">
                    {activeDragItem.item?.description}
                  </p>

                  {/* Telemetry Micro-Pills */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#E8E0D2]/70 text-xs text-[#555D50]">
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#F5F3EC]/80">
                      <Volume2 className="w-3.5 h-3.5 text-[#819477]" />
                      <span className="truncate">{activeDragItem.item?.baseDecibels || 30} dB · {activeDragItem.item?.noiseLevel || "Quiet"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-[#F5F3EC]/80">
                      <Wifi className="w-3.5 h-3.5 text-[#819477]" />
                      <span className="truncate">{activeDragItem.item?.wifiSpeed || "Fast Wi-Fi"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Minimal preview for non-venue utility cards (Reports, Preferences) */
              <motion.div
                initial={{ scale: 0.95, opacity: 0.9 }}
                animate={{ scale: 1.05, opacity: 1, rotate: 2 }}
                className="pointer-events-none rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[#819477] p-4 shadow-[0_20px_45px_rgba(38,56,43,0.3)] max-w-xs flex items-center gap-3 z-50 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#26382B] text-[#F5F3EC] flex items-center justify-center shrink-0">
                  {activeDragItem.type === "report" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#819477]" />
                  ) : activeDragItem.type === "preferences" ? (
                    <Sparkles className="w-5 h-5 text-[#819477]" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-[#819477]" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#819477]">
                    {activeDragItem.type === "report"
                      ? "Sensory Report Capsule"
                      : activeDragItem.type === "preferences"
                      ? "Focus Profile Spec"
                      : "Workspace Card"}
                  </span>
                  <p className="text-xs font-serif font-bold text-[#20231F] truncate">
                    {activeDragItem.type === "report"
                      ? `Telemetry for ${activeDragItem.item?.venueName || "Venue"}`
                      : activeDragItem.type === "preferences"
                      ? `${activeDragItem.item?.activity} Mode`
                      : activeDragItem.item?.name || "Card"}
                  </p>
                </div>
              </motion.div>
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </CanvasContext.Provider>
  );
}
