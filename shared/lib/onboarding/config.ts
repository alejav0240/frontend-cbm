import type { ConfiguracionOnboarding, PasoOnboarding } from "./tipos";

type RolAncla =
  | "header"
  | "stats"
  | "accion"
  | "busqueda"
  | "filtros"
  | "lista"
  | "tabs"
  | "modal"
  | "extra";

interface ConfiguracionVista extends ConfiguracionOnboarding {
  anclas: RolAncla[];
  textos: Partial<Record<RolAncla, { title: string; description: string }>>;
}

const pasosNavegacion: PasoOnboarding[] = [
  {
    element: "[data-onboarding-sidebar]",
    popover: {
      title: "Navegación principal",
      description:
        "Desde aquí puedes cambiar entre los módulos disponibles para tu cuenta.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "[data-onboarding-topbar]",
    popover: {
      title: "Barra superior",
      description:
        "Aquí encontrarás acciones generales, notificaciones y controles de tu sesión.",
      side: "bottom",
      align: "end",
    },
  },
];

const texto = (
  title: string,
  description: string,
): { title: string; description: string } => ({ title, description });

const vista = (
  titulo: string,
  descripcion: string,
  anclas: RolAncla[],
  textos: ConfiguracionVista["textos"] = {},
): ConfiguracionVista => ({
  titulo,
  descripcion,
  anclas,
  textos,
});

const vistas: Record<string, ConfiguracionVista> = {
  "/dashboard": vista(
    "Tu dashboard",
    "Este resumen concentra tus indicadores, actividad reciente y accesos rápidos.",
    ["header", "stats", "accion", "extra", "lista"],
    {
      accion: texto(
        "Iniciar una sesión",
        "Accede rápidamente a la siguiente sesión pendiente.",
      ),
      extra: texto(
        "Acciones rápidas",
        "Crea pacientes, sesiones, pagos o evaluaciones desde aquí.",
      ),
      lista: texto(
        "Actividad del día",
        "Consulta las sesiones y actividades más recientes.",
      ),
    },
  ),
  "/dashboard/pacientes": vista(
    "Gestión de pacientes",
    "Administra los registros y la información clínica de tus pacientes.",
    ["header", "stats", "accion", "filtros", "lista", "modal"],
  ),
  "/dashboard/agenda": vista(
    "Agenda",
    "Organiza tus citas y consulta el calendario del equipo.",
    ["header", "accion", "tabs", "lista", "extra"],
  ),
  "/dashboard/sesiones": vista(
    "Sesiones",
    "Consulta, filtra y administra las sesiones registradas.",
    ["header", "stats", "accion", "filtros", "lista"],
  ),
  "/dashboard/ciclos": vista(
    "Ciclos terapéuticos",
    "Da seguimiento al progreso de los ciclos y sus sesiones.",
    ["header", "accion", "filtros", "lista", "extra"],
  ),
  "/dashboard/portal-familiar": vista(
    "Portal familiar",
    "Consulta la información compartida con las familias autorizadas.",
    ["header", "tabs", "extra", "lista"],
  ),
  "/dashboard/expedientes": vista(
    "Expedientes clínicos",
    "Accede a la información clínica organizada por paciente.",
    ["header", "busqueda", "lista"],
  ),
  "/dashboard/evaluaciones": vista(
    "Evaluaciones",
    "Administra evaluaciones y consulta sus resultados.",
    ["header", "stats", "accion", "filtros", "lista"],
  ),
  "/dashboard/planes": vista(
    "Planes terapéuticos",
    "Crea y revisa los planes que guían el trabajo terapéutico.",
    ["header", "accion", "filtros", "lista"],
  ),
  "/dashboard/escalas": vista(
    "Escalas",
    "Gestiona las escalas disponibles para evaluar el progreso.",
    ["header", "accion", "busqueda", "lista"],
  ),
  "/dashboard/informes": vista(
    "Informes",
    "Genera y consulta informes terapéuticos.",
    ["header", "stats", "accion", "lista"],
  ),
  "/dashboard/pagos": vista(
    "Pagos",
    "Registra pagos y consulta el estado financiero de tus atenciones.",
    ["header", "tabs", "stats", "accion", "filtros", "lista", "modal"],
  ),
  "/dashboard/gastos": vista(
    "Gastos",
    "Registra y controla los gastos del centro.",
    ["header", "stats", "accion", "filtros", "lista"],
  ),
  "/dashboard/inventario": vista(
    "Inventario",
    "Consulta y administra los recursos disponibles.",
    ["header", "stats", "accion", "filtros", "lista"],
  ),
  "/dashboard/analisis": vista(
    "Análisis",
    "Explora métricas y tendencias de la actividad del centro.",
    ["header", "accion", "stats", "lista"],
  ),
  "/dashboard/instituciones": vista(
    "Instituciones",
    "Administra instituciones y convenios relacionados.",
    ["header", "stats", "accion", "busqueda", "lista"],
  ),
  "/dashboard/blog": vista(
    "Blog",
    "Gestiona artículos y contenidos informativos.",
    ["header", "stats", "accion", "filtros", "lista"],
  ),
  "/dashboard/cursos": vista(
    "Cursos",
    "Explora los cursos disponibles y su contenido.",
    ["header", "stats", "accion", "busqueda", "lista"],
  ),
  "/dashboard/recursos": vista(
    "Recursos",
    "Organiza los recursos utilizados durante el trabajo terapéutico.",
    ["header", "accion", "filtros", "lista"],
  ),
  "/dashboard/marketing": vista(
    "Marketing",
    "Gestiona campañas, leads y métricas de marketing.",
    ["header", "tabs", "stats", "accion", "busqueda", "lista"],
  ),
  "/dashboard/usuarios": vista(
    "Usuarios",
    "Administra cuentas, datos y accesos al sistema.",
    ["header", "tabs", "accion", "filtros", "lista"],
  ),
  "/dashboard/roles": vista(
    "Roles y permisos",
    "Define los permisos que controlan el acceso a cada módulo.",
    ["header", "accion", "busqueda", "lista", "extra"],
  ),
  "/dashboard/formularios": vista(
    "Formularios",
    "Gestiona plantillas, asignaciones y respuestas.",
    ["header", "accion", "tabs", "lista", "modal"],
  ),
  "/dashboard/ajustes": vista(
    "Ajustes",
    "Configura las preferencias generales del sistema.",
    ["header", "tabs", "extra", "lista"],
  ),
  "/dashboard/mi-perfil": vista(
    "Mi perfil",
    "Revisa y actualiza tus datos personales.",
    ["header", "accion", "lista", "extra"],
  ),
};

const vistasDetalle: Record<string, ConfiguracionVista> = {
  "/dashboard/cursos/": vista(
    "Detalle del curso",
    "Consulta la información del curso y administra sus estudiantes.",
    ["header", "accion", "stats", "lista", "extra"],
    {
      accion: texto(
        "Inscribir estudiantes",
        "Usa este botón para añadir participantes al curso.",
      ),
      lista: texto(
        "Estudiantes inscritos",
        "Aquí se muestra la lista de participantes del curso.",
      ),
    },
  ),
  "/dashboard/expedientes/": vista(
    "Expediente del paciente",
    "Consulta la información clínica, análisis y ciclos del paciente.",
    ["header", "tabs", "lista", "extra"],
    {
      tabs: texto(
        "Secciones del expediente",
        "Cambia entre información general, análisis y ciclos.",
      ),
      lista: texto(
        "Información clínica",
        "La sección activa muestra el contenido del expediente.",
      ),
      extra: texto(
        "Historial y acciones",
        "Desde aquí puedes revisar sesiones y generar documentos.",
      ),
    },
  ),
};

const pasoDeAncla = (
  rol: RolAncla,
  configuracion: ConfiguracionVista,
): PasoOnboarding => {
  const contenido =
    configuracion.textos[rol] ||
    (rol === "header"
      ? texto(configuracion.titulo, configuracion.descripcion)
      : rol === "accion"
        ? texto(
            "Acción principal",
            "Usa esta acción para crear o iniciar un nuevo registro.",
          )
        : rol === "stats"
          ? texto(
              "Indicadores",
              "Estos indicadores resumen la información más importante de la vista.",
            )
          : rol === "busqueda" || rol === "filtros"
            ? texto(
                "Búsqueda y filtros",
                "Utiliza estos controles para encontrar información rápidamente.",
              )
            : rol === "tabs"
              ? texto(
                  "Secciones",
                  "Cambia entre las secciones disponibles de este módulo.",
                )
              : rol === "modal"
                ? texto(
                    "Formulario seguro",
                    "Explora los campos disponibles. El onboarding cerrará este formulario sin guardar cambios.",
                  )
                : texto(
                    "Información principal",
                    "Aquí se muestran los registros y acciones de esta vista.",
                  ));

  return {
    element:
      rol === "modal"
        ? '[data-onboarding-step-modal], [data-onboarding-modal], [role="dialog"][aria-modal="true"]'
        : `[data-onboarding-step-${rol}], [data-onboarding-${rol}]`,
    popover: {
      title: contenido.title,
      description: contenido.description,
      side: rol === "accion" || rol === "busqueda" ? "bottom" : "top",
      align: "start",
    },
    waitForElement: ["stats", "lista", "extra"].includes(rol)
      ? 3000
      : undefined,
    skipMissingElement: true,
    interaccion:
      rol === "accion" && configuracion.anclas.includes("modal")
        ? "click"
        : rol === "tabs"
          ? "click"
          : rol === "busqueda"
            ? "input"
            : rol === "filtros"
              ? "change"
              : undefined,
    data: {
      interaccion:
        rol === "accion" && configuracion.anclas.includes("modal")
          ? "click"
          : rol === "tabs"
            ? "click"
            : rol === "busqueda"
              ? "input"
              : rol === "filtros"
                ? "change"
                : undefined,
      rol,
    },
  };
};

const pasosParaVista = (
  configuracion: ConfiguracionVista,
  incluirNavegacion = false,
): PasoOnboarding[] => [
  ...(incluirNavegacion ? pasosNavegacion : []),
  ...configuracion.anclas.map((rol) => pasoDeAncla(rol, configuracion)),
];

export const obtenerPasosOnboarding = (
  pathname: string,
): PasoOnboarding[] | null => {
  const configuracion = vistas[pathname];
  if (configuracion) {
    return pasosParaVista(configuracion, pathname === "/dashboard");
  }

  const detalle = Object.keys(vistasDetalle).find((prefijo) =>
    pathname.startsWith(prefijo),
  );
  if (detalle) return pasosParaVista(vistasDetalle[detalle]);

  const rutaBase = Object.keys(vistas).find(
    (ruta) => ruta !== "/dashboard" && pathname.startsWith(`${ruta}/`),
  );
  return rutaBase ? pasosParaVista(vistas[rutaBase]) : null;
};
