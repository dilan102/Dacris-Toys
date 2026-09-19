"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function GoogleAdminSignIn() {
  const [errorMessage, setErrorMessage] = useState("");

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setErrorMessage("Falta configurar la clave pública de Supabase.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    });

    if (error) setErrorMessage("No fue posible iniciar sesión con Google.");
  }

  return (
    <div className="google-admin-sign-in">
      <button className="secondary-button outline" onClick={signInWithGoogle} type="button">
        Continuar con Google
      </button>
      {errorMessage ? <p className="form-status">{errorMessage}</p> : null}
    </div>
  );
}
