import { apiClient } from "@/lib/api/client";
import type {
  CategoryWithCount,
  Course,
  CourseDetail,
  Paginated,
} from "@/lib/types";

/** Public course categories with their published course counts. */
export async function getPublicCategories(): Promise<CategoryWithCount[]> {
  const { data } = await apiClient.get<CategoryWithCount[]>("/categories");
  return data;
}

export interface CourseListParams {
  page?: number;
  per_page?: number;
  search?: string;
  level?: Course["level"];
  language?: Course["language"];
}

export async function getCourses(
  params: CourseListParams = {},
): Promise<Paginated<Course>> {
  const { data } = await apiClient.get<Paginated<Course>>("/courses", { params });
  return data;
}

export async function getCourse(slug: string): Promise<CourseDetail> {
  const { data } = await apiClient.get<CourseDetail>(`/courses/${slug}`);
  return data;
}

export type CreateCoursePayload = Omit<
  Course,
  "id" | "slug" | "created_at" | "updated_at"
>;

export async function createCourse(
  payload: CreateCoursePayload,
): Promise<Course> {
  const { data } = await apiClient.post<Course>("/courses", payload);
  return data;
}

export async function updateCourse(
  id: number,
  payload: Partial<CreateCoursePayload>,
): Promise<Course> {
  const { data } = await apiClient.patch<Course>(`/courses/${id}`, payload);
  return data;
}

export async function deleteCourse(id: number): Promise<void> {
  await apiClient.delete(`/courses/${id}`);
}
