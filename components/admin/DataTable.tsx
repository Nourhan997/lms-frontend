"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Extra classes for both header + cells (e.g. width, alignment). */
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  rowKey: (row: T) => string | number;
  isLoading: boolean;
  isError?: boolean;
  emptyMessage: string;
  errorMessage?: string;
  /** Pagination (omit to hide controls). */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading,
  isError = false,
  emptyMessage,
  errorMessage,
  page,
  totalPages,
  onPageChange,
}: DataTableProps<T>) {
  const t = useTranslations("admin");

  const showPagination =
    typeof page === "number" &&
    typeof totalPages === "number" &&
    totalPages > 1 &&
    onPageChange;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn("px-4 py-3 text-start font-medium", col.className)}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length} className="p-6">
                    <Alert variant="error">{errorMessage ?? t("loadError")}</Alert>
                  </td>
                </tr>
              ) : !data || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                  <tr
                    key={rowKey(row)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-4 py-3 align-middle", col.className)}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showPagination && (
          <div className="flex items-center justify-center gap-3 border-t border-gray-100 p-4 dark:border-gray-800">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(Math.max(1, page - 1))}
            >
              {t("previous")}
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            >
              {t("next")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
