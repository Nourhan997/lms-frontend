import { apiClient } from "@/lib/api/client";
import type { Enrollment } from "@/lib/types";

export async function getMyEnrollments(): Promise<Enrollment[]> {
  const { data } = await apiClient.get<Enrollment[]>("/enrollments");
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
