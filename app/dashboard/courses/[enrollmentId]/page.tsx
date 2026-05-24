"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { LessonList } from "@/components/courses/LessonList";
import { LessonContent } from "@/components/courses/LessonContent";
import { CompletionModal } from "@/components/courses/CompletionModal";
import { useCourseContent, useLessonComplete } from "@/lib/hooks/useEnrollments";

export default function CoursePlayerPage() {
  const params = useParams();
  const enrollmentId = Number(params.enrollmentId);
  const t = useTranslations("learn");

  const content = useCourseContent(enrollmentId);
  const completeLesson = useLessonComplete();

  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);

  const allLessons = useMemo(
    () => content.data?.sections.flatMap((s) => s.lessons) ?? [],
    [content.data],
  );
  const activeLesson =
    allLessons.find((l) => l.id === activeLessonId) ?? null;

  // Default to the first incomplete lesson (or the very first) once loaded.
  useEffect(() => {
    if (!content.data || activeLessonId !== null || allLessons.length === 0) {
      return;
    }
    const firstIncomplete = allLessons.find((l) => !l.completed) ?? allLessons[0];
    setActiveLessonId(firstIncomplete.id);
  }, [content.data, activeLessonId, allLessons]);

  function handleComplete() {
    if (!activeLesson) return;
    completeLesson.mutate(activeLesson.id, {
      onSuccess: (result) => {
        if (result.course_completed) setShowCompletion(true);
      },
    });
  }

  if (content.isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <Skeleton className="mb-4 h-8 w-1/2" />
        <Skeleton className="aspect-video w-full rounded-lg" />
      </div>
    );
  }

  if (content.isError || !content.data) {
    return (
      <div className="mx-auto max-w-6xl">
        <Alert variant="error">{t("loadError")}</Alert>
      </div>
    );
  }

  const { course, sections, progress } = content.data;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={course.title} />

      {/* Overall progress */}
      <div className="mb-6 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {t("courseProgress")}
          </span>
          <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lesson navigator */}
        <aside className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg border border-gray-200 lg:sticky lg:top-20 lg:max-h-[75vh] lg:overflow-y-auto dark:border-gray-800">
            <LessonList
              sections={sections}
              activeLessonId={activeLessonId}
              onSelect={(lesson) => setActiveLessonId(lesson.id)}
              enrollmentId={enrollmentId}
            />
          </div>
        </aside>

        {/* Content area */}
        <section className="flex flex-col gap-6 lg:col-span-2">
          {activeLesson ? (
            <>
              <LessonContent lesson={activeLesson} />
              <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
                <Button
                  onClick={handleComplete}
                  disabled={activeLesson.completed}
                  isLoading={completeLesson.isPending}
                  variant={activeLesson.completed ? "secondary" : "primary"}
                >
                  {activeLesson.completed && (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  )}
                  {activeLesson.completed ? t("completed") : t("markComplete")}
                </Button>
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              {t("selectLesson")}
            </p>
          )}
        </section>
      </div>

      <CompletionModal open={showCompletion} onOpenChange={setShowCompletion} />
    </div>
  );
}
