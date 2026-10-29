import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const sessionCookieName = "dacris_session";
const OWNER_GOOGLE_EMAILS = new Set(["dilanmunos91@gmail.com", "dacristoys@gmail.com"]);
const CATALOG_ADMIN_USERNAME = "dacris1989";
const CATALOG_ADMIN_PASSWORD = "DACRIS";
export type SessionUser = {
  username: string;
  role: "admin" | "customer";
  adminRole?: "owner" | "staff";
  displayName?: string;
  email?: string;
  avatarUrl?: string;
};

type AdminUserRow = { username: string; password_hash: string; role: "owner" | "staff" };
type GoogleAdminUserRow = { username: string; role: "owner" | "staff" };
type CustomerUserRow = { username: string };
type LoginAttemptRow = { failed_count: number; last_failed_at: string };

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET;
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload: string, secret = getSessionSecret()) {
  if (!secret) throw new Error("Falta AUTH_SESSION_SECRET para firmar sesiones.");
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function encodeSession(session: SessionUser) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value?: string): SessionUser | null {
  if (!value) return null;
  const secret = getSessionSecret();
  // A missing deployment variable must not make public pages fail to render.
  if (!secret) return null;

  const [payload, signature] = value.split(".");

  if (!payload || !signature || !safeCompare(signature, sign(payload, secret))) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    if (
      typeof parsed.username === "string" &&
      (parsed.role === "admin" || parsed.role === "customer") &&
      (parsed.adminRole === undefined || parsed.adminRole === "owner" || parsed.adminRole === "staff") &&
      (parsed.displayName === undefined || typeof parsed.displayName === "string") &&
      (parsed.email === undefined || typeof parsed.email === "string") &&
      (parsed.avatarUrl === undefined || typeof parsed.avatarUrl === "string")
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

function getAuthProfile(authUser: { email?: string | null; user_metadata?: unknown }) {
  const metadata = authUser.user_metadata && typeof authUser.user_metadata === "object"
    ? authUser.user_metadata as Record<string, unknown>
    : {};
  const getMetadataString = (...keys: string[]) => {
    for (const key of keys) {
      const value = metadata[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return undefined;
  };
  const email = authUser.email?.trim().toLowerCase();

  return {
    email,
    displayName: getMetadataString("full_name", "name", "user_name") ?? email,
    avatarUrl: getMetadataString("avatar_url", "picture"),
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const passwordSession = decodeSession(cookieStore.get(sessionCookieName)?.value);

  if (passwordSession) return passwordSession;

  const authClient = await createSupabaseAuthServerClient();
  if (!authClient) return null;

  const { data, error } = await authClient.auth.getUser();
  const authUser = data.user;
  if (error || !authUser) return null;

  const profile = getAuthProfile(authUser);
  const { email } = profile;

  const supabase = createSupabaseServerClient();

  // The store owner is explicitly pinned to this verified OAuth identity. This
  // is checked server-side after Supabase validates the Google session, so a
  // client cannot promote another account by changing a browser value.
  if (email && OWNER_GOOGLE_EMAILS.has(email)) {
    return {
      username: email,
      role: "admin",
      adminRole: "owner",
      ...profile,
    };
  }

  if (email && supabase) {
    const { data: adminData, error: adminError } = await supabase
      .from("admin_google_users")
      .select("username,role")
      .eq("email", email)
      .maybeSingle();

    if (!adminError && adminData) {
      const admin = adminData as GoogleAdminUserRow;
      return {
        username: admin.username,
        role: "admin",
        adminRole: admin.role,
        ...profile,
      };
    }
  }

  const customerResult = supabase
    ? await supabase
      .from("app_users")
      .select("username")
      .eq("auth_user_id", authUser.id)
      .maybeSingle()
    : null;
  const customerData = customerResult?.data;
  const customerError = customerResult?.error;

  if (customerData) {
    const customer = customerData as CustomerUserRow;
    return { username: customer.username, role: "customer", ...profile };
  }

  // An OAuth identity is valid even if the database trigger was added after the
  // account was created. Restore its local profile so orders and favorites work.
  const fallbackUsername = email ?? authUser.phone ?? authUser.id;
  if (supabase && !customerError) {
    const { data: restoredCustomer } = await supabase
      .from("app_users")
      .upsert({ username: fallbackUsername, auth_user_id: authUser.id }, { onConflict: "auth_user_id" })
      .select("username")
      .maybeSingle();

    if (restoredCustomer) {
      const customer = restoredCustomer as CustomerUserRow;
      return { username: customer.username, role: "customer", ...profile };
    }
  }

  // Do not throw a real Google user back to the login screen when the optional
  // application profile table is temporarily unavailable.
  return { username: fallbackUsername, role: "customer", ...profile };
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

  const authClient = await createSupabaseAuthServerClient();
  if (authClient) await authClient.auth.signOut();
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

export async function validateAdminLogin(username: string, password: string): Promise<SessionUser | null> {
  // Catalogue-mode bootstrap account requested by the store owner. It remains
  // server-side and still passes through rate limiting in the login action.
  if (safeCompare(username, CATALOG_ADMIN_USERNAME) && safeCompare(password, CATALOG_ADMIN_PASSWORD)) {
    return { username: CATALOG_ADMIN_USERNAME, role: "admin", adminRole: "owner" };
  }

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

  return null;
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
