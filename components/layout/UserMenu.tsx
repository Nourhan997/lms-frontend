"use client";

import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Award, LayoutDashboard, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { useLogout } from "@/lib/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/auth/shared";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const itemClass = cn(
  "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-700 outline-none",
  "data-[highlighted]:bg-gray-100 dark:text-gray-200 dark:data-[highlighted]:bg-gray-800",
);

export function UserMenu({ user }: { user: User }) {
  const t = useTranslations("nav");
  const logout = useLogout();
  const dashboardPath = dashboardPathForRole(user.role);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={t("account")}
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <Avatar name={user.name} size="md" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-52 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="px-2 py-1.5">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />

          <DropdownMenu.Item asChild>
            <Link href={dashboardPath} className={itemClass}>
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              {t("myDashboard")}
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/dashboard/certificates" className={itemClass}>
              <Award className="h-4 w-4" aria-hidden="true" />
              {t("myCertificates")}
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
          <DropdownMenu.Item
            onSelect={() => logout.mutate()}
            className={cn(itemClass, "text-red-600 dark:text-red-400")}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t("logout")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
