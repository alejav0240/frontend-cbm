'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ActivityFeedItem } from '@/components/ui/ActivityFeedItem';

interface OverviewActivityFeedProps {
  activities: any[];
}

export function OverviewActivityFeed({ activities }: OverviewActivityFeedProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="lg:col-span-1"
    >
      <div className="bg-white dark:bg-[#111] rounded-[32px] p-6 md:p-8 border border-gray-200 dark:border-white/5 shadow-sm h-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base md:text-lg font-bold dark:text-white">Actividad</h2>
          <button className="text-[10px] font-bold text-[#008080] hover:underline">Ver todo</button>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityFeedItem 
              key={activity.id}
              icon={activity.icon}
              user={activity.user}
              action={activity.action}
              target={activity.target}
              time={activity.time}
              color={activity.color}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
