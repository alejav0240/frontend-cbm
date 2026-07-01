import React from "react";
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <p className="text-[10px] text-red-500 font-semibold flex items-center gap-1 mt-1 text-xs">
      <AlertCircle size={10} /> {message}
    </p>
  );
};
