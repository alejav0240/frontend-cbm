# Estructura de Archivos del Proyecto

```text
frontend/
├── app/                        # Rutas y Layouts (Next.js App Router)
│   ├── api/                    # Endpoints de API (Upload, etc.)
│   ├── dashboard/              # Vista principal del Dashboard
│   ├── equipo/                 # Gestión de equipo (Rutas)
│   ├── login/                  # Página de autenticación
│   ├── globals.css             # Estilos globales
│   └── layout.tsx              # Layout raíz
├── config/                     # Configuración de App
│   ├── providers/              # Providers (Apollo, Theme, etc.)
│   └── dashboard-router.tsx    # Router interno del dashboard
├── docs/                       # Documentación técnica
│   ├── ESTADO_PROYECTO.md      # Estado actual y arquitectura
│   └── PROJECT_TREE.md         # Este archivo (Árbol de archivos)
├── modules/                    # Módulos de Negocio (Dominios)
│   ├── atencion/               # Dominio de Atención
│   │   ├── pacientes/          # Gestión de Pacientes
│   │   │   ├── hooks/          # Hooks: usePatients, useCreatePatient, etc.
│   │   │   ├── components/     # Componentes: Forms, Tables
│   │   │   ├── graphql/        # Queries y Mutations
│   │   │   └── types/          # Definiciones TypeScript
│   │   ├── sesiones/           # Gestión de Sesiones
│   │   │   ├── hooks/          # Hooks: useSessions, useCreateSession, etc.
│   │   │   ├── components/     # Componentes: SessionForm, Stats
│   │   │   └── ...
│   │   └── agenda/             # Calendario y Citas
│   ├── clinica/                # Dominio Clínico (Planes, Expedientes)
│   ├── operaciones/            # Dominio de Operaciones (Pagos, Inventario)
│   │   └── pagos/              # Módulo de Pagos y Descuentos
│   │       ├── hooks/          # Hooks: usePayments, useCreatePayment, etc.
│   │       └── ...
│   └── sistema/                # Dominio de Sistema (Usuarios, Roles)
├── shared/                     # Recursos Compartidos
│   ├── ui/                     # Componentes de UI (Modales, Navbar, etc.)
│   ├── store/                  # Gestión de estado global (Zustand)
│   ├── lib/                    # Utilidades y configuración Apollo
│   ├── data/                   # Datos estáticos y semillas
│   └── types/                  # Tipos globales
├── public/                     # Activos estáticos (Imágenes, logos)
├── package.json                # Dependencias y scripts
├── tailwind.config.ts          # Configuración de Tailwind
└── tsconfig.json               # Configuración de TypeScript
```
