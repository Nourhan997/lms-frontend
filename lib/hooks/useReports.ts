"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  exportPaymentsCsv,
  exportStudentsCsv,
  getCompletionsReport,
  getEnrollmentReport,
  getRevenueReport,
  getTopCourses,
} from "@/lib/api/reports";
import { useAuthStore } from "@/lib/store/authStore";
import type {
  ApiError,
  CompletionsReport,
  EnrollmentReportData,
  ReportPeriod,
  RevenueReportData,
  TopCourseRow,
} from "@/lib/types";

export const reportKeys = {
  revenue: (period: ReportPeriod) => ["reports", "revenue", period] as const,
  enrollments: (period: ReportPeriod) =>
    ["reports", "enrollments", period] as const,
  completions: ["reports", "completions"] as const,
  topCourses: ["reports", "top-courses"] as const,
};

function useReportsEnabled() {
  return Boolean(useAuthStore((s) => s.token));
}

export function useReportRevenue(period: ReportPeriod) {
  return useQuery<RevenueReportData, ApiError>({
    queryKey: reportKeys.revenue(period),
    queryFn: () => getRevenueReport(period),
    enabled: useReportsEnabled(),
  });
}

export function useReportEnrollments(period: ReportPeriod) {
  return useQuery<EnrollmentReportData, ApiError>({
    queryKey: reportKeys.enrollments(period),
    queryFn: () => getEnrollmentReport(period),
    enabled: useReportsEnabled(),
  });
}

export function useCompletionsReport() {
  return useQuery<CompletionsReport, ApiError>({
    queryKey: reportKeys.completions,
    queryFn: getCompletionsReport,
    enabled: useReportsEnabled(),
  });
}

export function useTopCourses() {
  return useQuery<TopCourseRow[], ApiError>({
    queryKey: reportKeys.topCourses,
    queryFn: getTopCourses,
    enabled: useReportsEnabled(),
  });
}

export function useExportStudents() {
  return useMutation<void, ApiError, void>({ mutationFn: exportStudentsCsv });
}

export function useExportPayments() {
  return useMutation<void, ApiError, void>({ mutationFn: exportPaymentsCsv });
}
