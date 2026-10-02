"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register" | "recovery";

export function CustomerAuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [isGooglePending, setIsGooglePending] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"to-register" | "to-login" | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Falta configurar la clave pública de Supabase.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (mode === "register") {
      const passwordConfirmation = String(formData.get("passwordConfirmation") ?? "");
      const firstName = String(formData.get("firstName") ?? "").trim();
      const lastName = String(formData.get("lastName") ?? "").trim();
      const phone = String(formData.get("phone") ?? "").trim();
      const city = String(formData.get("city") ?? "").trim();

      if (password !== passwordConfirmation) {
        setMessage("Las contraseñas no coinciden.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: email.toLowerCase(),
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            phone,
            city,
            terms_accepted_at: new Date().toISOString(),
            terms_version: "2026-10-01",
            privacy_policy_version: "2026-10-01",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
        },
      });

      if (error) {
        setMessage("No fue posible crear la cuenta. Revisa los datos e inténtalo de nuevo.");
      } else if (data.session) {
        window.location.assign("/perfil");
      } else {
        setMessage("Revisa tu correo para confirmar la cuenta antes de ingresar.");
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("Correo o contraseña incorrectos.");
    } else {
      window.location.assign("/perfil");
    }
  }

  function changeMode(nextMode: AuthMode) {
    if (nextMode === mode) return;
    setMessage("");
    setTransitionDirection(nextMode === "register" ? "to-register" : "to-login");
    setMode(nextMode);
  }

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Falta configurar la clave pública de Supabase.");
      return;
    }

    setIsGooglePending(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
      },
    });

    if (error) {
      setMessage("No fue posible iniciar sesión con Google. Inténtalo de nuevo.");
      setIsGooglePending(false);
    }
  }

  async function sendPasswordRecovery(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Falta configurar la clave pública de Supabase.");
      return;
    }

    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/restablecer-contrasena`,
    });

    setMessage(
      error
        ? "No fue posible enviar el correo de recuperación. Inténtalo más tarde."
        : "Si existe una cuenta con ese correo, recibirás las instrucciones para restablecer tu contraseña.",
    );
  }

  const registering = mode === "register";
  const recovering = mode === "recovery";

  return (
    <section className="profile-auth-stage" aria-label="Acceso a tu cuenta">
      <article className={`profile-auth-card ${registering ? "is-registering" : ""} ${transitionDirection ? `auth-sweep-${transitionDirection}` : ""}`}>
        <Image
          className="profile-auth-logo"
          src="/Dacris-Logo.png"
          alt="Dacri's Toys"
          width={1536}
          height={1024}
          loading="eager"
        />
        <div key={mode} className="profile-auth-content">
          <p className="profile-auth-eyebrow">Dacri&apos;s Toys</p>
          <h1>{registering ? "Crea tu cuenta" : recovering ? "Recupera tu acceso" : "Inicia sesión"}</h1>
          <p>{registering ? "Crea tu perfil para comprar más rápido, guardar favoritos y seguir tus pedidos." : recovering ? "Escribe tu correo y te enviaremos un enlace seguro para crear una nueva contraseña." : "Ingresa para ver tus pedidos y favoritos."}</p>
          {recovering ? (
            <form className="checkout-form profile-auth-form" onSubmit={sendPasswordRecovery}>
              <label>
                Correo electrónico
                <input autoComplete="email" name="email" required type="email" />
              </label>
              <button className="primary-button wide" type="submit">
                Enviar enlace <Icon name="arrow" />
              </button>
            </form>
          ) : <form className="checkout-form profile-auth-form" onSubmit={handleSubmit}>
            {registering ? (
              <div className="profile-auth-fields">
                <label>
                  Nombre
                  <input autoComplete="given-name" name="firstName" required />
                </label>
                <label>
                  Apellidos
                  <input autoComplete="family-name" name="lastName" required />
                </label>
                <label>
                  Celular
                  <input autoComplete="tel" inputMode="tel" name="phone" placeholder="300 123 4567" required type="tel" />
                </label>
                <label>
                  Ciudad
                  <input autoComplete="address-level2" name="city" placeholder="Bogotá" required />
                </label>
              </div>
            ) : null}
            <label>
              Correo electrónico
              <input autoComplete="email" name="email" required type="email" />
            </label>
            <label>
              Contraseña
              <input autoComplete={registering ? "new-password" : "current-password"} minLength={registering ? 12 : 1} name="password" required type="password" />
            </label>
            {registering ? (
              <label>
                Confirma tu contraseña
                <input autoComplete="new-password" minLength={12} name="passwordConfirmation" required type="password" />
              </label>
            ) : null}
            {registering ? (
              <label className="profile-auth-consent">
                <input name="terms" required type="checkbox" />
                <span>
                  Acepto los <Link href="/terminos">términos</Link> y la <Link href="/privacidad">política de privacidad</Link>.
                </span>
              </label>
            ) : null}
            <button className="primary-button wide" type="submit">
              {registering ? "Crear cuenta" : "Entrar"} <Icon name="arrow" />
            </button>
          </form>}
          {message ? <p className="form-status">{message}</p> : null}
          {!recovering ? (
            <>
              <div className="profile-auth-divider"><span>o</span></div>
              <button className="profile-google-button" disabled={isGooglePending} onClick={signInWithGoogle} type="button">
                <span aria-hidden="true">G</span>
                {isGooglePending ? "Redirigiendo a Google..." : "Continuar con Google"}
              </button>
            </>
          ) : null}
          <p className="profile-auth-switch">
            {recovering ? <>¿Ya recuerdas tu contraseña? <button onClick={() => changeMode("login")} type="button">Inicia sesión</button></> : <>{registering ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}<button onClick={() => changeMode(registering ? "login" : "register")} type="button">{registering ? "Inicia sesión" : "Regístrate"}</button></>}
          </p>
          {!registering && !recovering ? <button className="profile-auth-recovery" onClick={() => changeMode("recovery")} type="button">¿Olvidaste tu contraseña?</button> : null}
        </div>
      </article>
    </section>
  );
}
