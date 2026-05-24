"use client";

import { useState } from "react";
import { Plus, UserCheck, UserX } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ActionsMenu } from "@/components/admin/ActionsMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CreateInstructorModal } from "@/components/admin/CreateInstructorModal";
import {
  useActivateInstructor,
  useAdminInstructors,
  useSuspendInstructor,
} from "@/lib/hooks/useAdmin";
import { formatDate } from "@/lib/utils/format";
import type { AdminInstructor, Locale } from "@/lib/types";

interface PendingAction {
  type: "suspend" | "activate";
  instructor: AdminInstructor;
}

export default function AdminInstructorsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;

  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const instructors = useAdminInstructors({ page });
  const suspend = useSuspendInstructor();
  const activate = useActivateInstructor();

  const totalPages = instructors.data
    ? Math.max(1, Math.ceil(instructors.data.total / instructors.data.per_page))
    : 1;

  function confirmAction() {
    if (!pending) return;
    const mutation = pending.type === "suspend" ? suspend : activate;
    mutation.mutate(pending.instructor.id, { onSettled: () => setPending(null) });
  }

  const columns: Column<AdminInstructor>[] = [
    {
      key: "name",
      header: t("colName"),
      cell: (i) => (
        <div className="flex items-center gap-3">
          <Avatar name={i.name} src={i.avatar_url} size="sm" />
          <span className="font-medium text-gray-900 dark:text-gray-50">{i.name}</span>
        </div>
      ),
    },
    { key: "email", header: t("colEmail"), cell: (i) => i.email },
    { key: "courses", header: t("colCourses"), cell: (i) => i.courses_count },
    { key: "students", header: t("colTotalStudents"), cell: (i) => i.students_count },
    {
      key: "status",
      header: t("colStatus"),
      cell: (i) => (
        <Badge variant={i.is_active ? "success" : "danger"}>
          {i.is_active ? t("instructorActive") : t("instructorSuspended")}
        </Badge>
      ),
    },
    {
      key: "joined",
      header: t("colJoined"),
      cell: (i) => formatDate(i.created_at, locale),
    },
    {
      key: "actions",
      header: t("actions"),
      className: "w-12 text-end",
      cell: (i) => (
        <ActionsMenu
          items={[
            i.is_active
              ? {
                  label: t("suspend"),
                  variant: "danger",
                  icon: <UserX className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () => setPending({ type: "suspend", instructor: i }),
                }
              : {
                  label: t("activate"),
                  icon: <UserCheck className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () => setPending({ type: "activate", instructor: i }),
                },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={t("instructorsTitle")}
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("addInstructor")}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={instructors.data?.data}
        rowKey={(i) => i.id}
        isLoading={instructors.isLoading}
        isError={instructors.isError}
        emptyMessage={t("empty")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <CreateInstructorModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending?.type === "suspend" ? t("suspendTitle") : t("activateTitle")}
        description={pending?.type === "suspend" ? t("suspendBody") : t("activateBody")}
        confirmLabel={pending?.type === "suspend" ? t("suspend") : t("activate")}
        variant={pending?.type === "suspend" ? "danger" : "warning"}
        isLoading={suspend.isPending || activate.isPending}
        onConfirm={confirmAction}
      />
    </div>
  );
}
