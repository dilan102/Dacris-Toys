import Link from "next/link";
import { loginAction, logoutAction, registerAction } from "@/app/perfil/actions";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { getSessionUser } from "@/lib/auth";

type ProfilePageProps = {
  searchParams: Promise<{ estado?: string }>;
};

const statusMessages: Record<string, string> = {
  "admin-requerido": "Inicia sesión como administrador para entrar al panel.",
  "cuenta-creada": "Cuenta creada correctamente.",
  "faltan-datos": "Escribe usuario y contraseña.",
  "login-invalido": "Usuario o contraseña incorrectos.",
  "registro-corto": "El usuario debe tener 3 caracteres y la contraseña mínimo 6.",
  "usuario-existe": "Ese usuario ya existe. Prueba iniciar sesión.",
  "db-error": "No se pudo conectar con la base de datos. Revisa las tablas de Supabase.",
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await getSessionUser();
  const { estado } = await searchParams;
  const statusMessage = estado ? statusMessages[estado] : null;

  return (
    <main className="site-shell inner-page">
      <AppHeader title="Perfil" />
      <section className="content-wrap profile-layout">
        <div className="page-intro">
          <h1>Tu perfil</h1>
          <p>Inicia sesión para guardar pedidos y datos de entrega.</p>
        </div>

        {statusMessage ? <p className="form-status">{statusMessage}</p> : null}

        {session ? (
          <article className="info-card login-card">
            <div className="soft-icon heart">
              <Icon name="user" />
            </div>
            <h2>{session.username}</h2>
            <p>{session.role === "admin" ? "Modo administrador activo." : "Cuenta de cliente activa."}</p>
            <form action={logoutAction} className="login-actions">
              {session.role === "admin" ? (
                <Link className="secondary-button filled" href="/admin">
                  Panel administrativo
                </Link>
              ) : null}
              <button className="secondary-button outline" type="submit">
                Cerrar sesión
              </button>
            </form>
          </article>
        ) : (
          <section className="auth-grid">
            <article className="info-card login-card">
              <div className="soft-icon heart">
                <Icon name="user" />
              </div>
              <h2>Iniciar sesión</h2>
              <form className="checkout-form" action={loginAction}>
                <label>
                  Usuario
                  <input name="username" autoComplete="username" required />
                </label>
                <label>
                  Contraseña
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </label>
                <button className="secondary-button filled" type="submit">
                  Entrar
                </button>
              </form>
            </article>

            <article className="info-card login-card">
              <div className="soft-icon">
                <Icon name="badge" />
              </div>
              <h2>Crear cuenta</h2>
              <form className="checkout-form" action={registerAction}>
                <label>
                  Usuario
                  <input name="username" autoComplete="username" required minLength={3} />
                </label>
                <label>
                  Contraseña
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </label>
                <button className="secondary-button outline" type="submit">
                  Crear cuenta
                </button>
              </form>
            </article>
          </section>
        )}

        <section className="profile-grid">
          <article className="info-card profile-box">
            <Icon name="box" />
            <h2>Pedidos</h2>
            <p>Aquí aparecerá el historial cuando Supabase esté conectado.</p>
          </article>
          <article className="info-card profile-box">
            <Icon name="truck" />
            <h2>Direcciones</h2>
            <p>Guarda una dirección frecuente para comprar más rápido.</p>
          </article>
        </section>

        {!session || session.role === "admin" ? (
          <Link className="admin-link" href="/admin">
            Entrar al panel administrativo
          </Link>
        ) : null}
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
