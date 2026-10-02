"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmation = String(formData.get("confirmation") ?? "");

    if (password !== confirmation) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Falta configurar la clave pública de Supabase.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage("El enlace ya no es válido o venció. Solicita uno nuevo.");
      setIsSubmitting(false);
      return;
    }

    window.location.assign("/perfil?estado=contrasena-actualizada");
  }

  return (
    <form className="checkout-form info-card login-card" onSubmit={handleSubmit}>
      <label>
        Nueva contraseña
        <input autoComplete="new-password" minLength={12} name="password" required type="password" />
      </label>
      <label>
        Confirma la nueva contraseña
        <input autoComplete="new-password" minLength={12} name="confirmation" required type="password" />
      </label>
      <button className="primary-button wide" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Actualizando..." : "Actualizar contraseña"}
      </button>
      {message ? <p className="form-status">{message}</p> : null}
    </form>
  );
}
