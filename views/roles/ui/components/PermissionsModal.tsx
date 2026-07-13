'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { PERMISSION_ACTIONS, PERMISSION_ACTION_LABELS } from '@/lib/permissions';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: any;
  onTogglePermission: (moduleId: string) => void;
  modules: { id: string; name: string; icon: string }[];
}

export function PermissionsModal({ isOpen, onClose, selectedRole, onTogglePermission, modules }: PermissionsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Permisos: ${selectedRole?.name}`}>
      <div className="space-y-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">Selecciona las acciones permitidas por módulo.</p>
        <div className="grid lg:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {modules.map((module) => {
            const enabledActions = PERMISSION_ACTIONS.filter((action) => (
              selectedRole?.permissions?.includes(`${module.id}:${action}`)
            ));
            const hasAnyPermission = enabledActions.length > 0;

            return (
              <div
                key={module.id}
                className={`p-4 rounded-2xl border transition-all ${
                  hasAnyPermission 
                    ? 'bg-[#008080]/10 border-[#008080] text-[#008080]' 
                    : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 dark:text-gray-400'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{module.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{module.name}</p>
                    <p className="text-[10px] uppercase tracking-widest opacity-60">
                      {hasAnyPermission ? `${enabledActions.length} acciones` : 'Sin acceso'}
                    </p>
                  </div>
                  {hasAnyPermission && <CheckCircle2 size={16} />}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PERMISSION_ACTIONS.map((action) => {
                    const permission = `${module.id}:${action}`;
                    const hasPermission = selectedRole?.permissions?.includes(permission) || false;

                    return (
                      <button
                        key={permission}
                        type="button"
                        onClick={() => onTogglePermission(permission)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          hasPermission
                            ? 'bg-[#008080] text-white shadow-sm'
                            : 'bg-white dark:bg-black/20 text-gray-400 hover:text-[#008080]'
                        }`}
                      >
                        {PERMISSION_ACTION_LABELS[action]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </Modal>
  );
}
