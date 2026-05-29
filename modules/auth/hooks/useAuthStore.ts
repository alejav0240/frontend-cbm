import { create } from 'zustand';

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isStaff?: boolean;
    permissions?: string[];
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    setUser: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
