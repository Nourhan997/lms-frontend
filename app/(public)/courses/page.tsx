"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import {
  CourseFilters,
  type CourseFiltersValue,
} from "@/components/courses/CourseFilters";
import { CourseList } from "@/components/courses/CourseList";
import { useCourses } from "@/lib/hooks/useCourses";
import { useDebounce } from "@/lib/hooks/useDebounce";

function CoursesCatalog() {
  const t = useTranslations("courses");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<CourseFiltersValue>(() => ({
    search: "",
    level: "",
    language: "",
    category: searchParams.get("category") ?? "",
  }));
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search, 400);

  const query = useCourses({
    page,
    search: debouncedSearch || undefined,
    level: filters.level || undefined,
    language: filters.language || undefined,
    category: filters.category || undefined,
  });

  // Any filter change resets pagination; the category is mirrored to the URL.
  function handleFiltersChange(next: CourseFiltersValue) {
    setFilters(next);
    setPage(1);
    const params = new URLSearchParams();
    if (next.category) params.set("category", next.category);
    const qs = params.toString();
    router.replace(qs ? `/courses?${qs}` : "/courses", { scroll: false });
  }

  const totalPages = query.data
    ? Math.max(1, Math.ceil(query.data.total / query.data.per_page))
    : 1;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <CourseFilters value={filters} onChange={handleFiltersChange} />

      <CourseList
        courses={query.data?.data}
        isLoading={query.isLoading}
        isError={query.isError}
      />

      {query.data && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
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
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {t("next")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesCatalog />
    </Suspense>
  );
}
