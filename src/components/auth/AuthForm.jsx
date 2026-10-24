"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { AnimatedLogo } from "@/components/common";
import { InputField, CheckboxField } from "./AuthFields";
import DemoCredentials from "./DemoCredentials";
import { signInDemo, signUpDemo } from "@/lib/auth/demo-auth";

export default function AuthForm({ mode = "sign-in", onSwitchMode }) {
  const router = useRouter();
  const isSignIn = mode === "sign-in";

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) setGeneralError("");
  };

  const handleApplyDemo = (email, password) => {
    setFormData((prev) => ({
      ...prev,
      email,
      password,
    }));
    setErrors({});
    setGeneralError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    if (isSignIn) {
      setIsSubmitting(true);
      const res = signInDemo(formData.email, formData.password);
      if (res.success) {
        setSuccessMessage(`Welcome back, ${res.session.user.name}! Redirecting...`);
        setTimeout(() => {
          router.push("/discover");
        }, 800);
      } else {
        setGeneralError(res.error);
        setIsSubmitting(false);
      }
    } else {
      // Sign up validation
      const fieldErrors = {};
      if (!formData.name.trim()) fieldErrors.name = "Full name is required.";
      if (!formData.email.trim()) fieldErrors.email = "Email is required.";
      if (formData.password.length < 8) fieldErrors.password = "Minimum 8 characters.";
      if (formData.password !== formData.confirmPassword) {
        fieldErrors.confirmPassword = "Passwords do not match.";
      }
      if (!formData.agreeTerms) {
        fieldErrors.agreeTerms = "You must accept the terms.";
      }

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return;
      }

      setIsSubmitting(true);
      const res = signUpDemo(formData);
      if (res.success) {
        setSuccessMessage(`Welcome, ${res.session.user.name}! Opening discovery dashboard...`);
        setTimeout(() => {
          router.push("/discover");
        }, 900);
      } else {
        setGeneralError(res.error);
        setIsSubmitting(false);
      }
    }
  };

  const handleSwitch = (targetMode) => {
    setErrors({});
    setGeneralError("");
    setSuccessMessage("");
    if (onSwitchMode) {
      onSwitchMode(targetMode);
    } else {
      router.push(targetMode === "sign-in" ? "/sign-in" : "/sign-up");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 flex flex-col justify-center">
      {/* Brand Wordmark & Back to Home */}
      <div className="flex items-center justify-between mb-6">
        <AnimatedLogo size="md" variant="dark" href="/" />

        <span className="text-xs uppercase tracking-wider font-semibold text-[#819477] px-2.5 py-1 rounded-full bg-[#F5F3EC] border border-[#E8E0D2] transition-all">
          {isSignIn ? "Sign In" : "Sign Up"}
        </span>
      </div>

      {/* Header Narrative with Smooth Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSignIn ? "signin-header" : "signup-header"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="text-left mb-5"
        >
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
            {isSignIn ? "Welcome back to focus." : "Find your sanctuary."}
          </h1>
          <p className="mt-2 text-sm text-[#555D50] leading-relaxed">
            {isSignIn
              ? "Sign in to access your saved spots, quiet forecasts, and community telemetry."
              : "Create your free demo workspace account to start discovering quiet study spaces."}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Demo Credentials Helper for Sign In */}
      <AnimatePresence initial={false}>
        {isSignIn && (
          <motion.div
            key="demo-creds-box"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden mb-4"
          >
            <DemoCredentials onApply={handleApplyDemo} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Alert Banner */}
      {generalError && (
        <div className="p-3.5 mb-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Authentication Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <AnimatePresence initial={false}>
          {!isSignIn && (
            <motion.div
              key="signup-name-input"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pb-1">
                <InputField
                  id="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Mercer"
                  error={errors.name}
                  autoComplete="name"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <InputField
          id="email"
          label={isSignIn ? "Email or Full Name" : "Email Address"}
          type={isSignIn ? "text" : "email"}
          value={formData.email}
          onChange={handleChange}
          placeholder={
            isSignIn
              ? "e.g. demo@spotwise.app or your name"
              : "e.g. demo@spotwise.app"
          }
          error={errors.email}
          autoComplete={isSignIn ? "username" : "email"}
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••••••"
          error={errors.password}
          autoComplete={isSignIn ? "current-password" : "new-password"}
        />

        <AnimatePresence initial={false}>
          {!isSignIn && (
            <motion.div
              key="signup-confirm-inputs"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden space-y-3.5 pt-0.5"
            >
              <InputField
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                error={errors.confirmPassword}
                autoComplete="new-password"
              />

              <CheckboxField
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                label={
                  <span>
                    I agree to the Spotwise Community Guidelines &amp; Quiet Standards
                    (Demo terms).
                  </span>
                }
                error={errors.agreeTerms}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary CTA */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#26382B] hover:bg-[#20231F] text-[#F5F3EC] text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#819477] disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>{isSignIn ? "Sign In to Spotwise" : "Create Demo Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Mode Switcher with Seamless In-Place Transition */}
      <div className="mt-6 pt-5 border-t border-[#E8E0D2] text-center text-xs text-[#555D50]">
        {isSignIn ? (
          <p>
            Don&apos;t have an account yet?{" "}
            <button
              type="button"
              onClick={() => handleSwitch("sign-up")}
              className="font-semibold text-[#26382B] hover:text-[#819477] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Sign up for free demo
            </button>
          </p>
        ) : (
          <p>
            Already registered with Spotwise?{" "}
            <button
              type="button"
              onClick={() => handleSwitch("sign-in")}
              className="font-semibold text-[#26382B] hover:text-[#819477] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Sign in to your account
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
