"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicSettings, type PlatformSettings } from "@/lib/api/settings";
import type { ApiError } from "@/lib/types";

export const settingsKeys = {
  public: ["settings", "public"] as const,
};

/**
 * Public platform settings (name, tagline, logo). Consumers should fall back to
 * hardcoded defaults when the request fails — see `usePlatformSettings`.
 */
export function usePlatformSettings() {
  return useQuery<PlatformSettings, ApiError>({
    queryKey: settingsKeys.public,
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
}
