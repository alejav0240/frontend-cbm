# 1. Crear módulos principales
mkdir -p modules/{atencion,clinica,operaciones,comunidad,sistema}

# 2. Crear sub-módulos de Atención
mkdir -p modules/atencion/{dashboard,pacientes,agenda,sesiones,ciclos,portal-familiar}/{components,hooks,schemas,services,store,types,graphql}

# 3. Crear sub-módulos de Clínica
mkdir -p modules/clinica/{expedientes,evaluaciones,planes,escalas,informes}/{components,hooks,schemas,services,store,types,graphql}

# 4. Crear sub-módulos de Operaciones
mkdir -p modules/operaciones/{pagos,gastos,inventario,analisis,instituciones}/{components,hooks,schemas,services,store,types,graphql}

# 5. Crear sub-módulos de Comunidad
mkdir -p modules/comunidad/{blog,cursos,recursos,marketing}/{components,hooks,schemas,services,store,types,graphql}

# 6. Crear sub-módulos de Sistema
mkdir -p modules/sistema/{usuarios,roles,formularios,ajustes}/{components,hooks,schemas,services,store,types,graphql}

# 7. Crear shared y config
mkdir -p shared/{ui,lib/{apollo,react-hook-form,utils,permissions},hooks,types,constants}

# 8. Crear config
mkdir -p config

# 9. Crear estructura de app con grupos de rutas
mkdir -p app/\(dashboard\)/{atencion,clinica,operaciones,comunidad,sistema}