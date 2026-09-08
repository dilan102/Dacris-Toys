# Activar administración y pagos

Esta guía distingue entre valores públicos y secretos. Nunca copies claves secretas en GitHub, en mensajes o en archivos que vayas a subir.

## 1. Preparar Supabase

1. Abre tu proyecto en [Supabase](https://supabase.com/dashboard).
2. Ve a **SQL Editor** → **New query**.
3. Abre el archivo `supabase-schema.sql` de este proyecto, copia todo su contenido y ejecútalo con **Run**.
4. Confirma que aparecen las tablas `products`, `app_users`, `admin_users`, `login_attempts`, `orders` y `order_items` en **Table Editor**.

El SQL activa las reglas de seguridad. No agregues políticas de `insert`, `update`, `delete` o `select` para `anon` en `admin_users`, `app_users`, `orders` u `order_items`.

## 2. Crear el primer administrador

En tu computador, dentro de la carpeta del proyecto, instala las dependencias si aún no lo hiciste:

```bash
npm install
```

Después ejecuta el generador. La contraseña se pregunta de forma privada y no queda escrita en el comando:

```bash
node scripts/create-admin.mjs
```

Escribe un usuario, una contraseña de mínimo 12 caracteres y el rol `owner`. El programa imprimirá una instrucción SQL. Copia esa instrucción completa, pégala en **Supabase → SQL Editor** y pulsa **Run**.

`owner` puede crear, editar y borrar productos. `staff` puede crear y editar, pero no borrar.

## 3. Variables locales para desarrollo

Crea un archivo `.env.local` —no lo subas a Git— con estas tres variables:

```env
NEXT_PUBLIC_SUPABASE_URL=la-url-de-tu-proyecto-supabase
SUPABASE_SERVICE_ROLE_KEY=la-clave-service_role-de-supabase
AUTH_SESSION_SECRET=un-secreto-largo-generado-con-openssl
```

Para generar el secreto de sesión ejecuta:

```bash
openssl rand -base64 48
```

Tu archivo `.env` actual tiene la URL y una clave pública. Déjalo fuera de Git, pero añade las dos variables privadas anteriores en `.env.local` para que el login y el panel funcionen localmente.

## 4. Variables en Vercel

En Vercel abre el proyecto → **Settings** → **Environment Variables**. Agrega las siguientes variables para **Production**, **Preview** y **Development**:

| Variable | Dónde obtenerla | Pública |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` | No |
| `AUTH_SESSION_SECRET` | El comando `openssl rand -base64 48` | No |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Panel Wompi → Desarrolladores | Sí |
| `WOMPI_INTEGRITY_SECRET` | Panel Wompi → Desarrolladores → secretos técnicos | No |
| `WOMPI_EVENTS_SECRET` | Panel Wompi → Desarrolladores → secretos técnicos | No |

Tras guardar las variables, ejecuta **Deployments** → último despliegue → **Redeploy**. Vercel no aplica variables nuevas a un despliegue que ya estaba creado.

## 5. Entrar y verificar el panel

1. Abre `https://tu-dominio/acceso`.
2. Inicia sesión con el usuario y contraseña creados en el paso 2.
3. Debes llegar a `/admin`; desde allí entra a **Productos**.
4. Con una cuenta `staff`, comprueba que puedes guardar un producto, pero no borrarlo.

Si `/perfil` carga como invitado, es normal cuando no hay sesión. Si el login muestra un error de base de datos, revisa primero que `SUPABASE_SERVICE_ROLE_KEY` esté configurada en Vercel y que ejecutaste el esquema completo.

## 6. Configurar Wompi cuando vayas a cobrar

Antes de habilitar pagos reales, configura en Wompi una URL de eventos apuntando a:

```text
https://tu-dominio/api/wompi/webhook
```

Usa primero las llaves de prueba de Wompi. El pedido solo pasa a `paid` después de que Wompi envía un webhook con firma válida; volver a la página después del widget no confirma ningún pago.
