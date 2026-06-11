'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Music, CheckCircle2 } from 'lucide-react';

interface ResourcesTabProps {
    resources: any[];
    selectedResources: string[];
    toggleResource: (id: string) => void;
}

export function ResourcesTab({ resources, selectedResources, toggleResource }: ResourcesTabProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6"
        >
            {resources.map(resource => (
                <div
                    key={resource.id}
                    onClick={() => toggleResource(resource.id)}
                    className={`p-4 md:p-6 rounded-[24px] md:rounded-[32px] border-2 transition-all cursor-pointer flex items-center gap-3 md:gap-4 ${(selectedResources || []).includes(resource.id) ? 'border-[#008080] bg-[#008080]/5' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 hover:border-gray-200 dark:hover:border-white/10'}`}
                >
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex-shrink-0 flex items-center justify-center ${(selectedResources || []).includes(resource.id) ? 'bg-[#008080] text-white' : 'bg-white dark:bg-[#111] text-gray-400'}`}>
                        <Music size={18} className="md:w-5 md:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs md:text-sm dark:text-white truncate">{resource.title}</h4>
                        <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{resource.type} • {resource.category}</p>
                    </div>
                    {(selectedResources || []).includes(resource.id) && (
                        <CheckCircle2 size={18} className="text-[#008080] md:w-5 md:h-5 flex-shrink-0" />
                    )}
                </div>
            ))}
        </motion.div>
    );
}
