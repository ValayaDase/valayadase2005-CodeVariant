"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  Bookmark,
  ClipboardList,
  Sliders,
  LogOut,
} from "lucide-react";
import { clearDemoSession, getInitials } from "@/lib/auth/demo-auth";

export default function AppSidebar({ user, onCloseMobile }) {
  const pathname = usePathname();
  const router = useRouter();

  const displayName = user?.name || "Alex Mercer";
  const initials = user?.avatarInitials || getInitials(displayName);
  const displayRole = user?.role || (user?.isDemo ? "Remote Nomad" : "Nomad Member");

  const navItems = [
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Saved Places", href: "/saved", icon: Bookmark },
    { label: "Community Reports", href: "/reports", icon: ClipboardList },
    { label: "Preferences", href: "/preferences", icon: Sliders },
  ];

  const handleSignOut = () => {
    clearDemoSession();
    router.push("/sign-in");
  };

  return (
    <aside
      aria-label="Application Sidebar"
      className="w-64 h-full bg-white border-r border-[#E8E0D2] flex flex-col justify-between p-5 select-none"
    >
      {/* Top Brand Logo */}
      <div>
        <Link
          href="/discover"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 px-2 py-1 rounded-full group focus:outline-none focus:ring-2 focus:ring-[#819477]"
        >
          <div className="w-8 h-8 rounded-full bg-[#26382B] flex items-center justify-center text-[#F5F3EC] shadow-sm transition-transform group-hover:scale-105">
            <Compass className="w-4 h-4 text-[#F5F3EC]" strokeWidth={2.2} />
          </div>
          <div className="flex items-baseline">
            <span className="text-lg font-semibold tracking-tight text-[#20231F]">
              Spotwise
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#819477] ml-1 mb-0.5 inline-block" />
          </div>
        </Link>

        {/* Main Navigation Links */}
        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/discover" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#26382B] text-[#F5F3EC] shadow-sm"
                    : "text-[#555D50] hover:text-[#20231F] hover:bg-[#F5F3EC]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-[#819477]" : "text-[#819477]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile and Sign Out Card */}
      <div className="pt-4 border-t border-[#E8E0D2] space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-[#E8E0D2] border border-[#819477]/40 flex items-center justify-center font-serif font-bold text-sm text-[#26382B] tracking-tight">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#20231F] truncate">
              {displayName}
            </p>
            <p className="text-[11px] text-[#819477] truncate font-medium">
              {displayRole}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#555D50] hover:text-red-700 hover:bg-red-50 border border-[#E8E0D2] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
