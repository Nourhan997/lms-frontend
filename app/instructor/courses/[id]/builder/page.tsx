"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import {
  CourseOutline,
  type BuilderSelection,
} from "@/components/instructor/CourseOutline";
import { SectionEditor } from "@/components/instructor/SectionEditor";
import { LessonEditor } from "@/components/instructor/LessonEditor";
import { QuizBuilder } from "@/components/instructor/QuizBuilder";
import {
  useCourseStructure,
  useCreateLesson,
  useCreateSection,
} from "@/lib/hooks/useInstructor";

export default function CourseBuilderPage() {
  const params = useParams();
  const courseId = Number(params.id);
  const t = useTranslations("instructor");

  const structureQuery = useCourseStructure(courseId);
  const createSection = useCreateSection();
  const createLesson = useCreateLesson();

  // Selection lives in React state (not the URL), per spec.
  const [selection, setSelection] = useState<BuilderSelection>(null);

  const structure = structureQuery.data;

  // Derive the selected entity from fresh query data each render.
  const selectedSection =
    selection?.kind === "section"
      ? structure?.sections.find((s) => s.id === selection.id)
      : undefined;
  const selectedLesson =
    selection?.kind === "lesson"
      ? structure?.sections.flatMap((s) => s.lessons).find((l) => l.id === selection.id)
      : undefined;
  const selectedQuiz =
    selection?.kind === "quiz"
      ? structure?.sections.map((s) => s.quiz).find((q) => q?.id === selection.id) ?? undefined
      : undefined;

  function handleAddSection() {
    createSection.mutate(
      {
        courseId,
        input: { title_en: t("newSection"), title_ar: "", is_published: false },
      },
      { onSuccess: (section) => setSelection({ kind: "section", id: section.id }) },
    );
  }

  function handleAddLesson(sectionId: number) {
    createLesson.mutate(
      {
        sectionId,
        input: {
          title_en: t("newLesson"),
          title_ar: "",
          duration_minutes: 5,
          is_published: false,
        },
      },
      { onSuccess: (lesson) => setSelection({ kind: "lesson", id: lesson.id }) },
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={structure?.course_title ?? t("builderTitle")} />

      {structureQuery.isLoading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-lg lg:col-span-1" />
          <Skeleton className="h-96 w-full rounded-lg lg:col-span-2" />
        </div>
      ) : structureQuery.isError || !structure ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Outline */}
          <aside className="lg:col-span-1">
            <Card className="lg:sticky lg:top-20">
              <CardContent className="p-0">
                <CourseOutline
                  structure={structure}
                  selection={selection}
                  onSelect={setSelection}
                  onAddSection={handleAddSection}
                  onAddLesson={handleAddLesson}
                  isMutating={createSection.isPending || createLesson.isPending}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Editor */}
          <section className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 pt-6">
                {selectedSection ? (
                  <SectionEditor
                    key={selectedSection.id}
                    section={selectedSection}
                    onDeleted={() => setSelection(null)}
                    onQuizCreated={(quizId) => setSelection({ kind: "quiz", id: quizId })}
                  />
                ) : selectedLesson ? (
                  <LessonEditor
                    key={selectedLesson.id}
                    lesson={selectedLesson}
                    onDeleted={() => setSelection(null)}
                  />
                ) : selectedQuiz ? (
                  <QuizBuilder key={selectedQuiz.id} quiz={selectedQuiz} />
                ) : (
                  <p className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t("selectSomething")}
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}
