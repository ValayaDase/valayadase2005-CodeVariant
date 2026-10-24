"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Compass, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

export default function FinalCTASection() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section
      id="final-cta"
      aria-label="Find Your Spot CTA"
      className="relative w-full py-24 sm:py-32 bg-[#F5F3EC] px-4 sm:px-6 lg:px-8 border-t border-[#E8E0D2]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl bg-white border border-[#E8E0D2] p-8 sm:p-14 lg:p-16 shadow-[0_20px_60px_rgba(32,35,31,0.08)] text-center relative overflow-hidden"
        >
          {/* Subtle Decorative Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#819477]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#E8E0D2]/50 rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] shadow-sm mb-6">
            <Compass className="w-3.5 h-3.5 text-[#819477]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#555D50]">
              Instant Access
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-[#20231F] leading-tight max-w-2xl mx-auto">
            Ready to find your quiet spot today?
          </h2>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-[#555D50] max-w-xl mx-auto leading-relaxed">
            Join 14,200+ mindful remote workers, developers, and researchers who
            reclaimed their workday focus.
          </p>

          {/* Interactive Neighborhood Search Bar */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-2xl sm:rounded-full bg-[#F5F3EC] border border-[#E8E0D2] shadow-inner"
          >
            <div className="flex items-center gap-3 px-3.5 py-2 w-full">
              <Search className="w-5 h-5 text-[#819477] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter city or neighborhood (e.g. Greenwich, SoHo)..."
                className="w-full bg-transparent text-sm sm:text-base text-[#20231F] placeholder-[#555D50]/70 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-full bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-sm font-medium transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#819477]"
            >
              <span>Find My Spot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-[#819477] font-semibold"
            >
              ✓ Finding telemetry-verified quiet spots in &ldquo;{query}&rdquo;...
            </motion.p>
          )}

          {/* Trust Value Points */}
          <div className="mt-10 pt-8 border-t border-[#E8E0D2] flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#555D50]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#819477]" />
              <span>Sensory-calibrated venues</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#819477]" />
              <span>Free community access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#819477]" />
              <span>Real-time decibel updates</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
