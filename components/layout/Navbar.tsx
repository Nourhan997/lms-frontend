"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { UserMenu } from "@/components/layout/UserMenu";
import { usePlatformSettings } from "@/lib/hooks/useSettings";
import { useAuthStore } from "@/lib/store/authStore";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { dashboardPathForRole } from "@/lib/auth/shared";
import { cn } from "@/lib/utils/cn";

const NAV_LINKS = [
  { href: "/courses", labelKey: "courses" },
  { href: "/blog", labelKey: "blog" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const { data: settings } = usePlatformSettings();
  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Gate auth-dependent UI behind mount to keep SSR/CSR markup in sync.
  const isAuthed = mounted && Boolean(token && user);
  const platformName = settings?.platform_name ?? t("home");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          {settings?.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={platformName}
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          <span className="font-bold text-gray-900 dark:text-gray-50">
            {platformName}
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {isAuthed && user ? (
            <>
              <Link href={dashboardPathForRole(user.role)}>
                <Button variant="ghost" size="sm">
                  {t("dashboard")}
                </Button>
              </Link>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">{t("register")}</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile panel */}
      <div
        className={cn(
          "border-t border-gray-200 md:hidden dark:border-gray-800",
          mobileOpen ? "block" : "hidden",
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t(link.labelKey)}
            </Link>
          ))}

          <div className="my-2 h-px bg-gray-100 dark:bg-gray-800" />
          <LanguageSwitcher className="self-start" />

          <div className="mt-2 flex flex-col gap-2">
            {isAuthed && user ? (
              <Link href={dashboardPathForRole(user.role)} onClick={() => setMobileOpen(false)}>
                <Button fullWidth size="sm">
                  {t("dashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth size="sm">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button fullWidth size="sm">
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
