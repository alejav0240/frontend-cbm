"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client/react";
import { ME_QUERY } from "@/modules/auth/graphql";
import { AuthUser, useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import LoadingScreen from "@/shared/ui/LoadingScreen";

const Sidebar = dynamic(() => import("@/shared/ui/Sidebar"), { ssr: false });
const Topbar = dynamic(() => import("@/shared/ui/Topbar"), { ssr: false });

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, setIsLoading, isLoading } = useAuthStore();
  const router = useRouter();

  const { data, loading, error } = useQuery<{ me: AuthUser }>(ME_QUERY, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [data, loading, setUser, setIsLoading]);

  useEffect(() => {
    if (!loading && (error || !data?.me)) {
      router.replace("/login");
    }
  }, [loading, error, data, router]);

  if (loading || isLoading) return <LoadingScreen />;
  if (error || !data?.me) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background flex transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar />
        {children}
      </main>
    </div>
  );
}
