"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Pencil, Plus, Send, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ActionsMenu } from "@/components/admin/ActionsMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  useArchiveInstructorCourse,
  useInstructorCourses,
  usePublishInstructorCourse,
} from "@/lib/hooks/useInstructor";
import { cn } from "@/lib/utils/cn";
import type { AdminCourse, CourseStatus } from "@/lib/types";

const STATUS_VARIANT: Record<CourseStatus, BadgeVariant> = {
  draft: "default",
  published: "success",
  archived: "warning",
};

type StatusFilter = CourseStatus | "";

const FILTERS: { value: StatusFilter; labelKey: string }[] = [
  { value: "", labelKey: "filterAll" },
  { value: "draft", labelKey: "statusDraft" },
  { value: "published", labelKey: "statusPublished" },
  { value: "archived", labelKey: "statusArchived" },
];

export default function InstructorCoursesPage() {
  const t = useTranslations("instructor");
  const router = useRouter();

  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [archiveTarget, setArchiveTarget] = useState<AdminCourse | null>(null);

  const courses = useInstructorCourses({ page, status: status || undefined });
  const publish = usePublishInstructorCourse();
  const archive = useArchiveInstructorCourse();

  const totalPages = courses.data
    ? Math.max(1, Math.ceil(courses.data.total / courses.data.per_page))
    : 1;

  const columns: Column<AdminCourse>[] = [
    {
      key: "title",
      header: t("colTitle"),
      cell: (c) => (
        <span className="font-medium text-gray-900 dark:text-gray-50">{c.title}</span>
      ),
    },
    {
      key: "enrollments",
      header: t("colEnrollments"),
      cell: (c) => c.enrollments_count,
    },
    {
      key: "status",
      header: t("colStatus"),
      cell: (c) => (
        <Badge variant={STATUS_VARIANT[c.status]}>
          {c.status === "published"
            ? t("statusPublished")
            : c.status === "archived"
              ? t("statusArchived")
              : t("statusDraft")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      className: "w-12 text-end",
      cell: (c) => (
        <ActionsMenu
          items={[
            {
              label: t("build"),
              icon: <Wrench className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => router.push(`/instructor/courses/${c.id}/builder`),
            },
            {
              label: t("edit"),
              icon: <Pencil className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => router.push(`/instructor/courses/${c.id}/edit`),
            },
            {
              label: t("publish"),
              icon: <Send className="h-4 w-4" aria-hidden="true" />,
              disabled: c.status === "published",
              onSelect: () => publish.mutate(c.id),
            },
            {
              label: t("archive"),
              icon: <Archive className="h-4 w-4" aria-hidden="true" />,
              disabled: c.status === "archived",
              onSelect: () => setArchiveTarget(c),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={t("coursesTitle")}
        action={
          <Link href="/instructor/courses/create">
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("createCourse")}
            </Button>
          </Link>
        }
      />

      <div className="mb-6 inline-flex rounded-md border border-gray-200 p-0.5 dark:border-gray-700">
        {FILTERS.map((f) => (
          <button
            key={f.value || "all"}
            type="button"
            onClick={() => {
              setStatus(f.value);
              setPage(1);
            }}
            className={cn(
              "rounded px-3 py-1.5 text-sm font-medium transition-colors",
              status === f.value
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            {t(f.labelKey)}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={courses.data?.data}
        rowKey={(c) => c.id}
        isLoading={courses.isLoading}
        isError={courses.isError}
        emptyMessage={t("empty")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={archiveTarget !== null}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title={t("archive")}
        confirmLabel={t("archive")}
        variant="warning"
        isLoading={archive.isPending}
        onConfirm={() => {
          if (archiveTarget) {
            archive.mutate(archiveTarget.id, {
              onSettled: () => setArchiveTarget(null),
            });
          }
        }}
      />
    </div>
  );
}
