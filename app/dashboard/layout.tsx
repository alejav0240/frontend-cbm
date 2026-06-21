"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { CONSULTA_YO } from "@/shared/api/auth";
import { useAuthStore } from "@/shared/model/useAuthStore";
import LoadingScreen from "@/shared/ui/LoadingScreen";
import { Sidebar, Topbar } from "@/widgets/navegacion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUsuario, setEstaCargando, estaCargando } = useAuthStore();
  const router = useRouter();

  const { data, loading, error } = useQuery<any>(CONSULTA_YO, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.me) {
      setUsuario(data.me);
    } else if (!loading) {
      setEstaCargando(false);
    }
  }, [data, loading, setUsuario, setEstaCargando]);

  useEffect(() => {
    if (!loading && (error || !data?.me)) {
      router.replace("/login");
    }
  }, [loading, error, data, router]);

  if (loading || estaCargando) return <LoadingScreen />;
  if (error || !data?.me) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background flex transition-colors duration-500">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
