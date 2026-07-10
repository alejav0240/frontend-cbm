'use client';

import React from 'react';
import { Modal } from '@/shared/ui/components/Modal';
import { Eye, EyeOff } from 'lucide-react';
import { Usuario } from '@/entities/usuario';

interface UserCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: Usuario | null;
  showPassword: boolean;
  onTogglePassword: () => void;
  password?: string;
}

export function UserCredentialsModal({
  isOpen,
  onClose,
  user,
  showPassword,
  onTogglePassword,
  password: propPassword
}: UserCredentialsModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Credenciales de Acceso"
    >
      {user && (
        <div className="space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl space-y-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Usuario</p>
                  <p className="text-lg font-bold dark:text-white">{user.username || 'No asignado'}</p>
                  <p className="text-sm text-gray-500">{user.fullName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contraseña</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-mono font-bold text-[#008080]">
                  {showPassword ? (propPassword || 'No asignada') : '••••••••'}
                </p>
                <button 
                  onClick={onTogglePassword}
                  className="p-2 text-gray-400 hover:text-[#008080] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Por seguridad, comparte estas credenciales de forma privada con el usuario.
          </p>
          <div className="flex justify-center pt-4">
            <button 
              onClick={onClose}
              className="bg-[#008080] text-white px-12 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
