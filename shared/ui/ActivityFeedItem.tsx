"use client";

import React from "react";

interface ActivityFeedItemProps {
  icon: React.ReactNode;
  user: string;
  action: string;
  target: string;
  time: string;
  color: string;
}

export function ActivityFeedItem({
  icon,
  user,
  action,
  target,
  time,
  color,
}: ActivityFeedItemProps) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs dark:text-gray-300 leading-relaxed">
          <span className="font-bold dark:text-white">{user}</span> {action}{" "}
          <span className="font-bold text-[#008080]">{target}</span>
        </p>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
          {time}
        </p>
      </div>
    </div>
  );
}
