"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import AuthForm from "./AuthForm";
import AuthIllustration from "./AuthIllustration";
import { getDemoSession } from "@/lib/auth/demo-auth";
import { ArrowRight, UserCheck } from "lucide-react";

export default function AuthLayout({ mode = "sign-in" }) {
  const [currentMode, setCurrentMode] = useState(mode);
  const isSignIn = currentMode === "sign-in";
  const shouldReduceMotion = useReducedMotion();
  const [existingSession, setExistingSession] = useState(() => getDemoSession());
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop viewport (lg: 1024px+)
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Sync with browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("sign-up")) {
        setCurrentMode("sign-up");
      } else {
        setCurrentMode("sign-in");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Smooth mode transition without unmounting the layout or Lottie
  const handleSwitchMode = (nextMode) => {
    setCurrentMode(nextMode);
    if (typeof window !== "undefined") {
      const nextUrl = nextMode === "sign-in" ? "/sign-in" : "/sign-up";
      window.history.pushState(null, "", nextUrl);
    }
  };

  useEffect(() => {
    const handleAuthChange = () => {
      setExistingSession(getDemoSession());
    };
    window.addEventListener("spotwise_auth_changed", handleAuthChange);
    return () => {
      window.removeEventListener("spotwise_auth_changed", handleAuthChange);
    };
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#F5F3EC] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 select-none">
      {/* Existing Session Notice */}
      {existingSession && (
        <div className="w-full max-w-5xl mb-4 p-3 rounded-2xl bg-white border border-[#E8E0D2] shadow-sm flex items-center justify-between gap-3 text-xs text-[#20231F]">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#819477]" />
            <span>
              Signed in as <strong>{existingSession.user?.name}</strong> ({existingSession.user?.email})
            </span>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1 font-semibold text-[#26382B] hover:text-[#819477] underline"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Main Split-Screen Container with Signature Smooth Panel Exchange */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl border border-[#E8E0D2] shadow-[0_20px_60px_rgba(32,35,31,0.07)] overflow-hidden min-h-[660px] flex flex-col lg:flex-row">
        {/*
          Panel 1: Form Panel
          On Sign In: Left (x = 0%)
          On Sign Up: Right (x = 100%)
        */}
        <motion.div
          initial={false}
          animate={{
            x: isDesktop && !shouldReduceMotion ? (isSignIn ? "0%" : "100%") : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 110,
            damping: 18,
            mass: 0.85,
          }}
          className={`w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white z-20 transition-colors ${
            isSignIn ? "lg:border-r border-[#E8E0D2]" : "lg:border-l border-[#E8E0D2]"
          }`}
        >
          <AuthForm mode={currentMode} onSwitchMode={handleSwitchMode} />
        </motion.div>

        {/*
          Panel 2: Illustration Panel
          On Sign In: Right (x = 0%)
          On Sign Up: Left (x = -100%)
          Permanently mounted so the Lottie player keeps playing smoothly.
        */}
        <motion.div
          initial={false}
          animate={{
            x: isDesktop && !shouldReduceMotion ? (isSignIn ? "0%" : "-100%") : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 110,
            damping: 18,
            mass: 0.85,
          }}
          className="w-full lg:w-1/2 min-h-[380px] lg:min-h-full flex flex-col z-10 border-t lg:border-t-0 border-[#E8E0D2]"
        >
          <AuthIllustration />
        </motion.div>
      </div>
    </main>
  );
}
