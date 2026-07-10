'use client';

import React from 'react';
import { DollarSign, Users, BookOpen } from 'lucide-react';
import { StatCard } from '@/shared/ui/StatCard';

interface CoursesStatsProps {
  totalRevenue: number;
  totalStudents: number;
  activeCourses: number;
}

export function CoursesStats({ totalRevenue, totalStudents, activeCourses }: CoursesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        icon={<DollarSign />} 
        label="Ingresos Totales" 
        value={`Bs. ${totalRevenue.toLocaleString()}`} 
        color="teal"
        trend="+15% este mes"
      />
      <StatCard 
        icon={<Users />} 
        label="Total Estudiantes" 
        value={totalStudents.toString()} 
        color="blue"
        trend="+8% este mes"
      />
      <StatCard 
        icon={<BookOpen />} 
        label="Cursos Activos" 
        value={activeCourses.toString()} 
        color="green"
      />
    </div>
  );
}
