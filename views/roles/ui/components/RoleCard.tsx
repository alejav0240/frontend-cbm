"use client";

import React from "react";
import { motion } from "motion/react";
import { Shield, Trash2, Users, Edit3 } from "lucide-react";
import { countPermissionModules } from "@/shared/data/permissions";

interface RoleCardProps {
  role: {
    id: number;
    name: string;
    users: number;
    permissions: string[];
  };
  idx: number;
  onDelete: (id: number) => void;
  onEditPermissions: (role: any) => void;
}

export function RoleCard({
  role,
  idx,
  onDelete,
  onEditPermissions,
}: RoleCardProps) {
  const modulesCount = countPermissionModules(role.permissions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col hover:border-[#008080]/30 transition-all group"
    >
      <div className="p-6 pb-0 flex justify-between items-start">
        <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] shrink-0">
          <Shield size={24} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEditPermissions(role)}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 transition-colors"
            title="Editar permisos"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={() => onDelete(role.id)}
            className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold dark:text-white mb-2">{role.name}</h3>

        <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Users size={16} />
            <span className="text-sm font-bold">{role.users} usuarios</span>
          </div>
          <span className="px-3 py-1 bg-[#008080]/10 text-[#008080] rounded-lg text-xs font-bold">
            {modulesCount} módulos
          </span>
        </div>
      </div>
    </motion.div>
  );
}
