"use client";

import { Compass, Heart } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: "Sensory Discovery", href: "#features" },
      { label: "Quiet Meter", href: "#discovery-card" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Suitability Engine", href: "#features" },
    ],
    Telemetry: [
      { label: "Acoustic Sensors", href: "#" },
      { label: "Wi-Fi Speed Logs", href: "#" },
      { label: "Power Certainty", href: "#" },
      { label: "Daylight Index", href: "#" },
    ],
    Community: [
      { label: "Nomad Network", href: "#" },
      { label: "Submit a Spot", href: "#" },
      { label: "Acoustic Standards", href: "#" },
      { label: "Guidelines", href: "#" },
    ],
    Company: [
      { label: "About Spotwise", href: "#" },
      { label: "Manifesto", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Contact", href: "#" },
    ],
  };

  return (
    <footer
      aria-label="Footer"
      className="w-full bg-[#F5F3EC] border-t border-[#E8E0D2] px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-[#20231F]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-[#E8E0D2]">
          {/* Brand info */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#26382B] flex items-center justify-center text-[#F5F3EC] shadow-sm">
                <Compass className="w-4 h-4 text-[#F5F3EC]" strokeWidth={2.2} />
              </div>
              <div className="flex items-baseline">
                <span className="text-xl font-semibold tracking-tight text-[#20231F]">
                  Spotwise
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#819477] ml-1 mb-0.5 inline-block" />
              </div>
            </a>
            <p className="mt-4 text-sm text-[#555D50] leading-relaxed max-w-sm">
              The sensory space discovery engine. Empowering remote workers,
              thinkers, and creators to find verified calm spaces that foster deep
              focus.
            </p>
          </div>

          {/* Nav links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#20231F] mb-4">
                {title}
              </p>
              <ul className="space-y-2.5 text-sm text-[#555D50]">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-[#26382B] hover:underline underline-offset-4 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#555D50]">
          <p>© 2026 Spotwise Inc. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted for focused minds</span>
            <Heart className="w-3.5 h-3.5 text-[#819477] fill-[#819477]" />
          </p>
        </div>
      </div>
    </footer>
  );
}
