'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ME_QUERY } from '@/modules/auth/graphql';
import { AuthUser, useAuthStore } from '@/modules/auth/hooks/useAuthStore';
import Sidebar from '@/shared/ui/Sidebar';
import Topbar from '@/shared/ui/Topbar';
import LoadingScreen from "@/shared/ui/LoadingScreen";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { setUser, setIsLoading, isLoading } = useAuthStore();

    const { data, loading, error } = useQuery<{ me: AuthUser }>(ME_QUERY, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        if (data?.me) {
            setUser(data.me);
        } else if (!loading) {
            setIsLoading(false);
        }
    }, [data, loading]);

    if (isLoading || loading) return <LoadingScreen />;

    // Token inválido o expirado
    if (error || !data?.me) {
        if (typeof window !== 'undefined') window.location.href = '/login';
        return null;
    }

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
