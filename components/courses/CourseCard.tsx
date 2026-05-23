"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/format";
import type { Course, Locale } from "@/lib/types";

const LEVEL_VARIANT: Record<Course["level"], BadgeVariant> = {
  beginner: "success",
  intermediate: "info",
  advanced: "warning",
};

const LEVEL_LABEL: Record<Course["level"], string> = {
  beginner: "levelBeginner",
  intermediate: "levelIntermediate",
  advanced: "levelAdvanced",
};

export function CourseCard({ course }: { course: Course }) {
  const t = useTranslations("courses");
  const locale = useLocale() as Locale;
  const price = formatPrice(course.price, locale);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {course.thumbnail_url ? (
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

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant={LEVEL_VARIANT[course.level]}>
            {t(LEVEL_LABEL[course.level])}
          </Badge>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {price ?? t("free")}
          </span>
        </div>

        <h3 className="line-clamp-2 font-medium text-gray-900 dark:text-gray-50">
          {course.title}
        </h3>
        <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {course.description}
        </p>
      </div>
    </Link>
  );
}
