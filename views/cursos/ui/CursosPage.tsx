"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useCursos,
  useCrearCurso,
  useActualizarCurso,
  useEliminarCurso,
  useInscribirCurso,
  generarCursosPDF,
  generarCursosExcel,
  CursoExportarFila,
  Curso,
} from "@/entities/curso";
import { CoursesHeader } from "./components/CoursesHeader";
import { CoursesStats } from "./components/CoursesStats";
import {
  CourseFormModal,
  type CursoFormData,
} from "./components/CourseFormModal";
import { EnrollStudentModal } from "./components/EnrollStudentModal";
import { ConfirmModal } from "@/shared/ui/ConfirmModal";
import GenericExportModal, { Exporter } from "@/shared/ui/GenericExportModal";
import { Pagination } from "@/shared/ui/Pagination";
import { useDebounce } from "@/shared/lib/hooks/useDebounce";
import {
  Search,
  GraduationCap,
  Users,
  DollarSign,
  ChevronRight,
  Edit2,
  Trash2,
  UserPlus,
} from "lucide-react";

export const CursosPage = () => {
  const router = useRouter();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const busquedaDebounced = useDebounce(terminoBusqueda, 500);
  const [paginaActual, setPaginaActual] = useState(1);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarEliminar, setMostrarEliminar] = useState(false);
  const [mostrarExportar, setMostrarExportar] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState<string | null>(null);
  const [cursoAEditar, setCursoAEditar] = useState<Curso | null>(null);
  const [cursoAInscribir, setCursoAInscribir] = useState<Curso | null>(null);
  const [mostrarInscribir, setMostrarInscribir] = useState(false);

  const { cursos, paginas, refetch } = useCursos({
    page: paginaActual,
    pageSize: 9,
    busqueda: busquedaDebounced || undefined,
  });

  const { crearCurso } = useCrearCurso();
  const { actualizarCurso } = useActualizarCurso();
  const { eliminarCurso } = useEliminarCurso();
  const { inscribirCurso } = useInscribirCurso();

  const totalRevenue = useMemo(
    () => cursos.reduce((sum, c) => sum + Number(c.ingresosTotales), 0),
    [cursos],
  );

  const totalStudents = useMemo(
    () => cursos.reduce((sum, c) => sum + Number(c.conteoEstudiantes), 0),
    [cursos],
  );

  const activeCourses = useMemo(
    () => cursos.filter((c) => c.estado === "ACTIVE").length,
    [cursos],
  );

  const handleAbrirCrear = () => {
    setCursoAEditar(null);
    setMostrarFormulario(true);
  };

  const handleAbrirEditar = (curso: Curso) => {
    setCursoAEditar(curso);
    setMostrarFormulario(true);
  };

  const handleGuardar = async (data: CursoFormData) => {
    try {
      if (cursoAEditar) {
        await actualizarCurso({ id: cursoAEditar.id, ...data });
      } else {
        await crearCurso(data);
      }
      setMostrarFormulario(false);
      setCursoAEditar(null);
      await refetch();
    } catch {}
  };

  const handleAbrirInscribir = (curso: Curso) => {
    setCursoAInscribir(curso);
    setMostrarInscribir(true);
  };

  const handleInscribir = async (data: {
    fullName: string;
    carnet: string;
    paymentMethod: string;
    amount: number;
  }) => {
    if (!cursoAInscribir) return;
    try {
      await inscribirCurso({
        courseId: cursoAInscribir.id,
        ...data,
      });
      setMostrarInscribir(false);
      setCursoAInscribir(null);
      await refetch();
    } catch {}
  };

  const handleSolicitarEliminar = (id: string) => {
    setCursoAEliminar(id);
    setMostrarEliminar(true);
  };

  const handleEliminar = async () => {
    if (!cursoAEliminar) return;
    try {
      await eliminarCurso(cursoAEliminar);
      setMostrarEliminar(false);
      setCursoAEliminar(null);
      await refetch();
    } catch {}
  };

  const datosExportacion = useMemo((): CursoExportarFila[] => {
    return cursos.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      descripcion: c.descripcion,
      precio: Number(c.precio),
      estado: c.estado,
      conteoEstudiantes: Number(c.conteoEstudiantes),
      ingresosTotales: Number(c.ingresosTotales),
    }));
  }, [cursos]);

  const exporters = useMemo<Exporter<CursoExportarFila>[]>(
    () => [
      {
        id: "pdf",
        label: "Exportar PDF",
        async execute(data) {
          const doc = await generarCursosPDF(data);
          doc.save(`reporte_cursos_${Date.now()}.pdf`);
        },
        async preview(data) {
          const doc = await generarCursosPDF(data);
          return doc.output("blob") as Blob;
        },
      },
      {
        id: "excel",
        label: "Exportar Excel",
        async execute(data) {
          await generarCursosExcel(data);
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-8">
      <CoursesHeader
        onAddClick={handleAbrirCrear}
        onExportClick={() => setMostrarExportar(true)}
      />

      <CoursesStats
        totalRevenue={totalRevenue}
        totalStudents={totalStudents}
        activeCourses={activeCourses}
      />

      <div className="relative group max-w-md">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008080] transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#111] rounded-2xl border border-gray-200 dark:border-white/5 focus-visible:border-[#008080] outline-none transition-all text-sm shadow-sm"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cursos.map((curso) => (
          <div
            key={curso.id}
            onClick={() => router.push(`/dashboard/cursos/${curso.id}`)}
            className="bg-white dark:bg-[#111] rounded-[32px] border border-gray-200 dark:border-white/5 p-8 group hover:border-[#008080] hover:shadow-xl transition-all cursor-pointer relative"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAbrirInscribir(curso);
                }}
                className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
                title="Inscribir Estudiante"
              >
                <UserPlus size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAbrirEditar(curso);
                }}
                className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-[#008080] hover:bg-[#008080]/10 transition-all"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSolicitarEliminar(curso.id);
                }}
                className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap size={28} />
            </div>
            <h3 className="text-xl font-bold dark:text-white mb-2">
              {curso.nombre}
            </h3>
            <p className="text-sm text-gray-400 mb-8 line-clamp-2">
              {curso.descripcion}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
                <div className="flex items-center gap-2 text-[#008080] mb-1">
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Alumnos
                  </span>
                </div>
                <p className="text-lg font-bold dark:text-white">
                  {curso.conteoEstudiantes}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/2 rounded-2xl">
                <div className="flex items-center gap-2 text-green-500 mb-1">
                  <DollarSign size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Ingresos
                  </span>
                </div>
                <p className="text-lg font-bold dark:text-white">
                  Bs. {curso.ingresosTotales}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  curso.estado === "ACTIVE"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {curso.estado === "ACTIVE" ? "Activo" : "Cerrado"}
              </span>
              <ChevronRight
                size={18}
                className="text-gray-300 group-hover:text-[#008080] transition-all transform group-hover:translate-x-1"
              />
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={paginaActual}
        totalPages={paginas}
        onPageChange={setPaginaActual}
      />

      <EnrollStudentModal
        key={`inscribir-${cursoAInscribir?.id ?? "none"}`}
        isOpen={mostrarInscribir}
        onClose={() => {
          setMostrarInscribir(false);
          setCursoAInscribir(null);
        }}
        course={cursoAInscribir}
        onSave={handleInscribir}
      />

      <CourseFormModal
        key={`${mostrarFormulario}-${cursoAEditar?.id ?? "new"}`}
        isOpen={mostrarFormulario}
        onClose={() => {
          setMostrarFormulario(false);
          setCursoAEditar(null);
        }}
        onSave={handleGuardar}
        initialData={cursoAEditar}
      />

      <ConfirmModal
        isOpen={mostrarEliminar}
        onClose={() => {
          setMostrarEliminar(false);
          setCursoAEliminar(null);
        }}
        onConfirm={handleEliminar}
        title="Eliminar Curso"
        message="¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer."
        confirmLabel="Eliminar Curso"
      />

      <GenericExportModal<CursoExportarFila>
        title="Exportar Cursos"
        isOpen={mostrarExportar}
        onClose={() => setMostrarExportar(false)}
        data={datosExportacion}
        fileName="reporte_cursos"
        columns={[
          { key: "nombre", label: "Nombre" },
          { key: "descripcion", label: "Descripción" },
          {
            key: "precio",
            label: "Precio",
            formatter: (v) => `Bs. ${Number(v).toFixed(2)}`,
          },
          {
            key: "conteoEstudiantes",
            label: "Estudiantes",
          },
          {
            key: "ingresosTotales",
            label: "Ingresos",
            formatter: (v) => `Bs. ${Number(v).toFixed(2)}`,
          },
          {
            key: "estado",
            label: "Estado",
            formatter: (v) => (v === "ACTIVE" ? "Activo" : "Cerrado"),
          },
        ]}
        filters={[
          {
            key: "estado",
            label: "Estado",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Activo" },
              { value: "ARCHIVED", label: "Cerrado" },
              { value: "DRAFT", label: "Borrador" },
            ],
          },
        ]}
        exporters={exporters}
      />
    </div>
  );
};
