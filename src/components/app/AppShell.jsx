"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { getDemoSession, signInDemo, DEMO_CREDENTIALS } from "@/lib/auth/demo-auth";

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

  return (
    <div className="min-h-screen w-full bg-[#F5F3EC] flex flex-row text-[#20231F] selection:bg-[#819477] selection:text-white">
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        <AppSidebar user={session?.user} />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-[#20231F]/40 backdrop-blur-sm flex"
          onClick={() => setMobileNavOpen(false)}
        >
          <div
            className="w-72 h-full bg-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#555D50] hover:text-[#20231F] rounded-full focus:outline-none"
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
