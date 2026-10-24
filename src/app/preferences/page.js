"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { AnimatedSliders, AnimatedSparkles } from "@/components/common";
import AppShell from "@/components/app/AppShell";
import {
  getUserPreferences,
  saveUserPreferences,
  DEFAULT_PREFERENCES,
} from "@/lib/discovery/venue-data";
import {
  ACTIVITY_OPTIONS,
  NOISE_OPTIONS,
  BUDGET_OPTIONS,
  FACILITY_FILTERS,
  DAY_OPTIONS,
  TIME_SLOTS,
} from "@/components/app/DiscoveryFilters";
import {
  CanvasProvider,
  DraggableCard,
  ActionZone,
  DropFeedbackToast,
} from "@/components/canvas";
import { CurtainReveal, RevealItem } from "@/components/motion/MotionPrimitives";

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState(() => getUserPreferences());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleFacilityToggle = (facId) => {
    const current = preferences.requiredFacilities || [];
    const next = current.includes(facId)
      ? current.filter((id) => id !== facId)
      : [...current, facId];
    setPreferences({ ...preferences, requiredFacilities: next });
  };

  const handleDropSave = () => {
    saveUserPreferences(preferences);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleDropReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    saveUserPreferences(DEFAULT_PREFERENCES);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  return (
    <CanvasProvider initialPage="preferences">
      <AppShell
        title="Focus Preferences"
        subtitle="Customize your default sensory thresholds and focus requirements."
      >
        <div className="space-y-6 text-left max-w-4xl mx-auto pb-16">
          {/* Header */}
          <CurtainReveal className="rounded-3xl" delay={0.04}>
          <RevealItem delay={0.06}>
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)]">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477]">
                <AnimatedSliders size={14} className="text-[#819477]" />
                <span>Suitability Engine Personalization</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26382B] text-xs font-semibold text-[#F5F3EC]">
                <span>Canvas Protocol Active</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
              Sensory &amp; Ergonomic Defaults
            </h1>
            <p className="text-xs sm:text-sm text-[#555D50] mt-1">
              Configure your cognitive focus profile below. To commit changes or reset, drag the generated Focus Profile Spec card into the designated Action Zones.
            </p>
          </div>
          </RevealItem>
          </CurtainReveal>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Preferences saved! New focus thresholds are now active across Discovery.</span>
            </div>
          )}

          {resetSuccess && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Preferences restored to neutral defaults.</span>
            </div>
          )}

          {/* Preferences Form (Field selections remain standard) */}
          <CurtainReveal className="rounded-3xl" delay={0.14}>
          <RevealItem delay={0.16}>
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] space-y-8">
            {/* Section 1: Core Activity and Noise */}
            <div className="space-y-4">
              <h2 className="text-base font-serif font-bold text-[#20231F] pb-2 border-b border-[#E8E0D2]">
                1. Work Mode &amp; Acoustic Profile
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] block mb-1.5">
                    Default Activity Type
                  </label>
                  <select
                    value={preferences.activity}
                    onChange={(e) =>
                      setPreferences({ ...preferences, activity: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
                  >
                    {ACTIVITY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] block mb-1.5">
                    Noise Tolerance
                  </label>
                  <select
                    value={preferences.noisePreference}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        noisePreference: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
                  >
                    {NOISE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Budget & Default Visit Schedule */}
            <div className="space-y-4">
              <h2 className="text-base font-serif font-bold text-[#20231F] pb-2 border-b border-[#E8E0D2]">
                2. Budget &amp; Routine Hours
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] block mb-1.5">
                    Budget Maximum
                  </label>
                  <select
                    value={preferences.budget}
                    onChange={(e) =>
                      setPreferences({ ...preferences, budget: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] block mb-1.5">
                    Default Visit Day
                  </label>
                  <select
                    value={preferences.defaultDay}
                    onChange={(e) =>
                      setPreferences({ ...preferences, defaultDay: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
                  >
                    {DAY_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] block mb-1.5">
                    Default Time Slot
                  </label>
                  <select
                    value={preferences.defaultTime}
                    onChange={(e) =>
                      setPreferences({ ...preferences, defaultTime: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Essential Facilities */}
            <div className="space-y-4">
              <h2 className="text-base font-serif font-bold text-[#20231F] pb-2 border-b border-[#E8E0D2]">
                3. Mandatory Work Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FACILITY_FILTERS.map((fac) => {
                  const isSelected = (preferences.requiredFacilities || []).includes(fac.id);
                  return (
                    <button
                      key={fac.id}
                      type="button"
                      onClick={() => handleFacilityToggle(fac.id)}
                      className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                        isSelected
                          ? "bg-[#26382B] text-[#F5F3EC] border-[#26382B] shadow-xs"
                          : "liquid-hover bg-[#F5F3EC]/60 text-[#20231F] border-[#E8E0D2] hover:bg-[#F5F3EC]"
                      }`}
                    >
                      <span className="block font-semibold">
                        {isSelected ? "✓ " : "+ "}
                        {fac.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Canvas Protocol Interaction Area: Draggable Spec Card -> Action Zones */}
            <div className="pt-6 border-t border-[#E8E0D2] space-y-4">
              <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <AnimatedSparkles size={16} className="text-[#819477]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#20231F]">
                    Focus Profile Spec (Drag to Commit or Reset)
                  </h4>
                </div>
                <p className="text-[11px] text-[#555D50] sm:text-right">
                  No standard submit buttons — drag card into target zone.
                </p>
              </div>

              {/* Draggable Spec Card */}
              <DraggableCard
                id="focus-profile-spec"
                type="preferences"
                item={preferences}
                onSuccess={handleDropSave}
                onReset={handleDropReset}
                handleLabel="Drag Focus Profile Spec"
                className="rounded-2xl border-2 border-[#819477] bg-[#FAF8F3] p-4 text-left shadow-sm cursor-grab"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#26382B] text-white">
                      Profile Payload Ready
                    </span>
                    <h4 className="font-serif font-bold text-[#20231F] text-sm mt-1">
                      {preferences.activity} Profile ({preferences.noisePreference} acoustics)
                    </h4>
                  </div>
                  <div className="text-right text-[11px] text-[#819477]">
                    <span>{(preferences.requiredFacilities || []).length} Amenities Selected</span>
                  </div>
                </div>
              </DraggableCard>

              {/* Action Zones Grid: Save vs Reset */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <ActionZone
                  id="save-preferences"
                  title="Save Focus Preferences"
                  description="Drop Profile Spec card here to save settings"
                  accepts={["preferences"]}
                  variant="primary"
                />

                <ActionZone
                  id="reset-preferences"
                  title="Reset to Defaults"
                  description="Drop Profile Spec card here to restore factory baseline"
                  accepts={["preferences"]}
                  variant="danger"
                />
              </div>
            </div>
          </div>
          </RevealItem>
          </CurtainReveal>
        </div>

        <DropFeedbackToast />
      </AppShell>
    </CanvasProvider>
  );
}
