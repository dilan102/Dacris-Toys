"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register" | "phone" | "verify-phone";

export function CustomerAuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  function getClient() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage("Falta configurar la clave pública de Supabase.");
      return null;
    }

    return supabase;
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getClient();
    if (!supabase) return;

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

  async function signInWithGoogle() {
    const supabase = getClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/perfil`,
      },
    });

    if (error) setMessage("No fue posible iniciar sesión con Google.");
  }

  async function sendPhoneCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getClient();
    if (!supabase) return;

    const submittedPhone = String(new FormData(event.currentTarget).get("phone") ?? "").trim();
    const { error } = await supabase.auth.signInWithOtp({
      phone: submittedPhone,
      options: { data: { username: submittedPhone } },
    });

    if (error) {
      setMessage("No fue posible enviar el código. Revisa el número e inténtalo de nuevo.");
    } else {
      setPhone(submittedPhone);
      setMessage("Te enviamos un código por SMS.");
      setMode("verify-phone");
    }
  }

  async function verifyPhoneCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getClient();
    if (!supabase) return;

    const token = String(new FormData(event.currentTarget).get("token") ?? "").trim();
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });

    if (error) {
      setMessage("El código no es válido o venció.");
    } else {
      window.location.assign("/perfil");
    }
  }

  return (
    <article className="info-card login-card">
      <h2>{mode === "register" ? "Crear cuenta" : "Cuenta de cliente"}</h2>
      {mode === "phone" ? (
        <form className="checkout-form" onSubmit={sendPhoneCode}>
          <label>
            Teléfono
            <input autoComplete="tel" name="phone" placeholder="+573001234567" required type="tel" />
          </label>
          <button className="secondary-button filled" type="submit">Enviar código</button>
        </form>
      ) : mode === "verify-phone" ? (
        <form className="checkout-form" onSubmit={verifyPhoneCode}>
          <label>
            Código SMS
            <input autoComplete="one-time-code" inputMode="numeric" name="token" required />
          </label>
          <button className="secondary-button filled" type="submit">Verificar código</button>
        </form>
      ) : (
        <form className="checkout-form" onSubmit={handleEmailSubmit}>
          <label>
            Correo electrónico
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Contraseña
            <input
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              minLength={6}
              name="password"
              required
              type="password"
            />
          </label>
          <button className="secondary-button filled" type="submit">
            {mode === "register" ? "Crear cuenta" : "Entrar"}
          </button>
        </form>
      )}
      <div className="auth-method-links">
        {mode !== "login" ? <button onClick={() => setMode("login")} type="button">Entrar con correo</button> : null}
        {mode !== "register" ? <button onClick={() => setMode("register")} type="button">Crear cuenta</button> : null}
        {mode !== "phone" && mode !== "verify-phone" ? <button onClick={() => setMode("phone")} type="button">Entrar con teléfono</button> : null}
        <button onClick={signInWithGoogle} type="button">Continuar con Google</button>
      </div>
      {message ? <p className="form-status">{message}</p> : null}
    </article>
  );
}
