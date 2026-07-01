'use client';

import React, { useState } from 'react';
import { ScaleCard } from './ScaleCard';

interface ScalesListProps {
  scales: any[];
  onDelete: (id: number) => void;
}

export function ScalesList({ scales, onDelete }: ScalesListProps) {
  const [expandedScaleId, setExpandedScaleId] = useState<number | null>(null);

  if (scales.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-white/2 rounded-[48px] border border-dashed border-gray-200 dark:border-white/10">
        <p className="text-gray-400 italic">No se encontraron escalas registradas.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {scales.map((scale, idx) => (
        <ScaleCard 
          key={scale.id} 
          scale={scale} 
          index={idx} 
          isExpanded={expandedScaleId === scale.id}
          onToggleExpand={() => setExpandedScaleId(expandedScaleId === scale.id ? null : scale.id)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
