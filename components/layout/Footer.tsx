"use client";

import Link from "next/link";
import { AtSign, Globe, Rss, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePlatformSettings } from "@/lib/hooks/useSettings";

// Placeholder social/contact links — wire to real URLs from settings later.
const SOCIAL_LINKS = [
  { href: "#", label: "Website", icon: Globe },
  { href: "#", label: "Contact", icon: AtSign },
  { href: "#", label: "Blog feed", icon: Rss },
  { href: "#", label: "Share", icon: Share2 },
] as const;

export function Footer() {
  const t = useTranslations();
  const { data: settings } = usePlatformSettings();

  const platformName = settings?.platform_name ?? t("common.appName");
  const tagline = settings?.tagline ?? t("common.tagline");
  const copyright =
    settings?.footer_text ??
    `© ${new Date().getFullYear()} ${platformName}. ${t("footer.rights")}`;

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <p className="font-bold text-gray-900 dark:text-gray-50">
              {platformName}
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {tagline}
            </p>
          </div>

          <nav className="flex flex-col gap-2" aria-label="Footer">
            <Link
              href="/courses"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {t("footer.courses")}
            </Link>
            <Link
              href="/blog"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {t("footer.blog")}
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {t("footer.privacy")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
