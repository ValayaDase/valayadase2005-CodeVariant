"use client";

import { useEffect, useRef } from "react";
import { Sparkles, MapPin, CheckCircle2, Sliders, ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Section03TurningPoint() {
  const sectionRef = useRef(null);
  const gridLinesRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Zoom out & grid lines reveal on scroll
      gsap.fromTo(
        ".coordinate-marker",
        { opacity: 0, scale: 0.5, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          stagger: 0.15,
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
          scale: 1.2,
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
        duration: 1,
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
      className="relative min-h-[90svh] w-full bg-gradient-to-b from-[#F4F1E8] via-[#E3EBDD] to-[#F4F1E8] py-28 px-6 sm:px-8 lg:px-12 flex flex-col justify-center items-center overflow-hidden border-t border-[#E3E0D7]"
    >
      {/* Topographic Geometric Contour Circles (Clarity emerging) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="topo-ring absolute w-[360px] h-[360px] rounded-full border border-[#819478]/30" />
        <div className="topo-ring absolute w-[580px] h-[580px] rounded-full border border-[#819478]/25" />
        <div className="topo-ring absolute w-[840px] h-[840px] rounded-full border border-[#819478]/20" />
        <div className="topo-ring absolute w-[1140px] h-[1140px] rounded-full border border-[#819478]/15" />

        {/* Subtle coordinate crosshairs */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-[#819478]" />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* The Transition Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FCFBF7] border border-[#819478]/40 shadow-sm mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#648568]" />
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#263D31] font-semibold">
            Section 03 · The Turning Point
          </span>
        </div>

        {/* Cinematic Question Headlines */}
        <h2 className="turning-title font-editorial text-4xl sm:text-6xl lg:text-7xl text-[#252B26] leading-[1.08] tracking-tight mb-8">
          What if you knew <br />
          <span className="text-[#263D31] italic">before you arrived?</span>
        </h2>

        <p className="text-lg sm:text-2xl text-[#263D31]/80 font-editorial max-w-2xl leading-relaxed mb-12">
          “What if you could choose a place based on the way you actually work?”
        </p>

        {/* Three Discovered Quiet Coordinates Emerging onto the Map */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-12">
          {/* Node 1 */}
          <div className="coordinate-marker glass-ivory p-5 rounded-2xl border border-[#819478]/40 shadow-md text-left flex items-start space-x-3.5">
            <span className="p-2 rounded-xl bg-[#648568] text-white">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#819478] tracking-wider">
                Coordinate Alpha · 36 dB
              </p>
              <p className="font-editorial text-lg text-[#252B26]">The Solitude Atelier</p>
              <p className="text-xs text-[#6C7168] mt-1 font-mono">
                98% Quiet Match · 18 Outlets
              </p>
            </div>
          </div>

          {/* Node 2 */}
          <div className="coordinate-marker glass-ivory p-5 rounded-2xl border border-[#819478]/40 shadow-md text-left flex items-start space-x-3.5">
            <span className="p-2 rounded-xl bg-[#648568] text-white">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#819478] tracking-wider">
                Coordinate Beta · 41 dB
              </p>
              <p className="font-editorial text-lg text-[#252B26]">Komorebi Study</p>
              <p className="text-xs text-[#6C7168] mt-1 font-mono">
                92% Quiet Match · Fiber Line
              </p>
            </div>
          </div>

          {/* Node 3 */}
          <div className="coordinate-marker glass-ivory p-5 rounded-2xl border border-[#819478]/40 shadow-md text-left flex items-start space-x-3.5">
            <span className="p-2 rounded-xl bg-[#648568] text-white">
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] font-mono uppercase text-[#819478] tracking-wider">
                Coordinate Gamma · 31 dB
              </p>
              <p className="font-editorial text-lg text-[#252B26]">The Vault Archive</p>
              <p className="text-xs text-[#6C7168] mt-1 font-mono">
                96% Quiet Match · Silent Pods
              </p>
            </div>
          </div>
        </div>

        {/* Smooth Resolution Prompt to Interactive Map */}
        <a
          href="#discovery"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#263D31] text-[#F4F1E8] text-xs uppercase tracking-widest font-mono hover:bg-[#819478] hover:text-[#252B26] transition-all duration-300 shadow-md"
        >
          <span>Reveal Live Map Discovery</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
