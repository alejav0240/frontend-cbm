'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Music, Guitar, Edit2, Trash2 } from 'lucide-react';
import { InventoryItem } from '@/types';

interface InventoryTableProps {
  inventory: InventoryItem[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number) => void;
}

export function InventoryTable({ inventory, searchTerm, setSearchTerm, onEdit, onDelete }: InventoryTableProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excelente': return 'text-green-500 bg-green-500/10';
      case 'Bueno': return 'text-blue-500 bg-blue-500/10';
      case 'Regular': return 'text-amber-500 bg-amber-500/10';
      case 'Mantenimiento': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'text-green-500';
      case 'En uso': return 'text-blue-500';
      case 'No disponible': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar instrumentos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-3 text-gray-400 hover:text-[#008080] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2">
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipo</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Condición</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sala</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Últ. Mant.</th>
              <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5">
            {inventory.map((item) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400">
                      {item.type === 'Cuerda' ? <Guitar size={16} /> : <Music size={16} />}
                    </div>
                    <p className="text-sm font-bold dark:text-white">{item.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs text-gray-500">{item.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                    {item.sala || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-current ${getStatusColor(item.status)}`} />
                    <span className="text-sm font-medium dark:text-white">{item.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-500">{item.lastMaintenance || 'N/A'}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-2 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/10 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
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
