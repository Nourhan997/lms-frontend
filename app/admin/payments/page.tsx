"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "@/components/ui/use-toast";
import {
  useAdminDashboard,
  useAdminPayments,
  useRefundPayment,
} from "@/lib/hooks/useAdmin";
import { DEFAULT_CURRENCY, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Locale, Payment, PaymentStatus } from "@/lib/types";

const STATUS_VARIANT: Record<PaymentStatus, BadgeVariant> = {
  pending: "warning",
  succeeded: "success",
  failed: "danger",
  refunded: "default",
};

type StatusFilter = PaymentStatus | "";

const FILTERS: { value: StatusFilter; labelKey: string }[] = [
  { value: "", labelKey: "filterAll" },
  { value: "succeeded", labelKey: "filterCompleted" },
  { value: "pending", labelKey: "filterPending" },
  { value: "refunded", labelKey: "filterRefunded" },
];

export default function AdminPaymentsPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;

  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [refundTarget, setRefundTarget] = useState<Payment | null>(null);

  const payments = useAdminPayments({ page, status: status || undefined });
  const dashboard = useAdminDashboard();
  const refund = useRefundPayment();

  const totalPages = payments.data
    ? Math.max(1, Math.ceil(payments.data.total / payments.data.per_page))
    : 1;

  const money = (amount: number, currency: string) =>
    new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const columns: Column<Payment>[] = [
    { key: "student", header: t("colStudent"), cell: (p) => p.student_name ?? "—" },
    {
      key: "course",
      header: t("colCourse"),
      cell: (p) => p.course?.title ?? `#${p.course_id}`,
    },
    {
      key: "amount",
      header: t("colAmount"),
      cell: (p) => money(p.amount, p.currency),
    },
    {
      key: "status",
      header: t("colStatus"),
      cell: (p) => (
        <Badge variant={STATUS_VARIANT[p.status]}>
          {t(`payStatus${p.status.charAt(0).toUpperCase()}${p.status.slice(1)}`)}
        </Badge>
      ),
    },
    { key: "gateway", header: t("colGateway"), cell: (p) => p.gateway ?? "—" },
    {
      key: "date",
      header: t("colDate"),
      cell: (p) => formatDate(p.created_at, locale),
    },
    {
      key: "actions",
      header: t("actions"),
      className: "text-end",
      cell: (p) =>
        p.status === "succeeded" ? (
          <Button variant="outline" size="sm" onClick={() => setRefundTarget(p)}>
            {t("refund")}
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t("paymentsTitle")} />

      {/* Total revenue */}
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between p-6 pt-6">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t("totalRevenue")}
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {dashboard.data
              ? money(dashboard.data.total_revenue, DEFAULT_CURRENCY)
              : "—"}
          </span>
        </CardContent>
      </Card>

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
        data={payments.data?.data}
        rowKey={(p) => p.id}
        isLoading={payments.isLoading}
        isError={payments.isError}
        emptyMessage={t("empty")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={refundTarget !== null}
        onOpenChange={(open) => !open && setRefundTarget(null)}
        title={t("refundConfirmTitle")}
        description={t("refundConfirmBody")}
        confirmLabel={t("refund")}
        variant="danger"
        isLoading={refund.isPending}
        onConfirm={() => {
          if (refundTarget) {
            refund.mutate(refundTarget.id, {
              onSuccess: () => toast({ title: t("toastRefunded"), variant: "success" }),
              onSettled: () => setRefundTarget(null),
            });
          }
        }}
      />
    </div>
  );
}
