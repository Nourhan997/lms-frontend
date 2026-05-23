"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, LOCALE_COOKIE } from "@/i18n/config";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Toggles the active locale by writing the NEXT_LOCALE cookie and refreshing.
 * The server re-reads the cookie (i18n/request.ts) and the root layout updates
 * `<html dir>`, switching RTL/LTR. No locale prefix in the URL.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const activeLocale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function selectLocale(locale: Locale) {
    if (locale === activeLocale) return;
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-gray-200 p-0.5 dark:border-gray-700",
        className,
      )}
      role="group"
      aria-label={t("switchLanguage")}
    >
      <Languages className="ms-1 h-4 w-4 text-gray-500" aria-hidden="true" />
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          disabled={isPending}
          onClick={() => selectLocale(locale)}
          aria-pressed={locale === activeLocale}
          className={cn(
            "rounded px-2 py-1 text-xs font-medium uppercase transition-colors disabled:opacity-50",
            locale === activeLocale
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
