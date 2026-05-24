import { apiClient } from "@/lib/api/client";
import type {
  CompletionsReport,
  EnrollmentReportData,
  ReportPeriod,
  RevenueReportData,
  TopCourseRow,
} from "@/lib/types";

export async function getRevenueReport(
  period: ReportPeriod,
): Promise<RevenueReportData> {
  const { data } = await apiClient.get<RevenueReportData>(
    "/admin/reports/revenue",
    { params: { period } },
  );
  return data;
}

export async function getEnrollmentReport(
  period: ReportPeriod,
): Promise<EnrollmentReportData> {
  const { data } = await apiClient.get<EnrollmentReportData>(
    "/admin/reports/enrollments",
    { params: { period } },
  );
  return data;
}

export async function getCompletionsReport(): Promise<CompletionsReport> {
  const { data } = await apiClient.get<CompletionsReport>(
    "/admin/reports/completions",
  );
  return data;
}

export async function getTopCourses(): Promise<TopCourseRow[]> {
  const { data } = await apiClient.get<TopCourseRow[]>(
    "/admin/reports/top-courses",
  );
  return data;
}

/** Fetch a CSV blob and trigger a browser download. */
async function downloadCsv(path: string, filename: string): Promise<void> {
  const response = await apiClient.get<Blob>(path, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function exportStudentsCsv(): Promise<void> {
  return downloadCsv("/admin/reports/export/students", "students.csv");
}

export function exportPaymentsCsv(): Promise<void> {
  return downloadCsv("/admin/reports/export/payments", "payments.csv");
}
