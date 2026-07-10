'use client';

import React from 'react';
import { Modal } from '@/shared/ui/components/Modal';
import { Phone, Mail, MessageCircle, Edit } from 'lucide-react';
import { MarketingLead } from '@/entities/marketing';

interface LeadDetailModalProps {
  lead: MarketingLead | null;
  onClose: () => void;
  onWhatsApp: (lead: MarketingLead) => void;
  onEdit: (lead: MarketingLead) => void;
}

export function LeadDetailModal({ lead, onClose, onWhatsApp, onEdit }: LeadDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Convertido': return 'bg-green-100 text-green-600 dark:bg-green-500/10';
      case 'Contactado':
      case 'Interesado': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/10';
      case 'Nuevo': return 'bg-purple-100 text-purple-600 dark:bg-purple-500/10';
      case 'Perdido': return 'bg-gray-100 text-gray-600 dark:bg-white/5';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Modal
      isOpen={!!lead}
      onClose={onClose}
      title="Detalles del Prospecto"
    >
      {lead && (
        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-[#008080]/10 flex items-center justify-center text-[#008080] text-3xl font-light serif">
              {lead.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-light dark:text-white serif">{lead.name}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {lead.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Teléfono</p>
              <p className="text-sm font-medium dark:text-white flex items-center gap-2">
                <Phone size={14} className="text-[#008080]" />
                {lead.phone}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</p>
              <p className="text-sm font-medium dark:text-white flex items-center gap-2">
                <Mail size={14} className="text-[#008080]" />
                {lead.email || 'No proporcionado'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Origen</p>
              <p className="text-sm font-medium dark:text-white">{lead.source}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Estado</p>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-white/2 rounded-3xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Notas / Comentarios</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
              {lead.notes || 'Sin notas adicionales.'}
            </p>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onWhatsApp(lead)}
              className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20"
            >
              <MessageCircle size={20} />
              Contactar WhatsApp
            </button>
            <button 
              onClick={() => onEdit(lead)}
              className="px-6 bg-white dark:bg-white/5 text-[#008080] border border-[#008080]/10 rounded-2xl font-bold hover:bg-[#008080]/5 transition-all"
            >
              <Edit size={20} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
