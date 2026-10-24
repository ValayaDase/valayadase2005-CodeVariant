"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AnimatedCompass - Interactive compass with fluid magnetic needle oscillation & 360° hover spin
 */
export function AnimatedCompass({
  size = 18,
  className = "",
  isActive = false,
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <circle cx="12" cy="12" r="10" strokeOpacity="0.45" />
        <motion.polygon
          points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
          fill={isActive ? color : "none"}
          fillOpacity={isActive ? "0.2" : "0"}
          animate={
            prefersReducedMotion
              ? {}
              : hovered
              ? {
                  rotate: [0, 360 + 12, 360 - 4, 360],
                  scale: [1, 1.15, 1],
                }
              : isActive
              ? {
                  rotate: [-8, 8, -4, 4, -8],
                }
              : {
                  rotate: [-4, 4, -4],
                }
          }
          transition={
            hovered
              ? { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
              : { duration: isActive ? 4 : 8, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformOrigin: "12px 12px" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedBookmark - Elegant ribbon bookmark with smooth dip and bounce
 */
export function AnimatedBookmark({
  size = 18,
  className = "",
  isActive = false,
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <motion.path
          d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
          fill={isActive ? color : "none"}
          fillOpacity={isActive ? "0.85" : "0"}
          animate={
            prefersReducedMotion
              ? {}
              : hovered
              ? {
                  y: [0, -3.5, 1, 0],
                  scaleY: [1, 1.08, 0.96, 1],
                }
              : {}
          }
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "12px 3px" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedReports - Clipboard with drawing lines and checkmark reveal
 */
export function AnimatedReports({
  size = 18,
  className = "",
  isActive = false,
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <path
          d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
          fill={isActive ? color : "none"}
          fillOpacity={isActive ? "0.15" : "0"}
        />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <motion.path
          d="M9 12h6"
          animate={prefersReducedMotion ? {} : hovered ? { pathLength: [0, 1] } : {}}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.path
          d="M9 16h6"
          animate={prefersReducedMotion ? {} : hovered ? { pathLength: [0, 1] } : {}}
          transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedSliders - Settings / preference sliders with gliding adjustment knobs
 */
export function AnimatedSliders({
  size = 18,
  className = "",
  isActive = false,
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        {/* Track 1 */}
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        {/* Track 2 */}
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        {/* Track 3 */}
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />

        {/* Knob 1 */}
        <motion.circle
          cx="4"
          cy="12"
          r="2.2"
          fill={isActive ? color : "none"}
          animate={prefersReducedMotion ? {} : hovered ? { cy: [12, 8, 14, 12] } : {}}
          transition={{ duration: 0.65, ease: "easeInOut" }}
        />
        {/* Knob 2 */}
        <motion.circle
          cx="12"
          cy="10"
          r="2.2"
          fill={isActive ? color : "none"}
          animate={prefersReducedMotion ? {} : hovered ? { cy: [10, 15, 7, 10] } : {}}
          transition={{ duration: 0.65, delay: 0.05, ease: "easeInOut" }}
        />
        {/* Knob 3 */}
        <motion.circle
          cx="20"
          cy="14"
          r="2.2"
          fill={isActive ? color : "none"}
          animate={prefersReducedMotion ? {} : hovered ? { cy: [14, 9, 16, 14] } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedVolume - Speaker with dynamic pulsating acoustic decibel sound waves
 */
export function AnimatedVolume({
  size = 15,
  className = "",
  color = "currentColor",
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={color} fillOpacity="0.15" />
        {/* Wave 1 */}
        <motion.path
          d="M15.54 8.46a5 5 0 0 1 0 7.07"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  opacity: [0.35, 1, 0.35],
                  scale: [0.94, 1.06, 0.94],
                }
          }
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "11px 12px" }}
        />
        {/* Wave 2 */}
        <motion.path
          d="M19.07 4.93a10 10 0 0 1 0 14.14"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  opacity: [0.2, 0.85, 0.2],
                  scale: [0.96, 1.08, 0.96],
                }
          }
          transition={{ duration: 1.8, delay: 0.25, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "11px 12px" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedCrowd - Twin figures that breathe softly to communicate calm desk presence
 */
export function AnimatedCrowd({
  size = 15,
  className = "",
  color = "currentColor",
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        {/* Main User */}
        <motion.g
          animate={prefersReducedMotion ? {} : { y: [0, -1.2, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </motion.g>
        {/* Secondary peer user */}
        <motion.g
          animate={prefersReducedMotion ? {} : { y: [0, 1.2, 0] }}
          transition={{ duration: 2.8, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * AnimatedWifi - Radio arcs broadcasting outward sequentially
 */
export function AnimatedWifi({
  size = 15,
  className = "",
  color = "currentColor",
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        {/* Outer Arc */}
        <motion.path
          d="M5 12.55a11 11 0 0 1 14.08 0"
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Mid Arc */}
        <motion.path
          d="M1.42 9a16 16 0 0 1 21.16 0"
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Inner Arc */}
        <motion.path
          d="M8.53 16.11a6 6 0 0 1 6.95 0"
          animate={prefersReducedMotion ? {} : { opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Dot */}
        <circle cx="12" cy="20" r="1" fill={color} />
      </svg>
    </div>
  );
}

/**
 * AnimatedZap - Power certainty bolt with energetic spark pulse
 */
export function AnimatedZap({
  size = 15,
  className = "",
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <motion.polygon
          points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
          fill={color}
          fillOpacity={hovered ? "0.35" : "0.1"}
          animate={
            prefersReducedMotion
              ? {}
              : hovered
              ? {
                  scale: [1, 1.25, 1],
                  filter: [
                    "drop-shadow(0 0 0 rgba(129,148,119,0))",
                    "drop-shadow(0 0 6px rgba(129,148,119,0.8))",
                    "drop-shadow(0 0 0 rgba(129,148,119,0))",
                  ],
                }
              : {}
          }
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ transformOrigin: "12px 12px" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedSparkles - Twinkling focus stars with rotational shimmer
 */
export function AnimatedSparkles({
  size = 16,
  className = "",
  color = "currentColor",
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <motion.path
          d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
          fill={color}
          fillOpacity="0.2"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.14, 1],
                  rotate: [0, 90, 180, 270, 360],
                }
          }
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "12px 12px" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedScale - Precision balance scale that tilts on hover
 */
export function AnimatedScale({
  size = 18,
  className = "",
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <path d="M12 3v18" />
        <motion.g
          animate={
            prefersReducedMotion
              ? {}
              : hovered
              ? { rotate: [-10, 10, -5, 5, 0] }
              : { rotate: [-3, 3, -3] }
          }
          transition={
            hovered
              ? { duration: 0.8, ease: "easeInOut" }
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
          style={{ transformOrigin: "12px 6px" }}
        >
          <path d="M6 6h12" />
          <path d="M6 6l-3 7h6l-3-7z" fill={color} fillOpacity="0.1" />
          <path d="M18 6l-3 7h6l-3-7z" fill={color} fillOpacity="0.1" />
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * AnimatedArrowRight - Arrow that slides with kinetic trail on hover
 */
export function AnimatedArrowRight({
  size = 15,
  className = "",
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <motion.line
          x1="5"
          y1="12"
          x2="19"
          y2="12"
          animate={prefersReducedMotion ? {} : hovered ? { x2: [19, 21, 19] } : {}}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.polyline
          points="12 5 19 12 12 19"
          animate={prefersReducedMotion ? {} : hovered ? { x: [0, 2.5, 0] } : {}}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/**
 * AnimatedSend - Paper airplane taking flight with subtle lift
 */
export function AnimatedSend({
  size = 18,
  className = "",
  color = "currentColor",
}) {
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size, height: size }}
      >
        <motion.path
          d="M22 2L11 13"
          animate={prefersReducedMotion ? {} : hovered ? { pathLength: [0, 1] } : {}}
          transition={{ duration: 0.4 }}
        />
        <motion.path
          d="M22 2l-7 20-4-9-9-4 20-7z"
          fill={color}
          fillOpacity={hovered ? "0.2" : "0"}
          animate={
            prefersReducedMotion
              ? {}
              : hovered
              ? {
                  x: [0, 2, 0],
                  y: [0, -2, 0],
                }
              : {}
          }
          transition={{ duration: 0.45, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
