"use client";

import React, { Suspense } from "react";
import { useDashboardStore } from "@/shared/store/dashboardStore";

// ─── Lazy imports — each view compiles only when first navigated to ───────────
const DashboardView    = React.lazy(() => import("@/modules/atencion/dashboard/page").then(m => ({ default: m.DashboardView })));
const PacientesView    = React.lazy(() => import("@/modules/atencion/pacientes/page").then(m => ({ default: m.PacientesView })));
const AgendaView       = React.lazy(() => import("@/modules/atencion/agenda/page").then(m => ({ default: m.AgendaView })));
const SesionesView     = React.lazy(() => import("@/modules/atencion/sesiones/page").then(m => ({ default: m.SesionesView })));
const CiclosView       = React.lazy(() => import("@/modules/atencion/ciclos/page").then(m => ({ default: m.CiclosView })));
const PortalFamiliarView = React.lazy(() => import("@/modules/atencion/portal-familiar/page").then(m => ({ default: m.PortalFamiliarView })));

const ExpedientesView  = React.lazy(() => import("@/modules/clinica/expedientes/page").then(m => ({ default: m.ExpedientesView })));
const EvaluacionesView = React.lazy(() => import("@/modules/clinica/evaluaciones/page").then(m => ({ default: m.EvaluacionesView })));
const PlanesView       = React.lazy(() => import("@/modules/clinica/planes/page").then(m => ({ default: m.PlanesView })));
const EscalasView      = React.lazy(() => import("@/modules/clinica/escalas/page").then(m => ({ default: m.EscalasView })));
const InformesView     = React.lazy(() => import("@/modules/clinica/informes/page").then(m => ({ default: m.InformesView })));

const PagosView        = React.lazy(() => import("@/modules/operaciones/pagos/page").then(m => ({ default: m.PagosView })));
const GastosView       = React.lazy(() => import("@/modules/operaciones/gastos/page").then(m => ({ default: m.GastosView })));
const InventarioView   = React.lazy(() => import("@/modules/operaciones/inventario/page").then(m => ({ default: m.InventarioView })));
const AnalisisView     = React.lazy(() => import("@/modules/operaciones/analisis/page").then(m => ({ default: m.AnalisisView })));
const InstitucionesView = React.lazy(() => import("@/modules/operaciones/instituciones/page").then(m => ({ default: m.InstitucionesView })));

const BlogView         = React.lazy(() => import("@/modules/comunidad/blog/page").then(m => ({ default: m.BlogView })));
const CursosView       = React.lazy(() => import("@/modules/comunidad/cursos/page").then(m => ({ default: m.CursosView })));
const RecursosView     = React.lazy(() => import("@/modules/comunidad/recursos/page").then(m => ({ default: m.RecursosView })));
const MarketingView    = React.lazy(() => import("@/modules/comunidad/marketing/page").then(m => ({ default: m.MarketingView })));

const UsersView        = React.lazy(() => import("@/modules/sistema/usuarios/page").then(m => ({ default: m.UsersView })));
const RolesView        = React.lazy(() => import("@/modules/sistema/roles/page").then(m => ({ default: m.RolesView })));
const FormulariosView  = React.lazy(() => import("@/modules/sistema/formularios/page").then(m => ({ default: m.FormulariosView })));
const AjustesView      = React.lazy(() => import("@/modules/sistema/ajustes/page").then(m => ({ default: m.AjustesView })));

function RouterContent() {
    const { currentPage } = useDashboardStore();

    switch (currentPage) {
        case "overview":        return <DashboardView />;
        case "pacientes":       return <PacientesView />;
        case "agenda":          return <AgendaView />;
        case "sesiones":        return <SesionesView />;
        case "ciclos":          return <CiclosView />;
        case "portal-familiar": return <PortalFamiliarView />;

        case "expedientes":     return <ExpedientesView />;
        case "evaluaciones":    return <EvaluacionesView />;
        case "planes":          return <PlanesView />;
        case "escalas":         return <EscalasView />;
        case "informes":        return <InformesView />;

        case "pagos":           return <PagosView />;
        case "gastos":          return <GastosView />;
        case "inventario":      return <InventarioView />;
        case "analisis":        return <AnalisisView />;
        case "instituciones":   return <InstitucionesView />;

        case "blog":            return <BlogView />;
        case "cursos":          return <CursosView />;
        case "recursos":        return <RecursosView />;
        case "marketing":       return <MarketingView />;

        case "users":           return <UsersView />;
        case "roles":           return <RolesView />;
        case "formularios":     return <FormulariosView />;
        case "ajustes":         return <AjustesView />;

        default:                return <DashboardView />;
    }
}

export function DashboardRouter() {
    return (
        <Suspense fallback={null}>
            <RouterContent />
        </Suspense>
    );
}
