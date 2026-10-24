"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import {
  AnimatedReports,
  AnimatedCompass,
  AnimatedArrowRight,
} from "@/components/common";
import AppShell from "@/components/app/AppShell";
import { backendRequest } from "@/lib/backend";
import { CanvasProvider, DropFeedbackToast } from "@/components/canvas";

export default function ReportsHistoryPage() {
  const [reports, setReports] = useState([]);
  const [backendError, setBackendError] = useState("");

  const fetchReports = () => {
    backendRequest("/api/reports")
      .then(({ reports: latest }) => setReports(latest || []))
      .catch(() => setBackendError("Community reports could not be loaded from the backend."));
  };

  useEffect(() => {
    fetchReports();
    window.addEventListener("spotwise_reports_changed", fetchReports);
    return () => {
      window.removeEventListener("spotwise_reports_changed", fetchReports);
    };
  }, []);

  return (
    <CanvasProvider initialPage="reports">
      <AppShell
        title="Community Reports"
        subtitle="Your contributions to the Spotwise distributed sensory network."
      >
        <div className="space-y-6 text-left">
          {backendError && <p role="status" className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900">{backendError}</p>}
          {/* Header Banner */}
          <div className="rounded-3xl bg-white border border-[#E8E0D2] p-6 sm:p-8 shadow-[0_4px_24px_rgba(32,35,31,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] text-xs font-semibold text-[#819477] mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sensory Accountability Ledger</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
                Submitted Reports ({reports.length})
              </h1>
              <p className="text-xs sm:text-sm text-[#555D50] mt-1">
                Reports submitted by the Spotwise community.
              </p>
            </div>

            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26382B] text-[#F5F3EC] text-xs font-semibold hover:bg-[#20231F] transition-all shadow-sm shrink-0 self-start sm:self-auto"
            >
              <AnimatedCompass size={16} className="text-[#F5F3EC]" />
              <span>Find a Venue to Report</span>
            </Link>
          </div>

          {/* Reports History List */}
          {reports.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#E8E0D2] p-12 text-center my-8 shadow-xs">
              <AnimatedReports size={48} className="text-[#819477] mx-auto mb-3" />
              <h3 className="text-xl font-serif font-bold text-[#20231F]">
                No community reports submitted yet
              </h3>
              <p className="text-xs sm:text-sm text-[#555D50] max-w-md mx-auto mt-2 leading-relaxed">
                Whenever you visit a workspace, open its profile and submit a sensory report to help
                fellow nomads find calm, reliable spaces.
              </p>
              <Link
                href="/discover"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#26382B] text-[#F5F3EC] text-xs font-semibold hover:bg-[#20231F] transition-colors"
              >
                <span>Explore Venues</span>
                <AnimatedArrowRight size={16} className="text-[#F5F3EC]" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-3xl bg-white border border-[#E8E0D2] p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wider font-semibold text-[#819477] px-2.5 py-0.5 rounded-full bg-[#F5F3EC] border border-[#E8E0D2]">
                        {report.venueCategory}
                      </span>
                      <span className="text-xs text-[#555D50] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{report.timestamp}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#20231F] mt-1.5">
                      <Link
                        href={`/places/${report.venueId}`}
                        className="hover:text-[#26382B] transition-colors"
                      >
                        {report.venueName}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#555D50] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#819477]" />
                      <span>{report.neighborhood}</span>
                    </p>

                    {/* Telemetry pill tags */}
                    <div className="flex flex-wrap gap-2 mt-3 text-xs">
                      <span className="px-3 py-1 rounded-xl bg-[#F5F3EC] border border-[#E8E0D2] text-[#20231F]">
                        Noise: <strong>{report.noise}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-[#F5F3EC] border border-[#E8E0D2] text-[#20231F]">
                        Crowd: <strong>{report.crowd}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-[#F5F3EC] border border-[#E8E0D2] text-[#20231F]">
                        Wi-Fi: <strong>{report.wifi}</strong>
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-[#F5F3EC] border border-[#E8E0D2] text-[#20231F]">
                        Outlets: <strong>{report.outlets}</strong>
                      </span>
                    </div>

                    {report.note && (
                      <p className="text-xs text-[#555D50] italic mt-2.5">
                        &ldquo;{report.note}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 self-start sm:self-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{report.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DropFeedbackToast />
      </AppShell>
    </CanvasProvider>
  );
}
