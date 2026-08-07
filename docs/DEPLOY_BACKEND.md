# Despliegue del Backend (Django) en VPS compartido

Guia paso a paso para desplegar el backend de CBM en un servidor VPS con cPanel (sin acceso root/WHM).

## Requisitos previos

- SSH al servidor con usuario cPanel (`hmusicot`)
- Repositorio del backend clonado
- PostgreSQL accesible en `localhost:5432`

## Datos del servidor

| Dato | Valor |
|------|-------|
| Host | `musicoterapiabolivia.com` |
| SSH | `ssh -i ~/.ssh/dev_device -p 22 hmusicot@musicoterapiabolivia.com` |
| Usuario | `hmusicot` |
| DB usuario | `hmusicot_user` |
| DB nombre | `hmusicot_cbm` |
| DB host | `localhost:5432` |

## 1. Clonar el repositorio

```bash
ssh hmusicot@musicoterapiabolivia.com
git clone git@github.com:alejav0240/backend-cbm.git /home/hmusicot/cbm-backend
cd /home/hmusicot/cbm-backend
```

## 2. Configurar entorno virtual e instalar dependencias

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## 3. Configurar variables de entorno

Crear `/home/hmusicot/cbm-backend/.env`:

```env
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,api.musicoterapiabolivia.com
DB=postgresql
DB_NAME=hmusicot_cbm
DB_USER=hmusicot_user
DB_PASS=1d3nt1d@d3s
DB_HOST=127.0.0.1
DB_PORT=5432
FRONTEND_ORIGINS=https://plataform.musicoterapiabolivia.com
JWT_EXPIRATION_MINUTES=60
JWT_REFRESH_DAYS=7
SECURE_SSL_REDIRECT=False
CSRF_COOKIE_SECURE=True
SESSION_COOKIE_SECURE=True
```

## 4. Ejecutar migraciones

```bash
cd /home/hmusicot/cbm-backend
source venv/bin/activate
python manage.py migrate
```

## 5. Configurar Gunicorn

Crear `/home/hmusicot/cbm-backend/run.sh`:

```bash
#!/bin/bash
cd /home/hmusicot/cbm-backend
source venv/bin/activate
exec gunicorn config.wsgi:application \
  --bind 127.0.0.1:8000 \
  --workers 4 \
  --timeout 120 \
  --access-logfile /home/hmusicot/cbm-backend/access.log \
  --error-logfile /home/hmusicot/cbm-backend/error.log
```

```bash
chmod +x /home/hmusicot/cbm-backend/run.sh
```

## 6. Iniciar con PM2

```bash
pm2 start /home/hmusicot/cbm-backend/run.sh --name cbm-backend
pm2 save
```

Para que PM2 sobreviva a reinicios del servidor:

```bash
sudo env PATH=$PATH:/home/hmusicot/.nvm/versions/node/v24.15.0/bin \
  /home/hmusicot/.nvm/versions/node/v24.15.0/lib/node_modules/pm2/bin/pm2 \
  startup systemd -u hmusicot --hp /home/hmusicot
pm2 save
```

## 7. Configurar Apache proxy (.htaccess)

Crear `/home/hmusicot/public_html/api.musicoterapiabolivia.com/.htaccess`:

```apache
DirectoryIndex disabled

RewriteEngine On
RewriteCond %{REQUEST_URI} !^/\.well-known
RewriteRule ^(.*)$ http://127.0.0.1:8000/$1 [P,L]

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

> **Nota:** La exclusion `RewriteCond %{REQUEST_URI} !^/\.well-known` es necesaria para que los certificados SSL de Let's Encrypt se validen correctamente sin ser proxyeados a Django.

## 8. Instalar certificado SSL

### Generar certificado con acme.sh

```bash
# Instalar acme.sh (si no esta instalado)
curl https://get.acme.sh | sh -s email=centrobolivianodemusicoterapia@gmail.com

# Generar certificado
~/.acme.sh/acme.sh --issue -d api.musicoterapiabolivia.com --standalone --ecc
```

### Instalar via cPanel UAPI

```bash
~/.acme.sh/acme.sh --deploy --domain api.musicoterapiabolivia.com --deploy-hook cpanel_uapi --ecc
```

> **Importante:** El deploy via UAPI funciona porque `acme.sh` codifica el certificado en URL-encoding antes de pasarlo al UAPI. Intentar pasar el PEM directamente al UAPI falla con "Invalid base64".

### Verificar

```bash
curl -sk https://api.musicoterapiabolivia.com/csrf/
# Deberia devolver: {"csrfToken":"..."}
```

## 9. Comandos utiles

| Accion | Comando |
|--------|---------|
| Ver estado | `pm2 list` |
| Ver logs | `pm2 logs cbm-backend --lines 50` |
| Reiniciar | `pm2 restart cbm-backend` |
| Detener | `pm2 stop cbm-backend` |
| Guardar estado | `pm2 save` |
| Migraciones | `cd /home/hmusicot/cbm-backend && source venv/bin/activate && python manage.py migrate` |

## 10. Arquitectura de red

```
Cliente (HTTPS:443)
  └─→ Nginx (:443) SSL termination
       └─→ Apache (:81)
            └─→ .htaccess (RewriteRule [P])
                 └─→ Gunicorn (127.0.0.1:8000)
                      └─→ Django + PostgreSQL
```

## Solucion de problemas

### CSRF 403 en GraphQL POST

El backend requiere un cookie CSRF valido. El cliente debe:
1. Hacer GET a `/csrf/` para obtener el token y la cookie
2. Enviar el header `X-CSRFToken` en cada mutation/subscription

### CORS errors

Verificar que `FRONTEND_ORIGINS` en `.env` incluya `https://plataform.musicoterapiabolivia.com` (sin `/` al final).

### PM2 no sobrevive a reinicios

Ejecutar el comando de `pm2 startup` con sudo (requiere acceso de administrador al servidor).

### Backend no responde externamente

1. Verificar que PM2 esta online: `pm2 list`
2. Verificar que Gunicorn escucha: `curl http://127.0.0.1:8000/csrf/`
3. Verificar que el proxy funciona: `curl http://127.0.0.1:81/csrf/` (via Apache)
4. Verificar SSL: `curl -sk https://api.musicoterapiabolivia.com/csrf/`
