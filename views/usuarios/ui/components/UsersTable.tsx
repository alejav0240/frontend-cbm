"use client";

import React from "react";
import { motion } from "motion/react";
import { Shield, Key, Edit2, UserMinus, Trash2 } from "lucide-react";
import { Usuario } from "@/entities/usuario";

interface UsersTableProps {
  users: Usuario[];
  onShowCredentials: (user: Usuario) => void;
  onEdit: (user: Usuario) => void;
  onDeactivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UsersTable({
  users,
  onShowCredentials,
  onEdit,
  onDeactivate,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                #
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Nombre Completo
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Carnet
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Tipo
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Celular
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Estado/Visibilidad
              </th>
              <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {users.map((user, idx) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-8 py-5 text-sm font-mono text-gray-400">
                  {idx + 1}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#008080]/10 text-[#008080] flex items-center justify-center font-bold">
                      {user.fullName?.charAt(0) || "?"}
                    </div>
                    <span className="text-sm dark:text-white font-bold group-hover:text-[#008080] transition-colors">
                      {user.fullName}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">
                  {user.ci || "-"}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-blue-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-widest">
                      {user.rol?.nombre}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-gray-500 dark:text-gray-400">
                  {user.celular || "-"}
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit ${
                        user.isActive
                          ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                          : "bg-gray-100 text-gray-600 dark:bg-white/5"
                      }`}
                    >
                      {user.isActive ? "ACTIVO" : "INACTIVO"}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onShowCredentials(user)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
                      title="Ver Credenciales"
                    >
                      <Key size={16} />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeactivate(user.id)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                      title="Dar de baja"
                    >
                      <UserMinus size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
