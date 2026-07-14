import React, {
  forwardRef,
  TextareaHTMLAttributes,
  useId,
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
  const id = useId();
  const baseClasses =
    "w-full px-4 py-3 rounded-xl border-2 outline-none transition-all text-sm dark:text-white resize-none";
  const stateClasses = `bg-gray-50 dark:bg-white/5 ${error ? "border-red-500" : "border-transparent focus-visible:border-[#008080] focus-visible:ring-2 focus-visible:ring-[#008080]/20"}`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <textarea
        id={id}
        ref={ref}
        className={`${baseClasses} ${stateClasses} ${className}`}
        {...props}
      />
      <FormError message={error} />
    </div>
  );
});

TextAreaField.displayName = "TextAreaField";
