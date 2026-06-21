import React, { forwardRef, InputHTMLAttributes } from "react";
import { FormError } from "./FormError";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  readOnly?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = "", readOnly, ...props }, ref) => {
    const baseClasses =
      "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white";
    const stateClasses = readOnly
      ? "bg-gray-100 dark:bg-white/10 border-transparent cursor-not-allowed"
      : `bg-gray-50 dark:bg-white/5 ${error ? "border-red-500" : "border-transparent focus:border-[#008080]"}`;

    return (
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </label>
        <input
          ref={ref}
          readOnly={readOnly}
          className={`${baseClasses} ${stateClasses} ${className}`}
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  },
);

InputField.displayName = "InputField";
