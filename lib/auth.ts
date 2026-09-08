import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sessionCookieName = "dacris_session";
export type SessionUser = {
  username: string;
  role: "admin" | "customer";
  adminRole?: "owner" | "staff";
};

type UserRow = {
  username: string;
  password_hash: string;
};

type AdminUserRow = { username: string; password_hash: string; role: "owner" | "staff" };
type LoginAttemptRow = { failed_count: number; last_failed_at: string };

function getSessionSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) throw new Error("Falta AUTH_SESSION_SECRET para firmar sesiones.");
  return secret;
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex");
}

function encodeSession(session: SessionUser) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value?: string): SessionUser | null {
  if (!value) return null;

  const [payload, signature] = value.split(".");

  if (!payload || !signature || !safeCompare(signature, sign(payload))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (
      typeof parsed.username === "string" &&
      (parsed.role === "admin" || parsed.role === "customer") &&
      (parsed.adminRole === undefined || parsed.adminRole === "owner" || parsed.adminRole === "staff")
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(sessionCookieName)?.value);
}

export async function setSessionUser(session: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionUser() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function requireAdminSession() {
  const session = await getSessionUser();

  if (session?.role !== "admin") {
    throw new Error("No autorizado.");
  }

  return session;
}

export async function requireOwnerSession() {
  const session = await requireAdminSession();
  if (session.adminRole !== "owner") throw new Error("Solo el dueño puede realizar esta acción.");
  return session;
}

export async function registerCustomer(username: string, password: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Faltan variables de Supabase para crear usuarios.");
  }

  const { error } = await supabase.from("app_users").insert({
    username,
    password_hash: await bcrypt.hash(password, 12),
  });

  if (error) throw new Error(error.message);
}

export async function validateLogin(username: string, password: string): Promise<SessionUser | null> {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Faltan variables de Supabase para iniciar sesión.");
  }

  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("username,password_hash,role")
    .eq("username", username)
    .maybeSingle();
  if (adminError) throw new Error(adminError.message);
  if (adminData) {
    const admin = adminData as AdminUserRow;
    if (await bcrypt.compare(password, admin.password_hash)) {
      return { username: admin.username, role: "admin", adminRole: admin.role };
    }
    return null;
  }

  const { data, error } = await supabase
    .from("app_users")
    .select("username,password_hash")
    .eq("username", username)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const user = data as UserRow;
  if (!(await bcrypt.compare(password, user.password_hash))) return null;

  return { username: user.username, role: "customer" };
}

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function isLoginBlocked(username: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("login_attempts")
    .select("failed_count,last_failed_at")
    .eq("username", username)
    .maybeSingle();
  if (error || !data) return false;
  const attempt = data as LoginAttemptRow;
  return (
    attempt.failed_count >= LOGIN_LIMIT &&
    Date.now() - Date.parse(attempt.last_failed_at) < LOGIN_WINDOW_MS
  );
}

export async function recordLoginFailure(username: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return;
  const { data } = await supabase
    .from("login_attempts")
    .select("failed_count,last_failed_at")
    .eq("username", username)
    .maybeSingle();
  const previous = data as LoginAttemptRow | null;
  const withinWindow = previous && Date.now() - Date.parse(previous.last_failed_at) < LOGIN_WINDOW_MS;
  await supabase.from("login_attempts").upsert({
    username,
    failed_count: withinWindow ? previous.failed_count + 1 : 1,
    last_failed_at: new Date().toISOString(),
  });
}

export async function clearLoginFailures(username: string) {
  const supabase = createSupabaseServerClient();
  if (supabase) await supabase.from("login_attempts").delete().eq("username", username);
}
