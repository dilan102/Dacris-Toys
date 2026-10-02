# Activar administración y pagos

Esta guía distingue entre valores públicos y secretos. Nunca copies claves secretas en GitHub, en mensajes o en archivos que vayas a subir.

## 1. Preparar Supabase

1. Abre tu proyecto en [Supabase](https://supabase.com/dashboard).
2. Ve a **SQL Editor** → **New query**.
3. Abre el archivo `supabase-schema.sql` de este proyecto, copia todo su contenido y ejecútalo con **Run**.
4. Confirma que aparecen las tablas `products`, `app_users`, `admin_users`, `admin_google_users`, `login_attempts`, `orders`, `order_items` y `favorites` en **Table Editor**.

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

## 3. Activar inicio de sesión con Google

1. En [Google Auth Platform](https://console.cloud.google.com/auth/overview), crea un cliente OAuth de tipo **Web application**. En **Authorized JavaScript origins** agrega el dominio de la tienda, por ejemplo `https://tu-dominio` y, para desarrollo, `http://localhost:3000`.
2. En **Authorized redirect URIs** de Google agrega exactamente la URL de callback que muestra **Supabase → Authentication → Providers → Google**. Normalmente es:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

3. En **Supabase → Authentication → Providers**, habilita **Google** y pega el Client ID y Client Secret creados en Google. Esas credenciales solo se guardan en los paneles de Google y Supabase; nunca en este repositorio.
4. En **Supabase → Authentication → URL Configuration**, define tu dominio público como **Site URL** y agrega estas Redirect URLs:

```text
http://localhost:3000/auth/callback
https://tu-dominio/auth/callback
http://localhost:3000/auth/callback?next=/restablecer-contrasena
https://tu-dominio/auth/callback?next=/restablecer-contrasena
```

Para producción usa las URLs exactas de tu dominio. La aplicación intercambia el código OAuth únicamente en `/auth/callback` y después envía al usuario a una ruta interna permitida.

## 4. Autorizar administradores con Google

En **SQL Editor**, autoriza únicamente los correos administrativos que correspondan. El `username` es el nombre que aparecerá en el panel y `role` puede ser `owner` o `staff`.

```sql
insert into public.admin_google_users (email, username, role)
values ('admin@tu-dominio.com', 'admin-google', 'owner');
```

Una cuenta de Google que no esté en esta tabla no puede entrar a `/admin`.

## 5. Reforzar autenticación antes de producción

En **Supabase → Authentication → Settings**, antes de publicar:

1. Mantén activa la confirmación de correo electrónico.
2. Define una contraseña mínima de **12 caracteres**, con mayúscula, minúscula, número y símbolo.
3. Activa la protección de contraseñas filtradas, si tu plan la incluye.
4. Activa CAPTCHA con Cloudflare Turnstile o hCaptcha para registro, inicio de sesión y recuperación.
5. Configura SMTP propio: el servicio de correo predeterminado de Supabase es solo para pruebas y tiene límites estrictos.
6. Revisa los límites de tasa de Auth y, para administradores, considera MFA.

La interfaz exige 12 caracteres al registrar o restablecer una contraseña, pero estas reglas del panel son las que las hacen obligatorias también para peticiones directas a Auth.

## 6. Variables locales para desarrollo

Crea un archivo `.env.local` —no lo subas a Git— con estas tres variables:

```env
NEXT_PUBLIC_SUPABASE_URL=la-url-de-tu-proyecto-supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=la-clave-publica-de-supabase
SUPABASE_SERVICE_ROLE_KEY=la-clave-service_role-de-supabase
AUTH_SESSION_SECRET=un-secreto-largo-generado-con-openssl
```

Para generar el secreto de sesión ejecuta:

```bash
openssl rand -base64 48
```

Tu archivo `.env` actual tiene la URL y una clave pública. Déjalo fuera de Git, pero añade las dos variables privadas anteriores en `.env.local` para que el login y el panel funcionen localmente.

## 7. Variables en Vercel

En Vercel abre el proyecto → **Settings** → **Environment Variables**. Agrega las siguientes variables para **Production**, **Preview** y **Development**:

| Variable | Dónde obtenerla | Pública |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL | Sí |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → Publishable key | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` | No |
| `AUTH_SESSION_SECRET` | El comando `openssl rand -base64 48` | No |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Panel Wompi → Desarrolladores | Sí |
| `WOMPI_INTEGRITY_SECRET` | Panel Wompi → Desarrolladores → secretos técnicos | No |
| `WOMPI_EVENTS_SECRET` | Panel Wompi → Desarrolladores → secretos técnicos | No |

Tras guardar las variables, ejecuta **Deployments** → último despliegue → **Redeploy**. Vercel no aplica variables nuevas a un despliegue que ya estaba creado.

## 8. Entrar y verificar el panel

1. Abre `https://tu-dominio/acceso`.
2. Inicia sesión con el usuario y contraseña creados en el paso 2.
3. Debes llegar a `/admin`; desde allí entra a **Productos**.
4. Con una cuenta `staff`, comprueba que puedes guardar un producto, pero no borrarlo.

Si `/perfil` carga como invitado, es normal cuando no hay sesión. Si el login muestra un error de base de datos, revisa primero que `SUPABASE_SERVICE_ROLE_KEY` esté configurada en Vercel y que ejecutaste el esquema completo.

## 9. Configurar Wompi cuando vayas a cobrar

Antes de habilitar pagos reales, configura en Wompi una URL de eventos apuntando a:

```text
https://tu-dominio/api/wompi/webhook
```

Usa primero las llaves de prueba de Wompi. El pedido solo pasa a `paid` después de que Wompi envía un webhook con firma válida; volver a la página después del widget no confirma ningún pago.
