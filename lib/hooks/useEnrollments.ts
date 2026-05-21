"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  enroll,
  getMyEnrollments,
  updateProgress,
} from "@/lib/api/enrollments";
import type { ApiError, Enrollment } from "@/lib/types";

export const enrollmentKeys = {
  mine: ["enrollments", "mine"] as const,
};

export function useMyEnrollments() {
  return useQuery<Enrollment[], ApiError>({
    queryKey: enrollmentKeys.mine,
    queryFn: getMyEnrollments,
  });
}

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
