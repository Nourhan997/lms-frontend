import type { Locale } from "@/lib/types";

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";

/** Cookie key used to persist the active locale (read by the request config). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Locales that render right-to-left. */
export const rtlLocales: Locale[] = ["ar"];

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "ar";
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
