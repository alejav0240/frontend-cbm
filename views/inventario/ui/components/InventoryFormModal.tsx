'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { InventoryItem } from '@/types';

interface InventoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<InventoryItem>) => void;
  initialData?: InventoryItem | null;
}

export function InventoryFormModal({ isOpen, onClose, onSave, initialData }: InventoryFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Percusión',
    condition: 'Excelente' as 'Excelente' | 'Bueno' | 'Regular' | 'Mantenimiento',
    status: 'Disponible' as 'Disponible' | 'En uso' | 'No disponible',
    sala: 'Sala 1',
    lastMaintenance: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        condition: initialData.condition as any,
        status: initialData.status as any,
        sala: initialData.sala || 'Sala 1',
        lastMaintenance: initialData.lastMaintenance || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        name: '',
        type: 'Percusión',
        condition: 'Excelente',
        status: 'Disponible',
        sala: 'Sala 1',
        lastMaintenance: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, isOpen]);

  const types = ['Cuerda', 'Percusión', 'Viento', 'Teclado', 'Electrónico', 'Material Didáctico', 'Otros'];
  const conditions = ['Excelente', 'Bueno', 'Regular', 'Mantenimiento'];
  const statuses = ['Disponible', 'En uso', 'No disponible'];
  const salas = ['Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'];

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Item" : "Añadir Item al Inventario"}>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Instrumento / Material</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ej: Piano Yamaha, Set de Maracas..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tipo</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
            >
              {types.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Condición</label>
            <select 
              value={formData.condition}
              onChange={(e) => setFormData({...formData, condition: e.target.value as any})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
            >
              {conditions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sala</label>
            <select 
              value={formData.sala}
              onChange={(e) => setFormData({...formData, sala: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
            >
              {salas.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Último Mantenimiento</label>
            <input 
              type="date" 
              value={formData.lastMaintenance}
              onChange={(e) => setFormData({...formData, lastMaintenance: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20"
          >
            Guardar Item
          </button>
        </div>
      </div>
    </Modal>
  );
}
