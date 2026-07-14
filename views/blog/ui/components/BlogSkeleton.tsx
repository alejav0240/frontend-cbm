"use client";

import React from "react";
import { motion } from "motion/react";

export function BlogSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden"
        >
          <div className="h-48 bg-gray-100 dark:bg-white/5 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="flex gap-4">
              <div className="h-3 w-20 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
              <div className="h-3 w-16 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
            </div>
            <div className="h-5 w-3/4 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
              <div className="h-3 w-2/3 bg-gray-100 dark:bg-white/5 rounded-lg animate-pulse" />
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-white/5">
              <div className="h-3 w-16 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
              <div className="h-3 w-14 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
