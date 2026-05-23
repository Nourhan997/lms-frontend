"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyCertificates } from "@/lib/api/certificates";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError, Certificate } from "@/lib/types";

export const certificateKeys = {
  mine: ["certificates", "mine"] as const,
};

export function useMyCertificates() {
  const token = useAuthStore((s) => s.token);
  return useQuery<Certificate[], ApiError>({
    queryKey: certificateKeys.mine,
    queryFn: getMyCertificates,
    enabled: Boolean(token),
  });
}
