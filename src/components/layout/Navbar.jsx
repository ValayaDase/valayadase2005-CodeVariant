"use client";

import { useState, useEffect } from "react";
import { Volume2, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "The Search", href: "#hero" },
    { label: "The Friction", href: "#friction" },
    { label: "The Turning Point", href: "#turning-point" },
    { label: "Discovery Map", href: "#discovery" },
    { label: "Quiet When", href: "#quiet-when" },
    { label: "Focus Fit", href: "#focus-fit" },
    { label: "Compare", href: "#compare" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F4F1E8]/90 backdrop-blur-md border-b border-[#E3E0D7] py-3.5 shadow-sm"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" className="flex items-baseline space-x-2.5 group">
            <span className="font-editorial text-2xl tracking-tight text-[#263D31] group-hover:text-[#819478] transition-colors">
              Spotwise
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#6C7168] hidden sm:inline-block">
              The Quiet Place
            </span>
          </a>

          {/* Center Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs uppercase tracking-[0.16em] text-[#6C7168] hover:text-[#263D31] transition-colors font-medium relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#263D31] transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action & Acoustic Telemetry Indicator */}
          <div className="flex items-center space-x-3.5">
            {/* Live Telemetry Pill */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#E3EBDD]/70 border border-[#819478]/30 text-[#263D31]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#648568] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#648568]"></span>
              </span>
              <Volume2 className="w-3.5 h-3.5 text-[#648568]" />
              <span className="text-[11px] font-mono tracking-wider font-medium">
                41 dB · Serene
              </span>
            </div>

            {/* CTA Button */}
            <a
              href="#discovery"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-medium tracking-wider uppercase hover:bg-[#819478] hover:text-[#252B26] transition-all duration-200 shadow-sm"
            >
              <span>Find Focus</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#263D31] hover:text-[#819478] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F4F1E8] flex flex-col pt-24 px-8 pb-10 lg:hidden border-b border-[#E3E0D7]">
          <div className="flex flex-col space-y-6 flex-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#819478] font-mono">
              Chapters & Exploration
            </p>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-editorial text-2xl text-[#263D31] hover:text-[#819478] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-[#E3E0D7] flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#6C7168]">
              <span className="h-2 w-2 rounded-full bg-[#648568]" />
              <span>Acoustic Network: Active</span>
            </div>
            <a
              href="#discovery"
              onClick={() => setMobileMenuOpen(false)}
              className="px-5 py-2.5 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs font-medium uppercase tracking-wider"
            >
              Launch Map
            </a>
          </div>
        </div>
      )}
    </>
  );
}
