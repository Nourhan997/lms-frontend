import { apiClient } from "@/lib/api/client";
import type { CourseContent, Enrollment } from "@/lib/types";

export async function getMyEnrollments(): Promise<Enrollment[]> {
  const { data } = await apiClient.get<Enrollment[]>("/enrollments");
  return data;
}

/** Full course content (sections, lessons, completion) for the player view. */
export async function getCourseContent(
  enrollmentId: number,
): Promise<CourseContent> {
  const { data } = await apiClient.get<CourseContent>(
    `/enrollments/${enrollmentId}/content`,
  );
  return data;
}

export interface LessonCompleteResult {
  lesson_id: number;
  /** New overall course progress, 0–100. */
  progress: number;
  /** True when completing this lesson finished the whole course. */
  course_completed: boolean;
}

export async function completeLesson(
  lessonId: number,
): Promise<LessonCompleteResult> {
  const { data } = await apiClient.post<LessonCompleteResult>(
    `/lessons/${lessonId}/complete`,
  );
  return data;
}

export async function enroll(courseId: number): Promise<Enrollment> {
  const { data } = await apiClient.post<Enrollment>("/enrollments", {
    course_id: courseId,
  });
  return data;
}

export async function updateProgress(
  enrollmentId: number,
  progress: number,
): Promise<Enrollment> {
  const { data } = await apiClient.patch<Enrollment>(
    `/enrollments/${enrollmentId}`,
    { progress },
  );
  return data;
}
