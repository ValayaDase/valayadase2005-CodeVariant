"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSceneDepth from "@/components/three/HeroSceneDepth";

export default function Section01Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const headlineRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Discover", href: "#discovery" },
    { label: "How It Works", href: "#problem" },
    { label: "About", href: "#resolution" },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // 1. Background image entrance
      gsap.fromTo(
        bgRef.current,
        { scale: prefersReducedMotion ? 1 : 1.05, opacity: 0.7 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.6,
          ease: "power2.out",
        }
      );

      // 2. Parallax background on scroll (if motion enabled)
      if (!prefersReducedMotion) {
        gsap.to(bgRef.current, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // 3. Navbar entrance
      gsap.from(".hero-navbar-polygon", {
        y: -30,
        opacity: 0,
        duration: 1.1,
        delay: 0.1,
        ease: "power3.out",
      });

      // 4. Staggered headline lines reveal upward
      gsap.from(".hero-headline-line", {
        y: prefersReducedMotion ? 0 : 45,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        delay: 0.3,
        ease: "power3.out",
      });

      // 5. Chapter badge reveal
      gsap.from(".hero-badge", {
        opacity: 0,
        y: 18,
        duration: 0.9,
        delay: 0.2,
        ease: "power2.out",
      });

      // 6. Supporting copy and buttons reveal
      gsap.from(".hero-bottom-item", {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 25,
        stagger: 0.15,
        duration: 1,
        delay: 0.65,
        ease: "power2.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-[100svh] bg-[#263D31] flex flex-col justify-between overflow-hidden"
    >
      {/* Full-bleed hero container with no white border */}
       <div className="relative w-full min-h-[calc(100svh-10px)] rounded-[18px] sm:rounded-[24px] border border-[#819478]/70 overflow-hidden flex flex-col justify-between bg-[#263D31]">
        {/* Full-width background image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div ref={bgRef} className="relative w-full h-[112%] -top-[6%] left-0">
            <Image
              src="/images/hero/lakeside-cafe.png"
              alt="Serene Lakeside Café at Golden Hour overlooking peaceful waters"
              fill
              priority
              quality={90}
              className="object-cover object-[62%_35%] md:object-center select-none"
              sizes="100vw"
            />
          </div>

          {/* Left vignette for the headline */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent w-full md:w-3/5" />

          {/* Bottom gradient for supporting copy and CTA pills */}
          <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        </div>

        {/* Three.js focus depth layer */}
        <HeroSceneDepth />

        {/* 2. NAVBAR — floating logo + slanted green bar (Luma style) */}
        <div className="hero-navbar-polygon relative z-30 w-full flex items-start">
          {/* Logo: outside the bar, directly over the image */}
          <a
            href="#hero"
            className="flex items-center space-x-2 text-[#FCFBF7] group shrink-0 h-[56px] md:h-[64px] pl-6 sm:pl-8 lg:pl-12 w-[180px] md:w-[240px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#E3EBDD] group-hover:scale-125 transition-transform" />
            <span className="font-editorial text-lg md:text-xl lg:text-2xl tracking-[0.06em] uppercase">
              SPOTWISE
            </span>
          </a>

          {/* Green bar: left edge slanted */}
          <div
            className="flex-1 h-[56px] md:h-[64px] bg-[#263D31] text-[#F4F1E8] flex items-center justify-between pl-10 md:pl-14 pr-6 sm:pr-8 lg:pr-12"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 34px 100%)" }}
          >
            {/* Desktop nav */}
            <nav className="hidden md:flex flex-1 items-center justify-center space-x-7 lg:space-x-10">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.18em] text-[#E3EBDD]/80 hover:text-white transition-colors font-mono font-medium relative group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E3EBDD] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* CTA + mobile menu button */}
            <div className="flex items-center space-x-2 ml-auto md:ml-0">
              <a
                href="#discovery"
                className="inline-flex items-center space-x-1.5 px-3 md:px-5 py-2 rounded-full bg-[#FCFBF7] text-[#263D31] text-[10px] md:text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-[#E3EBDD] hover:shadow-md transition-all duration-200"
              >
                <span className="md:hidden">Find Quiet</span>
                <span className="hidden md:inline">Find your quiet place</span>
                <ArrowUpRight className="w-3.5 h-3.5 hidden md:block" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1 rounded-md text-[#FCFBF7] hover:bg-[#819478]/30 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. HERO CONTENT LAYER */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex-1 flex flex-col justify-between pt-8 sm:pt-12 pb-8 sm:pb-12">
          {/* Middle Left: Editorial Master Headline */}
          <div className="max-w-xl text-left my-auto">
            {/* Chapter Label */}
            <div className="hero-badge inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#263D31]/80 backdrop-blur-md border border-[#819478]/40 w-fit mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#819478] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#E3EBDD] font-semibold">
                Chapter 01 · The Search
              </span>
            </div>

            <h1
              ref={headlineRef}
              className="font-editorial text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] leading-[1.08] text-[#FCFBF7] tracking-tight drop-shadow-sm"
            >
              <span className="hero-headline-line block font-normal">You found a place.</span>
              <span className="hero-headline-line block text-[#E3EBDD] italic mt-1 sm:mt-1.5">
                But can you find your focus?
              </span>
            </h1>
          </div>

          {/* Bottom Area: Supporting Copy & Action Buttons */}
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pt-5">
            <div className="hero-bottom-item max-w-md">
              <p className="text-xs sm:text-sm lg:text-base text-[#FCFBF7]/90 leading-relaxed font-sans drop-shadow-sm">
                Too noisy. Too crowded. Uncertain Wi-Fi. Finding the right place to work shouldn’t be a gamble.
              </p>
            </div>

            <div className="hero-bottom-item flex flex-wrap items-center gap-3">
              <a
                href="#discovery"
                className="inline-flex items-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#263D31] text-[#FCFBF7] border border-[#819478]/50 text-xs font-mono uppercase tracking-widest font-semibold hover:bg-[#819478] hover:text-[#252B26] transition-all duration-200 shadow-lg group"
              >
                <span>Find your quiet place</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a
                href="#problem"
                className="inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-black/25 hover:bg-black/40 text-[#FCFBF7] backdrop-blur-md border border-white/30 text-xs font-mono uppercase tracking-widest font-medium transition-all duration-200 shadow-md"
              >
                <span>Discover the story</span>
                <ArrowDown className="w-3 h-3 text-[#E3EBDD]" />
              </a>
            </div>
          </div>
        </div>
      </div>

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
          <div className="flex flex-col space-y-5 flex-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#819478] font-mono font-bold">
              Navigation
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

          <div className="pt-6 border-t border-[#819478]/30 flex flex-col gap-3">
            <a
              href="#discovery"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full bg-[#FCFBF7] text-[#263D31] text-xs font-mono uppercase font-bold tracking-wider"
            >
              Find your quiet place
            </a>
            <p className="text-center text-[10px] font-mono text-[#819478]">
              SPOTWISE — THE QUIET PLACE
            </p>
          </div>
        </div>
      )}
    </section>
  );
}