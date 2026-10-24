"use client";

import { Menu } from "lucide-react";

export default function AppHeader({ title, subtitle, onOpenMobile, user }) {
  return (
    <header className="w-full bg-white border-b border-[#E8E0D2] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-[0_2px_10px_rgba(32,35,31,0.02)]">
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

      {/* Right: Telemetry pill & user badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-sm">
          <div className="w-6 h-6 rounded-full bg-[#26382B] text-[#F5F3EC] flex items-center justify-center font-bold text-xs font-serif">
            {user?.avatarInitials || "AM"}
          </div>
          <span className="text-xs font-semibold text-[#20231F] hidden sm:inline">
            {user?.name || "Alex Mercer"}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#819477]/15 text-[#26382B]">
            Demo
          </span>
        </div>
      </div>
    </header>
  );
}
