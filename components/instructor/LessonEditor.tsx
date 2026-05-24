"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AlignLeft,
  Film,
  FileText,
  Music,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ContentForm } from "@/components/instructor/ContentForm";
import { toast } from "@/components/ui/use-toast";
import {
  useAddContent,
  useDeleteContent,
  useDeleteLesson,
  useUpdateLesson,
} from "@/lib/hooks/useInstructor";
import type { BuilderLesson, LessonContentType } from "@/lib/types";

interface LessonFormValues {
  title_en: string;
  title_ar: string;
  duration_minutes: number;
  is_published: boolean;
}

const TYPE_ICON: Record<LessonContentType, LucideIcon> = {
  video: Film,
  audio: Music,
  pdf: FileText,
  text: AlignLeft,
};

export interface LessonEditorProps {
  lesson: BuilderLesson;
  onDeleted: () => void;
}

export function LessonEditor({ lesson, onDeleted }: LessonEditorProps) {
  const t = useTranslations("instructor");
  const update = useUpdateLesson();
  const remove = useDeleteLesson();
  const addContent = useAddContent();
  const deleteContent = useDeleteContent();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);

  const { register, handleSubmit } = useForm<LessonFormValues>({
    defaultValues: {
      title_en: lesson.title_en,
      title_ar: lesson.title_ar,
      duration_minutes: lesson.duration_minutes,
      is_published: lesson.is_published,
    },
  });

  const onSubmit = handleSubmit((values) =>
    update.mutate(
      { id: lesson.id, input: values },
      { onSuccess: () => toast({ title: t("saved"), variant: "success" }) },
    ),
  );

  const content = [...lesson.content].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input label={t("lessonTitleEn")} {...register("title_en")} />
        <Input label={t("lessonTitleAr")} dir="rtl" {...register("title_ar")} />
        <Input
          type="number"
          min={0}
          label={t("durationMinutes")}
          {...register("duration_minutes", { valueAsNumber: true })}
        />
        <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
          <input type="checkbox" className="h-4 w-4 accent-blue-600" {...register("is_published")} />
          {t("published")}
        </label>

        <div className="flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          <Button type="submit" isLoading={update.isPending}>
            {t("save")}
          </Button>
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
      </form>

      {/* Content items */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {t("contentItems")}
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={() => setContentOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("addContent")}
          </Button>
        </div>

        {content.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("noContent")}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            {content.map((item) => {
              const Icon = TYPE_ICON[item.type];
              return (
                <li key={item.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <Icon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                  <span className="text-gray-400">#{item.order}</span>
                  <span className="flex-1 truncate text-gray-900 dark:text-gray-50">
                    {t(`type${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`)}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteContent.mutate(item.id)}
                    className="rounded p-1 text-gray-400 hover:text-red-600"
                    aria-label={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <ContentForm
        open={contentOpen}
        onOpenChange={setContentOpen}
        isSaving={addContent.isPending}
        onSave={(input) =>
          addContent.mutate(
            { lessonId: lesson.id, input },
            { onSuccess: () => setContentOpen(false) },
          )
        }
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={t("deleteLessonTitle")}
        description={t("deleteLessonBody")}
        confirmLabel={t("delete")}
        variant="danger"
        isLoading={remove.isPending}
        onConfirm={() =>
          remove.mutate(lesson.id, {
            onSuccess: () => {
              setConfirmDelete(false);
              onDeleted();
            },
          })
        }
      />
    </div>
  );
}
