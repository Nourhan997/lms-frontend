"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/components/layout/Sidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/lib/store/authStore";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { useUnreadCount } from "@/lib/hooks/useNotifications";
import type { UserRole } from "@/lib/types";

function NotificationBell({ role }: { role: UserRole }) {
  const t = useTranslations("topbar");
  const unread = useUnreadCount();

  const content = (
    <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
      <Bell className="h-5 w-5" aria-hidden="true" />
      {unread > 0 && (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </span>
  );

  // Only the student tree has a notifications page to link to.
  if (role === "student") {
    return (
      <Link href="/dashboard/notifications" aria-label={t("notifications")}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={t("notifications")}>
      {content}
    </button>
  );
}

export interface DashboardLayoutProps {
  role: UserRole;
  children: ReactNode;
}

/**
 * Shell for all authenticated areas (dashboard / instructor / admin): a
 * role-aware sidebar plus a top bar with the portal title, notifications and
 * the user menu. Direction follows the root <html dir> for RTL support.
 */
export function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const tPortal = useTranslations("portal");
  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <aside className="sticky top-0 h-screen shrink-0">
        <Sidebar role={role} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
          <h1 className="truncate text-lg font-semibold text-gray-900 dark:text-gray-50">
            {tPortal(role)}
          </h1>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <NotificationBell role={role} />
            {mounted && user ? (
              <UserMenu user={user} />
            ) : (
              <Skeleton className="h-9 w-9 rounded-full" />
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
