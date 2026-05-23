"use client";

import { CheckCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Card, CardContent } from "@/components/ui/Card";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/lib/hooks/useNotifications";
import { timeAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Locale, Notification } from "@/lib/types";

function NotificationRow({ notification }: { notification: Notification }) {
  const locale = useLocale() as Locale;
  const markRead = useMarkNotificationRead();

  return (
    <button
      type="button"
      onClick={() => {
        if (!notification.read) markRead.mutate(notification.id);
      }}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-gray-50 dark:hover:bg-gray-900",
        !notification.read && "bg-blue-50/50 dark:bg-blue-950/30",
      )}
    >
      <span
        className={cn(
          "mt-1.5 h-2 w-2 shrink-0 rounded-full",
          notification.read ? "bg-transparent" : "bg-blue-600",
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              notification.read
                ? "text-gray-700 dark:text-gray-300"
                : "font-semibold text-gray-900 dark:text-gray-50",
            )}
          >
            {notification.title}
          </p>
          <span className="shrink-0 text-xs text-gray-400">
            {timeAgo(notification.created_at, locale)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          {notification.body}
        </p>
      </div>
    </button>
  );
}

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const notifications = useNotifications();
  const unread = useUnreadCount();
  const markAll = useMarkAllNotificationsRead();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={t("title")}
        action={
          <Button
            variant="outline"
            size="sm"
            disabled={unread === 0 || markAll.isPending}
            isLoading={markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            {t("markAllRead")}
          </Button>
        }
      />

      {notifications.isLoading ? (
        <Card>
          <CardContent className="p-0">
            <SkeletonCard variant="list-item" />
            <SkeletonCard variant="list-item" />
            <SkeletonCard variant="list-item" />
          </CardContent>
        </Card>
      ) : notifications.isError ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : !notifications.data || notifications.data.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
            {notifications.data.map((notification) => (
              <NotificationRow key={notification.id} notification={notification} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
