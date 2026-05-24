"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { toast } from "@/components/ui/use-toast";
import {
  useCreateQuiz,
  useDeleteSection,
  useUpdateSection,
} from "@/lib/hooks/useInstructor";
import type { BuilderSection } from "@/lib/types";

interface SectionFormValues {
  title_en: string;
  title_ar: string;
  is_published: boolean;
}

export interface SectionEditorProps {
  section: BuilderSection;
  onDeleted: () => void;
  onQuizCreated: (quizId: number) => void;
}

export function SectionEditor({
  section,
  onDeleted,
  onQuizCreated,
}: SectionEditorProps) {
  const t = useTranslations("instructor");
  const update = useUpdateSection();
  const remove = useDeleteSection();
  const createQuiz = useCreateQuiz();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { register, handleSubmit } = useForm<SectionFormValues>({
    defaultValues: {
      title_en: section.title_en,
      title_ar: section.title_ar,
      is_published: section.is_published,
    },
  });

  const onSubmit = handleSubmit((values) =>
    update.mutate(
      { id: section.id, input: values },
      { onSuccess: () => toast({ title: t("saved"), variant: "success" }) },
    ),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input label={t("sectionTitleEn")} {...register("title_en")} />
      <Input label={t("sectionTitleAr")} dir="rtl" {...register("title_ar")} />

      <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
        <input type="checkbox" className="h-4 w-4 accent-blue-600" {...register("is_published")} />
        {t("published")}
      </label>

      <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Button type="submit" isLoading={update.isPending}>
          {t("save")}
        </Button>
        {!section.quiz && (
          <Button
            type="button"
            variant="outline"
            isLoading={createQuiz.isPending}
            onClick={() =>
              createQuiz.mutate(
                { sectionId: section.id, input: { title: t("quiz"), pass_score: 70 } },
                { onSuccess: (quiz) => onQuizCreated(quiz.id) },
              )
            }
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("addQuiz")}
          </Button>
        )}
        <Button
          type="button"
          variant="danger"
          className="ms-auto"
          onClick={() => setConfirmDelete(true)}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {t("delete")}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={t("deleteSectionTitle")}
        description={t("deleteSectionBody")}
        confirmLabel={t("delete")}
        variant="danger"
        isLoading={remove.isPending}
        onConfirm={() =>
          remove.mutate(section.id, {
            onSuccess: () => {
              setConfirmDelete(false);
              onDeleted();
            },
          })
        }
      />
    </form>
  );
}
