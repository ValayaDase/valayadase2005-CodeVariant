"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Compass, Menu, X } from "lucide-react";
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
      className="relative w-full min-h-[100svh] p-2.5 sm:p-4 lg:p-5 bg-[#F4F1E8] flex flex-col justify-center overflow-hidden"
    >
      {/* 1. ARCHITECTURAL FRAMED CONTAINER (Matching Luma Reference) */}
      <div className="relative w-full h-[calc(100svh-1.25rem)] sm:h-[calc(100svh-2rem)] lg:h-[calc(100svh-2.5rem)] rounded-[20px] sm:rounded-[28px] lg:rounded-[32px] border border-[#819478]/40 overflow-hidden shadow-2xl flex flex-col justify-between bg-[#263D31]">
        
        {/* Full-width Panoramic Desktop Hero Background Image inside Frame */}
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

          {/* Local directional gradient overlays for pristine readability */}
          {/* Left vignette for the headline */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent w-full md:w-3/5" />

          {/* Bottom subtle gradient for supporting copy and CTA pills */}
          <div className="absolute bottom-0 left-0 right-0 h-48 md:h-64 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        </div>

        {/* Subtle Three.js focus depth layer for floating motes */}
        <HeroSceneDepth />

        {/* 2. ASYMMETRIC FOREST-GREEN NAVBAR (Luma Reference Polygon) */}
        <div className="hero-navbar-polygon relative z-30 w-full">
          {/* Desktop Polygon Shape */}
          <div
            className="hidden md:block w-full bg-[#263D31] text-[#F4F1E8] relative drop-shadow-md"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 50px, 290px 50px, 250px 78px, 0 78px)",
              height: "78px",
            }}
          >
            <div className="w-full px-6 lg:px-8 h-full flex items-start justify-between">
              {/* Brand Logo on the left (in the deeper 78px section) */}
              <div className="h-[78px] flex items-center pr-6">
                <a
                  href="#hero"
                  className="flex items-center space-x-2 text-[#FCFBF7] group"
                >
                  <span className="w-2 h-2 rounded-full bg-[#819478] group-hover:scale-125 transition-transform" />
                  <span className="font-editorial text-xl lg:text-2xl tracking-[0.06em] text-[#FCFBF7] font-normal uppercase">
                    SPOTWISE
                  </span>
                </a>
              </div>

              {/* Navigation in the middle (in the 50px section) */}
              <nav className="h-[50px] flex items-center space-x-7 lg:space-x-8">
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

              {/* Primary CTA on the right (in the 50px section) */}
              <div className="h-[50px] flex items-center">
                <a
                  href="#discovery"
                  className="inline-flex items-center space-x-1.5 px-4 lg:px-5 py-2 rounded-full bg-[#FCFBF7] text-[#263D31] text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-[#E3EBDD] hover:shadow-md transition-all duration-200"
                >
                  <span>Find your quiet place</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Polygon Shape & Nav */}
          <div
            className="md:hidden w-full bg-[#263D31] text-[#F4F1E8] px-4 py-3 flex items-center justify-between shadow-md"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 54px, 180px 54px, 160px 62px, 0 62px)",
              minHeight: "62px",
            }}
          >
            <a href="#hero" className="flex items-center space-x-1.5 text-[#FCFBF7]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#819478]" />
              <span className="font-editorial text-lg tracking-[0.06em] uppercase">
                SPOTWISE
              </span>
            </a>

            <div className="flex items-center space-x-2">
              <a
                href="#discovery"
                className="px-3 py-1.5 rounded-full bg-[#FCFBF7] text-[#263D31] text-[10px] font-mono uppercase font-bold"
              >
                Find Quiet
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 rounded-md text-[#FCFBF7] hover:bg-[#819478]/30 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3. HERO CONTENT LAYER */}
        <div className="relative z-20 w-full px-6 sm:px-8 lg:px-12 flex-1 flex flex-col justify-between pt-8 sm:pt-12 pb-8 sm:pb-10">
          {/* Middle Left: Editorial Master Headline */}
          <div className="max-w-xl text-left my-auto">
            {/* Chapter Label */}
            <div className="hero-badge inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#263D31]/80 backdrop-blur-md border border-[#819478]/40 w-fit mb-5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#819478] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#E3EBDD] font-semibold">
                Chapter 01 · The Search
              </span>
            </div>

            {/* Headline with Controlled Editorial Scale */}
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
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pt-5 border-t border-white/20">
            {/* Supporting Copy */}
            <div className="hero-bottom-item max-w-md">
              <p className="text-xs sm:text-sm lg:text-base text-[#FCFBF7]/90 leading-relaxed font-sans drop-shadow-sm">
                Too noisy. Too crowded. Uncertain Wi-Fi. Finding the right place to work shouldn’t be a gamble.
              </p>
            </div>

            {/* CTAs */}
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
