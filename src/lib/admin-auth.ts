import "server-only";

import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { safeEqualSecret } from "@/lib/request-security";

const COOKIE_NAME = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function sessionToken(password: string): string {
  return createHmac("sha256", password).update("usautorv-admin").digest("hex");
}

/** Пароль адмінки береться з ADMIN_PASSWORD у .env.local */
function getPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;

  return password && password.length > 0 ? password : null;
}

export function isAdminConfigured(): boolean {
  return getPassword() !== null;
}

export async function isAdminAuthed(): Promise<boolean> {
  const password = getPassword();
  if (!password) return false;

  const cookie = (await cookies()).get(COOKIE_NAME)?.value;
  if (!cookie) return false;

  return safeEqualSecret(cookie, sessionToken(password));
}

export async function signIn(candidate: string): Promise<boolean> {
  const password = getPassword();
  if (!password || !safeEqualSecret(candidate, password)) return false;

  (await cookies()).set(COOKIE_NAME, sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return true;
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}
