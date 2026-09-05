import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sessionCookieName = "dacris_session";
const adminUsername = "Dacris";
const adminPassword = "dacris123";

export type SessionUser = {
  username: string;
  role: "admin" | "customer";
};

type UserRow = {
  username: string;
  password_hash: string;
  password_salt: string;
};

function getSessionSecret() {
  return (
    process.env.AUTH_SESSION_SECRET ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "dacris-local-session-secret"
  );
}

function hashPassword(password: string, salt: string) {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
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
      (parsed.role === "admin" || parsed.role === "customer")
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

export async function registerCustomer(username: string, password: string) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Faltan variables de Supabase para crear usuarios.");
  }

  const salt = randomBytes(16).toString("hex");
  const { error } = await supabase.from("app_users").insert({
    username,
    password_salt: salt,
    password_hash: hashPassword(password, salt),
  });

  if (error) throw new Error(error.message);
}

export async function validateLogin(username: string, password: string): Promise<SessionUser | null> {
  if (username === adminUsername && password === adminPassword) {
    return { username: adminUsername, role: "admin" };
  }

  const supabase = createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Faltan variables de Supabase para iniciar sesión.");
  }

  const { data, error } = await supabase
    .from("app_users")
    .select("username,password_hash,password_salt")
    .eq("username", username)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const user = data as UserRow;
  const hash = hashPassword(password, user.password_salt);

  if (!safeCompare(hash, user.password_hash)) return null;

  return { username: user.username, role: "customer" };
}
