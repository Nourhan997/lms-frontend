"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Progress } from "@/components/ui/Progress";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { useInstructorStudents } from "@/lib/hooks/useInstructor";
import type { InstructorStudentRow } from "@/lib/api/instructor";
import { formatDate } from "@/lib/utils/format";
import type { Locale } from "@/lib/types";

export default function InstructorStudentsPage() {
  const t = useTranslations("instructor");
  const locale = useLocale() as Locale;
  const [page, setPage] = useState(1);
  const students = useInstructorStudents(page);

  const totalPages = students.data
    ? Math.max(1, Math.ceil(students.data.total / students.data.per_page))
    : 1;

  const columns: Column<InstructorStudentRow>[] = [
    {
      key: "student",
      header: t("colStudent"),
      cell: (r) => (
        <span className="font-medium text-gray-900 dark:text-gray-50">
          {r.student_name}
        </span>
      ),
    },
    { key: "course", header: t("colCourse"), cell: (r) => r.course_title },
    {
      key: "progress",
      header: t("colProgress"),
      className: "w-48",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Progress value={r.progress} />
          <span className="shrink-0 text-xs text-gray-500">{r.progress}%</span>
        </div>
      ),
    },
    {
      key: "enrolled",
      header: t("colEnrolled"),
      cell: (r) => formatDate(r.enrolled_at, locale),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={t("studentsTitle")} subtitle={t("studentsNote")} />

      <Alert variant="info" className="mb-6">
        {t("studentsNote")}
      </Alert>

      <DataTable
        columns={columns}
        data={students.data?.data}
        rowKey={(r) => r.enrollment_id}
        isLoading={students.isLoading}
        isError={students.isError}
        emptyMessage={t("studentsEmpty")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
