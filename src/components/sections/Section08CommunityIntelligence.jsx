"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  Send,
  PlusCircle,
  X,
  Volume2,
  ThumbsUp,
  Radio,
} from "lucide-react";
import { COMMUNITY_REPORTS, SPACES_DATA } from "@/data/spacesData";

export default function Section08CommunityIntelligence() {
  const [reports, setReports] = useState(COMMUNITY_REPORTS);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Form states
  const [venue, setVenue] = useState(SPACES_DATA[0].name);
  const [noiseInput, setNoiseInput] = useState("Quiet (<40 dB)");
  const [crowdInput, setCrowdInput] = useState("Under 30% full");
  const [commentInput, setCommentInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: `rep-${Date.now()}`,
      venue,
      contributor: "You (Verified Visitor)",
      badge: "Live Telemetry Node",
      timeAgo: "Just now",
      noise: noiseInput,
      crowd: crowdInput,
      comment:
        commentInput.trim() ||
        "Seating verified, quiet policy respected, power outlets active.",
      status: noiseInput.includes("Quiet") ? "quiet" : "crowded",
    };

    setReports([newReport, ...reports]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportModalOpen(false);
      setCommentInput("");
    }, 1200);
  };

  return (
    <section
      id="community"
      className="relative w-full bg-[#F4F1E8] py-24 px-6 sm:px-8 lg:px-12 border-t border-[#E3E0D7]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#E3EBDD] border border-[#819478]/30 w-fit mb-4">
              <Users className="w-3.5 h-3.5 text-[#263D31]" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#263D31] font-semibold">
                Section 08 · Community Intelligence
              </span>
            </div>

            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#252B26] tracking-tight leading-[1.08] mb-4">
              Better information. <br />
              <span className="text-[#263D31] italic">Powered by people.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#6C7168] leading-relaxed">
              Automated sensors capture baseline acoustic telemetry; community members provide immediate qualitative nuance. Together, they create real-time ground truth.
            </p>
          </div>

          {/* Action to Submit Report */}
          <button
            onClick={() => setReportModalOpen(true)}
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-mono uppercase tracking-widest hover:bg-[#819478] hover:text-[#252B26] transition-all shadow-md self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Telemetry Report</span>
          </button>
        </div>

        {/* Live Community Stream Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="card-ivory p-6 sm:p-7 rounded-2xl border border-[#E3E0D7] shadow-sm flex flex-col justify-between hover:border-[#819478] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-editorial text-xl text-[#252B26] font-bold">
                      {report.venue}
                    </h3>
                    <p className="text-xs text-[#6C7168] font-mono mt-0.5 flex items-center space-x-1.5">
                      <span>{report.contributor}</span>
                      <span>·</span>
                      <span className="text-[#819478] font-medium">{report.badge}</span>
                    </p>
                  </div>

                  <span className="text-[10px] font-mono text-[#92958D] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{report.timeAgo}</span>
                  </span>
                </div>

                <p className="text-sm text-[#252B26] leading-relaxed my-4 font-sans">
                  “{report.comment}”
                </p>
              </div>

              {/* Status Tags */}
              <div className="pt-4 border-t border-[#E3E0D7] flex flex-wrap items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      report.status === "quiet" ? "bg-[#648568]" : "bg-[#B86E52]"
                    }`}
                  />
                  <span className="text-[#252B26] font-medium">{report.noise}</span>
                </div>
                <span className="text-[#6C7168]">{report.crowd}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Report Modal */}
      <AnimatePresence>
        {reportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#252B26]/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setReportModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-ivory max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-[#E3E0D7] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E3E0D7] mb-5">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-[#648568] animate-pulse" />
                  <h3 className="font-editorial text-2xl text-[#252B26]">
                    Contribute Ground Truth
                  </h3>
                </div>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#E3EBDD] text-[#252B26]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 text-[#648568] mb-3" />
                  <p className="font-editorial text-2xl text-[#263D31]">
                    Report Transmitted
                  </p>
                  <p className="text-xs font-mono text-[#6C7168] mt-1">
                    Telemetry node updated. Thank you for preserving collective clarity.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-[#6C7168] mb-1">
                      Venue Location
                    </label>
                    <select
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#E3E0D7] bg-[#FCFBF7] text-sm text-[#252B26] focus:outline-none"
                    >
                      {SPACES_DATA.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.neighborhood})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#6C7168] mb-1">
                        Acoustic Noise
                      </label>
                      <select
                        value={noiseInput}
                        onChange={(e) => setNoiseInput(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E3E0D7] bg-[#FCFBF7] text-xs font-mono text-[#252B26] focus:outline-none"
                      >
                        <option value="Silent (<35 dB)">Silent (&lt;35 dB)</option>
                        <option value="Quiet (<45 dB)">Quiet (&lt;45 dB)</option>
                        <option value="Moderate (50-60 dB)">Moderate (50-60 dB)</option>
                        <option value="Loud (>65 dB)">Loud (&gt;65 dB)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-[#6C7168] mb-1">
                        Table Availability
                      </label>
                      <select
                        value={crowdInput}
                        onChange={(e) => setCrowdInput(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E3E0D7] bg-[#FCFBF7] text-xs font-mono text-[#252B26] focus:outline-none"
                      >
                        <option value="Plenty of open seats">Plenty of seats</option>
                        <option value="A few solo spots left">A few solo spots</option>
                        <option value="Nearly 100% full">Nearly 100% full</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#6C7168] mb-1">
                      Direct Observation / Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="e.g. Back patio has 3 open tables with AC sockets. Music volume is low."
                      className="w-full p-3 rounded-xl border border-[#E3E0D7] bg-[#FCFBF7] text-sm text-[#252B26] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-mono uppercase tracking-widest hover:bg-[#819478] hover:text-[#252B26] transition-all shadow-md font-bold"
                  >
                    Transmit Ground Truth
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
