"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Users,
  Volume2,
  Wifi,
  Zap,
  Armchair,
  Sparkles,
} from "lucide-react";
import { backendRequest } from "@/lib/backend";
import { getDemoSession } from "@/lib/auth/demo-auth";
import DraggableCard from "@/components/canvas/DraggableCard";
import ActionZone from "@/components/canvas/ActionZone";

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

  const isValid = Boolean(
    formData.crowd &&
    formData.noise &&
    formData.seating &&
    formData.wifi &&
    formData.outlets
  );

  const executeDropSubmission = async () => {
    if (isSubmitting) return; // Prevent duplicate submissions while in-flight
    setError("");

    if (!isValid) {
      setError("Please ensure crowd, noise, seating, Wi-Fi, and outlets are all selected.");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = getDemoSession();
      const currentAuthor = session?.user?.name || "Spotwise member";
      const { report } = await backendRequest(`/api/venues/${venueId}/reports`, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          author: currentAuthor,
        }),
      });

      const saved = {
        ...report,
        id: report._id,
        author: currentAuthor,
        timestamp: "Just now",
        timestampIso: report.createdAt,
      };

      setSuccess(true);
      setIsSubmitting(false);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("spotwise_reports_changed", { detail: saved }));
      }

      if (onReportSubmitted) onReportSubmitted(saved);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || "Could not publish your report. Check that the backend and database are running.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-[#E8E0D2] p-4 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] text-left space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-[#E8E0D2] pb-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477]">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Sensory Telemetry Verification</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#26382B] text-xs font-semibold text-[#F5F3EC]">
              <span>Canvas Protocol Active</span>
            </span>
          </div>
          <h3 className="text-xl font-serif font-bold text-[#20231F]">
            Submit Sensory Report for {venueName}
          </h3>
          <p className="text-xs text-[#555D50] mt-1">
            Adjust the telemetry values below to compile your Report Capsule, then drag and drop it into the Verification Zone to publish.
          </p>
        </div>
        <span className="text-xs font-mono text-[#819477] px-2.5 py-1 rounded-full bg-[#EBF0E9] hidden sm:inline">
          MongoDB Verified
        </span>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Thank you! Your report has been persisted in MongoDB and published to the Spotwise sensory network.
            </span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of structured selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Crowd level */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#819477]" />
            <span>Crowd Density</span>
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
            <span>Acoustic Profile</span>
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

        {/* Seating Availability */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F] flex items-center gap-1.5">
            <Armchair className="w-3.5 h-3.5 text-[#819477]" />
            <span>Seating Availability</span>
          </label>
          <select
            value={formData.seating}
            onChange={(e) => setFormData({ ...formData, seating: e.target.value })}
            className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
          >
            <option value="Plentiful">Plentiful (Open tables)</option>
            <option value="Few Seats Left">Few Seats Left</option>
            <option value="Full">Full / Standing only</option>
            <option value="Not checked">Not checked</option>
          </select>
        </div>

        {/* Wi-Fi Reliability */}
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
            <option value="Excellent">Excellent (&gt;100 Mbps, video clear)</option>
            <option value="Good">Good (Fast browsing)</option>
            <option value="Spotty">Spotty (Occasional drop)</option>
            <option value="Down">Down / Offline</option>
            <option value="Not checked">Not checked</option>
          </select>
        </div>

        {/* Power Outlets */}
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
            <option value="Some Desks">Some Desks only</option>
            <option value="None Available">None Available</option>
            <option value="Not checked">Not checked</option>
          </select>
        </div>

        {/* Observation Note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#20231F]">
            Observation Note (Optional)
          </label>
          <input
            type="text"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="e.g. Garden corner is shaded and silent"
            className="w-full p-2.5 rounded-xl bg-[#F5F3EC]/70 border border-[#E8E0D2] text-sm text-[#20231F] placeholder-[#555D50]/60 focus:outline-none focus:ring-2 focus:ring-[#819477]/40"
          />
        </div>
      </div>

      {/* Canvas Protocol Submission Area: Draggable Capsule -> Action Zone */}
      <div className="pt-6 border-t border-[#E8E0D2] space-y-4">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#819477]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#20231F]">
              Canvas Report Capsule (Drag to Action Zone)
            </h4>
          </div>
          <p className="text-[11px] text-[#555D50]">
            No standard submit button — drop into the Action Zone to finalize.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Draggable Sensory Report Card */}
          <DraggableCard
            id={`report-${venueId}`}
            type="report"
            item={{ ...formData, venueId, venueName }}
            onSubmit={executeDropSubmission}
            handleLabel="Drag Report Capsule"
            disabled={!isValid || isSubmitting}
            className={`rounded-2xl border-2 transition-all p-4 text-left ${
              !isValid
                ? "border-dashed border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed"
                : isSubmitting
                ? "border-[#819477] bg-[#FAF8F3] opacity-75"
                : "border-[#819477] bg-[#FAF8F3] hover:border-[#26382B] shadow-sm cursor-grab"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#26382B] text-white">
                  Telemetry Payload Ready
                </span>
                <span className="text-[11px] text-[#819477] font-semibold">
                  {venueName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#555D50] pt-1">
                <div className="p-1.5 rounded-lg bg-white border border-[#E8E0D2]/60">
                  <span className="text-[10px] text-[#819477] block">Acoustics:</span>
                  <strong className="text-[#20231F]">{formData.noise}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E8E0D2]/60">
                  <span className="text-[10px] text-[#819477] block">Crowd:</span>
                  <strong className="text-[#20231F]">{formData.crowd}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E8E0D2]/60">
                  <span className="text-[10px] text-[#819477] block">Wi-Fi:</span>
                  <strong className="text-[#20231F]">{formData.wifi}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-white border border-[#E8E0D2]/60">
                  <span className="text-[10px] text-[#819477] block">Outlets:</span>
                  <strong className="text-[#20231F]">{formData.outlets}</strong>
                </div>
              </div>

              {formData.note && (
                <p className="text-[11px] text-[#555D50] italic truncate">
                  &ldquo;{formData.note}&rdquo;
                </p>
              )}
            </div>
          </DraggableCard>

          {/* Dedicated Action Zone: Submit Verification to Network */}
          <ActionZone
            id="submit-report"
            title={isSubmitting ? "Transmitting Telemetry..." : "Submit Verification to Network"}
            description={
              isSubmitting
                ? "Persisting to MongoDB network..."
                : "Drop the report card here to publish to community"
            }
            accepts={["report"]}
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}
