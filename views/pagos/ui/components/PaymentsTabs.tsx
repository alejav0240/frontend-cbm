"use client";

import React from "react";

interface PaymentsTabsProps {
  activeTab: "payments" | "discounts";
  setActiveTab: (tab: "payments" | "discounts") => void;
}

export function PaymentsTabs({ activeTab, setActiveTab }: PaymentsTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit">
      <button
        onClick={() => setActiveTab("payments")}
        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
          activeTab === "payments"
            ? "bg-white dark:bg-white/10 text-[#008080] shadow-sm"
            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        Pagos
      </button>
      <button
        onClick={() => setActiveTab("discounts")}
        className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
          activeTab === "discounts"
            ? "bg-white dark:bg-white/10 text-[#008080] shadow-sm"
            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        Descuentos
      </button>
    </div>
  );
}
