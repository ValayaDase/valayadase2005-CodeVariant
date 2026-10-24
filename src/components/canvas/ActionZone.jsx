"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
} from "lucide-react";
import {
  AnimatedBookmark,
  AnimatedArrowRight,
  AnimatedScale,
  AnimatedSend,
  AnimatedSparkles,
} from "@/components/common";
import { useCanvas } from "./CanvasContext";

const ZONE_ICONS = {
  "save-space": AnimatedBookmark,
  "view-details": AnimatedArrowRight,
  "compare-spaces": AnimatedScale,
  "remove-saved": Trash2,
  "remove-compare": Trash2,
  "submit-report": AnimatedSend,
  "save-preferences": AnimatedBookmark,
  "reset-preferences": Trash2,
};

export default function ActionZone({
  id,
  title,
  description,
  accepts = ["venue"], // types of cards accepted
  variant = "primary", // "primary" (forest) | "secondary" (sage/ivory) | "danger" (soft red)
  countBadge = null,
  className = "",
  compact = false,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      accepts,
    },
  });

  const { activeDragItem } = useCanvas();

  // Check compatibility
  const isCompatible = activeDragItem && accepts.includes(activeDragItem.type);
  const isIncompatible = activeDragItem && !accepts.includes(activeDragItem.type);

  const IconComponent = ZONE_ICONS[id] || AnimatedSparkles;

  // Visual state computation
  const isHovered = isOver && isCompatible;

  // Color schemes matching Spotwise warm ivory and forest identity
  const baseColors = {
    primary: "border-[#819477]/40 bg-[#FAF8F3] text-[#20231F]",
    secondary: "border-[#E8E0D2] bg-white text-[#20231F]",
    danger: "border-red-200 bg-red-50/50 text-red-950",
  }[variant];

  return (
    <div
      ref={setNodeRef}
      className={`relative select-none transition-all duration-300 rounded-2xl md:rounded-3xl border-2 ${
        isHovered
          ? "border-[#26382B] bg-[#EBF0E9] shadow-[0_12px_30px_rgba(38,56,43,0.18)] scale-[1.04]"
          : isCompatible
          ? "border-[#819477] bg-[#F5F3EC] shadow-md ring-2 ring-[#819477]/30 animate-pulse"
          : isIncompatible && isOver
          ? "border-amber-400 bg-amber-50/70 opacity-60"
          : baseColors
      } ${compact ? "p-2.5 sm:p-4" : "p-4 sm:p-5"} flex flex-col justify-between overflow-hidden group ${className}`}
    >
      {/* Background Animated Ripple Rings when Hovered */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-[#26382B] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Top Header: Icon & Badge */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div
          className={`${compact ? "h-7 w-7 sm:h-10 sm:w-10" : "h-9 w-9 sm:h-10 sm:w-10"} rounded-xl flex items-center justify-center transition-all ${
            isHovered
              ? "bg-[#26382B] text-white scale-110 shadow-sm"
              : isCompatible
              ? "bg-[#819477] text-white"
              : variant === "danger"
              ? "bg-red-100 text-red-700"
              : "bg-[#26382B]/10 text-[#26382B]"
          }`}
        >
          {isHovered ? (
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
          ) : (
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </div>

        {/* Count Badge / Indicator */}
        <div className="flex items-center gap-1.5">
          {countBadge !== null && (
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white border border-[#E8E0D2] text-[#26382B] shadow-2xs">
              {countBadge}
            </span>
          )}

          {isHovered ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#26382B] text-white">
              Release to Drop
            </span>
          ) : isCompatible ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#819477] text-white animate-bounce">
              Drop Target
            </span>
          ) : isIncompatible && isOver ? (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
              Not Accepted
            </span>
          ) : null}
        </div>
      </div>

      {/* Body: Title and Description */}
        <div className={`${compact ? "mt-1.5 sm:mt-3" : "mt-3"} relative z-10 text-left`}>
        <h4 className={`${compact ? "text-[10px] sm:text-sm" : "text-xs sm:text-sm"} font-serif font-bold tracking-tight text-[#20231F] group-hover:text-[#26382B] transition-colors flex items-center gap-1.5`}>
          <span>{title}</span>
        </h4>
        <p className={`${compact ? "hidden sm:block" : "block"} text-[11px] text-[#555D50] mt-0.5 line-clamp-1 leading-normal`}>
          {isHovered ? (
            <strong className="text-[#26382B]">Release mouse or finger now to complete action</strong>
          ) : (
            description
          )}
        </p>
      </div>

      {/* Micro Status Bar on bottom */}
      <div className={`${compact ? "hidden sm:flex" : "flex"} mt-3 pt-2 border-t border-[#E8E0D2]/50 items-center justify-between text-[10px] text-[#819477] relative z-10`}>
        <span className="uppercase tracking-wider font-medium">
          Accepts: {accepts.join(", ")}
        </span>
        <span className="text-[10px] text-[#555D50]/80">Canvas Protocol</span>
      </div>
    </div>
  );
}
