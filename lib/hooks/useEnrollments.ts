"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  enroll,
  getMyEnrollments,
  updateProgress,
} from "@/lib/api/enrollments";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError, Enrollment } from "@/lib/types";

export const enrollmentKeys = {
  mine: ["enrollments", "mine"] as const,
};

export function useMyEnrollments() {
  // Enabled only when authenticated — this endpoint requires a token, and we
  // must not trigger a 401 (and the resulting login redirect) on public pages.
  const token = useAuthStore((s) => s.token);
  return useQuery<Enrollment[], ApiError>({
    queryKey: enrollmentKeys.mine,
    queryFn: getMyEnrollments,
    enabled: Boolean(token),
  });
}

// Convenience alias used by dashboard components.
export const useEnrollments = useMyEnrollments;

export function useEnroll() {
  const queryClient = useQueryClient();
  return useMutation<Enrollment, ApiError, number>({
    mutationFn: (courseId) => enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.mine });
    },
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation<
    Enrollment,
    ApiError,
    { enrollmentId: number; progress: number }
  >({
    mutationFn: ({ enrollmentId, progress }) =>
      updateProgress(enrollmentId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.mine });
    },
  });
}
