"use client";

import { useTranslations } from "next-intl";
import { CourseCard } from "@/components/courses/CourseCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Alert } from "@/components/ui/Alert";
import type { Course } from "@/lib/types";

export interface CourseListProps {
  courses: Course[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

/** Responsive grid of courses with built-in loading, error and empty states. */
export function CourseList({ courses, isLoading, isError }: CourseListProps) {
  const t = useTranslations("courses");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} variant="course" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <Alert variant="error">{t("loadError")}</Alert>;
  }

  if (!courses || courses.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
        {t("empty")}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
