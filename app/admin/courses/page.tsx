"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Archive, GraduationCap, Pencil, Plus, Send, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ActionsMenu } from "@/components/admin/ActionsMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  useAdminCourses,
  useArchiveCourse,
  useDeleteCourse,
  usePublishCourse,
} from "@/lib/hooks/useAdmin";
import { formatPrice } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { AdminCourse, CourseStatus, Locale } from "@/lib/types";

const STATUS_VARIANT: Record<CourseStatus, BadgeVariant> = {
  draft: "default",
  published: "success",
  archived: "warning",
};

type StatusFilter = CourseStatus | "";

const FILTERS: { value: StatusFilter; labelKey: string }[] = [
  { value: "", labelKey: "filterAll" },
  { value: "draft", labelKey: "courseStatusDraft" },
  { value: "published", labelKey: "courseStatusPublished" },
  { value: "archived", labelKey: "courseStatusArchived" },
];

interface PendingAction {
  type: "archive" | "delete";
  course: AdminCourse;
}

export default function AdminCoursesPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const courses = useAdminCourses({ page, status: status || undefined });
  const publish = usePublishCourse();
  const archive = useArchiveCourse();
  const remove = useDeleteCourse();

  const totalPages = courses.data
    ? Math.max(1, Math.ceil(courses.data.total / courses.data.per_page))
    : 1;

  function confirmAction() {
    if (!pending) return;
    const mutation = pending.type === "archive" ? archive : remove;
    mutation.mutate(pending.course.id, { onSettled: () => setPending(null) });
  }

  const columns: Column<AdminCourse>[] = [
    {
      key: "thumbnail",
      header: "",
      className: "w-16",
      cell: (c) => (
        <div className="relative h-9 w-14 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
          {c.thumbnail_url ? (
            <Image src={c.thumbnail_url} alt="" fill sizes="56px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-300">
              <GraduationCap className="h-4 w-4" aria-hidden="true" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      header: t("colTitle"),
      cell: (c) => (
        <span className="font-medium text-gray-900 dark:text-gray-50">{c.title}</span>
      ),
    },
    {
      key: "instructor",
      header: t("colInstructor"),
      cell: (c) => c.instructor_name ?? "—",
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
          {t(
            `courseStatus${c.status.charAt(0).toUpperCase()}${c.status.slice(1)}`,
          )}
        </Badge>
      ),
    },
    {
      key: "price",
      header: t("colPrice"),
      cell: (c) => formatPrice(c.price, locale) ?? "—",
    },
    {
      key: "actions",
      header: t("actions"),
      className: "w-12 text-end",
      cell: (c) => (
        <ActionsMenu
          items={[
            {
              label: t("edit"),
              icon: <Pencil className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => router.push(`/admin/courses/${c.id}/edit`),
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
              onSelect: () => setPending({ type: "archive", course: c }),
            },
            {
              label: t("delete"),
              variant: "danger",
              icon: <Trash2 className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => setPending({ type: "delete", course: c }),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={t("coursesTitle")}
        action={
          <Link href="/admin/courses/create">
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
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending?.type === "archive" ? t("archiveCourseTitle") : t("deleteCourseTitle")}
        description={
          pending?.type === "archive" ? t("archiveCourseBody") : t("deleteCourseBody")
        }
        confirmLabel={pending?.type === "archive" ? t("archive") : t("delete")}
        variant={pending?.type === "archive" ? "warning" : "danger"}
        isLoading={archive.isPending || remove.isPending}
        onConfirm={confirmAction}
      />
    </div>
  );
}
