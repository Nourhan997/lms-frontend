"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { usePlatformSettings } from "@/lib/hooks/useSettings";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * Centered branded shell for the auth pages. Platform name, tagline and logo
 * come from public settings; if the request fails we fall back to hardcoded
 * (localized) defaults so the page always renders. Direction (LTR/RTL) is
 * inherited from the <html dir> set in the root layout.
 */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const t = useTranslations();
  const { data: settings } = usePlatformSettings();

  const platformName = settings?.platform_name ?? t("common.appName");
  const tagline = settings?.tagline ?? t("common.tagline");
  const logoUrl = settings?.logo_url ?? null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={platformName}
            width={48}
            height={48}
            className="h-12 w-auto"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
            <GraduationCap className="h-7 w-7" aria-hidden="true" />
          </span>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          {platformName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{tagline}</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </main>
  );
}
