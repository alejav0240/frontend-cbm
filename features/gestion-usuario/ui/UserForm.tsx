'use client';

import React from 'react';
import { User, CreditCard, Phone, Key, AlertCircle } from 'lucide-react';
import { SearchableSelect } from '@/shared/ui/components/SearchableSelect';

interface UserFormProps {
  name: string;
  setName: (val: string) => void;
  carnet: string;
  setCarnet: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  type: string;
  setType: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  visibility: string;
  setVisibility: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  errors?: Record<string, string>;
}

export function UserForm({
  name, setName,
  carnet, setCarnet,
  phone, setPhone,
  username, setUsername,
  password, setPassword,
  type, setType,
  status, setStatus,
  visibility, setVisibility,
  onSubmit, onCancel,
  isEditing,
  errors = {}
}: UserFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.name ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
            placeholder="Ej. Alejandro Chipana" 
          />
        </div>
        {errors.name && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Carnet de Identidad</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={carnet}
              onChange={(e) => setCarnet(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.carnet ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
              placeholder="Ej. 1234567 LP" 
            />
          </div>
          {errors.carnet && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 flex items-center gap-1"><AlertCircle size={10} /> {errors.carnet}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Celular</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-2 focus:bg-white dark:focus:bg-white/10 outline-none transition-all text-sm dark:text-white ${errors.phone ? 'border-red-500' : 'border-transparent focus:border-[#008080]'}`} 
              placeholder="Ej. 70000000" 
            />
          </div>
          {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Usuario (Login)</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" 
              placeholder="Opcional: se generará automáticamente" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contraseña</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" 
              placeholder="Opcional: se generará automáticamente" 
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <SearchableSelect 
          label="Tipo de Usuario"
          options={['TERAPEUTA', 'ADMINISTRADOR', 'SECRETARIA', 'RECEPCION', 'TUTOR']}
          value={type}
          onChange={setType}
        />
        <SearchableSelect 
          label="Estado"
          options={['ACTIVO', 'INACTIVO']}
          value={status}
          onChange={setStatus}
        />
        <SearchableSelect 
          label="Visibilidad"
          options={['VISIBLE', 'NO VISIBLE']}
          value={visibility}
          onChange={setVisibility}
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
        <button type="submit" className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">
          {isEditing ? "Guardar Cambios" : "Crear Usuario"}
        </button>
      </div>
    </form>
  );
}
