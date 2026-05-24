"use client";

import Image from "next/image";
import { Award, BookOpen, GraduationCap, Infinity as InfinityIcon, Layers, ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { formatPrice } from "@/lib/utils/format";
import type { CourseDetail, Locale } from "@/lib/types";

export function CheckoutSummary({ course }: { course: CourseDetail }) {
  const t = useTranslations("checkout");
  const locale = useLocale() as Locale;
  const price = formatPrice(course.price, locale);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("summaryTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Course */}
        <div className="flex gap-4">
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            {course.thumbnail_url ? (
              <Image
                src={course.thumbnail_url}
                alt={course.title}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-300 dark:text-gray-600">
                <GraduationCap className="h-6 w-6" aria-hidden="true" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-50">
              {course.title}
            </h3>
            {course.instructor_name && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("by", { name: course.instructor_name })}
              </p>
            )}
          </div>
        </div>

        {/* What you get */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-50">
            {t("whatYouGet")}
          </p>
          <ul className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-gray-400" aria-hidden="true" />
              {t("lessonsItem", { count: course.lessons.length })}
            </li>
            {typeof course.sections_count === "number" && (
              <li className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-gray-400" aria-hidden="true" />
                {t("sectionsItem", { count: course.sections_count })}
              </li>
            )}
            <li className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gray-400" aria-hidden="true" />
              {t("certificateItem")}
            </li>
            <li className="flex items-center gap-2">
              <InfinityIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
              {t("lifetimeAccess")}
            </li>
          </ul>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <span className="font-medium text-gray-900 dark:text-gray-50">
            {t("total")}
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-gray-50">
            {price ?? "—"}
          </span>
        </div>

        <Alert variant="info" title={t("secureNote")}>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t("demoNotice")}
          </span>
        </Alert>
      </CardContent>
    </Card>
  );
}
