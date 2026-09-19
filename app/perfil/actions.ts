"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearSessionUser,
  clearLoginFailures,
  isLoginBlocked,
  recordLoginFailure,
  setSessionUser,
  type SessionUser,
  validateAdminLogin,
} from "@/lib/auth";

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function profileRedirect(status: string): never {
  redirect(`/acceso?estado=${encodeURIComponent(status)}`);
}

export async function adminLoginAction(formData: FormData) {
  const username = getString(formData, "username");
  const password = getString(formData, "password");

  if (!username || !password) profileRedirect("faltan-datos");
  if (await isLoginBlocked(username)) profileRedirect("demasiados-intentos");

  let session: SessionUser | null = null;

  try {
    session = await validateAdminLogin(username, password);
  } catch {
    profileRedirect("db-error");
  }

  if (!session) {
    await recordLoginFailure(username);
    profileRedirect("login-invalido");
  }

  await clearLoginFailures(username);
  await setSessionUser(session);
  revalidatePath("/perfil");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAction() {
  await clearSessionUser();
  revalidatePath("/perfil");
  revalidatePath("/admin");
  redirect("/perfil");
}
