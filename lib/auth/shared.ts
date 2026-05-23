import type { User, UserRole } from "@/lib/types";

/**
 * Cookie key used by the Zustand `persist` middleware (see authStore). The auth
 * state is stored in a cookie — not localStorage — so that edge middleware can
 * read it for route protection. This module is pure (no Node/Next APIs) so it
 * is safe to import from the edge runtime.
 */
export const AUTH_COOKIE = "lms-auth";

/** Shape persisted by Zustand `persist` (partialized to token + user). */
export interface PersistedAuth {
  token: string | null;
  user: User | null;
}

function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

/**
 * Parse the auth cookie value written by Zustand's `createJSONStorage`, which
 * wraps state as `{ "state": { token, user }, "version": n }`. Tries the raw
 * value and a percent-decoded variant. Returns null on any malformation.
 */
export function parseAuthCookie(
  value: string | undefined,
): PersistedAuth | null {
  if (!value) return null;

  const candidates = [value, safeDecode(value)];
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const parsed = JSON.parse(candidate) as { state?: PersistedAuth };
      if (parsed?.state && typeof parsed.state === "object") {
        return parsed.state;
      }
    } catch {
      // try the next candidate
    }
  }
  return null;
}

/** The landing route for a freshly authenticated user, by role. */
export function dashboardPathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "instructor":
      return "/instructor";
    case "student":
    default:
      return "/dashboard";
  }
}
