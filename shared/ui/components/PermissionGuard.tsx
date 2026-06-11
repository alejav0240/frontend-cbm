"use client";

import React from "react";
import { useAuthStore } from "@/shared/model/useAuthStore";
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
  const { usuario } = useAuthStore();
  if (!permission) return <>{children}</>;
  return canAccess(usuario?.modules, permission) ? (
    <>{children}</>
  ) : (
    <>{fallback}</>
  );
}

export function useCan(permission: string) {
  const { usuario } = useAuthStore();
  return canAccess(usuario?.modules, permission);
}
