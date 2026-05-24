"use client";

import Link from "next/link";
import { Award, BookOpen, Compass, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Card, CardContent } from "@/components/ui/Card";
import { CourseCard } from "@/components/courses/CourseCard";
import { usePlatformSettings } from "@/lib/hooks/useSettings";
import { useCourses, usePublicCategories } from "@/lib/hooks/useCourses";

export function LandingContent() {
  const t = useTranslations("landing");
  const tCommon = useTranslations("common");
  const { data: settings } = usePlatformSettings();
  const courses = useCourses({ per_page: 6 });
  const categories = usePublicCategories();

  const platformName = settings?.platform_name ?? tCommon("appName");
  const tagline = settings?.tagline ?? tCommon("tagline");

  const steps = [
    { icon: Compass, title: t("step1Title"), body: t("step1Body") },
    { icon: BookOpen, title: t("step2Title"), body: t("step2Body") },
    { icon: Award, title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-blue-50 to-white dark:border-gray-800 dark:from-blue-950 dark:to-gray-950">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center">
          <h1 className="text-balance text-4xl font-bold text-gray-900 sm:text-5xl dark:text-gray-50">
            {platformName}
          </h1>
          <p className="text-balance text-lg text-gray-600 dark:text-gray-300">
            {tagline}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/courses">
              <Button size="lg">{t("browseCourses")}</Button>
            </Link>
            <Link href="/placement">
              <Button size="lg" variant="outline">
                {t("findMyLevel")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {t("featured")}
        </h2>
        {courses.isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant="course" />
            ))}
          </div>
        ) : courses.isError ? (
          <Alert variant="error">{tCommon("error")}</Alert>
        ) : courses.data && courses.data.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.data.data.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : null}
      </section>

      {/* How it works */}
      <section className="border-y border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto w-full max-w-5xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-semibold text-gray-900 dark:text-gray-50">
            {t("howItWorks")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
                  <step.icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-50">
          {t("categories")}
        </h2>
        {categories.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} variant="stat" />
            ))}
          </div>
        ) : categories.data && categories.data.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.data.map((category) => (
              <Link
                key={category.id}
                href={`/courses?category=${encodeURIComponent(category.slug)}`}
              >
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      <GraduationCap className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900 dark:text-gray-50">
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("coursesCount", { count: category.course_count })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      {/* CTA banner */}
      <section className="bg-blue-600">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("ctaTitle")}</h2>
          <p className="text-blue-100">{t("ctaBody")}</p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              {t("ctaButton")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
