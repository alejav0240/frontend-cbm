'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MessageCircle, Edit, Trash2, Users } from 'lucide-react';
import { MarketingLead } from '@/entities/marketing';

interface LeadsTableProps {
  leads: MarketingLead[];
  onSelectLead: (lead: MarketingLead) => void;
  onUpdateStatus: (id: number, status: MarketingLead['status']) => void;
  onWhatsApp: (lead: MarketingLead) => void;
  onEdit: (lead: MarketingLead) => void;
  onDelete: (id: number) => void;
}

export function LeadsTable({ leads, onSelectLead, onUpdateStatus, onWhatsApp, onEdit, onDelete }: LeadsTableProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
        <div className="px-8 py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Users size={36} className="text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-bold dark:text-white mb-2">No hay prospectos</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            No se encontraron leads con los filtros actuales. Intenta ajustar los filtros o registra un nuevo lead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111] rounded-[40px] border border-gray-200 dark:border-white/5 shadow-xl shadow-black/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Prospecto</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contacto</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Origen</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estado</th>
              <th className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {leads.map((lead, idx) => (
              <motion.tr 
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-all group"
              >
                <td className="px-8 py-6 cursor-pointer" onClick={() => onSelectLead(lead)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#008080]/20 to-[#008080]/5 flex items-center justify-center text-[#008080] font-bold text-lg shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white group-hover:text-[#008080] transition-colors">{lead.name}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Captado: {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                      <Phone size={12} className="text-[#008080]" />
                      {lead.phone}
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-500">
                        <Mail size={12} />
                        {lead.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#008080]/30" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{lead.source}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateStatus(lead.id, e.target.value as MarketingLead['status'])}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border-0 outline-none cursor-pointer transition-all ${
                      lead.status === 'Nuevo' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/10' :
                      lead.status === 'Contactado' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10' :
                      lead.status === 'Interesado' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10' :
                      lead.status === 'Convertido' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' :
                      'bg-gray-100 text-gray-600 dark:bg-white/5'
                    }`}
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Interesado">Interesado</option>
                    <option value="Convertido">Convertido</option>
                    <option value="Perdido">Perdido</option>
                  </select>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-1 justify-end">
                    <button 
                      onClick={() => onWhatsApp(lead)}
                      className="p-3 text-green-500 hover:bg-green-500/10 rounded-xl transition-all active:scale-90"
                      title="Contactar por WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </button>
                    <button 
                      onClick={() => onEdit(lead)}
                      className="p-3 text-gray-400 hover:text-[#008080] hover:bg-[#008080]/5 rounded-xl transition-all active:scale-90"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(lead.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all active:scale-90"
                    >
                      <Trash2 size={18} />
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
