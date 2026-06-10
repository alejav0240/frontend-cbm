import { create } from 'zustand';

export interface AuthUser {
    id: string;
    databaseId: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    ci?: string;
    celular?: string;
    status?: string;
    visibility?: string;
    isStaff?: boolean;
    foto?: string;
    cv?: string;
    modules?: string[];
    permissions?: string[];
    role?: {
        id: string;
        name: string;
    };
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: AuthUser) => void;
    setIsLoading: (v: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
    setIsLoading: (v) => set({ isLoading: v }),
    logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
