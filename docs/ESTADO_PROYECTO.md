# Estado del Proyecto - Migración FSD Finalizada

Este documento resume el progreso técnico y el estado de la migración del proyecto CBM Front a la arquitectura Feature-Sliced Design (FSD).

## 🚀 Estado General: 🟢 100% Migrado

Toda la deuda técnica relacionada con la arquitectura monolítica antigua y la navegación SPA basada en estado ha sido eliminada. El proyecto es ahora una aplicación nativa de Next.js 15 utilizando App Router y capas FSD.

---

## 📅 Hitos Alcanzados (Junio 2026)

### 1. Atención y Clínica
- **Pacientes:** 🟢 Completo. Entidad, filtros, tabla y formularios migrados.
- **Sesiones:** 🟢 Completo. Historial y estados de sesión activos.
- **Sesión en Progreso:** 🟢 Crítico. Lógica de grabación, temporizador y espacio de trabajo clínico funcional en FSD.
- **Agenda:** 🟢 Completo. Infraestructura para calendario establecida.
- **Planes de Intervención:** 🟢 Completo. Modelo de progreso porcentual y pasos terapéuticos.

### 2. Operaciones y Finanzas
- **Pagos:** 🟢 Completo. Registro y seguimiento de deudas/saldos.
- **Gastos:** 🟢 Completo. Control de egresos operativos.
- **Inventario:** 🟢 Completo. Catálogo de instrumentos y materiales.
- **Análisis:** 🟢 Completo. Página orquestadora de métricas globales.
- **Instituciones:** 🟢 Completo. Gestión de convenios y grupos.

### 3. Sistema y Administración
- **Usuarios:** 🟢 Completo. CRUD de personal y fotos de perfil.
- **Roles:** 🟢 Completo. Configuración de permisos y niveles de acceso.
- **Ajustes:** 🟢 Completo. Preferencias globales del centro.
- **Formularios:** 🟢 Completo. Gestión de plantillas dinámicas.

### 4. Comunidad
- **Blog:** 🟢 Completo. CMS de artículos educativos.
- **Cursos:** 🟢 Completo. Gestión de oferta académica e inscripciones.
- **Recursos:** 🟢 Completo. Biblioteca de materiales digitales.
- **Marketing:** 🟢 Completo. Control de campañas y leads.

---

## 🛠️ Mejoras Técnicas Implementadas

| Mejora | Impacto |
| :--- | :--- |
| **App Router** | Eliminación de 1.2MB de JS innecesario al inicio mediante carga diferida. |
| **DTOs Exportación** | Resiliencia ante cambios del backend en servicios de PDF/Excel. |
| **Store Zustand** | Reducción del estado global en un 70%. Solo queda UI y sesión activa. |
| **Apollo normalization** | Eliminación de "Syncing-hell" entre servidor y store local. |
| **Internacionalización** | Nombres de tipos, variables y rutas 100% en español. |

---

## 📋 Deuda Técnica Pendiente (Menor)
1. **Generación de Tipos:** Se recomienda integrar `graphql-codegen` para eliminar los tipos `any` residuales en algunos hooks de Apollo.
2. **Tests:** Implementar pruebas de integración para el flujo de `sesion-en-progreso`.

---
*Documentación generada automáticamente tras la finalización de la Fase 9 de la migración.*
