"use client";

import { Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";

export default function SuitabilityScore({ suitability, compact = false }) {
  if (!suitability) return null;

  const { score, grade, matchReasons = [], missingFactors = [] } = suitability;

  // Grade color theme
  let badgeClasses = "bg-[#26382B] text-[#F5F3EC]";
  let scoreColor = "text-[#26382B]";
  if (score >= 85) {
    badgeClasses = "bg-[#26382B] text-[#F5F3EC]";
    scoreColor = "text-[#26382B]";
  } else if (score >= 70) {
    badgeClasses = "bg-[#819477] text-white";
    scoreColor = "text-[#819477]";
  } else if (score >= 50) {
    badgeClasses = "bg-[#DCD5C5] text-[#20231F]";
    scoreColor = "text-[#555D50]";
  } else {
    badgeClasses = "bg-[#E8E0D2] text-[#555D50]";
    scoreColor = "text-[#555D50]";
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-serif font-bold tracking-tight ${badgeClasses}`}
        >
          {score}% Fit
        </span>
        <span className="text-xs font-semibold text-[#555D50]">{grade}</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-[#F5F3EC]/80 border border-[#E8E0D2] p-4 text-left">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E8E0D2]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#819477]" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#26382B]">
            Focus Fit Score
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-serif font-bold ${scoreColor}`}>
            {score}
          </span>
          <span className="text-xs font-semibold text-[#819477]">/ 100</span>
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-[11px] font-semibold ${badgeClasses}`}
          >
            {grade}
          </span>
        </div>
      </div>

      {/* Match reasons */}
      {matchReasons.length > 0 && (
        <div className="mt-3 space-y-1">
          {matchReasons.slice(0, 3).map((reason, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs text-[#20231F]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#819477] shrink-0 mt-0.5" />
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Missing considerations */}
      {missingFactors.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-dashed border-[#E8E0D2] space-y-1">
          {missingFactors.slice(0, 2).map((factor, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 text-xs text-[#555D50]"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{factor}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
