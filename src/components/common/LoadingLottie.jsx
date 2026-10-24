"use client";

import { memo, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import Lottie from lottie-react without SSR
const Lottie = dynamic(
  () =>
    import("lottie-react").then((mod) => {
      return mod.Lottie || mod.default || mod;
    }),
  {
    ssr: false,
    loading: () => null,
  }
);

/**
 * Reusable Spotwise Lottie Loading Component
 * Pure animated loader with generous, prominent sizing and zero clutter/text.
 */
const LoadingLottie = memo(function LoadingLottie({
  size = "lg",
  className = "",
  fullScreen = false,
  speed = 0.5,
}) {
  const lottieRef = useRef(null);

  const sizeMap = {
    sm: "w-28 h-28",
    md: "w-40 h-40",
    lg: "w-52 h-52",
    xl: "w-64 h-64",
  };

  const lottieSizeClass = sizeMap[size] || size;

  const content = (
    <div className={`flex items-center justify-center p-2 ${className}`}>
      <div className={`relative ${lottieSizeClass} flex items-center justify-center`}>
        <Lottie
          lottieRef={lottieRef}
          onDOMLoaded={() => {
            if (lottieRef.current) {
              lottieRef.current.setSpeed(speed);
            }
          }}
          src="/animations/loading.json"
          loop={true}
          autoplay={true}
          className="w-full h-full object-contain pointer-events-none"
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#F5F3EC]/90 backdrop-blur-sm flex items-center justify-center p-6">
        {content}
      </div>
    );
  }

  return content;
});

export default LoadingLottie;
