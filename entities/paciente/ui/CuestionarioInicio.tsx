"use client";

import React from "react";
import { PacienteDetalleSerializado } from "@/entities/paciente";

interface QuestionItemProps {
  q: string;
  a?: string;
}

function QuestionItem({ q, a }: QuestionItemProps) {
  return (
    <div className="space-y-2 p-4 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5">
      <p className="text-xs font-bold dark:text-white leading-relaxed">{q}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        {a || "Sin respuesta"}
      </p>
    </div>
  );
}

interface IntakeQuestionnaireProps {
  patient: PacienteDetalleSerializado;
}

export function CuestionarioInicio({ patient }: IntakeQuestionnaireProps) {
  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm space-y-6 overflow-y-auto max-h-[1050px] custom-scrollbar">
      <h2 className="text-lg font-bold dark:text-white serif">
        Cuestionario de Ingreso
      </h2>

      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-bold text-[#008080] uppercase tracking-[0.2em] mb-4">
            Referencias Musicales
          </h3>
          <div className="space-y-4">
            <QuestionItem
              q="1 - ¿Cuáles son las preferencias/rechazos musicales/sonoros de los responsables?"
              a={patient?.cuestionario?.referenciasMusicales?.q1}
            />
            <QuestionItem
              q="2 - ¿Cuáles/Cómo fueron tus experiencias musicales/sonoras durante el embarazo?"
              a={patient?.cuestionario?.referenciasMusicales?.q2}
            />
            <QuestionItem
              q="3 - ¿Cuáles/Cómo fueron tus primeras experiencias musicales/sonoras después del nacimiento?"
              a={patient?.cuestionario?.referenciasMusicales?.q3}
            />
            <QuestionItem
              q="4- ¿Cuáles son las preferencias/rechazos musicales/sonoros del niño?"
              a={patient?.cuestionario?.referenciasMusicales?.q4}
            />
            <QuestionItem
              q="5- ¿Tienes experiencia musical?"
              a={patient?.cuestionario?.referenciasMusicales?.q5}
            />
            <QuestionItem
              q="6- ¿Tienes familiares que sean músicos?"
              a={patient?.cuestionario?.referenciasMusicales?.q6}
            />
            <QuestionItem
              q="7- ¿Tienes instrumentos musicales en casa?"
              a={patient?.cuestionario?.referenciasMusicales?.q7}
            />
            <QuestionItem
              q="8- ¿Cómo se involucra musicalmente 'más'?"
              a={patient?.cuestionario?.referenciasMusicales?.q8}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#008080] uppercase tracking-[0.2em] mb-4">
            Referencias Generales
          </h3>
          <div className="space-y-4">
            <QuestionItem
              q="9- ¿Tiene alguna discapacidad o enfermedad? ¿Alguna hiper o hiposensibilidad?"
              a={patient?.cuestionario?.referenciasGenerales?.q9}
            />
            <QuestionItem
              q="10-¿Usas algún medicamento?"
              a={patient?.cuestionario?.referenciasGenerales?.q10}
            />
            <QuestionItem
              q="11- ¿Tiene algún tipo de alergia?"
              a={patient?.cuestionario?.referenciasGenerales?.q11}
            />
            <QuestionItem
              q="12- ¿Tiene alguna dificultad motora, social, comunicativa, cognitiva, emocional o de otro tipo?"
              a={patient?.cuestionario?.referenciasGenerales?.q12}
            />
            <QuestionItem
              q="13- ¿Realiza intervenciones/monitoreos/terapias?"
              a={patient?.cuestionario?.referenciasGenerales?.q13}
            />
            <QuestionItem
              q="14 - ¿Tienes algún hiperenfoque?"
              a={patient?.cuestionario?.referenciasGenerales?.q14}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-[#008080] uppercase tracking-[0.2em] mb-4">
            Referencias Familiares
          </h3>
          <div className="space-y-4">
            <QuestionItem
              q="15- ¿Cuál es el origen de la familia?"
              a={patient?.cuestionario?.referenciasFamiliares?.q15}
            />
            <QuestionItem
              q="16-¿Tienes hermanos?"
              a={patient?.cuestionario?.referenciasFamiliares?.q16}
            />
            <QuestionItem
              q="17 - ¿Adopción u otra información relevante?"
              a={patient?.cuestionario?.referenciasFamiliares?.q17}
            />
            <QuestionItem
              q="18 - ¿Con quién pasa el niño la mayor parte del tiempo?"
              a={patient?.cuestionario?.referenciasFamiliares?.q18}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
