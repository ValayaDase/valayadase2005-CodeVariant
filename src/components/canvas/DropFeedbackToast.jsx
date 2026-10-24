"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, RotateCcw, X } from "lucide-react";
import { useCanvas } from "./CanvasContext";

export default function DropFeedbackToast() {
  const { toast, dismissToast } = useCanvas();

  if (!toast) return null;

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertCircle,
    info: Info,
  };
  const Icon = icons[toast.type] || CheckCircle2;

  const bgColors = {
    success: "bg-[#26382B] text-[#F5F3EC] border-[#819477]/40",
    error: "bg-red-950 text-white border-red-800",
    warning: "bg-amber-950 text-white border-amber-800",
    info: "bg-[#20231F] text-[#F5F3EC] border-[#E8E0D2]/40",
  }[toast.type] || "bg-[#26382B] text-[#F5F3EC] border-[#819477]/40";

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`pointer-events-auto rounded-2xl p-4 shadow-2xl border flex items-center justify-between gap-3 text-left ${bgColors}`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Icon className="w-5 h-5 text-[#819477] shrink-0" />
            <p className="text-xs font-medium leading-relaxed truncate">
              {toast.message}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toast.undoAction && (
              <button
                type="button"
                onClick={() => {
                  toast.undoAction();
                  dismissToast();
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#819477]" />
                <span>Undo</span>
              </button>
            )}

            <button
              type="button"
              onClick={dismissToast}
              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
