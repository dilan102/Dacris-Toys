import type { Metadata } from "next";
import { AppHeader } from "@/components/ui/app-header";
import { BottomNav } from "@/components/ui/bottom-nav";
import { ResetPasswordForm } from "@/app/restablecer-contrasena/reset-password-form";

export const metadata: Metadata = {
  title: "Restablecer contraseña | Dacri's Toys",
};

export default function ResetPasswordPage() {
  return (
    <main className="site-shell inner-page">
      <AppHeader title="Restablecer contraseña" backHref="/perfil" />
      <section className="content-wrap profile-layout">
        <div className="page-intro">
          <h1>Crea una nueva contraseña</h1>
          <p>Usa una contraseña larga y única para proteger tu cuenta.</p>
        </div>
        <ResetPasswordForm />
      </section>
      <BottomNav active="perfil" alwaysVisible />
    </main>
  );
}
