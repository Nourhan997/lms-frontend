import { apiClient } from "@/lib/api/client";
import type {
  AdminCourse,
  AdminCourseInput,
  AdminDashboard,
  AdminStudent,
  AdminStudentDetail,
  Category,
  CourseStatus,
  Paginated,
  Payment,
  PaymentStatus,
  RevenuePoint,
  StudentStatus,
} from "@/lib/types";

// --- Dashboard / reports ---------------------------------------------------

export async function getAdminDashboard(): Promise<AdminDashboard> {
  const { data } = await apiClient.get<AdminDashboard>("/admin/overview");
  return data;
}

export async function getRevenueReport(
  period: "12m" | "6m" | "30d" = "12m",
): Promise<RevenuePoint[]> {
  const { data } = await apiClient.get<RevenuePoint[]>(
    "/admin/reports/revenue",
    { params: { period } },
  );
  return data;
}

// --- Students --------------------------------------------------------------

export interface StudentFilters {
  page?: number;
  search?: string;
  status?: StudentStatus | "";
}

export async function getStudents(
  filters: StudentFilters = {},
): Promise<Paginated<AdminStudent>> {
  const { data } = await apiClient.get<Paginated<AdminStudent>>(
    "/admin/students",
    { params: filters },
  );
  return data;
}

export async function getStudent(id: number): Promise<AdminStudentDetail> {
  const { data } = await apiClient.get<AdminStudentDetail>(
    `/admin/students/${id}`,
  );
  return data;
}

export async function suspendStudent(id: number): Promise<AdminStudent> {
  const { data } = await apiClient.post<AdminStudent>(
    `/admin/students/${id}/suspend`,
  );
  return data;
}

export async function activateStudent(id: number): Promise<AdminStudent> {
  const { data } = await apiClient.post<AdminStudent>(
    `/admin/students/${id}/activate`,
  );
  return data;
}

// --- Courses ---------------------------------------------------------------

export interface CourseFilters {
  page?: number;
  status?: CourseStatus | "";
}

export async function getAdminCourses(
  filters: CourseFilters = {},
): Promise<Paginated<AdminCourse>> {
  const { data } = await apiClient.get<Paginated<AdminCourse>>(
    "/admin/courses",
    { params: filters },
  );
  return data;
}

export async function getAdminCourse(id: number): Promise<AdminCourse> {
  const { data } = await apiClient.get<AdminCourse>(`/admin/courses/${id}`);
  return data;
}

export async function createAdminCourse(
  payload: AdminCourseInput,
): Promise<AdminCourse> {
  const { data } = await apiClient.post<AdminCourse>("/admin/courses", payload);
  return data;
}

export async function updateAdminCourse(
  id: number,
  payload: Partial<AdminCourseInput>,
): Promise<AdminCourse> {
  const { data } = await apiClient.patch<AdminCourse>(
    `/admin/courses/${id}`,
    payload,
  );
  return data;
}

export async function publishCourse(id: number): Promise<AdminCourse> {
  const { data } = await apiClient.post<AdminCourse>(
    `/admin/courses/${id}/publish`,
  );
  return data;
}

export async function archiveCourse(id: number): Promise<AdminCourse> {
  const { data } = await apiClient.post<AdminCourse>(
    `/admin/courses/${id}/archive`,
  );
  return data;
}

export async function deleteCourse(id: number): Promise<void> {
  await apiClient.delete(`/admin/courses/${id}`);
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<Category[]>("/admin/categories");
  return data;
}

// --- Payments --------------------------------------------------------------

export interface PaymentFilters {
  page?: number;
  status?: PaymentStatus | "";
}

export async function getAdminPayments(
  filters: PaymentFilters = {},
): Promise<Paginated<Payment>> {
  const { data } = await apiClient.get<Paginated<Payment>>("/admin/payments", {
    params: filters,
  });
  return data;
}

export async function refundPayment(id: number): Promise<Payment> {
  const { data } = await apiClient.post<Payment>(
    `/admin/payments/${id}/refund`,
  );
  return data;
}

// --- Uploads ---------------------------------------------------------------

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await apiClient.post<{ url: string }>(
    "/admin/uploads",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}
