// app/dashboard/layout.tsx
'use client';

import {useDashboardStore} from "@/shared/store/dashboardStore"
import Sidebar from "@/shared/ui/Sidebar";
import Topbar from "@/shared/ui/Topbar";

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useDashboardStore();

  return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-background flex transition-colors duration-500">
          <Sidebar/>

          <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
              <Topbar/>

              {children}
          </main>
        </div>
  );
}