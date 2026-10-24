"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDraggable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Bookmark, Scale, Trash2, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { useCanvas } from "./CanvasContext";

export default function DraggableCard({
  id,
  type = "venue", // "venue" | "saved_venue" | "report" | "preferences" | "plan"
  item,
  children,
  className = "",
  handleLabel = "Drag to Canvas Zone",
  onSubmit = null,
  onSuccess = null,
  onReset = null,
  showHandle = false,
  disabled = false,
}) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${type}-${id}`,
    data: {
      type,
      item,
      onSubmit,
      onSuccess,
      onReset,
    },
    disabled,
  });

  const {
    handleSaveVenue,
    handleRemoveSavedVenue,
    handleAddToCompare,
  } = useCanvas();

  const [menuOpen, setMenuOpen] = useState(false);

  // Transform styles during drag
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 40,
      }
    : undefined;

  // Keyboard accessibility actions without conventional bypass buttons
  const executeAccessibleAction = (actionKey) => {
    setMenuOpen(false);
    if (type === "venue" || type === "saved_venue") {
      if (actionKey === "save") handleSaveVenue(item);
      if (actionKey === "view_details") router.push(`/places/${item.id}`);
      if (actionKey === "remove_saved") handleRemoveSavedVenue(item);
      if (actionKey === "compare") handleAddToCompare(item);
    } else if (type === "report" && actionKey === "submit_report" && onSubmit) {
      onSubmit();
    } else if (type === "preferences") {
      if (actionKey === "save_prefs" && onSuccess) onSuccess();
      if (actionKey === "reset_prefs" && onReset) onReset();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!showHandle ? attributes : {})}
      {...(!showHandle ? listeners : {})}
      className={`relative transition-all duration-200 ${
        !showHandle ? "cursor-grab active:cursor-grabbing select-none" : ""
      } ${
        isDragging
          ? "opacity-40 ring-2 ring-[#819477] shadow-2xl scale-[1.01] rounded-3xl"
          : ""
      } ${className}`}
    >
      {/* Optional top handle banner (used on utility cards if needed) */}
      {showHandle && (
        <div className="relative z-20 flex items-center justify-between px-3.5 py-1.5 rounded-t-3xl bg-[#FAF8F3] border-b border-[#E8E0D2] text-[11px] font-medium text-[#555D50]">
          <div
            {...attributes}
            {...listeners}
            className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing hover:text-[#26382B] transition-colors select-none py-1 group/handle flex-1"
            title="Drag to drop into an Action Zone"
            tabIndex={0}
            role="button"
            aria-label={`${handleLabel} (Press Enter or Space for action menu)`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMenuOpen(!menuOpen);
              }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="p-1 rounded-md bg-white border border-[#E8E0D2] text-[#819477] group-hover/handle:border-[#819477] transition-colors shadow-2xs"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </motion.div>
            <span className="font-semibold text-[#20231F] group-hover/handle:text-[#26382B]">
              {handleLabel}
            </span>
            <span className="text-[10px] text-[#819477] hidden sm:inline ml-auto pr-2">
              Drag to Canvas Dock ↓
            </span>
          </div>

          {/* Keyboard / Assistive Action Dispatcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Accessible canvas action selector"
              aria-expanded={menuOpen}
              className="p-1 rounded-full text-[#555D50] hover:text-[#20231F] hover:bg-white border border-transparent hover:border-[#E8E0D2] transition-colors text-[10px] font-semibold"
            >
              Actions ▾
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  className="absolute right-0 top-full mt-1.5 w-52 rounded-2xl bg-white border border-[#E8E0D2] shadow-xl p-2 z-50 text-left space-y-1"
                >
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#819477] border-b border-[#E8E0D2]/70">
                    Canvas Action Dispatch
                  </div>

                  {(type === "venue" || type === "saved_venue") && (
                    <>
                      <button
                        type="button"
                        onClick={() => executeAccessibleAction("save")}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3EC] text-xs font-medium text-[#20231F] flex items-center justify-between group transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-[#819477]" />
                          Save Sanctuary
                        </span>
                        <ChevronRight className="w-3 h-3 text-[#555D50] group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => executeAccessibleAction("view_details")}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3EC] text-xs font-medium text-[#20231F] flex items-center justify-between group transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-[#819477]" />
                          View Information
                        </span>
                        <ChevronRight className="w-3 h-3 text-[#555D50] group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => executeAccessibleAction("compare")}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3EC] text-xs font-medium text-[#20231F] flex items-center justify-between group transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Scale className="w-3.5 h-3.5 text-[#819477]" />
                          Compare Spaces
                        </span>
                        <ChevronRight className="w-3 h-3 text-[#555D50] group-hover:translate-x-0.5 transition-transform" />
                      </button>

                      {type === "saved_venue" && (
                        <button
                          type="button"
                          onClick={() => executeAccessibleAction("remove_saved")}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-xs font-medium text-red-700 flex items-center justify-between group transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            Release Sanctuary
                          </span>
                          <ChevronRight className="w-3 h-3 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </>
                  )}


                  {type === "report" && (
                    <button
                      type="button"
                      onClick={() => executeAccessibleAction("submit_report")}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3EC] text-xs font-medium text-[#26382B] flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Submit Verification
                      </span>
                    </button>
                  )}

                  {type === "preferences" && (
                    <>
                      <button
                        type="button"
                        onClick={() => executeAccessibleAction("save_prefs")}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3EC] text-xs font-medium text-[#26382B] flex items-center justify-between group transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-[#819477]" />
                          Save Focus Profile
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => executeAccessibleAction("reset_prefs")}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-red-50 text-xs font-medium text-red-700 flex items-center justify-between group transition-colors"
                      >
                        <span>Reset Defaults</span>
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Main Card Content */}
      <div className={showHandle ? "rounded-b-3xl overflow-hidden" : "h-full"}>
        {typeof children === "function" ? children({ isDragging }) : children}
      </div>
    </div>
  );
}
