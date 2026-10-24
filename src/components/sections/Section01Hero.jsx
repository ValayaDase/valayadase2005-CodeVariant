"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function HL({ children }) {
  return (
    <span className="relative inline-block px-1.5 sm:px-2">
      <span
        className="hl-text relative inline-block"
        style={{
          color: "transparent",
          backgroundImage:
            "linear-gradient(#819478, #819478), linear-gradient(#FCFBF7, #FCFBF7)",
          backgroundSize: "0% 100%, 100% 100%",
          backgroundPosition: "100% 50%, 0% 50%",
          backgroundRepeat: "no-repeat",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
        }}
      >
        {children}
      </span>
    </span>
  );
}

export default function Section01Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const headlineRef = useRef(null);
  const introOverlayRef = useRef(null);
  const introLogoRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Nav links matching the actual content sections of the page
  const navLinks = [
    { label: "The Problem", href: "#problem" },
    { label: "Discovery Map", href: "#discovery" },
    { label: "Quiet When", href: "#quiet-when" },
    { label: "Focus Fit", href: "#focus-fit" },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // Reduced motion: skip the opening sequence and keep everything visible immediately
      if (prefersReducedMotion) {
        if (introOverlayRef.current) {
          gsap.set(introOverlayRef.current, { display: "none" });
        }
        gsap.set(".hl-text", {
          backgroundSize: "100% 100%, 100% 100%",
        });
        return;
      }

      // Check if intro has already played in this browser session
      const alreadyPlayed =
        typeof window !== "undefined" && window.__spotwiseIntroPlayed;

      if (alreadyPlayed) {
        if (introOverlayRef.current) {
          gsap.set(introOverlayRef.current, { display: "none" });
        }
        gsap.set([".hero-navbar-polygon", ".hero-headline-line", ".hero-support-copy", ".hero-action-btn"], {
          opacity: 1,
          y: 0,
          yPercent: 0,
        });
      } else {
        // Mark as played for subsequent interactions
        if (typeof window !== "undefined") {
          window.__spotwiseIntroPlayed = true;
        }

        // =========================================================
        // MASTER CINEMATIC OPENING TIMELINE (Total duration ~ 2.2s)
        // 1. Forest Green Intro with Logo
        // 2. Staggered Horizontal Green Panels Reveal
        // 3. Café Sunset Hero Image Reveal with Subtle Scale Depth
        // 4. Navbar, Masked Headline Lines, and Actions Entrance
        // =========================================================
        const masterOpeningTl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            if (introOverlayRef.current) {
              gsap.set(introOverlayRef.current, { display: "none" });
            }
          },
        });

        // Initial setup
        gsap.set(bgRef.current, { scale: 1.08, opacity: 0.85 });
        gsap.set(".intro-panel", { scaleX: 1 });
        gsap.set(".hero-navbar-polygon", { y: -35, opacity: 0 });
        gsap.set(".hero-headline-line", { yPercent: 110, opacity: 0 });
        gsap.set(".hero-support-copy", { y: 22, opacity: 0 });
        gsap.set(".hero-action-btn", { y: 24, opacity: 0, scale: 0.96 });

        // Step 1: Center SPOTWISE Logo Entrance & Soft Scale
        masterOpeningTl
          .fromTo(
            introLogoRef.current,
            { opacity: 0, scale: 0.92, y: 8 },
            { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: "power2.out" },
            0.1
          )
          // Logo gentle scale and fade-out transition into shutter reveal
          .to(
            introLogoRef.current,
            { opacity: 0, scale: 1.05, duration: 0.35, ease: "power2.in" },
            0.7
          );

        // Step 2: Staggered Horizontal Panels Shutter Reveal (Wiping in alternating directions)
        const panels = gsap.utils.toArray(".intro-panel");
        panels.forEach((panel, i) => {
          masterOpeningTl.to(
            panel,
            {
              scaleX: 0,
              transformOrigin: i % 2 === 0 ? "left center" : "right center",
              duration: 0.75,
              ease: "power3.inOut",
            },
            0.8 + i * 0.07
          );
        });

        // Step 3: Hero Image subtle scale down for cinematic depth
        masterOpeningTl.to(
          bgRef.current,
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
          },
          0.85
        );

        // Fade overlay container background to completely reveal scene
        masterOpeningTl.to(
          introOverlayRef.current,
          {
            opacity: 0,
            duration: 0.35,
            ease: "power1.out",
          },
          1.45
        );

        // Step 4: Coordinated Navbar & Headline Entrance
        masterOpeningTl
          .to(
            ".hero-navbar-polygon",
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              clearProps: "transform,opacity",
            },
            1.25
          )
          .to(
            ".hero-headline-line",
            {
              yPercent: 0,
              opacity: 1,
              stagger: 0.14,
              duration: 0.95,
              clearProps: "transform,opacity",
            },
            1.35
          )
          .to(
            ".hero-support-copy",
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              clearProps: "transform,opacity",
            },
            1.6
          )
          .to(
            ".hero-action-btn",
            {
              y: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.12,
              duration: 0.75,
              clearProps: "transform,opacity",
            },
            1.7
          );
      }

      // Parallax background on ordinary scroll
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

      // Green color fills inside highlighted words on scroll
      gsap.to(".hl-text", {
        backgroundSize: "100% 100%, 100% 100%",
        duration: 1,
        stagger: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "60% top",
          scrub: 0.6,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-[100svh] bg-[#263D31] p-[10px] sm:p-[12px] flex flex-col justify-between overflow-hidden"
    >
      {/* =========================================================================
          CINEMATIC OPENING INTRO OVERLAY (Full-screen deep forest green curtain)
          Plays once on initial load with centered logo and staggered horizontal panels
      ========================================================================= */}
      <div
        ref={introOverlayRef}
        className="fixed inset-0 z-50 pointer-events-auto flex flex-col justify-between overflow-hidden bg-[#263D31]"
        aria-hidden="true"
      >
        {/* Layer 1: Centered SPOTWISE Logo with clean typography & emerald accent */}
        <div
          ref={introLogoRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none px-6"
        >
          <div className="flex items-center space-x-3 text-[#FCFBF7]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#819478] shadow-[0_0_12px_#819478]" />
            <span className="font-['Montserrat'] text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.24em] uppercase">
              SPOTWISE
            </span>
          </div>
          <p className="mt-3 text-[10px] sm:text-xs font-mono uppercase tracking-[0.32em] text-[#819478]">
            The Quiet Place
          </p>
        </div>

        {/* Layer 2: 5 Horizontal Rectangular Panels spanning different tone strips */}
        <div className="absolute inset-0 z-10 flex flex-col w-full h-full pointer-events-none">
          <div className="intro-panel flex-1 w-full bg-[#263D31] border-b border-[#819478]/15" />
          <div className="intro-panel flex-1 w-full bg-[#1E3227] border-b border-[#819478]/15" />
          <div className="intro-panel flex-1 w-full bg-[#263D31] border-b border-[#819478]/15" />
          <div className="intro-panel flex-1 w-full bg-[#1B2D23] border-b border-[#819478]/15" />
          <div className="intro-panel flex-1 w-full bg-[#263D31]" />
        </div>
      </div>

      {/* Full-bleed hero container with subtle framing */}
      <div className="relative w-full min-h-[calc(100svh-10px)] rounded-[18px] sm:rounded-[24px] border-2 border-[#819478]/0 overflow-hidden flex flex-col justify-between bg-[#263D31]">
        {/* Full-width background image */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div
            ref={bgRef}
            className="relative w-full h-[112%] -top-[6%] left-0"
          >
            <Image
              src="/images/hero/heroimage.png"
              alt="Serene Lakeside Café at Golden Hour overlooking peaceful waters"
              fill
              priority
              quality={90}
              className="object-cover object-[62%_35%] md:object-center select-none"
              sizes="100vw"
            />
          </div>

          {/* Subtle forest-green vignette: strongest on left for headline contrast, fading naturally to the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#14231A]/85 via-[#1B3024]/40 via-45% to-transparent pointer-events-none z-10" />
        </div>

        {/* 2. NAVBAR — floating logo + slanted green bar (Luma style) */}
        <div className="hero-navbar-polygon relative z-30 w-full flex items-start">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center space-x-2 text-[#FCFBF7] group shrink-0 h-[56px] md:h-[64px] pl-5 sm:pl-8 lg:pl-12 w-[160px] sm:w-[180px] md:w-[240px] drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
          >
            <span className="w-2 h-2 rounded-full bg-[#E3EBDD] group-hover:scale-125 transition-transform" />

            <span className="font-['Montserrat'] text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight uppercase">
              SPOTWISE
            </span>
          </a>

          {/* Green bar: left edge slanted */}
          <div
            className="flex-1 h-[56px] md:h-[64px] bg-[#263D31] text-[#F4F1E8] flex items-center justify-between pl-8 sm:pl-10 md:pl-14 pr-3 sm:pr-8 lg:pr-12"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 30px 100%)",
            }}
          >
            {/* Desktop nav with content-focused links */}
            <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 lg:space-x-9">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs uppercase tracking-[0.16em] text-[#E3EBDD]/85 hover:text-white transition-colors font-mono font-medium relative group py-1"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#E3EBDD] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* CTA + Mobile Menu Button: Perfectly proportioned horizontal pill with no wrapping */}
            <div className="flex items-center space-x-1.5 sm:space-x-3 ml-auto md:ml-0 shrink-0">
              <a
                href="#discovery"
                className="inline-flex items-center justify-center whitespace-nowrap px-3 sm:px-5 h-[34px] sm:h-[38px] rounded-full bg-[#FCFBF7] text-[#263D31] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider hover:bg-[#E3EBDD] hover:shadow-md transition-all duration-200 shrink-0 shadow-sm"
              >
                <span className="md:hidden">Find Quiet</span>
                <span className="hidden md:inline">Find your quiet place</span>
                <ArrowUpRight className="w-3.5 h-3.5 hidden md:inline-block ml-1" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-[#FCFBF7] hover:bg-[#819478]/30 focus:outline-none shrink-0 flex items-center justify-center transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. HERO CONTENT LAYER */}
        <div className="relative z-20 w-full px-5 sm:px-8 lg:px-10 flex-1 flex flex-col justify-between pt-6 sm:pt-10 pb-8 sm:pb-12">
          {/* Editorial headline */}
          <div className="max-w-2xl text-left my-auto">
            <h1
              ref={headlineRef}
              className="font-editorial text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.85rem] leading-[1.18] text-[#FCFBF7] tracking-tight drop-shadow-sm"
            >
              {/* Mask keeps the reveal inside the headline area */}
              <span className="block overflow-hidden py-[0.12em] -my-[0.12em]">
                <span className="hero-headline-line block font-normal">
                  You found a <HL>place.</HL>
                </span>
              </span>

              <span className="block overflow-hidden mt-1 sm:mt-1.5 py-[0.12em] -mb-[0.12em]">
                <span className="hero-headline-line block text-[#E3EBDD] italic">
                  But can you <HL>find</HL> your <HL>focus?</HL>
                </span>
              </span>
            </h1>
          </div>

          {/* Supporting copy & action buttons */}
          <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pt-5">
            <div className="hero-bottom-item hero-support-copy max-w-md">
              <p className="text-xs sm:text-sm lg:text-base text-[#FCFBF7]/90 leading-relaxed font-sans drop-shadow-sm">
                Too noisy. Too crowded. Uncertain Wi-Fi. Finding the right
                place to work shouldn’t be a gamble.
              </p>
            </div>

            <div className="hero-bottom-item flex flex-wrap items-center gap-3 md:justify-end md:ml-auto">
              <a
                href="#discovery"
                className="hero-action-btn inline-flex items-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#263D31] text-[#FCFBF7] border border-[#819478]/50 text-xs font-mono uppercase tracking-widest font-semibold hover:bg-[#819478] hover:text-[#252B26] transition-colors duration-200 shadow-lg group"
              >
                <span>Find your quiet place</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
              </a>

              <a
                href="#problem"
                className="hero-action-btn inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-black/25 hover:bg-black/40 text-[#FCFBF7] backdrop-blur-md border border-white/30 text-xs font-mono uppercase tracking-widest font-medium transition-colors duration-200 shadow-md"
              >
                <span>Discover the story</span>
                <ArrowDown className="w-3 h-3 text-[#E3EBDD]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer menu */}
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