"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

export default function AnimatedLogo({
  size = "md", // "sm" | "md" | "lg" | "xl"
  showText = true,
  variant = "dark", // "dark" (for light backgrounds) | "light" (for dark backgrounds)
  className = "",
  href = null,
  onClick = null,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const sizeConfigs = {
    sm: { emblem: 32, icon: 18, text: "text-base", dot: "w-1.5 h-1.5" },
    md: { emblem: 38, icon: 22, text: "text-lg", dot: "w-2 h-2" },
    lg: { emblem: 48, icon: 28, text: "text-2xl", dot: "w-2.5 h-2.5" },
    xl: { emblem: 60, icon: 36, text: "text-3xl", dot: "w-3 h-3" },
  };

  const cfg = sizeConfigs[size] || sizeConfigs.md;

  const isLight = variant === "light";
  const emblemBg = isLight ? "bg-[#FAF8F3] text-[#26382B]" : "bg-[#26382B] text-[#F5F3EC]";
  const textColor = isLight ? "text-[#FAF8F3]" : "text-[#20231F]";

  const emblemContent = (
    <div
      className="relative flex items-center justify-center shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: cfg.emblem, height: cfg.emblem }}
    >
      {/* Outer ambient breathing glow ring */}
      <motion.div
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: isHovered ? [1, 1.15, 1.1] : [1, 1.08, 1],
                opacity: isHovered ? 0.35 : [0.15, 0.28, 0.15],
              }
        }
        transition={{
          duration: isHovered ? 0.6 : 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`absolute inset-[-3px] rounded-full ${
          isLight ? "bg-[#819477]" : "bg-[#819477]"
        } blur-xs pointer-events-none`}
      />

      {/* Main emblem circle */}
      <motion.div
        whileHover={prefersReducedMotion ? {} : { scale: 1.06 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        className={`relative w-full h-full rounded-full ${emblemBg} shadow-sm border ${
          isLight ? "border-white/20" : "border-[#819477]/30"
        } flex items-center justify-center overflow-hidden`}
      >
        {/* Subtle rotating orbit track */}
        <motion.div
          animate={prefersReducedMotion ? {} : { rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[3px] rounded-full border border-dashed border-[#819477]/30 pointer-events-none"
        />

        {/* Dynamic Compass SVG with interactive spinning needle */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: cfg.icon, height: cfg.icon }}
          className="relative z-10"
        >
          {/* Compass Bezel Markers (N, S, E, W) */}
          <circle
            cx="16"
            cy="16"
            r="13"
            stroke={isLight ? "#26382B" : "#819477"}
            strokeWidth="1.2"
            strokeOpacity="0.4"
          />
          <line
            x1="16"
            y1="4.5"
            x2="16"
            y2="7"
            stroke={isLight ? "#26382B" : "#F5F3EC"}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="16"
            y1="25"
            x2="16"
            y2="27.5"
            stroke={isLight ? "#26382B" : "#F5F3EC"}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="4.5"
            y1="16"
            x2="7"
            y2="16"
            stroke={isLight ? "#26382B" : "#F5F3EC"}
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <line
            x1="25"
            y1="16"
            x2="27.5"
            y2="16"
            stroke={isLight ? "#26382B" : "#F5F3EC"}
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Animated Magnetic Needle */}
          <motion.g
            animate={
              prefersReducedMotion
                ? {}
                : isHovered
                ? {
                    rotate: [0, 360 + 15, 360 - 5, 360],
                    scale: [1, 1.1, 1],
                  }
                : {
                    rotate: [-8, 8, -5, 5, -8],
                  }
            }
            transition={
              isHovered
                ? {
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }
                : {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
            style={{ transformOrigin: "16px 16px" }}
          >
            {/* North pointer (Sage green) */}
            <path
              d="M16 6.5 L19.2 16 L16 14.5 L12.8 16 Z"
              fill={isLight ? "#3E5842" : "#819477"}
            />
            {/* South pointer (Warm ivory / light) */}
            <path
              d="M16 25.5 L19.2 16 L16 17.5 L12.8 16 Z"
              fill={isLight ? "#C58C5A" : "#F5F3EC"}
              fillOpacity="0.9"
            />
          </motion.g>

          {/* Central Pivot Jewel */}
          <circle
            cx="16"
            cy="16"
            r="2.2"
            fill={isLight ? "#26382B" : "#26382B"}
            stroke={isLight ? "#819477" : "#819477"}
            strokeWidth="1"
          />
        </svg>
      </motion.div>
    </div>
  );

  const textContent = showText && (
    <div className="flex items-baseline select-none">
      <span className={`${cfg.text} font-serif font-bold tracking-tight ${textColor}`}>
        Spotwise
      </span>
      {/* Live focus heartbeat dot */}
      <motion.span
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.35, 1],
                opacity: [0.75, 1, 0.75],
              }
        }
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`${cfg.dot} rounded-full bg-[#819477] ml-1 mb-0.5 inline-block shadow-[0_0_8px_rgba(129,148,119,0.5)]`}
      />
    </div>
  );

  const containerContent = (
    <div
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 transition-transform ${className}`}
    >
      {emblemContent}
      {textContent}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#819477] rounded-full"
      >
        {containerContent}
      </Link>
    );
  }

  return containerContent;
}
