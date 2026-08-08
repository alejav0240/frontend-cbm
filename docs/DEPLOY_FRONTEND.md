# Despliegue del Frontend (Next.js) en VPS compartido

Guia paso a paso para desplegar el frontend de CBM en un servidor VPS con cPanel (sin acceso root/WHM).

## Requisitos previos

- SSH al servidor con usuario cPanel (`hmusicot`)
- Repositorio del frontend clonado
- Backend desplegado y funcionando en `api.musicoterapiabolivia.com`

## Datos del servidor

| Dato | Valor |
|------|-------|
| Host | `musicoterapiabolivia.com` |
| SSH | `ssh -i ~/.ssh/dev_device -p 22 hmusicot@musicoterapiabolivia.com` |
| Usuario | `hmusicot` |
| Frontend URL | `https://plataform.musicoterapiabolivia.com` |
| Backend API | `https://api.musicoterapiabolivia.com` |

## 1. Clonar el repositorio

```bash
ssh hmusicot@musicoterapiabolivia.com
git clone https://github.com/alejav0240/frontend-cbm.git /home/hmusicot/cbm-frontend
cd /home/hmusicot/cbm-frontend
```

## 2. Configurar variables de entorno

El archivo `.env.production` del repositorio **esta versionado en git** y solo contiene las variables publicas `NEXT_PUBLIC_*` (se resetea en cada deploy con `git reset --hard`, asi que NO se le agregan secretos):

```env
NEXT_PUBLIC_API_URL=https://api.musicoterapiabolivia.com
NEXT_PUBLIC_GRAPHQL_URI=https://api.musicoterapiabolivia.com/graphql/
```

> **Importante:** Las variables `NEXT_PUBLIC_*` se incrustan en el bundle del cliente durante el build. Cambiarlas requiere reconstruir.

### Secretos del servidor (R2 y OneDrive)

Las claves se inyectan en el entorno del proceso pm2 en el VPS (ver seccion 6), NO en `.env.production`. La primera vez crea `/home/hmusicot/cbm-frontend/.env.server` con los valores reales:

```env
R2_ACCOUNT_ID=tu_r2_account_id
R2_ACCESS_KEY_ID=tu_r2_access_key
R2_SECRET_ACCESS_KEY=tu_r2_secret_key
R2_BUCKET=cbm-plaform
R2_PUBLIC_BASE_URL=https://pub-xxx.r2.dev
ONEDRIVE_CLIENT_ID=tu_client_id
ONEDRIVE_CLIENT_SECRET=tu_client_secret
ONEDRIVE_SERVICE_KEY=tu_service_key
```

> **OneDrive (delegado, cuenta personal):** `ONEDRIVE_SERVICE_KEY` debe coincidir con la variable `ONEDRIVE_SERVICE_KEY` del `.env` del backend. La conexion se hace una sola vez entrando a `/api/onedrive/connect`, que redirige al login de Microsoft y guarda el refresh token encriptado en la BD del backend (`onedrive_connections`). `ONEDRIVE_TENANT_ID`, `ONEDRIVE_DRIVE_ID` y `ONEDRIVE_USER_ID` NO se usan para el flujo delegado con cuenta personal.

## 3. Habilitar output standalone

Editar `next.config.ts` para agregar `output: "standalone"`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "motion",
      "motion/react",
      "@apollo/client",
    ],
  },
};

export default nextConfig;
```

El modo standalone genera un bundle autocontenido que no necesita `node_modules` en produccion.

## 4. Instalar dependencias y compilar

```bash
cd /home/hmusicot/cbm-frontend
pnpm install --frozen-lockfile
pnpm build
```

El build genera la carpeta `.next/standalone/` con el servidor autocontenido.

## 5. Copiar archivos estaticos al standalone

```bash
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
```

> **Critico:** Sin estos archivos, las hojas de estilo, fuentes, imagenes y scripts no se sirven.

## 6. Iniciar con PM2

```bash
cd /home/hmusicot/cbm-frontend
set -a; source .env.server; set +a
pm2 start .next/standalone/server.js --name cbm-frontend --cwd /home/hmusicot/cbm-frontend --env production -- --port 3000
pm2 save
```

> `HOSTNAME=127.0.0.1`: Sin esta variable (definida en `.env.server`), Next.js se vincula a la IP externa del servidor (`149.56.131.206`), lo que impide que Apache pueda proxyear las peticiones via `127.0.0.1:3000`.
>
> pm2 conserva el entorno con el que arranco el proceso. Si cambias las claves en `.env.server`, hay que `pm2 delete cbm-frontend`, volver a hacer `set -a; source .env.server; set +a` y arrancar de nuevo (un simple `pm2 restart` no refresca las variables).

## 7. Configurar Apache proxy (.htaccess)

Crear/modificar `/home/hmusicot/public_html/plataform.musicoterapiabolivia.com/.htaccess`:

```apache
DirectoryIndex disabled

RewriteEngine On
RewriteCond %{REQUEST_URI} !^/\.well-known
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]

# BEGIN cPanel-generated php ini directives, do not edit
<IfModule php8_module>
   php_value error_log "/home/hmusicot/logs/php.error.log"
   php_flag log_errors On
</IfModule>
<IfModule lsapi_module>
   php_value error_log "/home/hmusicot/logs/php.error.log"
   php_flag log_errors On
</IfModule>
# END cPanel-generated php ini directives, do not edit

# php -- BEGIN cPanel-generated handler, do not edit
<IfModule mime_module>
  AddHandler application/x-httpd-ea-php82 .php .php8 .phtml
</IfModule>
# php -- END cPanel-generated handler, do not edit
```

## 8. Verificar despliegue

```bash
# Verificar que el frontend responde internamente
curl -s http://127.0.0.1:3000/ | head -5

# Verificar proxy via Apache
curl -s http://127.0.0.1:81/ -H "Host: plataform.musicoterapiabolivia.com" | head -5

# Verificar acceso externo
curl -sk https://plataform.musicoterapiabolivia.com/ | head -5
```

El HTML devuelto debe contener `<title>Centro Boliviano de Musicoterapia</title>`.

## 9. Comandos utiles

| Accion | Comando |
|--------|---------|
| Ver estado | `pm2 list` |
| Ver logs | `pm2 logs cbm-frontend --lines 50` |
| Reiniciar | `pm2 restart cbm-frontend` |
| Detener | `pm2 stop cbm-frontend` |
| Guardar estado | `pm2 save` |
| Rebuild completo | `cd /home/hmusicot/cbm-frontend && pnpm build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/ && pm2 restart cbm-frontend` |

## 10. Actualizar el frontend

Cuando haya cambios en el repositorio:

```bash
cd /home/hmusicot/cbm-frontend
git pull origin main
pnpm install --frozen-lockfile
pnpm build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/
pm2 restart cbm-frontend
pm2 save
```

> Si cambio `NEXT_PUBLIC_*` (archivo `.env.production` del repo), hay que hacer un rebuild completo. Si cambiaron los secretos del servidor (`R2_*`, `ONEDRIVE_*` en `.env.server`), editar ese archivo, luego `pm2 delete cbm-frontend` y arrancar de nuevo con `source .env.server` (pm2 restart conserva el entorno antiguo).

## 11. Arquitectura de red

```
Cliente (HTTPS:443)
  └─→ Nginx (:443) SSL termination
       └─→ Apache (:81)
            └─→ .htaccess (RewriteRule [P])
                 └─→ Next.js standalone (127.0.0.1:3000)
                      └─→ API: https://api.musicoterapiabolivia.com/graphql/
```

## 12. Estructura del build standalone

```
.next/standalone/
├── .env.production          # Variables de entorno (incrustadas en build)
├── .next/
│   ├── static/              # CSS, JS chunks, fuentes, imagenes (COPIAR)
│   ├── required-server-files.json
│   ├── routes-manifest.json
│   └── ...
├── public/                  # Archivos estaticos del root (COPIAR)
├── node_modules/            # Dependencias minimas del runtime
├── server.js                # Punto de entrada del servidor
└── package.json
```

## Solucion de problemas

### Frontend no responde en puerto 3000

```bash
# Verificar que PM2 esta corriendo
pm2 list

# Verificar que escucha en el puerto
ss -tlnp | grep 3000

# Verificar logs por errores
pm2 logs cbm-frontend --lines 20
```

### 502 Bad Gateway desde el dominio

1. Verificar que Next.js escucha en `127.0.0.1:3000` (no en la IP externa)
2. Verificar que el `.htaccess` tiene la regla `RewriteRule` correcta
3. Verificar que Apache tiene `mod_proxy` habilitado

### Frontend no conecta con la API

Verificar que `.env.production` tiene las URLs correctas y que se hizo rebuild despues de cambiarlas:

```bash
grep NEXT_PUBLIC /home/hmusicot/cbm-frontend/.env.production
```

### Estilos/scripts no se cargan (404)

Los archivos estaticos no se copiaron al standalone:

```bash
cp -r /home/hmusicot/cbm-frontend/.next/static /home/hmusicot/cbm-frontend/.next/standalone/.next/
cp -r /home/hmusicot/cbm-frontend/public /home/hmusicot/cbm-frontend/.next/standalone/
pm2 restart cbm-frontend
```

### PM2 no sobrevive a reinicios

Ejecutar el comando de `pm2 startup` con sudo (requiere acceso de administrador).

### SSL no funciona

Usar acme.sh con el deploy hook de cPanel:

```bash
~/.acme.sh/acme.sh --deploy --domain plataform.musicoterapiabolivia.com --deploy-hook cpanel_uapi
```

> **Nota:** El UAPI de cPanel requiere que el cert este codificado en URL-encoding. Intentar pasar PEM directamente falla. acme.sh maneja esto automaticamente via su deploy hook.
