"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Card, CardContent } from "@/components/ui/Card";
import { useMyEnrollments, type EnrollmentFilter } from "@/lib/hooks/useEnrollments";
import { timeAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Enrollment, Locale } from "@/lib/types";

const TABS: { value: EnrollmentFilter; labelKey: string }[] = [
  { value: "all", labelKey: "tabAll" },
  { value: "in_progress", labelKey: "tabInProgress" },
  { value: "completed", labelKey: "tabCompleted" },
];

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const t = useTranslations("myCourses");
  const locale = useLocale() as Locale;
  const course = enrollment.course;

  return (
    <Link
      href={`/dashboard/courses/${enrollment.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {course?.thumbnail_url ? (
          <Image
            src={course.thumbnail_url}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
            <GraduationCap className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-medium text-gray-900 dark:text-gray-50">
            {course?.title ?? `#${enrollment.course_id}`}
          </h3>
          <Badge variant={enrollment.completed ? "success" : "info"}>
            {enrollment.completed ? t("statusCompleted") : t("statusActive")}
          </Badge>
        </div>

        <div className="mt-auto flex flex-col gap-1.5">
          <Progress value={enrollment.progress} />
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{t("progress", { progress: enrollment.progress })}</span>
            <span>
              {enrollment.last_accessed_at
                ? t("lastAccessed", {
                    time: timeAgo(enrollment.last_accessed_at, locale),
                  })
                : t("neverAccessed")}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MyCoursesPage() {
  const t = useTranslations("myCourses");
  const [filter, setFilter] = useState<EnrollmentFilter>("all");
  const enrollments = useMyEnrollments(filter);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {/* Filter tabs */}
      <div
        className="mb-6 inline-flex rounded-md border border-gray-200 p-0.5 dark:border-gray-700"
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={filter === tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              "rounded px-3 py-1.5 text-sm font-medium transition-colors",
              filter === tab.value
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
            )}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {enrollments.isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} variant="course" />
          ))}
        </div>
      ) : enrollments.isError ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : !enrollments.data || enrollments.data.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("empty")}
            </p>
            <Link href="/courses">
              <Button>{t("browse")}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.data.map((enrollment) => (
            <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
          ))}
        </div>
      )}
    </div>
  );
}
