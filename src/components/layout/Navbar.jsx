"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AnimatedLogo } from "@/components/common";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal floating persistent navbar once user scrolls past the framed hero
      setScrolled(window.scrollY > 380);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Search", href: "#hero" },
    { label: "Problem", href: "#problem" },
    { label: "Turning Point", href: "#turning-point" },
    { label: "Discovery Map", href: "#discovery" },
    { label: "Quiet When", href: "#quiet-when" },
    { label: "Focus Fit", href: "#focus-fit" },
    { label: "Community", href: "#community" },
    { label: "Compare", href: "#compare" },
  ];

  return (
    <>
      {/* Floating persistent navigation header - reveals smoothly once user scrolls past hero */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl transition-all duration-400 ease-out ${scrolled
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-24 opacity-0 pointer-events-none"
          }`}
      >
        <div className="bg-[#263D31]/92 backdrop-blur-md text-[#F4F1E8] px-5 py-2.5 rounded-full border border-[#819478]/40 shadow-xl flex items-center justify-between">
          {/* Animated Logo */}
          <AnimatedLogo size="sm" variant="light" href="#hero" />

          {/* Nav links */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-5 text-[11px] font-mono uppercase tracking-[0.14em] text-[#E3EBDD]/80">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions: Sign In + App Launch */}
          <div className="flex items-center space-x-2.5">
            <Link
              href="/sign-in"
              className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-[#E3EBDD] hover:text-white px-2.5 py-1 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/discover"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#FCFBF7] text-[#263D31] text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#E3EBDD] transition-colors shadow-sm"
            >
              <span>Launch App</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1 text-[#FCFBF7] hover:text-[#819478]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#263D31]/95 backdrop-blur-md text-[#F4F1E8] flex flex-col pt-20 px-8 pb-10 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="self-end p-2 text-[#FCFBF7] mb-6"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col space-y-3 flex-1 overflow-y-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#819478] font-mono font-bold">
              Navigation Chapters
            </p>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-editorial text-xl text-[#FCFBF7] hover:text-[#819478] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-5 border-t border-[#819478]/30 flex flex-col gap-2.5">
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-mono uppercase text-[#E3EBDD] hover:text-white"
            >
              Sign In (Demo)
            </Link>
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-full bg-[#FCFBF7] text-[#263D31] text-xs font-mono uppercase font-bold tracking-wider"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
