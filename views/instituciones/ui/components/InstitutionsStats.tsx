'use client';

import React from 'react';
import { Building2, Users, Activity } from 'lucide-react';
import { StatCard } from '@/shared/ui/StatCard';

interface InstitutionsStatsProps {
  totalInstitutions: number;
  totalGroups: number;
  totalSessions: number;
}

export function InstitutionsStats({ totalInstitutions, totalGroups, totalSessions }: InstitutionsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        icon={<Building2 />} 
        label="Total Instituciones" 
        value={totalInstitutions.toString()} 
        color="teal"
      />
      <StatCard 
        icon={<Users />} 
        label="Total Grupos" 
        value={totalGroups.toString()} 
        color="blue"
      />
      <StatCard 
        icon={<Activity />} 
        label="Sesiones Grupales" 
        value={totalSessions.toString()} 
        color="green"
      />
    </div>
  );
}
