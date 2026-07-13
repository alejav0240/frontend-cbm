"use client";

import React from "react";
import { motion } from "motion/react";

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/10 animate-pulse" />
        <div className="w-24 h-6 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>
      <div className="w-3/4 h-5 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-2" />
      <div className="w-full h-3 rounded bg-gray-100 dark:bg-white/5 animate-pulse mb-6" />
      <div className="flex gap-2 mb-8">
        <div className="w-16 h-5 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
        <div className="w-20 h-5 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
        <div className="w-14 h-5 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
      </div>
      <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-between">
        <div className="w-28 h-3 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
        <div className="w-5 h-5 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
      </div>
    </motion.div>
  );
}

function SkeletonStatCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>
      <div className="w-20 h-3 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-2" />
      <div className="w-16 h-7 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
    </motion.div>
  );
}

export function SkeletonRoles() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="w-64 h-9 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-2" />
          <div className="w-80 h-4 rounded bg-gray-100 dark:bg-white/5 animate-pulse" />
        </div>
        <div className="w-36 h-12 rounded-2xl bg-gray-200 dark:bg-white/10 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={`stat-${i}`} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 h-[400px]">
          <div className="w-48 h-5 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-8" />
          <div className="flex items-end gap-4 h-[280px] px-4">
            {[60, 80, 45, 90, 70, 55].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gray-200 dark:bg-white/10 animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-[#111] p-8 rounded-[40px] border border-gray-200 dark:border-white/5 h-[400px]">
          <div className="w-44 h-5 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-8" />
          <div className="flex items-center justify-center h-[280px]">
            <div className="w-48 h-48 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={`card-${i}`} delay={i * 0.05} />
        ))}
      </div>
    </div>
  );
}
