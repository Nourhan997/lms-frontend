"use client";

import { Lock, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export interface CourseCurriculumProps {
  lessons: Lesson[];
  isEnrolled: boolean;
  activeLessonId: number | null;
  onSelect: (lesson: Lesson) => void;
}

function isPlayable(lesson: Lesson, isEnrolled: boolean): boolean {
  return Boolean(lesson.video_url) && (lesson.is_preview || isEnrolled);
}

export function CourseCurriculum({
  lessons,
  isEnrolled,
  activeLessonId,
  onSelect,
}: CourseCurriculumProps) {
  const t = useTranslations("courses");
  const ordered = [...lessons].sort((a, b) => a.order - b.order);

  return (
    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
      {ordered.map((lesson) => {
        const playable = isPlayable(lesson, isEnrolled);
        const active = lesson.id === activeLessonId;

        return (
          <li key={lesson.id}>
            <button
              type="button"
              disabled={!playable}
              onClick={() => playable && onSelect(lesson)}
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-start text-sm transition-colors",
                playable
                  ? "hover:bg-gray-50 dark:hover:bg-gray-900"
                  : "cursor-not-allowed opacity-60",
                active && "bg-blue-50 dark:bg-blue-950",
              )}
            >
              {playable ? (
                <PlayCircle
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-blue-600" : "text-gray-400",
                  )}
                  aria-hidden="true"
                />
              ) : (
                <Lock className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              )}

              <span className="flex-1 truncate text-gray-900 dark:text-gray-50">
                {lesson.title}
              </span>

              {lesson.is_preview && !isEnrolled && (
                <Badge variant="info">{t("previewBadge")}</Badge>
              )}
              <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                {t("minutes", { minutes: lesson.duration_minutes })}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
