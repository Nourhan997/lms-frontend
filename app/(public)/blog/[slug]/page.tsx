import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getPublicBlogPost, getPublicBlogPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/utils/format";
import type { BlogPost, Locale } from "@/lib/types";

function pickTitle(post: BlogPost, locale: Locale): string {
  return (locale === "ar" ? post.title_ar : post.title_en) || post.title;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const post = await getPublicBlogPost(params.slug).catch(() => null);
  if (!post) return { title: "Blog" };
  return { title: pickTitle(post, locale) };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("blog");

  const post = await getPublicBlogPost(params.slug).catch(() => null);
  if (!post) notFound();

  const list = await getPublicBlogPosts(1).catch(() => null);
  const related = (list?.data ?? [])
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const title = pickTitle(post, locale);
  const body = (locale === "ar" ? post.body_ar : post.body_en) || "";
  const date = post.published_at ?? post.created_at;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("backToBlog")}
      </Link>

      <h1 className="text-balance text-3xl font-bold text-gray-900 dark:text-gray-50">
        {title}
      </h1>
      <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        {post.author_name && <span>{t("by", { author: post.author_name })}</span>}
        <span>{formatDate(date, locale)}</span>
      </div>

      {post.thumbnail_url && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <Image
            src={post.thumbnail_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-6 whitespace-pre-line text-gray-700 dark:text-gray-300">
        {body}
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("related")}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-50 dark:hover:bg-gray-900"
              >
                <span className="line-clamp-2">{pickTitle(p, locale)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
