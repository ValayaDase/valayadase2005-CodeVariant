"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Bookmark, Compass, LogOut, MessageSquareText, SlidersHorizontal } from "lucide-react";
import { AnimatedLogo } from "@/components/common";
import { clearDemoSession, getInitials } from "@/lib/auth/demo-auth";

const navItems = [
  { label: "Discover", href: "/discover", icon: Compass, animation: { rotate: [0, -12, 8, 0], scale: [1, 0.9, 1.12, 1] } },
  { label: "Saved Places", href: "/saved", icon: Bookmark, animation: { y: [3, -2, 0], scale: [0.88, 1.08, 1] } },
  { label: "Community Reports", href: "/reports", icon: MessageSquareText, animation: { scale: [0.9, 1.08, 1], rotate: [0, -5, 0] } },
  { label: "Preferences", href: "/preferences", icon: SlidersHorizontal, animation: { x: [-2, 2, -1, 0], rotate: [0, 3, -2, 0] } },
];

export default function AppSidebar({ user, onCloseMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const displayName = user?.name || "Alex Mercer";
  const initials = user?.avatarInitials || getInitials(displayName);
  const displayRole = user?.role || (user?.isDemo ? "Remote Nomad" : "Nomad Member");

  const handleSignOut = () => {
    clearDemoSession();
    router.push("/sign-in");
    onCloseMobile?.();
  };

  return (
    <aside
      aria-label="Application navigation"
      className="flex h-full min-h-0 w-full flex-col justify-between overflow-y-auto rounded-[1.75rem] border border-[#E3E0D7] bg-[#FCFBF7] p-4 text-[#263D31] shadow-[0_12px_36px_rgba(38,61,49,0.09)] sm:p-5"
    >
      <div>
        <div className="px-1 py-1">
          <AnimatedLogo size="md" href="/discover" onClick={onCloseMobile} />
        </div>

        <nav aria-label="Main navigation" className="mt-7 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex min-h-11 items-center gap-3 overflow-hidden rounded-2xl px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#49624E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FCFBF7] ${
                  isActive ? "font-semibold text-[#263D31]" : "font-medium text-[#555D50] hover:bg-[#F3F2E9] hover:text-[#20231F]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="spotwise-active-nav"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl bg-[#E3EBDD]"
                    transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <motion.span
                  className="relative z-[1] inline-flex h-5 w-5 shrink-0 items-center justify-center"
                  aria-hidden="true"
                  animate={isActive && !reduceMotion ? item.animation : { rotate: 0, x: 0, y: 0, scale: 1 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                </motion.span>
                <span className="relative z-[1] min-w-0 truncate tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-6 space-y-3 border-t border-[#E3E0D7] pt-4">
        <div className="flex min-w-0 items-center gap-3 px-1.5 py-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#819477]/40 bg-[#E8EBDD] font-serif text-sm font-bold tracking-tight text-[#26382B]">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#20231F]">{displayName}</p>
            <p className="truncate text-[11px] font-medium text-[#819477]">{displayRole}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#E3E0D7] px-3 py-2 text-xs font-semibold text-[#555D50] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#49624E]"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
