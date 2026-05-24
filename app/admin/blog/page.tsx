"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ActionsMenu } from "@/components/admin/ActionsMenu";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  useAdminBlogPosts,
  useDeleteBlogPost,
  useSetBlogPublished,
} from "@/lib/hooks/useAdmin";
import { formatDate } from "@/lib/utils/format";
import type { BlogPost, Locale } from "@/lib/types";

export default function AdminBlogPage() {
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const posts = useAdminBlogPosts({ page });
  const setPublished = useSetBlogPublished();
  const remove = useDeleteBlogPost();

  const totalPages = posts.data
    ? Math.max(1, Math.ceil(posts.data.total / posts.data.per_page))
    : 1;

  const columns: Column<BlogPost>[] = [
    {
      key: "title",
      header: t("colTitle"),
      cell: (p) => (
        <span className="font-medium text-gray-900 dark:text-gray-50">
          {p.title}
        </span>
      ),
    },
    {
      key: "status",
      header: t("colStatus"),
      cell: (p) => (
        <Badge variant={p.is_published ? "success" : "default"}>
          {p.is_published ? t("blogStatusPublished") : t("blogStatusDraft")}
        </Badge>
      ),
    },
    {
      key: "published",
      header: t("colPublished"),
      cell: (p) => (p.published_at ? formatDate(p.published_at, locale) : "—"),
    },
    {
      key: "actions",
      header: t("actions"),
      className: "w-12 text-end",
      cell: (p) => (
        <ActionsMenu
          items={[
            {
              label: t("edit"),
              icon: <Pencil className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => router.push(`/admin/blog/${p.id}/edit`),
            },
            p.is_published
              ? {
                  label: t("unpublish"),
                  icon: <EyeOff className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () =>
                    setPublished.mutate({ id: p.id, isPublished: false }),
                }
              : {
                  label: t("publish"),
                  icon: <Eye className="h-4 w-4" aria-hidden="true" />,
                  onSelect: () =>
                    setPublished.mutate({ id: p.id, isPublished: true }),
                },
            {
              label: t("delete"),
              variant: "danger",
              icon: <Trash2 className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => setDeleteTarget(p),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={t("blogTitle")}
        action={
          <Link href="/admin/blog/create">
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("createPost")}
            </Button>
          </Link>
        }
      />

      <DataTable
        columns={columns}
        data={posts.data?.data}
        rowKey={(p) => p.id}
        isLoading={posts.isLoading}
        isError={posts.isError}
        emptyMessage={t("empty")}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("deletePostTitle")}
        description={t("deletePostBody")}
        confirmLabel={t("delete")}
        variant="danger"
        isLoading={remove.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            remove.mutate(deleteTarget.id, {
              onSettled: () => setDeleteTarget(null),
            });
          }
        }}
      />
    </div>
  );
}
