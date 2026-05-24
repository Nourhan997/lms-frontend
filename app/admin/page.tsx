"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  GraduationCap,
  Plus,
  Users,
  Wallet,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsCard } from "@/components/courses/StatsCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { useAdminDashboard, useRevenueReport } from "@/lib/hooks/useAdmin";
import { DEFAULT_CURRENCY, formatDate } from "@/lib/utils/format";
import type { Locale, RecentEnrollment } from "@/lib/types";

export default function AdminDashboardPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const dashboard = useAdminDashboard();
  const revenue = useRevenueReport("12m");

  const money = (n: number) =>
    new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: DEFAULT_CURRENCY,
      maximumFractionDigits: 0,
    }).format(n);

  const columns: Column<RecentEnrollment>[] = [
    { key: "student", header: t("colStudent"), cell: (r) => r.student_name },
    { key: "course", header: t("colCourse"), cell: (r) => r.course_title },
    {
      key: "date",
      header: t("colDate"),
      cell: (r) => formatDate(r.enrolled_at, locale),
    },
    {
      key: "status",
      header: t("colStatus"),
      cell: (r) => (
        <Badge variant={r.status === "completed" ? "success" : "info"}>
          {r.status === "completed"
            ? t("enrollStatusCompleted")
            : t("enrollStatusActive")}
        </Badge>
      ),
    },
  ];

  const d = dashboard.data;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={t("dashboardTitle")}
        action={
          <Link href="/admin/courses/create">
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("createCourse")}
            </Button>
          </Link>
        }
      />

      {dashboard.isError ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : (
        <>
          {/* Stats */}
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatsCard
              icon={Users}
              label={t("statStudents")}
              value={d?.total_students ?? 0}
              isLoading={dashboard.isLoading}
            />
            <StatsCard
              icon={BookOpen}
              label={t("statCourses")}
              value={d?.total_courses ?? 0}
              isLoading={dashboard.isLoading}
            />
            <StatsCard
              icon={Wallet}
              label={t("statRevenue")}
              value={d ? money(d.total_revenue) : "—"}
              isLoading={dashboard.isLoading}
            />
            <StatsCard
              icon={GraduationCap}
              label={t("statEnrollments")}
              value={d?.active_enrollments ?? 0}
              isLoading={dashboard.isLoading}
            />
            <StatsCard
              icon={Award}
              label={t("statCertificates")}
              value={d?.certificates_issued ?? 0}
              isLoading={dashboard.isLoading}
            />
          </section>

          {/* Revenue chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">{t("revenueTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {revenue.isLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : revenue.isError ? (
                <Alert variant="error">{t("loadError")}</Alert>
              ) : (
                <RevenueChart data={revenue.data ?? []} />
              )}
            </CardContent>
          </Card>

          {/* Recent enrollments */}
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-50">
              {t("recentEnrollments")}
            </h2>
            <DataTable
              columns={columns}
              data={d?.recent_enrollments}
              rowKey={(r) => r.id}
              isLoading={dashboard.isLoading}
              isError={dashboard.isError}
              emptyMessage={t("empty")}
            />
          </section>

          {/* Quick actions */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-50">
              {t("quickActions")}
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/courses/create">
                <Button variant="outline">{t("createCourse")}</Button>
              </Link>
              <Link href="/admin/students">
                <Button variant="outline">{t("addStudent")}</Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline">{t("viewReports")}</Button>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
