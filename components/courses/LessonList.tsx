"use client";

import Link from "next/link";
import { Check, ClipboardList, Lock, PlayCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CourseSection, LessonWithProgress } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export interface LessonListProps {
  sections: CourseSection[];
  activeLessonId: number | null;
  onSelect: (lesson: LessonWithProgress) => void;
  /** Needed to build section-quiz links. */
  enrollmentId: number;
}

/** Sidebar navigator: lessons grouped by section, with completion status. */
export function LessonList({
  sections,
  activeLessonId,
  onSelect,
  enrollmentId,
}: LessonListProps) {
  const t = useTranslations("learn");
  const tQuiz = useTranslations("quiz");
  const ordered = [...sections].sort((a, b) => a.order - b.order);

  return (
    <nav aria-label={t("courseProgress")} className="flex flex-col">
      {ordered.map((section) => {
        const lessons = [...section.lessons].sort((a, b) => a.order - b.order);
        return (
          <div key={section.id} className="border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between gap-2 bg-gray-50 px-4 py-2 dark:bg-gray-900">
              <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
                {section.title}
              </h3>
              <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                {t("lessonsCount", { count: lessons.length })}
              </span>
            </div>

            <ul>
              {lessons.map((lesson) => {
                const active = lesson.id === activeLessonId;
                const locked = Boolean(lesson.locked);
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      disabled={locked}
                      onClick={() => !locked && onSelect(lesson)}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition-colors",
                        locked
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-gray-50 dark:hover:bg-gray-900",
                        active && "bg-blue-50 dark:bg-blue-950",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          lesson.completed
                            ? "bg-green-600 text-white"
                            : "text-gray-400",
                        )}
                        aria-hidden="true"
                      >
                        {lesson.completed ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : locked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <PlayCircle
                            className={cn("h-5 w-5", active && "text-blue-600")}
                          />
                        )}
                      </span>
                      <span className="flex-1 truncate text-gray-900 dark:text-gray-50">
                        {lesson.title}
                      </span>
                      <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                        {lesson.duration_minutes}m
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {section.quiz_id ? (
              <Link
                href={`/dashboard/courses/${enrollmentId}/quiz/${section.id}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <ClipboardList className="h-5 w-5 shrink-0" aria-hidden="true" />
                {tQuiz("start")}
              </Link>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
