'use client';

import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export function DroppableSlot({id, children, className}: {
    id: string,
    children: React.ReactNode,
    className?: string
}) {
    const {isOver, setNodeRef} = useDroppable({id});

    return (
        <div
            ref={setNodeRef}
            className={`${className} ${isOver ? 'bg-[#008080]/10 ring-2 ring-[#008080]/20' : ''}`}
        >
            {children}
        </div>
    );
}

export function DraggableSession({session, onClick}: { session: any, onClick: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({id: session.id});

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Individual':
                return 'bg-blue-500';
            case 'Grupal':
                return 'bg-purple-500';
            case 'Evaluación':
                return 'bg-orange-500';
            case 'Rehabilitación':
                return 'bg-emerald-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`p-2 mb-2 rounded-xl border cursor-grab active:cursor-grabbing transition-all flex items-center gap-2 ${
                session.status === 'Completada'
                    ? 'bg-green-500/5 dark:bg-green-500/10 border-green-500/10 hover:bg-green-500/10'
                    : 'bg-[#008080]/5 dark:bg-[#008080]/10 border-[#008080]/10 hover:bg-[#008080]/10'
            }`}
        >
            <div className={`w-1 h-4 rounded-full shrink-0 ${getTypeColor(session.type)}`}/>
            <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold truncate ${session.status === 'Completada' ? 'text-green-600' : 'text-[#008080]'}`}>
                    {session.patientName}
                </p>
                <div className="flex justify-between items-center mt-0.5">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{session.time}</span>
                    {session.isTest && (
                        <span
                            className="text-[7px] bg-purple-500/10 text-purple-600 px-1 py-0.5 rounded-md font-bold">PRUEBA</span>
                    )}
                </div>
            </div>
        </div>
    );
}
