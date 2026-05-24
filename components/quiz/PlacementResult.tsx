"use client";

import Link from "next/link";
import { Award, Share2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { toast } from "@/components/ui/use-toast";
import { useEnroll } from "@/lib/hooks/useEnrollments";
import { formatPrice } from "@/lib/utils/format";
import type { Locale, PlacementResult as PlacementResultType } from "@/lib/types";

export function PlacementResult({ result }: { result: PlacementResultType }) {
  const t = useTranslations("placement");
  const tc = useTranslations("courses");
  const locale = useLocale() as Locale;
  const enrollMutation = useEnroll();
  const course = result.suggested_course;

  async function share() {
    const text = `${t("yourLevel")}: ${result.level_label} (${result.level_code}) — ${result.score}%`;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: t("shareCopied"), variant: "success" });
    } catch {
      toast({ title: t("shareError"), variant: "destructive" });
    }
  }

  function enroll() {
    if (!course) return;
    enrollMutation.mutate(course.id, {
      onSuccess: () => toast({ title: t("enrollSuccess"), variant: "success" }),
      onError: () => toast({ title: t("enrollError"), variant: "destructive" }),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Level + score */}
      <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
        <CardContent className="flex flex-col items-center gap-2 p-8 pt-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
            <Award className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t("yourLevel")}
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {result.level_label} — {result.level_code}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {t("scoreLabel")}: {result.score}%
          </span>
        </CardContent>
      </Card>

      {/* Suggested course */}
      {course && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("suggestedCourse")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/courses/${course.slug}`}
                className="font-medium text-gray-900 hover:underline dark:text-gray-50"
              >
                {course.title}
              </Link>
              <Badge variant="info">
                {formatPrice(course.price, locale) ?? tc("free")}
              </Badge>
            </div>
            <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
              {course.description}
            </p>
            <div>
              <Button onClick={enroll} isLoading={enrollMutation.isPending}>
                {t("enrollSuggested")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" onClick={share}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          {t("share")}
        </Button>
        <Link
          href="/courses"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          {t("browseAll")}
        </Link>
      </div>
    </div>
  );
}
