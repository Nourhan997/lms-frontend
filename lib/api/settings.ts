import { apiClient } from "@/lib/api/client";
import type { AdminSettings } from "@/lib/types";

export interface PlatformSettings {
  platform_name: string;
  tagline: string;
  logo_url: string | null;
  /** Copyright / footer line shown in the site footer. */
  footer_text: string | null;
}

export async function getPublicSettings(): Promise<PlatformSettings> {
  const { data } = await apiClient.get<PlatformSettings>("/settings/public");
  return data;
}

// --- Admin settings --------------------------------------------------------

export async function getAdminSettings(): Promise<AdminSettings> {
  const { data } = await apiClient.get<AdminSettings>("/admin/settings");
  return data;
}

export async function updateSettings(
  payload: Partial<AdminSettings>,
): Promise<AdminSettings> {
  const { data } = await apiClient.patch<AdminSettings>(
    "/admin/settings",
    payload,
  );
  return data;
}

export async function uploadLogo(file: File): Promise<{ logo_url: string }> {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await apiClient.post<{ logo_url: string }>(
    "/admin/settings/logo",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}
