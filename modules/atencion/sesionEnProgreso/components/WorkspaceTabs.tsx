'use client';

import React from 'react';
import { Target, MessageSquare, Layers, FileText } from 'lucide-react';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 md:gap-3 px-6 md:px-10 py-6 md:py-8 border-b-2 transition-all relative group ${active ? 'border-[#008080] text-[#008080]' : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
        >
            <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">{label}</span>
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008080] shadow-[0_0_10px_rgba(0,128,128,0.5)]" />
            )}
        </button>
    );
}

interface WorkspaceTabsProps {
    activeTab: 'notes' | 'resources' | 'forms' | 'plan';
    setActiveTab: (tab: 'notes' | 'resources' | 'forms' | 'plan') => void;
}

export function WorkspaceTabs({ activeTab, setActiveTab }: WorkspaceTabsProps) {
    return (
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-white/5 px-4 md:px-10 bg-gray-50/50 dark:bg-white/1 no-scrollbar">
            <TabButton
                active={activeTab === 'plan'}
                onClick={() => setActiveTab('plan')}
                icon={<Target size={18} className="md:w-5 md:h-5" />}
                label="Plan"
            />
            <TabButton
                active={activeTab === 'notes'}
                onClick={() => setActiveTab('notes')}
                icon={<MessageSquare size={18} className="md:w-5 md:h-5" />}
                label="Notas"
            />
            <TabButton
                active={activeTab === 'resources'}
                onClick={() => setActiveTab('resources')}
                icon={<Layers size={18} className="md:w-5 md:h-5" />}
                label="Recursos"
            />
            <TabButton
                active={activeTab === 'forms'}
                onClick={() => setActiveTab('forms')}
                icon={<FileText size={18} className="md:w-5 md:h-5" />}
                label="Evaluación"
            />
        </div>
    );
}
