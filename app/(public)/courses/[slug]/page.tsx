"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CoursePlayer } from "@/components/courses/CoursePlayer";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { EnrollButton } from "@/components/courses/EnrollButton";
import { useCourse } from "@/lib/hooks/useCourses";
import { useEnrollments } from "@/lib/hooks/useEnrollments";
import { formatPrice, totalDurationMinutes } from "@/lib/utils/format";
import type { Course, Lesson, Locale } from "@/lib/types";

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

export default function CourseDetailPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const t = useTranslations("courses");
  const locale = useLocale() as Locale;

  const course = useCourse(slug);
  const enrollments = useEnrollments();

  const isEnrolled = Boolean(
    course.data &&
      enrollments.data?.some((e) => e.course_id === course.data!.id),
  );

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Pick a sensible default lesson once the course (and enrollment) is known.
  useEffect(() => {
    if (!course.data || activeLesson) return;
    const ordered = [...course.data.lessons].sort((a, b) => a.order - b.order);
    const firstPlayable = ordered.find(
      (l) => l.video_url && (l.is_preview || isEnrolled),
    );
    if (firstPlayable) setActiveLesson(firstPlayable);
  }, [course.data, isEnrolled, activeLesson]);

  if (course.isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-4 h-8 w-2/3" />
        <Skeleton className="aspect-video w-full rounded-lg" />
      </div>
    );
  }

  if (course.isError || !course.data) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Alert variant="error">{t("notFound")}</Alert>
      </div>
    );
  }

  const detail = course.data;
  const price = formatPrice(detail.price, locale);
  const duration = totalDurationMinutes(detail.lessons);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        title={detail.title}
        subtitle={
          detail.instructor_name ? t("by", { name: detail.instructor_name }) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {activeLesson?.video_url ? (
            <CoursePlayer src={activeLesson.video_url} />
          ) : (
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              {detail.thumbnail_url ? (
                <Image
                  src={detail.thumbnail_url}
                  alt={detail.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              ) : (
                <GraduationCap
                  className="h-12 w-12 text-gray-300 dark:text-gray-600"
                  aria-hidden="true"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 bg-black/50 p-3 text-center text-sm text-white">
                {activeLesson ? t("noVideo") : t("selectLesson")}
              </span>
            </div>
          )}

          <section>
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50">
              {t("aboutTitle")}
            </h3>
            <p className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">
              {detail.description}
            </p>
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("curriculum")}</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-2">
              <CourseCurriculum
                lessons={detail.lessons}
                isEnrolled={isEnrolled}
                activeLessonId={activeLesson?.id ?? null}
                onSelect={setActiveLesson}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="lg:sticky lg:top-20">
            <CardContent className="flex flex-col gap-4 p-6 pt-6">
              <div className="flex items-center justify-between">
                <Badge variant={LEVEL_VARIANT[detail.level]}>
                  {t(LEVEL_LABEL[detail.level])}
                </Badge>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  {price ?? t("free")}
                </span>
              </div>

              <ul className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {t("lessons", { count: detail.lessons.length })}
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {t("minutes", { minutes: duration })}
                </li>
                <li className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {t("students", { count: detail.students_count })}
                </li>
              </ul>

              <EnrollButton course={detail} fullWidth />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
