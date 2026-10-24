"use client";

import { useState } from "react";
import { Sliders, Save, CheckCircle2, RotateCcw } from "lucide-react";
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

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState(() => getUserPreferences());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleFacilityToggle = (facId) => {
    const current = preferences.requiredFacilities || [];
    const next = current.includes(facId)
      ? current.filter((id) => id !== facId)
      : [...current, facId];
    setPreferences({ ...preferences, requiredFacilities: next });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserPreferences(preferences);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES);
    saveUserPreferences(DEFAULT_PREFERENCES);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppShell
      title="Focus Preferences"
      subtitle="Customize your default sensory thresholds and focus requirements."
    >
      <div className="space-y-6 text-left max-w-4xl mx-auto">
        {/* Header */}
        <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)]">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477] mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>Suitability Engine Personalization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
            Sensory &amp; Ergonomic Defaults
          </h1>
          <p className="text-xs sm:text-sm text-[#555D50] mt-1">
            These settings are applied automatically whenever you open Discovery or calculate Focus Fit Scores.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Preferences saved! New focus thresholds are now active in Discovery.</span>
          </div>
        )}

        {/* Preferences Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] space-y-8"
        >
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
                  Typical Visit Day
                </label>
                <select
                  value={preferences.defaultDay}
                  onChange={(e) =>
                    setPreferences({ ...preferences, defaultDay: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
                >
                  {DAY_OPTIONS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] block mb-1.5">
                  Typical Focus Window
                </label>
                <select
                  value={preferences.defaultTime}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      defaultTime: e.target.value,
                    })
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
              3. Required Workspace Facilities
            </h2>
            <p className="text-xs text-[#555D50]">
              Venues missing these facilities will be penalized in your personalized Focus Fit Score.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FACILITY_FILTERS.map((fac) => {
                const isSelected = (
                  preferences.requiredFacilities || []
                ).includes(fac.id);
                return (
                  <button
                    key={fac.id}
                    type="button"
                    onClick={() => handleFacilityToggle(fac.id)}
                    className={`p-3 rounded-2xl text-left border text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#26382B] text-[#F5F3EC] border-[#26382B] shadow-xs"
                        : "bg-white text-[#555D50] border-[#E8E0D2] hover:border-[#819477]"
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

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-[#E8E0D2] flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#555D50] hover:text-[#20231F] border border-transparent hover:border-[#E8E0D2] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#819477] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Focus Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
