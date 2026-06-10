"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function CalendarPicker({
  value,
  onChange,
  label,
}: {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(new Date(value));
  const [openUpwards, setOpenUpwards] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpwards(spaceBelow < 400); // Calendar is quite tall
    }
  }, [isOpen]);

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const days = [];

    // Empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${viewDate.getFullYear()}-${viewDate.getMonth()}-${i}`}
          className="h-10"
        />,
      );
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const currentDay = new Date(year, month, d);
      const isSelected = isSameDay(currentDay, value);
      const isToday = isSameDay(currentDay, new Date());

      days.push(
        <button
          key={`day-${year}-${month}-${d}`}
          onClick={(e) => {
            e.stopPropagation();
            onChange(currentDay);
            setIsOpen(false);
          }}
          className={`h-10 w-10 rounded-xl text-sm font-medium transition-all flex items-center justify-center ${
            isSelected
              ? "bg-[#008080] text-white shadow-lg shadow-[#008080]/20"
              : isToday
                ? "text-[#008080] bg-[#008080]/10"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          {d}
        </button>,
      );
    }

    return days;
  };

  return (
    <div className="relative space-y-2" ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`px-6 py-3 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 cursor-pointer flex items-center gap-3 transition-all hover:shadow-md ${isOpen ? "border-[#008080] ring-2 ring-[#008080]/10" : ""}`}
        >
          <CalendarIcon size={18} className="text-[#008080]" />
          <span
            className="text-sm dark:text-white font-bold"
            suppressHydrationWarning
          >
            {value.getDate()} {months[value.getMonth()]} {value.getFullYear()}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 ml-2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: openUpwards ? -10 : 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: openUpwards ? -10 : 10, scale: 0.95 }}
                className={`absolute z-50 p-6 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-[32px] shadow-2xl w-[320px] ${openUpwards ? "bottom-full mb-4" : "mt-4"}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-[#008080]"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="font-bold dark:text-white serif">
                    {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all text-gray-400 hover:text-[#008080]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => (
                    <div
                      key={`${d}-${i}`}
                      className="h-10 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div
                  className="grid grid-cols-7 gap-1"
                  suppressHydrationWarning
                >
                  {renderDays()}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(new Date());
                      setIsOpen(false);
                    }}
                    className="w-full py-3 text-xs font-bold text-[#008080] hover:bg-[#008080]/5 rounded-xl transition-all uppercase tracking-widest"
                  >
                    Ir a Hoy
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
