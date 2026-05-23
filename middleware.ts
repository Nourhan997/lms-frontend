import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales } from "@/i18n/config";
import { AUTH_COOKIE, dashboardPathForRole, parseAuthCookie } from "@/lib/auth/shared";
import type { UserRole } from "@/lib/types";

/** Route prefixes that require auth, with the roles allowed to enter them. */
const PROTECTED_ROUTES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/instructor", roles: ["instructor", "admin"] },
  { prefix: "/dashboard", roles: ["student", "admin"] },
];

/** Pages that an authenticated user should be bounced away from. */
const AUTH_PAGES = ["/login", "/register"];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Edge middleware handling two concerns:
 *  1. Locale detection — set the NEXT_LOCALE cookie from Accept-Language when
 *     absent (read server-side by `i18n/request.ts`).
 *  2. Route protection — read the auth cookie (`lms-auth`, written by the
 *     Zustand persist store) and gate protected route trees by role.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // --- Locale detection -----------------------------------------------------
  const currentLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (!isLocale(currentLocale)) {
    const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
    const detected =
      locales.find((locale) => accept.startsWith(locale)) ?? defaultLocale;
    response.cookies.set(LOCALE_COOKIE, detected, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  // --- Auth state -----------------------------------------------------------
  const auth = parseAuthCookie(request.cookies.get(AUTH_COOKIE)?.value);
  const user = auth?.token ? auth.user : null;

  // Authenticated users shouldn't see login/register.
  if (AUTH_PAGES.some((page) => matchesPrefix(pathname, page))) {
    if (user) {
      return NextResponse.redirect(
        new URL(dashboardPathForRole(user.role), request.url),
      );
    }
    return response;
  }

  // Gate protected route trees.
  const protectedRoute = PROTECTED_ROUTES.find((route) =>
    matchesPrefix(pathname, route.prefix),
  );
  if (protectedRoute) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!protectedRoute.roles.includes(user.role)) {
      // Authenticated but wrong role → send to their own dashboard.
      return NextResponse.redirect(
        new URL(dashboardPathForRole(user.role), request.url),
      );
    }
  }

  return response;
}

export const config = {
  // Run on pages only — skip API routes, Next internals and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
