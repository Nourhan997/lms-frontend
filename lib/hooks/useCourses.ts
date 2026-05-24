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
  getPublicCategories,
  type CourseListParams,
  type CreateCoursePayload,
} from "@/lib/api/courses";
import type {
  ApiError,
  CategoryWithCount,
  Course,
  CourseDetail,
  Paginated,
} from "@/lib/types";

export const courseKeys = {
  all: ["courses"] as const,
  list: (params: CourseListParams) => ["courses", "list", params] as const,
  detail: (slug: string) => ["courses", "detail", slug] as const,
  categories: ["courses", "categories"] as const,
};

export function usePublicCategories() {
  return useQuery<CategoryWithCount[], ApiError>({
    queryKey: courseKeys.categories,
    queryFn: getPublicCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCourses(params: CourseListParams = {}) {
  return useQuery<Paginated<Course>, ApiError>({
    queryKey: courseKeys.list(params),
    queryFn: () => getCourses(params),
  });
}

export function useCourse(slug: string) {
  return useQuery<CourseDetail, ApiError>({
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
