"use client";

import { FormEvent, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

export function CustomerAuthPanel() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username: email.toLowerCase() },
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
    setMessage("");
    setMode(nextMode);
  }

  const registering = mode === "register";

  return (
    <section className="profile-auth-stage" aria-label="Acceso a tu cuenta">
      <article className={`profile-auth-card ${registering ? "is-registering" : ""}`}>
        <div className="profile-auth-icon" aria-hidden="true">
          <Icon name={registering ? "user" : "lock"} />
        </div>
        <div key={mode} className="profile-auth-content">
          <p className="profile-auth-eyebrow">Dacri&apos;s Toys</p>
          <h1>{registering ? "Crea tu cuenta" : "Inicia sesión"}</h1>
          <p>{registering ? "Regístrate para guardar tus favoritos y consultar tus pedidos." : "Ingresa para ver tus pedidos y favoritos."}</p>
          <form className="checkout-form profile-auth-form" onSubmit={handleSubmit}>
            <label>
              Correo electrónico
              <input autoComplete="email" name="email" required type="email" />
            </label>
            <label>
              Contraseña
              <input autoComplete={registering ? "new-password" : "current-password"} minLength={6} name="password" required type="password" />
            </label>
            <button className="primary-button wide" type="submit">
              {registering ? "Crear cuenta" : "Entrar"} <Icon name="arrow" />
            </button>
          </form>
          {message ? <p className="form-status">{message}</p> : null}
          <p className="profile-auth-switch">
            {registering ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}
            <button onClick={() => changeMode(registering ? "login" : "register")} type="button">
              {registering ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </div>
      </article>
    </section>
  );
}
