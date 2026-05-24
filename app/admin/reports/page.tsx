"use client";

import { useState } from "react";
import { Download, TrendingUp, Users, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Progress } from "@/components/ui/Progress";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { StatsCard } from "@/components/courses/StatsCard";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { LineChart } from "@/components/admin/LineChart";
import { BarChart } from "@/components/admin/BarChart";
import { toast } from "@/components/ui/use-toast";
import {
  useCompletionsReport,
  useExportPayments,
  useExportStudents,
  useReportEnrollments,
  useReportRevenue,
  useTopCourses,
} from "@/lib/hooks/useReports";
import { DEFAULT_CURRENCY } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type {
  CompletionRow,
  Locale,
  ReportPeriod,
  TopCourseRow,
} from "@/lib/types";

const PERIODS: { value: ReportPeriod; labelKey: string }[] = [
  { value: "daily", labelKey: "periodDaily" },
  { value: "monthly", labelKey: "periodMonthly" },
  { value: "yearly", labelKey: "periodYearly" },
];

function PeriodSelector({
  value,
  onChange,
}: {
  value: ReportPeriod;
  onChange: (p: ReportPeriod) => void;
}) {
  const t = useTranslations("reports");
  return (
    <div className="mb-4 inline-flex rounded-md border border-gray-200 p-0.5 dark:border-gray-700">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onChange(p.value)}
          className={cn(
            "rounded px-3 py-1.5 text-sm font-medium transition-colors",
            value === p.value
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
          )}
        >
          {t(p.labelKey)}
        </button>
      ))}
    </div>
  );
}

export default function AdminReportsPage() {
  const t = useTranslations("reports");
  const locale = useLocale() as Locale;

  const [revenuePeriod, setRevenuePeriod] = useState<ReportPeriod>("monthly");
  const [enrollPeriod, setEnrollPeriod] = useState<ReportPeriod>("monthly");

  const revenue = useReportRevenue(revenuePeriod);
  const enrollments = useReportEnrollments(enrollPeriod);
  const completions = useCompletionsReport();
  const topCourses = useTopCourses();

  const exportStudents = useExportStudents();
  const exportPayments = useExportPayments();

  const money = (n: number) =>
    new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: DEFAULT_CURRENCY,
      maximumFractionDigits: 0,
    }).format(n);

  const completionColumns: Column<CompletionRow>[] = [
    { key: "course", header: t("colCourse"), cell: (r) => r.course_title },
    { key: "enrolled", header: t("colEnrolled"), cell: (r) => r.enrolled },
    { key: "completed", header: t("colCompleted"), cell: (r) => r.completed },
    {
      key: "rate",
      header: t("colCompletionRate"),
      className: "w-48",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Progress value={r.rate} />
          <span className="shrink-0 text-xs text-gray-500">{r.rate}%</span>
        </div>
      ),
    },
  ];

  const topColumns: Column<TopCourseRow>[] = [
    {
      key: "rank",
      header: t("colRank"),
      className: "w-10",
      cell: () => "",
    },
    { key: "title", header: t("colCourse"), cell: (r) => r.title },
    { key: "enrollments", header: t("colEnrollments"), cell: (r) => r.enrollments },
    { key: "revenue", header: t("colRevenue"), cell: (r) => money(r.revenue) },
    {
      key: "completion",
      header: t("colCompletionRate"),
      cell: (r) => `${r.completion_rate}%`,
    },
  ];

  // Inject rank numbers (1-based) into the first column.
  topColumns[0].cell = ((): Column<TopCourseRow>["cell"] => {
    const list = topCourses.data ?? [];
    return (row) => String(list.indexOf(row) + 1);
  })();

  function runExport(
    mutation: ReturnType<typeof useExportStudents>,
  ) {
    mutation.mutate(undefined, {
      onError: () => toast({ title: t("exportError"), variant: "destructive" }),
    });
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={t("title")}
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              isLoading={exportStudents.isPending}
              onClick={() => runExport(exportStudents)}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("exportStudents")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              isLoading={exportPayments.isPending}
              onClick={() => runExport(exportPayments)}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("exportPayments")}
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">{t("tabRevenue")}</TabsTrigger>
          <TabsTrigger value="enrollments">{t("tabEnrollments")}</TabsTrigger>
          <TabsTrigger value="completions">{t("tabCompletions")}</TabsTrigger>
          <TabsTrigger value="top">{t("tabTopCourses")}</TabsTrigger>
        </TabsList>

        {/* Revenue */}
        <TabsContent value="revenue">
          <PeriodSelector value={revenuePeriod} onChange={setRevenuePeriod} />
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatsCard icon={Wallet} label={t("totalRevenue")} value={revenue.data ? money(revenue.data.total) : "—"} isLoading={revenue.isLoading} />
            <StatsCard icon={TrendingUp} label={t("thisMonth")} value={revenue.data ? money(revenue.data.this_month) : "—"} isLoading={revenue.isLoading} />
            <StatsCard icon={Wallet} label={t("netRevenue")} value={revenue.data ? money(revenue.data.net) : "—"} isLoading={revenue.isLoading} />
          </div>
          <Card>
            <CardContent className="p-6 pt-6">
              {revenue.isLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : revenue.isError ? (
                <Alert variant="error">{t("loadError")}</Alert>
              ) : revenue.data && revenue.data.series.length > 0 ? (
                <LineChart data={revenue.data.series} />
              ) : (
                <p className="py-12 text-center text-sm text-gray-500">{t("empty")}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Enrollments */}
        <TabsContent value="enrollments">
          <PeriodSelector value={enrollPeriod} onChange={setEnrollPeriod} />
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatsCard icon={Users} label={t("totalEnrollments")} value={enrollments.data?.total ?? 0} isLoading={enrollments.isLoading} />
            <StatsCard icon={TrendingUp} label={t("thisMonth")} value={enrollments.data?.this_month ?? 0} isLoading={enrollments.isLoading} />
          </div>
          <Card>
            <CardContent className="p-6 pt-6">
              {enrollments.isLoading ? (
                <Skeleton className="h-56 w-full" />
              ) : enrollments.isError ? (
                <Alert variant="error">{t("loadError")}</Alert>
              ) : enrollments.data && enrollments.data.series.length > 0 ? (
                <BarChart data={enrollments.data.series} />
              ) : (
                <p className="py-12 text-center text-sm text-gray-500">{t("empty")}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Completions */}
        <TabsContent value="completions">
          <div className="mb-6">
            <StatsCard
              icon={TrendingUp}
              label={t("overallCompletion")}
              value={completions.data ? `${completions.data.overall_rate}%` : "—"}
              isLoading={completions.isLoading}
              className="sm:max-w-xs"
            />
          </div>
          <DataTable
            columns={completionColumns}
            data={completions.data?.rows}
            rowKey={(r) => r.course_id}
            isLoading={completions.isLoading}
            isError={completions.isError}
            emptyMessage={t("empty")}
          />
        </TabsContent>

        {/* Top courses */}
        <TabsContent value="top">
          <DataTable
            columns={topColumns}
            data={topCourses.data}
            rowKey={(r) => r.course_id}
            isLoading={topCourses.isLoading}
            isError={topCourses.isError}
            emptyMessage={t("empty")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
