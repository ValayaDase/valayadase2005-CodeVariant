"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  Users,
  Volume2,
  Wifi,
  Zap,
} from "lucide-react";
import { saveVenueReport } from "@/lib/discovery/venue-data";

export default function CommunityReportForm({ venueId, venueName, onReportSubmitted }) {
  const [formData, setFormData] = useState({
    crowd: "Low",
    noise: "Quiet",
    seating: "Plentiful",
    wifi: "Excellent",
    outlets: "Available Everywhere",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.crowd || !formData.noise) {
      setError("Please select both crowd and noise levels.");
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = saveVenueReport(venueId, formData);
      setSuccess(true);
      setIsSubmitting(false);
      if (onReportSubmitted) onReportSubmitted(saved);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Failed to save report locally.");
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] text-left space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477] mb-1">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Community Telemetry Contribution</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#20231F]">
            Submit Sensory Report for {venueName}
          </h3>
        </div>
        <span className="text-xs font-mono text-[#819477] px-2.5 py-1 rounded-full bg-[#EBF0E9]">
          Local Demo Session
        </span>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Thank you! Your verified community report has been recorded locally and updated venue telemetry.
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of structured selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Crowd level */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#819477]" />
            <span>Crowd Level</span>
          </label>
          <select
            value={formData.crowd}
            onChange={(e) => setFormData({ ...formData, crowd: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
          >
            <option value="Low">Low (&lt;25% desks occupied)</option>
            <option value="Moderate">Moderate (comfortable)</option>
            <option value="High">High (near full)</option>
          </select>
        </div>

        {/* Noise level */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#819477]" />
            <span>Noise Level</span>
          </label>
          <select
            value={formData.noise}
            onChange={(e) => setFormData({ ...formData, noise: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
          >
            <option value="Quiet">Quiet (Whisper / Library)</option>
            <option value="Moderate">Moderate (Soft murmur)</option>
            <option value="Noisy">Noisy (Loud chatter / machinery)</option>
          </select>
        </div>

        {/* Wi-Fi Quality */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#819477]" />
            <span>Wi-Fi Reliability</span>
          </label>
          <select
            value={formData.wifi}
            onChange={(e) => setFormData({ ...formData, wifi: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
          >
            <option value="Excellent">Excellent (&gt;150 Mbps, low ping)</option>
            <option value="Good">Good (fine for video/browsing)</option>
            <option value="Spotty">Spotty (dropped connections)</option>
            <option value="Down">Offline / Down</option>
          </select>
        </div>

        {/* Outlets */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#819477]" />
            <span>Power Outlets</span>
          </label>
          <select
            value={formData.outlets}
            onChange={(e) => setFormData({ ...formData, outlets: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
          >
            <option value="Available Everywhere">Available Everywhere</option>
            <option value="Some Desks">Some Desks</option>
            <option value="None Available">None Available</option>
          </select>
        </div>

        {/* Seating */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F]">
            Seat Availability
          </label>
          <select
            value={formData.seating}
            onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
          >
            <option value="Plentiful">Plentiful Open Tables</option>
            <option value="Few Seats Left">Few Seats Left</option>
            <option value="Full">Full (Waitlist)</option>
          </select>
        </div>
      </div>

      {/* Optional Short Note */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F]">
          Observation Note (Optional)
        </label>
        <textarea
          rows={2}
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="e.g. Back corner by the garden is especially quiet today. Natural lighting is great."
          className="w-full p-3 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] placeholder-[#555D50]/60 focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
        />
      </div>

      {/* Submit button */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-[#555D50]">
          * Stored locally in this browser session. Verified against community consensus.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-xs font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#819477] cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Publish Community Report</span>
        </button>
      </div>
    </form>
  );
}
