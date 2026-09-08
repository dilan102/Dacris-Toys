# Configuración segura

1. Copia `.env.example` a `.env.local` y completa las variables privadas en el panel de Vercel, nunca en el repositorio.
2. Ejecuta `supabase-schema.sql` en el editor SQL de Supabase.
3. Después de instalar las dependencias, genera una contraseña única y su hash bcrypt en tu equipo:

```bash
node -e "import('bcryptjs').then(({default:bcrypt}) => bcrypt.hash(process.env.DACRIS_ADMIN_PASSWORD, 12).then(console.log))"
```

4. Usa el hash resultante una única vez en Supabase (sustituye los valores):

```sql
insert into public.admin_users (username, password_hash, role)
values ('tu-usuario', 'HASH_BCRYPT_GENERADO', 'owner');
```

No hay una contraseña inicial publicada ni guardada en el código: así nadie puede entrar con una clave conocida. Conserva la contraseña en un gestor de contraseñas y cámbiala si sospechas que fue expuesta.
