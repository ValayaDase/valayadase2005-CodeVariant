"use client";

import { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import { Sparkles, ShieldCheck, Volume2 } from "lucide-react";

// Dynamically import Lottie from lottie-react without SSR.
// lottie-react v3 exports a named { Lottie }, while v2 exported default.
const Lottie = dynamic(
  () =>
    import("lottie-react").then((mod) => {
      const Component = mod.Lottie || mod.default || mod;
      return Component;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center text-[#555D50]">
        <div className="w-8 h-8 border-2 border-[#819477] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs uppercase tracking-wider font-semibold">
          Calibrating Sanctuary Visual...
        </span>
      </div>
    ),
  }
);

const AuthIllustration = memo(function AuthIllustration() {
  const [animationData, setAnimationData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/animations/peaceful-at-work.json")
      .then((res) => {
        if (!res.ok) throw new Error("Animation JSON not found");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setAnimationData(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load Lottie animation JSON:", err);
        if (isMounted) {
          setError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-full flex flex-col items-center justify-between p-8 sm:p-12 bg-gradient-to-br from-[#EBF0E9] via-[#F5F3EC] to-[#E8E0D2]/60 overflow-hidden select-none">
      
      {/* Central Lottie Animation / Fallback */}
      <div className="my-auto relative w-full max-w-sm sm:max-w-md aspect-square flex items-center justify-center z-10 min-h-[280px]">
        {!error ? (
          <Lottie
            src={animationData || "/animations/peaceful-at-work.json"}
            animationData={animationData}
            loop={true}
            autoplay={true}
            className="w-full h-full object-contain"
            style={{ width: "100%", height: "100%", minHeight: "280px" }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-white/80 rounded-3xl border border-[#E8E0D2]">
            <Sparkles className="w-10 h-10 text-[#819477] mb-2" />
            <p className="font-serif text-lg font-bold text-[#20231F]">
              Peaceful at Work
            </p>
            <p className="text-xs text-[#555D50] mt-1">
              Curated focus sanctuary for deep cognitive flow
            </p>
          </div>
        )}
      </div>

      {/* Bottom Editorial Caption */}
      <div className="w-full text-center z-10 pt-4 border-t border-[#E8E0D2]/70">
        <p className="font-serif text-base sm:text-lg font-medium text-[#20231F]">
          &ldquo;Your surroundings shape your cognitive bandwidth.&rdquo;
        </p>
        <p className="text-xs text-[#555D50] mt-1">
          Spotwise acoustic intelligence maps calm spaces across your city.
        </p>
      </div>

      {/* Ambient background blur elements */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-[#819477]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#E8E0D2] rounded-full blur-3xl pointer-events-none" />
    </div>
  );
});

export default AuthIllustration;
