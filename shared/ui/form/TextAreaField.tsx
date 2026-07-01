import React, {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { FormError } from "./FormError";

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(({ label, error, className = "", ...props }, ref) => {
  const baseClasses =
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white resize-none";
  const stateClasses = `bg-gray-50 dark:bg-white/5 ${error ? "border-red-500" : "border-transparent focus:border-[#008080]"}`;

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <textarea
        ref={ref}
        className={`${baseClasses} ${stateClasses} ${className}`}
        {...props}
      />
      <FormError message={error} />
    </div>
  );
});

TextAreaField.displayName = "TextAreaField";
