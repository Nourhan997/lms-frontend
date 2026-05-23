"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/api/notifications";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError, Notification } from "@/lib/types";

export const notificationKeys = {
  all: ["notifications"] as const,
};

/** Current user's notifications. Enabled only when authenticated. */
export function useNotifications() {
  const token = useAuthStore((s) => s.token);
  return useQuery<Notification[], ApiError>({
    queryKey: notificationKeys.all,
    queryFn: getNotifications,
    enabled: Boolean(token),
  });
}

/**
 * Count of unread notifications, derived from the notifications cache so it
 * shares a single request with {@link useNotifications}. Returns 0 while
 * loading or on error.
 */
export function useUnreadCount(): number {
  const { data } = useNotifications();
  return data?.filter((n) => !n.read).length ?? 0;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation<Notification, ApiError, number>({
    mutationFn: (id) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
