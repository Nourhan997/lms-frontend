"use client";

import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { useMyPayments } from "@/lib/hooks/usePayments";
import { formatDate } from "@/lib/utils/format";
import type { Locale, PaymentStatus } from "@/lib/types";

const STATUS_VARIANT: Record<PaymentStatus, BadgeVariant> = {
  pending: "warning",
  succeeded: "success",
  failed: "danger",
  refunded: "default",
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "statusPending",
  succeeded: "statusSucceeded",
  failed: "statusFailed",
  refunded: "statusRefunded",
};

function formatAmount(amount: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentsPage() {
  const t = useTranslations("payments");
  const locale = useLocale() as Locale;
  const payments = useMyPayments();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {payments.isLoading ? (
        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : payments.isError ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : !payments.data || payments.data.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-start text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <th className="px-4 py-3 text-start font-medium">
                      {t("colCourse")}
                    </th>
                    <th className="px-4 py-3 text-start font-medium">
                      {t("colAmount")}
                    </th>
                    <th className="px-4 py-3 text-start font-medium">
                      {t("colStatus")}
                    </th>
                    <th className="px-4 py-3 text-start font-medium">
                      {t("colDate")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {payments.data.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-3 text-gray-900 dark:text-gray-50">
                        {payment.course?.title ?? `#${payment.course_id}`}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {formatAmount(payment.amount, payment.currency, locale)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANT[payment.status]}>
                          {t(STATUS_LABEL[payment.status])}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {formatDate(payment.created_at, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
