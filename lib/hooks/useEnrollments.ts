"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeLesson,
  enroll,
  getCourseContent,
  getMyEnrollments,
  updateProgress,
  type LessonCompleteResult,
} from "@/lib/api/enrollments";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError, CourseContent, Enrollment } from "@/lib/types";

export const enrollmentKeys = {
  all: ["enrollments"] as const,
  mine: ["enrollments", "mine"] as const,
  content: (enrollmentId: number) =>
    ["enrollments", "content", enrollmentId] as const,
};

export type EnrollmentFilter = "all" | "in_progress" | "completed";

function filterEnrollments(
  list: Enrollment[],
  filter: EnrollmentFilter,
): Enrollment[] {
  if (filter === "completed") return list.filter((e) => e.completed);
  if (filter === "in_progress") return list.filter((e) => !e.completed);
  return list;
}

/**
 * Current user's enrollments, optionally filtered by status. The filter is
 * applied client-side via `select`, so all tabs share one cached request.
 * Enabled only when authenticated (avoids 401s on public pages).
 */
export function useMyEnrollments(filter: EnrollmentFilter = "all") {
  const token = useAuthStore((s) => s.token);
  return useQuery<Enrollment[], ApiError, Enrollment[]>({
    queryKey: enrollmentKeys.mine,
    queryFn: getMyEnrollments,
    enabled: Boolean(token),
    select: (data) => filterEnrollments(data, filter),
  });
}

// Convenience alias used by dashboard components.
export const useEnrollments = useMyEnrollments;

/** Full course content for the player, by enrollment id. */
export function useCourseContent(enrollmentId: number) {
  const token = useAuthStore((s) => s.token);
  return useQuery<CourseContent, ApiError>({
    queryKey: enrollmentKeys.content(enrollmentId),
    queryFn: () => getCourseContent(enrollmentId),
    enabled: Boolean(token) && Number.isFinite(enrollmentId) && enrollmentId > 0,
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

/** Mark a lesson complete. Call `mutate(lessonId)`. Refreshes progress. */
export function useLessonComplete() {
  const queryClient = useQueryClient();
  return useMutation<LessonCompleteResult, ApiError, number>({
    mutationFn: (lessonId) => completeLesson(lessonId),
    onSuccess: () => {
      // Refresh both the enrollment list and the player content (progress).
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
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
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.all });
    },
  });
}
