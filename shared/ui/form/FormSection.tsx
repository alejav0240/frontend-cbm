import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
}

export const FormSection = ({
  title,
  icon: Icon,
  children,
}: FormSectionProps) => {
  return (
    <div className="p-6 bg-[#008080]/5 rounded-[32px] border border-[#008080]/10 space-y-6">
      <h3 className="text-sm font-bold text-[#008080] uppercase tracking-widest flex items-center gap-2">
        {Icon && <Icon size={16} />}
        {title}
      </h3>
      <div className="grid sm:grid-cols-2 gap-6">{children}</div>
    </div>
  );
};
