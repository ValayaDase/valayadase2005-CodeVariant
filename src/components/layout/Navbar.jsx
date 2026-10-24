"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

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
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl transition-all duration-400 ease-out ${
          scrolled
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#263D31]/92 backdrop-blur-md text-[#F4F1E8] px-5 py-2.5 rounded-full border border-[#819478]/40 shadow-xl flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center space-x-2 text-[#FCFBF7] group">
            <span className="w-2 h-2 rounded-full bg-[#819478] group-hover:scale-125 transition-transform" />
            <span className="font-editorial text-lg tracking-[0.06em] text-[#FCFBF7] font-normal uppercase">
              Spotwise
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-6 text-[11px] font-mono uppercase tracking-[0.15em] text-[#E3EBDD]/80">
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

          {/* Right CTA */}
          <div className="flex items-center space-x-3">
            <Link
              href="/sign-in"
              className="hidden lg:inline-flex text-[11px] font-mono uppercase tracking-wider text-[#E3EBDD] hover:text-white px-2 py-1 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#FCFBF7] text-[#263D31] text-[10px] font-mono font-bold uppercase tracking-wider hover:bg-[#E3EBDD] transition-colors"
            >
              <span>Launch App</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-[#FCFBF7] hover:text-[#819478]"
              aria-label="Toggle menu"
            >
              <Menu className="w-4 h-4" />
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
          <div className="flex flex-col space-y-4 flex-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#819478] font-mono font-bold">
              Navigation Chapters
            </p>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-editorial text-2xl text-[#FCFBF7] hover:text-[#819478] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-[#819478]/30 space-y-3">
            <Link
              href="/discover"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-full bg-[#FCFBF7] text-[#263D31] text-xs font-mono uppercase font-bold tracking-wider"
            >
              Launch App
            </Link>
            <Link
              href="/sign-in"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 rounded-full border border-[#819478]/40 text-[#FCFBF7] text-xs font-mono uppercase font-semibold tracking-wider hover:bg-[#819478]/10"
            >
              Sign In (Demo)
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
