"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { getDemoSession, signInDemo, DEMO_CREDENTIALS } from "@/lib/auth/demo-auth";
import { LocationProvider } from "@/lib/location";

export default function AppShell({ children, title, subtitle }) {
  const [session, setSession] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    let curr = getDemoSession();
    if (!curr) {
      const res = signInDemo(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
      if (res.success) curr = res.session;
    }
    const timer = setTimeout(() => {
      setSession(curr);
    }, 0);

    const handleAuthChange = () => {
      setSession(getDemoSession());
    };
    window.addEventListener("spotwise_auth_changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("spotwise_auth_changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileNavOpen]);

  return (
    <LocationProvider>
      <div className="flex min-h-screen w-full flex-row bg-[#F5F3EC] text-[#20231F] selection:bg-[#819477] selection:text-white">
        {/* Desktop floating sidebar */}
        <div className="sticky top-3 hidden h-[calc(100dvh_-_1.5rem)] w-64 shrink-0 self-start lg:ml-3 lg:my-3 lg:block">
          <AppSidebar user={session?.user} />
        </div>

        {/* Mobile Drawer Backdrop & Sidebar */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 z-50 flex bg-[#20231F]/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Application navigation"
              className="relative h-full max-h-[100dvh] w-[min(20rem,calc(100vw-1.25rem))] rounded-r-[1.75rem] bg-[#FCFBF7] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="absolute right-3 top-3 z-10 rounded-full p-2 text-[#555D50] hover:bg-[#F3F2E9] hover:text-[#20231F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#49624E]"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
              <AppSidebar
                user={session?.user}
                onCloseMobile={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader
            title={title}
            subtitle={subtitle}
            onOpenMobile={() => setMobileNavOpen(true)}
            user={session?.user}
          />
          <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 p-3 sm:p-5 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </LocationProvider>
  );
}
