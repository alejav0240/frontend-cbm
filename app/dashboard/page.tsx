// app/dashboard/page.tsx
'use client';

import {DashboardRouter} from "@/config/dashboard-router";

export default function HomePage() {

  return (
      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
              <DashboardRouter/>
        </div>
      </div>
  );
}