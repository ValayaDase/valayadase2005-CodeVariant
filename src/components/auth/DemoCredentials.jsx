"use client";

import { KeyRound, Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { DEMO_CREDENTIALS } from "@/lib/auth/demo-auth";

export default function DemoCredentials({ onApply }) {
  const [copied, setCopied] = useState(false);

  const handleApply = () => {
    onApply(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F5F3EC] border border-[#E8E0D2] my-5 text-left">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#26382B] flex items-center justify-center text-[#F5F3EC]">
            <KeyRound className="w-3.5 h-3.5 text-[#F5F3EC]" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#26382B]">
            Prototype Demo Access
          </span>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FAF8F3] text-xs font-semibold text-[#26382B] border border-[#E8E0D2] shadow-sm transition-all hover:border-[#819477] focus:outline-none focus:ring-2 focus:ring-[#819477]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-[#819477]" />
              <span>Filled!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-[#819477]" />
              <span>Use demo account</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#E8E0D2]/70 flex flex-wrap items-center justify-between gap-y-1 text-xs text-[#555D50]">
        <div>
          <span className="text-[#819477] font-medium">Email: </span>
          <code className="text-[#20231F] font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#E8E0D2]">
            {DEMO_CREDENTIALS.email}
          </code>
        </div>
        <div>
          <span className="text-[#819477] font-medium">Password: </span>
          <code className="text-[#20231F] font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#E8E0D2]">
            {DEMO_CREDENTIALS.password}
          </code>
        </div>
      </div>
    </div>
  );
}
