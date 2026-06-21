"use client";

import React from "react";

// Subcomponents
import { NoData } from "@/entities/paciente/ui/NoData";
import { AIOverviewCards } from "@/entities/paciente/components/AIOverviewCards";
import { AIHistorial } from "@/entities/paciente/components/AIHistorial";
import { GraficoRadar } from "@/entities/paciente/components/GraficoRadar";
import { EvolucionCategoria } from "@/entities/paciente/components/EvolucionCategoria";
import { ProgresoSubEscala } from "@/entities/paciente/api/useObtenerProgresoSubEscala";

interface PatientAIGeneralViewProps {
  dataDemuca: ProgresoSubEscala[];
}

// --- TIPADO PARA LOS GRÁFICOS (OUTPUT) ---
export interface RadarChartData {
  item: string; // Ej: "Agresividad" o "Exploración Vocal"
  score: number; // El puntaje asociado
  category: string; // Para agrupar o filtrar si es necesario
}

export interface AreaChartData {
  evaluationId: string;

  [categoryName: string]: number | string; // Dinámico: "Exploración Vocal": 9, "id": "27272"
}

function formatearDatosEvaluacion(evaluations: ProgresoSubEscala[]) {
  if (!evaluations || evaluations.length === 0) {
    return { radarData: [], areaData: [] };
  }

  // Tomamos la última evaluación para el Radar (el estado actual)
  const ultimaEvaluacion = evaluations[evaluations.length - 1];

  // 1. FORMATEAR PARA RADAR (Detalle por subescala individual o por categoría)
  // Puedes elegir graficar las subescalas directamente:
  const radarData: RadarChartData[] = ultimaEvaluacion.subscaleResponses.map(
    (resp) => ({
      item: resp.subscale.name,
      score: resp.score,
      category: resp.subscale.category,
    }),
  );

  // 2. FORMATEAR PARA ÁREA (Histórico acumulado por categorías a lo largo de las evaluaciones)
  const areaData: AreaChartData[] = evaluations.map((evaluacion) => {
    // Inicializamos el objeto de la evaluación con su ID de referencia
    const puntoEvolucion: AreaChartData = {
      evaluationId: evaluacion.id,
    };

    // Sumamos los puntajes agrupándolos por su categoría madre
    evaluacion.subscaleResponses.forEach((resp) => {
      const categoria = resp.subscale.category;
      if (!puntoEvolucion[categoria]) {
        puntoEvolucion[categoria] = 0;
      }
      (puntoEvolucion[categoria] as number) += resp.score;
    });

    return puntoEvolucion;
  });

  return { radarData, areaData };
}

export default function AnalisDemuca({
  dataDemuca,
}: PatientAIGeneralViewProps) {
  if (!dataDemuca) {
    return <NoData />;
  }

  const { areaData, radarData } = formatearDatosEvaluacion(dataDemuca);
  return (
    <div className="space-y-8 p-6">
      <AIOverviewCards analysesCount={20} lastUpdateDate={""} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EvolucionCategoria data={areaData} />
        <GraficoRadar data={radarData} />
      </div>
      {false && <AIHistorial data={[]} />}
    </div>
  );
}
