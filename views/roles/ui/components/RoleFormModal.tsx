'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { PERMISSION_ACTIONS, expandModuleToPermissions } from '@/lib/permissions';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newRole: any;
  setNewRole: (role: any) => void;
  onToggleModule: (moduleId: string, checked: boolean) => void;
  modules: any[];
}

export function RoleFormModal({ isOpen, onClose, onSubmit, newRole, setNewRole, onToggleModule, modules }: RoleFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Rol">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre del Rol</label>
            <input 
              type="text" 
              required 
              value={newRole.name}
              onChange={(e) => setNewRole({...newRole, name: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border-transparent focus:bg-white dark:focus:bg-white/10 focus:border-[#008080] outline-none transition-all text-sm dark:text-white" 
              placeholder="Ej. Terapeuta Senior" 
            />
          </div>

          <div className="space-y-3 pt-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Módulos Permitidos Inicialmente</label>
            <div className="grid grid-cols-2 gap-3">
              {modules.map(module => {
                const modulePermissions = expandModuleToPermissions(module.id);
                const checkedActions = modulePermissions.filter(permission => newRole.permissions.includes(permission));
                const isChecked = checkedActions.length === PERMISSION_ACTIONS.length;
                const isIndeterminate = checkedActions.length > 0 && !isChecked;

                return (
                  <label key={module.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-transparent">
                    <input 
                      type="checkbox"
                      checked={isChecked}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => onToggleModule(module.id, e.target.checked)}
                      className="w-4 h-4 rounded text-[#008080] focus:ring-[#008080] bg-white dark:bg-black border-gray-300 dark:border-white/20"
                    />
                    <span className="text-sm font-bold dark:text-white flex items-center gap-2">
                      <span>{module.icon}</span> {module.name}
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-gray-400">
              Al marcar un módulo se habilitan ver, crear, editar y eliminar. Puedes ajustar acciones específicas después de crear el rol.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancelar</button>
          <button type="submit" className="bg-[#008080] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg">Guardar Rol</button>
        </div>
      </form>
    </Modal>
  );
}
