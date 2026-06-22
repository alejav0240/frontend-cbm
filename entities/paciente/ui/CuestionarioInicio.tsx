"use client";

import React, { useMemo } from "react";

interface QuestionItemProps {
  pregunta: string;
  respuesta?: string;
}

const QuestionItem = React.memo(
  ({ pregunta, respuesta }: QuestionItemProps) => {
    return (
      <div className="space-y-2 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 transition-colors">
        <p className="text-xs font-bold dark:text-white leading-relaxed">
          {pregunta}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          {respuesta || "Sin respuesta"}
        </p>
      </div>
    );
  },
);

QuestionItem.displayName = "QuestionItem";

interface QuestionGroupProps {
  title: string;
  data: QuestionItemProps[];
}

const QuestionGroup = React.memo(({ title, data }: QuestionGroupProps) => {
  if (data.length === 0) return null;

  return (
    <section>
      <h3 className="text-xs font-bold text-[#008080] uppercase tracking-[0.2em] mb-4">
        {title}
      </h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <QuestionItem
            key={`${item.pregunta}-${index}`}
            pregunta={item.pregunta}
            respuesta={item.respuesta}
          />
        ))}
      </div>
    </section>
  );
});

QuestionGroup.displayName = "QuestionGroup";

interface CuestionarioInicioProps {
  preguntas?: QuestionItemProps[];
}

export function CuestionarioInicio({
  preguntas = [],
}: CuestionarioInicioProps) {
  const grupos = useMemo(() => {
    const respuestas = preguntas ?? [];

    return {
      musicales: respuestas.slice(0, 8),
      generales: respuestas.slice(8, 14),
      familiares: respuestas.slice(14, 18),
    };
  }, [preguntas]);

  if (!preguntas || preguntas.length === 0) {
    return (
      <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm">
        <h2 className="text-lg font-bold dark:text-white serif mb-4">
          Cuestionario de Ingreso
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No hay respuestas registradas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#111] p-8 rounded-[32px] border border-gray-200 dark:border-white/5 shadow-sm space-y-6 overflow-y-auto max-h-[1050px]">
      <h2 className="text-lg font-bold dark:text-white serif">
        Cuestionario de Ingreso
      </h2>

      <div className="space-y-6">
        <QuestionGroup title="Referencias Musicales" data={grupos.musicales} />
        <QuestionGroup title="Referencias Generales" data={grupos.generales} />
        <QuestionGroup
          title="Referencias Familiares"
          data={grupos.familiares}
        />
      </div>
    </div>
  );
}
