'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Plus, User, Users } from 'lucide-react';

interface UsersHeaderProps {
  onCreateClick: () => void;
  activeTab: 'PERSONAL' | 'TUTORES';
  setActiveTab: (tab: 'PERSONAL' | 'TUTORES') => void;
}

export function UsersHeader({ onCreateClick, activeTab, setActiveTab }: UsersHeaderProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold dark:text-white serif">Gestión de <span className="text-[#008080] italic">Usuarios</span></h1>
          <p className="text-gray-500 dark:text-gray-400">Administra toda la información de los Usuarios de manera sencilla e eficiente</p>
        </motion.div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onCreateClick}
            className="bg-[#008080] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#006666] transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('PERSONAL')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'PERSONAL' 
              ? 'bg-white dark:bg-white/10 text-[#008080] shadow-sm' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <User size={16} />
          PERSONAL
        </button>
        <button
          onClick={() => setActiveTab('TUTORES')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'TUTORES' 
              ? 'bg-white dark:bg-white/10 text-[#008080] shadow-sm' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <Users size={16} />
          TUTORES
        </button>
      </div>
    </div>
  );
}
