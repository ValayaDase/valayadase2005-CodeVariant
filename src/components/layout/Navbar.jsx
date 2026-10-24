"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function Navbar({ style }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Discovery", href: "#features" },
    { label: "Quiet Meter", href: "#discovery-card" },
    { label: "The Problem", href: "#problem" },
    { label: "How It Works", href: "#how-it-works" },
  ];

  return (
    <motion.header
      style={style}
      initial={false}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 transition-colors duration-300 pointer-events-auto"
    >
      <div className="max-w-7xl mx-auto">
        <nav
          className="flex items-center justify-between px-5 py-3 rounded-full bg-white/85 backdrop-blur-md border border-[#E8E0D2] shadow-[0_4px_24px_rgba(32,35,31,0.06)]"
          aria-label="Main Navigation"
        >
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-[#20231F] group focus:outline-none focus:ring-2 focus:ring-[#819477] rounded-full px-1"
          >
            <div className="w-8 h-8 rounded-full bg-[#26382B] flex items-center justify-center text-[#F5F3EC] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Compass className="w-4 h-4 text-[#F5F3EC]" strokeWidth={2.2} />
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-semibold tracking-tight text-[#20231F]">
                Spotwise
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#819477] ml-1 mb-0.5 inline-block" />
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-sm font-medium text-[#20231F]/80 hover:text-[#20231F] hover:bg-[#F5F3EC] rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#819477]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#discovery-card"
              className="text-xs uppercase tracking-wider font-semibold text-[#819477] flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#819477]" />
              <span>Sensory Verified</span>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#F5F3EC] bg-[#26382B] hover:bg-[#20231F] rounded-full transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#819477]"
            >
              <span>Discover Spots</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#20231F] hover:bg-[#F5F3EC] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#819477]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-2 px-4"
          >
            <div className="p-4 rounded-2xl bg-white border border-[#E8E0D2] shadow-xl space-y-3">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 text-base font-medium text-[#20231F] hover:bg-[#F5F3EC] rounded-xl transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="pt-3 border-t border-[#E8E0D2] flex flex-col gap-2">
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#F5F3EC] bg-[#26382B] rounded-xl shadow-sm"
                >
                  <span>Discover Spots</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
