"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { usePublicBlogPosts } from "@/lib/hooks/useBlog";
import { formatDate } from "@/lib/utils/format";
import type { BlogPost, Locale } from "@/lib/types";

function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = useTranslations("blog");
  const title = (locale === "ar" ? post.title_ar : post.title_en) || post.title;
  const date = post.published_at ?? post.created_at;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {post.thumbnail_url ? (
          <Image
            src={post.thumbnail_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
            <FileText className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-medium text-gray-900 dark:text-gray-50">{title}</h3>
        {post.excerpt && (
          <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-gray-400">
          {post.author_name && <span>{t("by", { author: post.author_name })}</span>}
          <span>{formatDate(date, locale)}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogListPage() {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;
  const [page, setPage] = useState(1);
  const posts = usePublicBlogPosts(page);

  const totalPages = posts.data
    ? Math.max(1, Math.ceil(posts.data.total / posts.data.per_page))
    : 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {posts.isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} variant="course" />
          ))}
        </div>
      ) : posts.isError ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : !posts.data || posts.data.data.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {t("empty")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.data.map((post) => (
              <PostCard key={post.id} post={post} locale={locale} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                {t("previous")}
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t("next")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
