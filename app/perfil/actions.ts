"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearSessionUser,
  registerCustomer,
  setSessionUser,
  type SessionUser,
  validateLogin,
} from "@/lib/auth";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function profileRedirect(status: string) {
  redirect(`/perfil?estado=${encodeURIComponent(status)}`);
}

export async function loginAction(formData: FormData) {
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  if (!username || !password) profileRedirect("faltan-datos");

  let session: SessionUser | null = null;

  try {
    session = await validateLogin(username, password);
  } catch {
    profileRedirect("db-error");
  }

  if (!session) profileRedirect("login-invalido");

  await setSessionUser(session);
  revalidatePath("/perfil");
  revalidatePath("/admin");
  redirect(session.role === "admin" ? "/admin" : "/perfil");
}

export async function registerAction(formData: FormData) {
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  if (username.length < 3 || password.length < 6) profileRedirect("registro-corto");

  try {
    await registerCustomer(username, password);
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    profileRedirect(message.includes("duplicate") ? "usuario-existe" : "db-error");
  }

  await setSessionUser({ username, role: "customer" });
  revalidatePath("/perfil");
  redirect("/perfil?estado=cuenta-creada");
}

export async function logoutAction() {
  await clearSessionUser();
  revalidatePath("/perfil");
  revalidatePath("/admin");
  redirect("/perfil");
}
