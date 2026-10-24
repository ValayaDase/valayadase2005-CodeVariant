"use client";

import { useEffect, useRef } from "react";
import { Sparkles, MapPin, ArrowDown, Radio } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TurningPointDepth from "@/components/three/TurningPointDepth";

export default function Section03TurningPoint() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Zoom out & grid lines reveal on scroll
      gsap.fromTo(
        ".coordinate-marker",
        { opacity: 0, scale: 0.6, y: 35 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.16,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "center center",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        ".topo-ring",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1.25,
          opacity: 0.35,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom center",
            scrub: 1,
          },
        }
      );

      gsap.from(".turning-title", {
        opacity: 0,
        y: 50,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="turning-point"
      ref={sectionRef}
      className="relative z-20 min-h-[92svh] w-full bg-[#F4F1E8] bg-gradient-to-b from-[#F4F1E8] via-[#E3EBDD]/60 to-[#FCFBF7] py-28 px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-center overflow-hidden border-t border-[#E3E0D7]"
    >
      {/* Three.js 3D Spatial Transition Layer */}
      <TurningPointDepth />

      {/* Topographic Geometric Contour Circles (Clarity emerging from chaos) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="topo-ring absolute w-[380px] h-[380px] rounded-full border border-[#819478]/30" />
        <div className="topo-ring absolute w-[620px] h-[620px] rounded-full border border-[#819478]/25" />
        <div className="topo-ring absolute w-[900px] h-[900px] rounded-full border border-[#819478]/20" />
        <div className="topo-ring absolute w-[1220px] h-[1220px] rounded-full border border-[#819478]/15" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* The Transition Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FCFBF7] border border-[#819478]/40 shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#263D31]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#263D31] font-semibold">
            Section 03 · The Turning Point
          </span>
        </div>

        {/* Cinematic Question Headlines matching Master Prompt verbatim */}
        <h2 className="turning-title font-editorial text-4xl sm:text-6xl lg:text-7xl text-[#252B26] leading-[1.08] tracking-tight mb-6">
          What if you knew <br />
          <span className="text-[#263D31] italic">before you arrived?</span>
        </h2>

        {/* Supporting Copy matching Master Prompt verbatim */}
        <p className="text-lg sm:text-2xl text-[#263D31]/80 font-editorial max-w-2xl leading-relaxed mb-12">
          “What if you could choose a place based on the environment you actually need?”
        </p>

        {/* Three Discovered Geographic Nodes: Quiet, Caution, Crowded States */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-12">
          {/* Node 1: Quiet */}
          <div className="coordinate-marker glass-ivory p-5 rounded-2xl border border-[#263D31]/30 shadow-md text-left flex items-start space-x-3.5">
            <span className="p-2 rounded-xl bg-[#263D31] text-white">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#263D31] font-bold tracking-wider">
                Quiet Sanctuary · 36 dB
              </p>
              <p className="font-editorial text-lg text-[#252B26]">The Solitude Atelier</p>
              <p className="text-xs text-[#6C7168] mt-1 font-mono">
                98% Focus Match · 100% Sockets
              </p>
            </div>
          </div>

          {/* Node 2: Caution */}
          <div className="coordinate-marker glass-ivory p-5 rounded-2xl border border-[#C58C5A]/40 shadow-md text-left flex items-start space-x-3.5">
            <span className="p-2 rounded-xl bg-[#C58C5A] text-white">
              <Radio className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#C58C5A] font-bold tracking-wider">
                Caution Variable · 58 dB
              </p>
              <p className="font-editorial text-lg text-[#252B26]">Amber Courtyard</p>
              <p className="text-xs text-[#6C7168] mt-1 font-mono">
                74% Focus Match · Morning Only
              </p>
            </div>
          </div>

          {/* Node 3: Crowded */}
          <div className="coordinate-marker glass-ivory p-5 rounded-2xl border border-[#B86E52]/40 shadow-md text-left flex items-start space-x-3.5">
            <span className="p-2 rounded-xl bg-[#B86E52] text-white">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#B86E52] font-bold tracking-wider">
                Crowded Warning · 67 dB
              </p>
              <p className="font-editorial text-lg text-[#252B26]">Monocle Commons</p>
              <p className="text-xs text-[#6C7168] mt-1 font-mono">
                89% Occupancy · High Echo
              </p>
            </div>
          </div>
        </div>

        {/* Smooth Resolution Prompt to Interactive Map */}
        <a
          href="#discovery"
          className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs uppercase tracking-widest font-mono hover:bg-[#819478] hover:text-[#252B26] transition-all duration-300 shadow-md"
        >
          <span>Reveal Live Map Discovery</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
