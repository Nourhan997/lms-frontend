import { apiClient } from "@/lib/api/client";
import type { Notification } from "@/lib/types";

export async function getNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<Notification[]>("/notifications");
  return data;
}

export async function markNotificationRead(id: number): Promise<Notification> {
  const { data } = await apiClient.patch<Notification>(
    `/notifications/${id}/read`,
  );
  return data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.post("/notifications/read-all");
}
