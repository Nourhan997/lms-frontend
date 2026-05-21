"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAdminCourses,
  getAdminStats,
  getStudents,
  type AdminStats,
} from "@/lib/api/admin";
import type { ApiError, Course, Paginated, User } from "@/lib/types";

export const adminKeys = {
  stats: ["admin", "stats"] as const,
  students: (page: number) => ["admin", "students", page] as const,
  courses: (page: number) => ["admin", "courses", page] as const,
};

export function useAdminStats() {
  return useQuery<AdminStats, ApiError>({
    queryKey: adminKeys.stats,
    queryFn: getAdminStats,
  });
}

export function useAdminStudents(page = 1) {
  return useQuery<Paginated<User>, ApiError>({
    queryKey: adminKeys.students(page),
    queryFn: () => getStudents(page),
  });
}

export function useAdminCourses(page = 1) {
  return useQuery<Paginated<Course>, ApiError>({
    queryKey: adminKeys.courses(page),
    queryFn: () => getAdminCourses(page),
  });
}
