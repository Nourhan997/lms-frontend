"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateInstructor,
  activateStudent,
  archiveCourse,
  createAdminCourse,
  createInstructor,
  deleteCourse,
  getAdminCourse,
  getAdminCourses,
  getAdminDashboard,
  getAdminPayments,
  getAuditLog,
  getCategories,
  getInstructors,
  getRevenueReport,
  getStudent,
  getStudents,
  publishCourse,
  refundPayment,
  suspendInstructor,
  suspendStudent,
  updateAdminCourse,
  uploadImage,
  type AuditLogFilters,
  type CourseFilters,
  type InstructorFilters,
  type PaymentFilters,
  type StudentFilters,
} from "@/lib/api/admin";
import {
  createBlogPost,
  deleteBlogPost,
  getAdminBlogPost,
  getAdminBlogPosts,
  setBlogPublished,
  updateBlogPost,
  type BlogFilters,
} from "@/lib/api/blog";
import {
  getAdminSettings,
  updateSettings,
  uploadLogo,
} from "@/lib/api/settings";
import { useAuthStore } from "@/lib/store/authStore";
import type {
  AdminBlogInput,
  AdminCourse,
  AdminCourseInput,
  AdminDashboard,
  AdminInstructor,
  AdminSettings,
  AdminStudent,
  AdminStudentDetail,
  ApiError,
  AuditLogEntry,
  BlogPost,
  Category,
  CreateInstructorInput,
  Paginated,
  Payment,
  RevenuePoint,
} from "@/lib/types";

export const adminKeys = {
  dashboard: ["admin", "dashboard"] as const,
  revenue: (period: string) => ["admin", "revenue", period] as const,
  students: (filters: StudentFilters) =>
    ["admin", "students", filters] as const,
  student: (id: number) => ["admin", "student", id] as const,
  courses: (filters: CourseFilters) => ["admin", "courses", filters] as const,
  course: (id: number) => ["admin", "course", id] as const,
  categories: ["admin", "categories"] as const,
  instructors: (filters: InstructorFilters) =>
    ["admin", "instructors", filters] as const,
  auditLog: (filters: AuditLogFilters) =>
    ["admin", "audit-log", filters] as const,
  payments: (filters: PaymentFilters) =>
    ["admin", "payments", filters] as const,
  blog: (filters: BlogFilters) => ["admin", "blog", filters] as const,
  blogPost: (id: number) => ["admin", "blogPost", id] as const,
  settings: ["admin", "settings"] as const,
};

function useAdminEnabled() {
  return Boolean(useAuthStore((s) => s.token));
}

// --- Dashboard / reports ---------------------------------------------------

export function useAdminDashboard() {
  return useQuery<AdminDashboard, ApiError>({
    queryKey: adminKeys.dashboard,
    queryFn: getAdminDashboard,
    enabled: useAdminEnabled(),
  });
}

export function useRevenueReport(period: "12m" | "6m" | "30d" = "12m") {
  return useQuery<RevenuePoint[], ApiError>({
    queryKey: adminKeys.revenue(period),
    queryFn: () => getRevenueReport(period),
    enabled: useAdminEnabled(),
  });
}

// --- Students --------------------------------------------------------------

export function useAdminStudents(filters: StudentFilters = {}) {
  return useQuery<Paginated<AdminStudent>, ApiError>({
    queryKey: adminKeys.students(filters),
    queryFn: () => getStudents(filters),
    enabled: useAdminEnabled(),
  });
}

export function useAdminStudent(id: number) {
  return useQuery<AdminStudentDetail, ApiError>({
    queryKey: adminKeys.student(id),
    queryFn: () => getStudent(id),
    enabled: useAdminEnabled() && Number.isFinite(id) && id > 0,
  });
}

export function useSuspendStudent() {
  const queryClient = useQueryClient();
  return useMutation<AdminStudent, ApiError, number>({
    mutationFn: (id) => suspendStudent(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.student(id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
    },
  });
}

export function useActivateStudent() {
  const queryClient = useQueryClient();
  return useMutation<AdminStudent, ApiError, number>({
    mutationFn: (id) => activateStudent(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.student(id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
    },
  });
}

// --- Courses ---------------------------------------------------------------

export function useAdminCourses(filters: CourseFilters = {}) {
  return useQuery<Paginated<AdminCourse>, ApiError>({
    queryKey: adminKeys.courses(filters),
    queryFn: () => getAdminCourses(filters),
    enabled: useAdminEnabled(),
  });
}

export function useAdminCourse(id: number) {
  return useQuery<AdminCourse, ApiError>({
    queryKey: adminKeys.course(id),
    queryFn: () => getAdminCourse(id),
    enabled: useAdminEnabled() && Number.isFinite(id) && id > 0,
  });
}

export function useCategories() {
  return useQuery<Category[], ApiError>({
    queryKey: adminKeys.categories,
    queryFn: getCategories,
    enabled: useAdminEnabled(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation<AdminCourse, ApiError, AdminCourseInput>({
    mutationFn: createAdminCourse,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation<
    AdminCourse,
    ApiError,
    { id: number; payload: Partial<AdminCourseInput> }
  >({
    mutationFn: ({ id, payload }) => updateAdminCourse(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.course(id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
    },
  });
}

export function usePublishCourse() {
  const queryClient = useQueryClient();
  return useMutation<AdminCourse, ApiError, number>({
    mutationFn: (id) => publishCourse(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useArchiveCourse() {
  const queryClient = useQueryClient();
  return useMutation<AdminCourse, ApiError, number>({
    mutationFn: (id) => archiveCourse(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] }),
  });
}

// --- Instructors -----------------------------------------------------------

export function useAdminInstructors(filters: InstructorFilters = {}) {
  return useQuery<Paginated<AdminInstructor>, ApiError>({
    queryKey: adminKeys.instructors(filters),
    queryFn: () => getInstructors(filters),
    enabled: useAdminEnabled(),
  });
}

export function useCreateInstructor() {
  const queryClient = useQueryClient();
  return useMutation<AdminInstructor, ApiError, CreateInstructorInput>({
    mutationFn: createInstructor,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "instructors"] }),
  });
}

export function useSuspendInstructor() {
  const queryClient = useQueryClient();
  return useMutation<AdminInstructor, ApiError, number>({
    mutationFn: (id) => suspendInstructor(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "instructors"] }),
  });
}

export function useActivateInstructor() {
  const queryClient = useQueryClient();
  return useMutation<AdminInstructor, ApiError, number>({
    mutationFn: (id) => activateInstructor(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "instructors"] }),
  });
}

// --- Audit log -------------------------------------------------------------

export function useAuditLog(filters: AuditLogFilters = {}) {
  return useQuery<Paginated<AuditLogEntry>, ApiError>({
    queryKey: adminKeys.auditLog(filters),
    queryFn: () => getAuditLog(filters),
    enabled: useAdminEnabled(),
  });
}

// --- Payments --------------------------------------------------------------

export function useAdminPayments(filters: PaymentFilters = {}) {
  return useQuery<Paginated<Payment>, ApiError>({
    queryKey: adminKeys.payments(filters),
    queryFn: () => getAdminPayments(filters),
    enabled: useAdminEnabled(),
  });
}

export function useRefundPayment() {
  const queryClient = useQueryClient();
  return useMutation<Payment, ApiError, number>({
    mutationFn: (id) => refundPayment(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "payments"] }),
  });
}

// --- Blog ------------------------------------------------------------------

export function useAdminBlogPosts(filters: BlogFilters = {}) {
  return useQuery<Paginated<BlogPost>, ApiError>({
    queryKey: adminKeys.blog(filters),
    queryFn: () => getAdminBlogPosts(filters),
    enabled: useAdminEnabled(),
  });
}

export function useAdminBlogPost(id: number) {
  return useQuery<BlogPost, ApiError>({
    queryKey: adminKeys.blogPost(id),
    queryFn: () => getAdminBlogPost(id),
    enabled: useAdminEnabled() && Number.isFinite(id) && id > 0,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation<BlogPost, ApiError, AdminBlogInput>({
    mutationFn: createBlogPost,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  return useMutation<
    BlogPost,
    ApiError,
    { id: number; payload: Partial<AdminBlogInput> }
  >({
    mutationFn: ({ id, payload }) => updateBlogPost(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.blogPost(id) });
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] });
    },
  });
}

export function useSetBlogPublished() {
  const queryClient = useQueryClient();
  return useMutation<
    BlogPost,
    ApiError,
    { id: number; isPublished: boolean }
  >({
    mutationFn: ({ id, isPublished }) => setBlogPublished(id, isPublished),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, number>({
    mutationFn: (id) => deleteBlogPost(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });
}

// --- Settings / uploads ----------------------------------------------------

export function useSettings() {
  return useQuery<AdminSettings, ApiError>({
    queryKey: adminKeys.settings,
    queryFn: getAdminSettings,
    enabled: useAdminEnabled(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation<AdminSettings, ApiError, Partial<AdminSettings>>({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(adminKeys.settings, data);
      queryClient.invalidateQueries({ queryKey: ["settings", "public"] });
    },
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();
  return useMutation<{ logo_url: string }, ApiError, File>({
    mutationFn: uploadLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.settings });
      queryClient.invalidateQueries({ queryKey: ["settings", "public"] });
    },
  });
}

export function useUploadImage() {
  return useMutation<{ url: string }, ApiError, File>({
    mutationFn: uploadImage,
  });
}
