"use client";

import { Menu } from "lucide-react";
import { getInitials } from "@/lib/auth/demo-auth";

export default function AppHeader({ title, subtitle, onOpenMobile, user }) {
  const displayName = user?.name || "Alex Mercer";
  const initials = user?.avatarInitials || getInitials(displayName);
  const badgeLabel = user?.isDemo ? "Demo" : "Member";

  return (
    <header className="sticky top-2 z-30 mx-2 mt-2 flex w-auto min-w-0 items-center justify-between gap-2 rounded-3xl border border-[#E8E0D2] bg-white px-3 py-3 shadow-[0_8px_28px_rgba(32,35,31,0.08)] sm:top-3 sm:mx-5 sm:mt-3 sm:gap-4 sm:px-6 sm:py-3.5 lg:mx-6 lg:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden shrink-0 p-2 text-[#20231F] hover:bg-[#F5F3EC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#819477]"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="line-clamp-2 text-base font-serif font-bold leading-tight text-[#20231F] tracking-tight sm:line-clamp-1 sm:text-xl">
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
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5 rounded-full border border-[#E8E0D2] bg-white px-2 py-1.5 shadow-sm sm:gap-2 sm:px-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#26382B] font-serif text-xs font-bold tracking-tight text-[#F5F3EC]">
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
