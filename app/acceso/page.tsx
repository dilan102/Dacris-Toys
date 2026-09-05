import { redirect } from "next/navigation";
import { loginAction, registerAction } from "@/app/perfil/actions";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";
import { getSessionUser } from "@/lib/auth";

type AccessPageProps = {
  searchParams: Promise<{ estado?: string }>;
};

const statusMessages: Record<string, string> = {
  "admin-requerido": "Inicia sesión como administrador para entrar al panel.",
  "faltan-datos": "Escribe usuario y contraseña.",
  "login-invalido": "Usuario o contraseña incorrectos.",
  "registro-corto": "El usuario debe tener 3 caracteres y la contraseña mínimo 6.",
  "usuario-existe": "Ese usuario ya existe. Prueba iniciar sesión.",
  "db-error": "No se pudo conectar con la base de datos. Revisa las tablas de Supabase.",
};

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const session = await getSessionUser();
  const { estado } = await searchParams;
  const statusMessage = estado ? statusMessages[estado] : null;

  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/perfil");
  }

  return (
    <main className="site-shell inner-page">
      <AppHeader title="Acceso" backHref="/perfil" />
      <section className="content-wrap profile-layout">
        <div className="page-intro">
          <h1>Entrar a Dacri&apos;s Toys</h1>
          <p>Usa tu usuario y contraseña para continuar.</p>
        </div>

        {statusMessage ? <p className="form-status">{statusMessage}</p> : null}

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
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
