'use client';

import React from 'react';

interface GastoFormData {
  descripcion: string;
  categoria: string;
  monto: number;
  fechaGasto: string;
  estado: 'PAID' | 'PENDING';
}

interface ExpenseFormProps {
  newExpense: GastoFormData;
  setNewExpense: (expense: GastoFormData) => void;
  categories: string[];
  onSubmit: () => void;
  onCancel: () => void;
}

export function ExpenseForm({
  newExpense,
  setNewExpense,
  categories,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Descripción</label>
        <input
          type="text"
          value={newExpense.descripcion}
          onChange={(e) => setNewExpense({...newExpense, descripcion: e.target.value})}
          placeholder="Ej: Alquiler de local, Compra de materiales..."
          className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categoría</label>
          <select
            value={newExpense.categoria}
            onChange={(e) => setNewExpense({...newExpense, categoria: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Monto (Bs)</label>
          <input
            type="number"
            value={newExpense.monto}
            onChange={(e) => setNewExpense({...newExpense, monto: Number(e.target.value)})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fecha</label>
          <input
            type="date"
            value={newExpense.fechaGasto}
            onChange={(e) => setNewExpense({...newExpense, fechaGasto: e.target.value})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estado</label>
          <select
            value={newExpense.estado}
            onChange={(e) => setNewExpense({...newExpense, estado: e.target.value as 'PAID' | 'PENDING'})}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#008080]/20 transition-all appearance-none"
          >
            <option value="PENDING">Pendiente</option>
            <option value="PAID">Pagado</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
        >
          Cancelar
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 bg-[#008080] hover:bg-[#006666] text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-[#008080]/20"
        >
          Guardar Gasto
        </button>
      </div>
    </div>
  );
}
