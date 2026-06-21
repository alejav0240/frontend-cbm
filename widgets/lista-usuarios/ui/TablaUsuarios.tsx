"use client";

import React from "react";
import { motion } from "motion/react";
import { User, Mail, Phone, Shield, MoreVertical } from "lucide-react";
import Image from "next/image";
import { Usuario } from "@/entities/usuario";

interface TablaUsuariosProps {
  usuarios: Usuario[];
}

export const TablaUsuarios = ({ usuarios }: TablaUsuariosProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Usuario
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Contacto
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Rol
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Estado
            </th>
            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {usuarios.map((usuario, idx) => (
            <motion.tr
              key={usuario.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors group"
            >
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] font-bold text-lg relative overflow-hidden">
                    {usuario.foto ? (
                      <Image
                        src={usuario.foto}
                        alt={usuario.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold dark:text-white">
                      {usuario.fullName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      @{usuario.username}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail size={12} />
                    <span>{usuario.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={12} />
                    <span>{usuario.celular}</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-blue-500" />
                  <span className="text-sm dark:text-gray-300 font-medium">
                    {usuario.rol.nombre}
                  </span>
                </div>
              </td>
              <td className="px-8 py-5">
                <span
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    usuario.isActive
                      ? "bg-green-100 text-green-600 dark:bg-green-500/10"
                      : "bg-red-100 text-red-600 dark:bg-red-500/10"
                  }`}
                >
                  {usuario.isActive ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="px-8 py-5">
                <button className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] transition-all">
                  <MoreVertical size={18} />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
