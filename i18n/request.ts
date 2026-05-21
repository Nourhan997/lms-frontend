import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/i18n/config";

/**
 * next-intl request config (no-routing setup): the active locale is read from
 * the {@link LOCALE_COOKIE} cookie rather than a `[locale]` URL segment, which
 * keeps the route tree flat. The cookie is set by `middleware.ts`.
 */
export default getRequestConfig(async () => {
  const cookieLocale = cookies().get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});
