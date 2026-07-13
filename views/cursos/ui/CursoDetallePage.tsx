"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCurso,
  useActualizarCurso,
  useEliminarCurso,
  useInscribirCurso,
} from "@/entities/curso";
import {
  CourseFormModal,
  type CursoFormData,
} from "./components/CourseFormModal";
import { EnrollStudentModal } from "./components/EnrollStudentModal";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import {
  ArrowLeft,
  GraduationCap,
  Users,
  DollarSign,
  Edit2,
  Trash2,
  UserPlus,
  Calendar,
  IdCard,
  Loader2,
} from "lucide-react";

interface CursoDetallePageProps {
  id: string;
}

export const CursoDetallePage = ({ id }: CursoDetallePageProps) => {
  const router = useRouter();
  const { curso, cargando } = useCurso(id);

  const { actualizarCurso } = useActualizarCurso();
  const { eliminarCurso } = useEliminarCurso();
  const { inscribirCurso } = useInscribirCurso();

  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarInscribir, setMostrarInscribir] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);

  if (cargando) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#008080] animate-spin" />
      </div>
    );
  }

  if (!curso) {
    return (
      <div className="text-center py-20">
        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl font-bold text-gray-400 dark:text-gray-500">
          Curso no encontrado
        </p>
        <button
          onClick={() => router.push("/dashboard/cursos")}
          className="mt-4 text-sm text-[#008080] hover:underline font-bold"
        >
          Volver a Cursos
        </button>
      </div>
    );
  }

  const handleActualizar = async (data: CursoFormData) => {
    try {
      await actualizarCurso({ id: curso.id, ...data });
      setMostrarEditar(false);
    } catch {}
  };

  const handleInscribir = async (data: {
    fullName: string;
    carnet: string;
    paymentMethod: string;
    amount: number;
  }) => {
    try {
      await inscribirCurso({ courseId: curso.id, ...data });
      setMostrarInscribir(false);
    } catch {}
  };

  const handleEliminar = async () => {
    try {
      await eliminarCurso(curso.id);
      setMostrarEliminar(false);
      router.push("/dashboard/cursos");
    } catch {}
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push("/dashboard/cursos")}
        className="flex items-center gap-2 text-gray-500 hover:text-[#008080] transition-colors font-bold text-xs uppercase tracking-widest"
      >
        <ArrowLeft size={16} />
        Volver a Cursos
      </button>

      {/* Course header */}
      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] shrink-0">
              <GraduationCap size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold dark:text-white serif">
                  {curso.nombre}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    curso.estado === "ACTIVE"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {curso.estado === "ACTIVE" ? "Activo" : "Cerrado"}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#008080]">
                Bs. {Number(curso.precio).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMostrarInscribir(true)}
              className="flex items-center gap-2 px-5 py-3 bg-[#008080] text-white rounded-2xl font-bold hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20 text-sm"
            >
              <UserPlus size={18} />
              Inscribir
            </button>
            <button
              onClick={() => setMostrarEditar(true)}
              className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => setMostrarEliminar(true)}
              className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Description */}
        {curso.descripcion && (
          <p className="mt-6 text-gray-500 dark:text-gray-400 leading-relaxed">
            {curso.descripcion}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080]">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Estudiantes Inscritos
            </p>
            <p className="text-3xl font-bold dark:text-white">
              {curso.conteoEstudiantes}
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#111] p-6 rounded-[32px] border border-gray-200 dark:border-white/5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
            <DollarSign size={28} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Ingresos Totales
            </p>
            <p className="text-3xl font-bold dark:text-white">
              Bs. {Number(curso.ingresosTotales).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Enrollments */}
      <div className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-[#008080]" />
            <h2 className="text-lg font-bold dark:text-white">
              Estudiantes Inscritos
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#008080]/10 text-[#008080] text-xs font-bold">
              {curso.inscripciones.length}
            </span>
          </div>
          <button
            onClick={() => setMostrarInscribir(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#008080] text-white rounded-xl font-bold hover:bg-[#006666] transition-all text-sm"
          >
            <UserPlus size={16} />
            Inscribir
          </button>
        </div>

        <div className="overflow-x-auto">
          {curso.inscripciones.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">
                No hay estudiantes inscritos
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Inscribe al primer estudiante usando el botón
                &quot;Inscribir&quot;
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <Users size={12} />
                      Estudiante
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <IdCard size={12} />
                      Carnet
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      Fecha de Inscripción
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {curso.inscripciones.map((inscripcion, idx) => (
                  <tr
                    key={inscripcion.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#008080]/10 flex items-center justify-center text-[#008080] text-sm font-bold">
                          {inscripcion.nombreCompleto.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold dark:text-white">
                          {inscripcion.nombreCompleto}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      {inscripcion.carnet || "—"}
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500">
                      {inscripcion.fechaInscripcion.toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modals */}
      <CourseFormModal
        key={`editar-${mostrarEditar}`}
        isOpen={mostrarEditar}
        onClose={() => setMostrarEditar(false)}
        onSave={handleActualizar}
        initialData={curso}
      />

      <EnrollStudentModal
        key={`inscribir-${mostrarInscribir}`}
        isOpen={mostrarInscribir}
        onClose={() => setMostrarInscribir(false)}
        course={curso}
        onSave={handleInscribir}
      />

      <ConfirmModal
        isOpen={mostrarEliminar}
        onClose={() => setMostrarEliminar(false)}
        onConfirm={handleEliminar}
        title="Eliminar Curso"
        message={`¿Estás seguro de que deseas eliminar "${curso.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar Curso"
      />
    </div>
  );
};
