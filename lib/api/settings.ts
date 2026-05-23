import { apiClient } from "@/lib/api/client";

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
