import { redirect } from "next/navigation";
import { AccessSubmitButton } from "@/app/acceso/access-submit-button";
import { GoogleAdminSignIn } from "@/app/acceso/google-admin-sign-in";
import { adminLoginAction } from "@/app/perfil/actions";
import { AppHeader } from "@/components/ui/app-header";
import { Icon } from "@/components/ui/icon";
import { getSessionUser } from "@/lib/auth";

const statusMessages: Record<string, string> = {
  "admin-requerido": "Inicia sesión como administrador para entrar al panel.",
  "faltan-datos": "Escribe usuario y contraseña de administrador.",
  "login-invalido": "Usuario o contraseña de administrador incorrectos.",
  "demasiados-intentos": "Demasiados intentos. Espera 15 minutos antes de volver a intentarlo.",
  "db-error": "No se pudo conectar con la base de datos. Revisa las tablas de Supabase.",
  "google-error": "No fue posible completar el acceso con Google.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const session = await getSessionUser();
  const { estado } = await searchParams;
  if (session) redirect(session.role === "admin" ? "/admin" : "/");

  return (
    <main className="site-shell inner-page">
      <AppHeader title="Acceso administrativo" backHref="/" />
      <section className="content-wrap profile-layout">
        <div className="page-intro">
          <h1>Entrar a Dacri&apos;s Toys</h1>
          <p>Ingresa para administrar los productos del catálogo.</p>
        </div>
        {estado && statusMessages[estado] ? <p className="form-status">{statusMessages[estado]}</p> : null}
        <section className="auth-grid">
          <article className="info-card login-card">
            <div className="soft-icon heart"><Icon name="lock" /></div>
            <h2>Acceso de administrador</h2>
            <form className="checkout-form" action={adminLoginAction}>
              <label>Usuario<input name="username" autoComplete="username" required /></label>
              <label>Contraseña<input name="password" type="password" autoComplete="current-password" required /></label>
              <AccessSubmitButton variant="filled" pendingText="Entrando...">Entrar</AccessSubmitButton>
            </form>
          </article>
        </section>
        <article className="info-card login-card google-admin-card">
          <div className="soft-icon"><Icon name="lock" /></div>
          <h2>Administradores</h2>
          <p>Acceso con Google para las cuentas autorizadas por la tienda.</p>
          <GoogleAdminSignIn />
        </article>
      </section>
    </main>
  );
}
