"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CreditCard,
  FileBarChart,
  FileText,
  Home,
  LayoutDashboard,
  PencilRuler,
  Settings,
  Shield,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useUnreadCount } from "@/lib/hooks/useNotifications";
import type { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface SidebarLink {
  href: string;
  labelKey: string;
  icon: LucideIcon;
  /** Show the unread-notifications badge on this link. */
  badge?: boolean;
}

const LINKS_BY_ROLE: Record<UserRole, { root: string; links: SidebarLink[] }> = {
  student: {
    root: "/dashboard",
    links: [
      { href: "/dashboard", labelKey: "dashboard", icon: Home },
      { href: "/dashboard/courses", labelKey: "myCourses", icon: BookOpen },
      { href: "/dashboard/certificates", labelKey: "certificates", icon: Award },
      { href: "/dashboard/payments", labelKey: "payments", icon: CreditCard },
      { href: "/dashboard/notifications", labelKey: "notifications", icon: Bell, badge: true },
      { href: "/dashboard/profile", labelKey: "profile", icon: User },
    ],
  },
  instructor: {
    root: "/instructor",
    links: [
      { href: "/instructor", labelKey: "dashboard", icon: LayoutDashboard },
      { href: "/instructor/courses", labelKey: "myCourses", icon: BookOpen },
      { href: "/instructor/builder", labelKey: "courseBuilder", icon: PencilRuler },
      { href: "/instructor/students", labelKey: "students", icon: Users },
      { href: "/instructor/profile", labelKey: "profile", icon: User },
    ],
  },
  admin: {
    root: "/admin",
    links: [
      { href: "/admin", labelKey: "dashboard", icon: BarChart3 },
      { href: "/admin/courses", labelKey: "courses", icon: BookOpen },
      { href: "/admin/students", labelKey: "students", icon: Users },
      { href: "/admin/instructors", labelKey: "instructors", icon: UserCheck },
      { href: "/admin/payments", labelKey: "payments", icon: CreditCard },
      { href: "/admin/reports", labelKey: "reports", icon: FileBarChart },
      { href: "/admin/blog", labelKey: "blog", icon: FileText },
      { href: "/admin/settings", labelKey: "settings", icon: Settings },
      { href: "/admin/audit-log", labelKey: "auditLog", icon: Shield },
    ],
  },
};

function isActive(pathname: string, href: string, root: string): boolean {
  // Section root matches exactly; nested links also match their descendants.
  if (href === root) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const t = useTranslations("sidebar");
  const pathname = usePathname();
  const unread = useUnreadCount();
  const { root, links } = LINKS_BY_ROLE[role];

  return (
    <nav
      aria-label="Sidebar"
      className="flex h-full w-16 flex-col gap-1 border-e border-gray-200 bg-white p-2 lg:w-64 dark:border-gray-800 dark:bg-gray-950"
    >
      {links.map(({ href, labelKey, icon: Icon, badge }) => {
        const active = isActive(pathname, href, root);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            title={t(labelKey)}
            className={cn(
              "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "justify-center lg:justify-start",
              active
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            <span className="relative">
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {badge && unread > 0 && (
                <span className="absolute -end-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white lg:hidden">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </span>
            <span className="hidden lg:inline">{t(labelKey)}</span>
            {badge && unread > 0 && (
              <span className="ms-auto hidden h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white lg:inline-flex">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
