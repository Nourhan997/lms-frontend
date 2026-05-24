"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { QuestionForm } from "@/components/instructor/QuestionForm";
import { toast } from "@/components/ui/use-toast";
import {
  useAddQuestion,
  useDeleteQuestion,
  useUpdateQuestion,
  useUpdateQuiz,
} from "@/lib/hooks/useInstructor";
import type { BuilderQuestion, BuilderQuiz } from "@/lib/types";

interface QuizFormValues {
  title: string;
  pass_score: number;
}

export interface QuizBuilderProps {
  quiz: BuilderQuiz;
}

export function QuizBuilder({ quiz }: QuizBuilderProps) {
  const t = useTranslations("instructor");
  const updateQuiz = useUpdateQuiz();
  const addQuestion = useAddQuestion();
  const updateQuestion = useUpdateQuestion();
  const deleteQuestion = useDeleteQuestion();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BuilderQuestion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BuilderQuestion | null>(null);

  const { register, handleSubmit } = useForm<QuizFormValues>({
    defaultValues: { title: quiz.title, pass_score: quiz.pass_score },
  });

  const onSubmit = handleSubmit((values) =>
    updateQuiz.mutate(
      { id: quiz.id, input: values },
      { onSuccess: () => toast({ title: t("saved"), variant: "success" }) },
    ),
  );

  const isSavingQuestion = addQuestion.isPending || updateQuestion.isPending;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input label={t("quizTitle")} {...register("title")} />
        <Input
          type="number"
          min={0}
          max={100}
          label={t("passScore")}
          {...register("pass_score", { valueAsNumber: true })}
        />
        <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
          <Button type="submit" isLoading={updateQuiz.isPending}>
            {t("saveQuiz")}
          </Button>
        </div>
      </form>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {t("questions")}
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("addQuestion")}
          </Button>
        </div>

        {quiz.questions.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("noQuestions")}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {quiz.questions.map((question, i) => (
              <li key={question.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                <span className="text-gray-400">{i + 1}.</span>
                <span className="flex-1 truncate text-gray-900 dark:text-gray-50">
                  {question.prompt}
                </span>
                <span className="shrink-0 text-xs text-gray-400">{question.type}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(question);
                    setFormOpen(true);
                  }}
                  className="rounded p-1 text-gray-400 hover:text-blue-600"
                  aria-label={t("edit")}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(question)}
                  className="rounded p-1 text-gray-400 hover:text-red-600"
                  aria-label={t("delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <QuestionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        isSaving={isSavingQuestion}
        onSave={(input) => {
          if (editing) {
            updateQuestion.mutate(
              { id: editing.id, input },
              { onSuccess: () => setFormOpen(false) },
            );
          } else {
            addQuestion.mutate(
              { quizId: quiz.id, input },
              { onSuccess: () => setFormOpen(false) },
            );
          }
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("deleteQuestionTitle")}
        description={t("deleteQuestionBody")}
        confirmLabel={t("delete")}
        variant="danger"
        isLoading={deleteQuestion.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteQuestion.mutate(deleteTarget.id, {
              onSettled: () => setDeleteTarget(null),
            });
          }
        }}
      />
    </div>
  );
}
