"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCourse,
  getCourse,
  getCourses,
  type CourseListParams,
  type CreateCoursePayload,
} from "@/lib/api/courses";
import type { ApiError, Course, Paginated } from "@/lib/types";

export const courseKeys = {
  all: ["courses"] as const,
  list: (params: CourseListParams) => ["courses", "list", params] as const,
  detail: (slug: string) => ["courses", "detail", slug] as const,
};

export function useCourses(params: CourseListParams = {}) {
  return useQuery<Paginated<Course>, ApiError>({
    queryKey: courseKeys.list(params),
    queryFn: () => getCourses(params),
  });
}

export function useCourse(slug: string) {
  return useQuery<Course, ApiError>({
    queryKey: courseKeys.detail(slug),
    queryFn: () => getCourse(slug),
    enabled: Boolean(slug),
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation<Course, ApiError, CreateCoursePayload>({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
