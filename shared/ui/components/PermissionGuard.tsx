"use client";

import React from "react";
import { useAuthStore } from "@/modules/auth/hooks/useAuthStore";
import { canAccess } from "@/shared/data/permissions";

interface PermissionGuardProps {
  permission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { user } = useAuthStore();
  if (!permission) return <>{children}</>;
  return canAccess(user?.modules, permission) ? (
    <>{children}</>
  ) : (
    <>{fallback}</>
  );
}

export function useCan(permission: string) {
  const { user } = useAuthStore();
  return canAccess(user?.modules, permission);
}
