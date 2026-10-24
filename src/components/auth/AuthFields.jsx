"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckSquare, Square } from "lucide-react";

export function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 text-left">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wider text-[#20231F]"
      >
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#819477]">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          name={id}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full rounded-xl bg-white border ${
            error ? "border-red-400 focus:ring-red-300" : "border-[#E8E0D2] focus:border-[#819477] focus:ring-[#819477]/30"
          } ${Icon ? "pl-10" : "pl-4"} ${
            isPassword ? "pr-11" : "pr-4"
          } py-2.5 text-sm text-[#20231F] placeholder-[#555D50]/60 transition-all focus:outline-none focus:ring-2 shadow-sm`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#555D50] hover:text-[#20231F] focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-[#819477]" />
            ) : (
              <Eye className="w-4 h-4 text-[#555D50]" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium pl-1">{error}</p>}
    </div>
  );
}

export function CheckboxField({ id, checked, onChange, label, error }) {
  return (
    <div className="space-y-1 text-left">
      <label
        htmlFor={id}
        className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-[#555D50] select-none"
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className="mt-0.5 text-[#26382B]">
          {checked ? (
            <CheckSquare className="w-4 h-4 text-[#26382B]" />
          ) : (
            <Square className="w-4 h-4 text-[#819477]" />
          )}
        </div>
        <span>{label}</span>
      </label>
      {error && <p className="text-xs text-red-600 font-medium pl-6">{error}</p>}
    </div>
  );
}
