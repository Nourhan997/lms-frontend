"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { useAuditLog } from "@/lib/hooks/useAdmin";
import { formatDate } from "@/lib/utils/format";
import type { AuditLogEntry, Locale } from "@/lib/types";

const ACTIONS = [
  "created",
  "updated",
  "deleted",
  "published",
  "archived",
  "refunded",
  "suspended",
  "activated",
  "login",
];

const inputClass =
  "h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50";

export default function AdminAuditLogPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;

  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);

  const log = useAuditLog({
    page,
    action: action || undefined,
    from: from || undefined,
    to: to || undefined,
  });

  const totalPages = log.data
    ? Math.max(1, Math.ceil(log.data.total / log.data.per_page))
    : 1;

  const columns: Column<AuditLogEntry>[] = [
    {
      key: "timestamp",
      header: t("colTimestamp"),
      cell: (e) => formatDate(e.created_at, locale),
    },
    { key: "admin", header: t("colAdmin"), cell: (e) => e.admin_name },
    { key: "action", header: t("colAction"), cell: (e) => e.action },
    {
      key: "target",
      header: t("colTarget"),
      cell: (e) =>
        e.target_id != null ? `${e.target_type} #${e.target_id}` : e.target_type,
    },
  ];

  function reset() {
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={t("auditTitle")} />

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="action" className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {t("filterAction")}
          </label>
          <select
            id="action"
            className={inputClass}
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              reset();
            }}
          >
            <option value="">{t("allActions")}</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="from" className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {t("fromDate")}
          </label>
          <input
            id="from"
            type="date"
            className={inputClass}
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              reset();
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="to" className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {t("toDate")}
          </label>
          <input
            id="to"
            type="date"
            className={inputClass}
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              reset();
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={log.data?.data}
        rowKey={(e) => e.id}
        isLoading={log.isLoading}
        isError={log.isError}
        emptyMessage={t("empty")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
