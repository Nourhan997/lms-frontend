import { apiClient } from "@/lib/api/client";
import type { Course, Paginated, User } from "@/lib/types";

export interface AdminStats {
  total_students: number;
  total_courses: number;
  total_revenue: number;
  active_enrollments: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<AdminStats>("/admin/stats");
  return data;
}

export async function getStudents(page = 1): Promise<Paginated<User>> {
  const { data } = await apiClient.get<Paginated<User>>("/admin/students", {
    params: { page },
  });
  return data;
}

export async function getAdminCourses(page = 1): Promise<Paginated<Course>> {
  const { data } = await apiClient.get<Paginated<Course>>("/admin/courses", {
    params: { page },
  });
  return data;
}
