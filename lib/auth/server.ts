import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE, parseAuthCookie, type PersistedAuth } from "@/lib/auth/shared";

/**
 * Read the persisted auth state from the request cookies in a Server Component.
 * Returns null when there is no valid session. Use for SSR redirects.
 */
export function getServerAuth(): PersistedAuth | null {
  const raw = cookies().get(AUTH_COOKIE)?.value;
  const auth = parseAuthCookie(raw);
  if (!auth?.token || !auth.user) return null;
  return auth;
}
