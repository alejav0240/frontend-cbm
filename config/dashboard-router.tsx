// app-router.tsx

"use client";

import { useDashboardStore } from "@/shared/store/dashboardStore";
import { DashboardView, PacientesView, AgendaView, SesionesView, CiclosView, PortalFamiliarView } from "@/modules/atencion";
import { ExpedientesView, EvaluacionesView, PlanesView, EscalasView, InformesView } from "@/modules/clinica";
import { PagosView, GastosView, InventarioView, AnalisisView, InstitucionesView } from "@/modules/operaciones";
import { BlogView, CursosView, RecursosView, MarketingView } from "@/modules/comunidad";
import { UsersView, RolesView, FormulariosView, AjustesView } from "@/modules/sistema";

export function DashboardRouter() {
    const { currentPage } = useDashboardStore();

    console.log(currentPage);

    switch (currentPage) {
        // atencion
        case "overview":       return <DashboardView />;
        case "pacientes":      return <PacientesView />;
        case "agenda":         return <AgendaView />;
        case "sesiones":       return <SesionesView />;
        case "ciclos":         return <CiclosView />;
        case "portal-familiar": return <PortalFamiliarView />;

        // clinica
        case "expedientes":    return <ExpedientesView />;
        case "evaluaciones":   return <EvaluacionesView />;
        case "planes":         return <PlanesView />;
        case "escalas":        return <EscalasView />;
        case "informes":       return <InformesView />;

        // operaciones
        case "pagos":          return <PagosView />;
        case "gastos":         return <GastosView />;
        case "inventario":     return <InventarioView />;
        case "analisis":       return <AnalisisView />;
        case "instituciones":  return <InstitucionesView />;

        // comunidad
        case "blog":           return <BlogView />;
        case "cursos":         return <CursosView />;
        case "recursos":       return <RecursosView />;
        case "marketing":      return <MarketingView />;

        // sistema
        case "users":          return <UsersView />;
        case "roles":          return <RolesView />;
        case "formularios":    return <FormulariosView />;
        case "ajustes":        return <AjustesView />;

        default:               return <DashboardView />;
    }
}
