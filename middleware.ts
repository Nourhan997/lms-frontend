import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, locales } from "@/i18n/config";

/**
 * Locale detection. If the visitor has no valid locale cookie yet, infer one
 * from the `Accept-Language` header and persist it. next-intl reads this cookie
 * server-side (see `i18n/request.ts`), so routes stay un-prefixed.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const current = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(current)) {
    return response;
  }

  const accept = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const detected =
    locales.find((locale) => accept.startsWith(locale)) ?? defaultLocale;

  response.cookies.set(LOCALE_COOKIE, detected, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });

  return response;
}

export const config = {
  // Run on pages only — skip API routes, Next internals and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
