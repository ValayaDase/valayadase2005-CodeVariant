"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, Compass, AlertCircle, Wifi, Users, Volume2 } from "lucide-react";
import { gsap } from "gsap";
import HeroSceneDepth from "@/components/three/HeroSceneDepth";

export default function Section01Hero() {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const indicatorsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line by line reveal
      gsap.from(".hero-line", {
        y: 45,
        opacity: 0,
        stagger: 0.18,
        duration: 1.1,
        ease: "power3.out",
      });

      // Supporting text fade in
      gsap.from(".hero-support", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        delay: 0.5,
        ease: "power2.out",
      });

      // CTAs
      gsap.from(".hero-cta", {
        opacity: 0,
        y: 15,
        stagger: 0.12,
        duration: 0.8,
        delay: 0.7,
        ease: "power2.out",
      });

      // Image clip-path reveal
      gsap.fromTo(
        imageWrapperRef.current,
        {
          clipPath: "polygon(0 15%, 100% 15%, 100% 85%, 0 85%)",
          opacity: 0,
          scale: 0.96,
        },
        {
          clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
          opacity: 1,
          scale: 1,
          duration: 1.4,
          delay: 0.3,
          ease: "expo.out",
        }
      );

      // Micro telemetry indicators reveal
      gsap.from(".telemetry-pill", {
        opacity: 0,
        scale: 0.85,
        y: 12,
        stagger: 0.15,
        duration: 0.9,
        delay: 0.9,
        ease: "back.out(1.4)",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-28 pb-12 px-6 sm:px-8 lg:px-12 bg-[#F4F1E8] overflow-hidden"
    >
      {/* Three.js ambient focus depth canvas */}
      <HeroSceneDepth />

      {/* Main Grid Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Editorial Headline & Narrative */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Chapter Subtitle Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E3EBDD] border border-[#819478]/30 w-fit mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#263D31]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#263D31] font-semibold">
              Chapter 01 · The Search
            </span>
          </div>

          {/* Master Headline */}
          <h1
            ref={headlineRef}
            className="font-editorial text-4xl sm:text-6xl lg:text-[4.25rem] leading-[1.08] text-[#252B26] tracking-tight mb-7"
          >
            <span className="hero-line block">You found a place.</span>
            <span className="hero-line block text-[#263D31] italic">
              But can you find your focus?
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="hero-support text-base sm:text-lg text-[#6C7168] max-w-xl font-normal leading-relaxed mb-9">
            Noise. Crowds. Uncertainty. Finding a place to work should not be a gamble. Discover workspaces curated through live sensory telemetry, crowd forecasting, and acoustic clarity.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#discovery"
              className="hero-cta inline-flex items-center space-x-2.5 px-7 py-3.5 rounded-full bg-[#263D31] text-[#F4F1E8] text-sm font-medium tracking-wide uppercase hover:bg-[#819478] hover:text-[#252B26] transition-all duration-300 shadow-md group"
            >
              <span>Find your quiet place</span>
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            </a>

            <a
              href="#friction"
              className="hero-cta inline-flex items-center space-x-2 px-6 py-3.5 rounded-full border border-[#E3E0D7] bg-[#FCFBF7]/80 text-[#252B26] text-sm font-medium tracking-wide uppercase hover:border-[#263D31] transition-all duration-300"
            >
              <span>Discover the story</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#819478]" />
            </a>
          </div>

          {/* Environmental Insight Counter */}
          <div className="mt-12 pt-6 border-t border-[#E3E0D7] grid grid-cols-3 gap-6 max-w-lg">
            <div>
              <p className="text-2xl font-editorial text-[#263D31]">78%</p>
              <p className="text-xs text-[#6C7168] font-mono mt-0.5">
                Work sessions cut short by unexpected noise
              </p>
            </div>
            <div>
              <p className="text-2xl font-editorial text-[#263D31]">24 min</p>
              <p className="text-xs text-[#6C7168] font-mono mt-0.5">
                Average lost time seeking an open seat
              </p>
            </div>
            <div>
              <p className="text-2xl font-editorial text-[#648568]">41 dB</p>
              <p className="text-xs text-[#6C7168] font-mono mt-0.5">
                Spotwise verified quiet baseline
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Realistic Workspace Photography & Telemetry Float */}
        <div className="lg:col-span-5 relative">
          <div
            ref={imageWrapperRef}
            className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-[#E3E0D7]/60 group"
          >
            <Image
              src="/images/hero/workspace.jpg"
              alt="Natural daylight architectural workspace with oak desks"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            {/* Subtle photographic vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#252B26]/30 via-transparent to-transparent pointer-events-none" />

            {/* Micro Telemetry Indicator 1: Noise Level */}
            <div className="telemetry-pill absolute top-4 left-4 glass-ivory px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-md">
              <span className="p-1.5 rounded-lg bg-[#C58C5A]/15 text-[#C58C5A]">
                <Volume2 className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] uppercase font-mono text-[#6C7168] tracking-wider">
                  Ambient Noise
                </p>
                <p className="text-xs font-semibold text-[#252B26] font-mono">
                  68 dB · Fluctuating
                </p>
              </div>
            </div>

            {/* Micro Telemetry Indicator 2: Crowd Status */}
            <div className="telemetry-pill absolute top-20 right-4 glass-ivory px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-md">
              <span className="p-1.5 rounded-lg bg-[#B86E52]/15 text-[#B86E52]">
                <Users className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] uppercase font-mono text-[#6C7168] tracking-wider">
                  Crowd Density
                </p>
                <p className="text-xs font-semibold text-[#252B26] font-mono">
                  84% · High Risk
                </p>
              </div>
            </div>

            {/* Micro Telemetry Indicator 3: WiFi Speed */}
            <div className="telemetry-pill absolute bottom-6 left-6 glass-ivory px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-md">
              <span className="p-1.5 rounded-lg bg-[#92958D]/20 text-[#6C7168]">
                <Wifi className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="text-[10px] uppercase font-mono text-[#6C7168] tracking-wider">
                  WiFi Stability
                </p>
                <p className="text-xs font-semibold text-[#252B26] font-mono">
                  2.4 GHz · Packet Jitter
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-6 border-t border-[#E3E0D7]/70 text-xs font-mono text-[#6C7168]">
        <div className="flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#819478] animate-pulse" />
          <span className="tracking-widest uppercase">Scroll-driven acoustic narrative</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Scroll to uncover the friction</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#263D31] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
