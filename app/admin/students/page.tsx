"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, UserCheck, UserX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ActionsMenu } from "@/components/admin/ActionsMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  useActivateStudent,
  useAdminStudents,
  useSuspendStudent,
} from "@/lib/hooks/useAdmin";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { AdminStudent, Locale, StudentStatus } from "@/lib/types";

type StatusFilter = StudentStatus | "";

const FILTERS: { value: StatusFilter; labelKey: string }[] = [
  { value: "", labelKey: "filterAll" },
  { value: "active", labelKey: "filterActive" },
  { value: "suspended", labelKey: "filterSuspended" },
];

interface PendingAction {
  type: "suspend" | "activate";
  student: AdminStudent;
}

export default function AdminStudentsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const students = useAdminStudents({
    page,
    search: debouncedSearch || undefined,
    status: status || undefined,
  });
  const suspend = useSuspendStudent();
  const activate = useActivateStudent();

  const totalPages = students.data
    ? Math.max(1, Math.ceil(students.data.total / students.data.per_page))
    : 1;

  function confirmAction() {
    if (!pending) return;
    const mutation = pending.type === "suspend" ? suspend : activate;
    mutation.mutate(pending.student.id, { onSettled: () => setPending(null) });
  }

  const columns: Column<AdminStudent>[] = [
    {
      key: "name",
      header: t("colName"),
      cell: (s) => (
        <div className="flex items-center gap-3">
          <Avatar name={s.name} src={s.avatar_url} size="sm" />
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {s.name}
          </span>
        </div>
      ),
    },
    { key: "email", header: t("colEmail"), cell: (s) => s.email },
    {
      key: "enrollments",
      header: t("colEnrollments"),
      cell: (s) => s.enrollments_count,
    },
    {
      key: "joined",
      header: t("colJoined"),
      cell: (s) => formatDate(s.created_at, locale),
    },
    {
      key: "status",
      header: t("colStatus"),
      cell: (s) => (
        <Badge variant={s.status === "active" ? "success" : "danger"}>
          {s.status === "active"
            ? t("studentStatusActive")
            : t("studentStatusSuspended")}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: t("actions"),
      className: "w-12 text-end",
      cell: (s) => (
        <ActionsMenu
          items={[
            {
              label: t("viewProfile"),
              onSelect: () => router.push(`/admin/students/${s.id}`),
            },
            s.status === "active"
              ? {
                  label: t("suspend"),
                  variant: "danger",
                  icon: <UserX className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () => setPending({ type: "suspend", student: s }),
                }
              : {
                  label: t("activate"),
                  icon: <UserCheck className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () => setPending({ type: "activate", student: s }),
                },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t("studentsTitle")} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            type="search"
            placeholder={t("searchStudents")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            endAdornment={<Search className="h-4 w-4 text-gray-400" aria-hidden="true" />}
          />
        </div>
        <div className="inline-flex rounded-md border border-gray-200 p-0.5 dark:border-gray-700">
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
      </div>

      <DataTable
        columns={columns}
        data={students.data?.data}
        rowKey={(s) => s.id}
        isLoading={students.isLoading}
        isError={students.isError}
        emptyMessage={t("empty")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending?.type === "suspend" ? t("suspendTitle") : t("activateTitle")}
        description={
          pending?.type === "suspend" ? t("suspendBody") : t("activateBody")
        }
        confirmLabel={pending?.type === "suspend" ? t("suspend") : t("activate")}
        variant={pending?.type === "suspend" ? "danger" : "warning"}
        isLoading={suspend.isPending || activate.isPending}
        onConfirm={confirmAction}
      />
    </div>
  );
}
