import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Icon } from "@/components/ui/icon";

export default function ProfilePage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Perfil" />
      <section className="content-wrap profile-layout">
        <div className="page-intro">
          <h1>Tu perfil</h1>
          <p>Inicia sesión para guardar pedidos y datos de entrega.</p>
        </div>

        <article className="info-card login-card">
          <div className="soft-icon heart">
            <Icon name="user" />
          </div>
          <h2>Entrar a Dacri&apos;s Toys</h2>
          <p>Más adelante se conectará con Supabase Auth usando Google o teléfono.</p>
          <div className="login-actions">
            <button className="secondary-button filled">Continuar con Google</button>
            <button className="secondary-button outline">Continuar con teléfono</button>
          </div>
        </article>

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

        <Link className="admin-link" href="/admin">
          Entrar al panel administrativo
        </Link>
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
