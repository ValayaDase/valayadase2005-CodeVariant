"use client";

import { Menu } from "lucide-react";
import { getInitials } from "@/lib/auth/demo-auth";

export default function AppHeader({ title, subtitle, onOpenMobile, user }) {
  const displayName = user?.name || "Alex Mercer";
  const initials = user?.avatarInitials || getInitials(displayName);
  const badgeLabel = user?.isDemo ? "Demo" : "Member";

  return (
    <header className="sticky top-3 z-30 mx-3 mt-3 flex w-auto items-center justify-between gap-4 rounded-3xl border border-[#E8E0D2] bg-white px-4 py-3.5 shadow-[0_8px_28px_rgba(32,35,31,0.08)] sm:mx-5 sm:px-6 lg:mx-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 text-[#20231F] hover:bg-[#F5F3EC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#819477]"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-serif font-bold text-[#20231F] tracking-tight">
            {title || "Space Discovery"}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#555D50] hidden sm:block truncate max-w-md">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: User initials and name badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-sm">
          <div className="w-6 h-6 rounded-full bg-[#26382B] text-[#F5F3EC] flex items-center justify-center font-bold text-xs font-serif tracking-tight">
            {initials}
          </div>
          <span className="text-xs font-semibold text-[#20231F] hidden sm:inline">
            {displayName}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#819477]/15 text-[#26382B]">
            {badgeLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
