"use client";

import { Children } from "react";
import { motion, MotionConfig } from "framer-motion";

const revealEase = [0.22, 1, 0.36, 1];

export function PageEntrance({ children, disabled = false, className = "" }) {
  if (disabled) return children;

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28, ease: revealEase }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

export function CurtainReveal({ children, className = "", delay = 0 }) {
  return (
    <div className={`relative isolate ${className}`}>
      {children}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-[#FCFBF7]"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ delay, duration: 0.62, ease: revealEase }}
        style={{ originX: 1 }}
      />
    </div>
  );
}

export function RevealItem({ children, className = "", delay = 0, as: Element = motion.div }) {
  return (
    <Element
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.42, ease: revealEase }}
      className={className}
    >
      {children}
    </Element>
  );
}

export function SectionReveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ delay, duration: 0.44, ease: revealEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerContainer = (delay) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: delay,
      staggerChildren: 0.075,
    },
  },
});

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: revealEase },
  },
};

export function StaggerGrid({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(delay)}
      className={className}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={child?.key ?? index} variants={staggerItem} className="h-full">
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
