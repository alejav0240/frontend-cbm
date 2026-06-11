# Estructura del Proyecto (Feature-Sliced Design)

```text
frontend/
├── app/                        # Rutas y Layouts (App Router)
│   ├── (dashboard)/            # Grupo de rutas protegidas
│   │   ├── layout.tsx          # Layout con Sidebar/Topbar
│   │   ├── page.tsx            # Dashboard Overview
│   │   ├── pacientes/          # /dashboard/pacientes
│   │   ├── pagos/              # /dashboard/pagos
│   │   └── ...                 # Demás rutas migradas
│   ├── login/                  # Página de Login
│   ├── globals.css             # Tailwind & Global styles
│   └── layout.tsx              # Root Layout (MainProvider)
│
├── views/                      # Capa de composición de páginas
│   ├── dashboard/              # Composición de la vista Overview
│   ├── pacientes/              # Composición de la vista Pacientes
│   └── ...
│
├── widgets/                    # Bloques complejos autónomos
│   ├── navegacion/             # Sidebar y Topbar
│   ├── tabla-pacientes/        # Tabla interactiva
│   ├── dashboard-metricas/     # Tarjetas de KPIs
│   └── ...
│
├── features/                   # Lógica de interacción de usuario
│   ├── gestion-paciente/       # Formularios de alta/edición
│   ├── filtrar-pacientes/      # Lógica de búsqueda
│   ├── sesion-en-progreso/     # Temporizadores y grabación
│   └── ...
│
├── entities/                   # Lógica de dominio (Core)
│   ├── paciente/               # Dominio Paciente
│   │   ├── api/                # Hooks de Apollo
│   │   ├── model/              # Tipos, Zod schemas, DTOs
│   │   ├── lib/                # Exportadores PDF/Excel
│   │   └── ui/                 # Componentes visuales básicos
│   ├── sesion/
│   ├── pago/
│   └── ...
│
├── shared/                     # Recursos transversales
│   ├── api/                    # Apollo Client y Auth centralizado
│   ├── ui/                     # UI Kit (Botones, Modales, Inputs)
│   ├── model/                  # Stores Zustand (UI, Auth)
│   ├── lib/                    # Utils, Hooks globales, Permisos
│   └── data/                   # Seed data, configuraciones estáticas
│
├── public/                     # Imágenes y activos estáticos
├── docs/                       # Documentación del sistema
├── package.json
└── tsconfig.json
```
