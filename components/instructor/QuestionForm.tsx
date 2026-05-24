"use client";

import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { BuilderQuestion, QuestionInput, QuizQuestionType } from "@/lib/types";

interface QFormValues {
  prompt: string;
  type: QuizQuestionType;
  explanation: string;
  correct_index: number;
  options: { value: string }[];
}

const selectClass =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50";

export interface QuestionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: BuilderQuestion | null;
  onSave: (input: QuestionInput) => void;
  isSaving: boolean;
}

export function QuestionForm({
  open,
  onOpenChange,
  initial,
  onSave,
  isSaving,
}: QuestionFormProps) {
  const t = useTranslations("instructor");
  const tq = useTranslations("quiz");
  const tv = useTranslations("validation");

  const schema = useMemo(
    () =>
      z
        .object({
          prompt: z.string().min(1, tv("required")),
          type: z.enum(["multiple_choice", "true_false", "fill_blank"]),
          explanation: z.string(),
          correct_index: z.number(),
          options: z.array(z.object({ value: z.string() })),
        })
        .superRefine((data, ctx) => {
          if (data.type === "multiple_choice") {
            if (data.options.length < 2) {
              ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options"], message: tv("required") });
            }
            data.options.forEach((o, i) => {
              if (!o.value.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["options", i, "value"], message: tv("required") });
              }
            });
          }
        }),
    [tv],
  );

  const defaults = useMemo<QFormValues>(
    () => ({
      prompt: initial?.prompt ?? "",
      type: initial?.type ?? "multiple_choice",
      explanation: initial?.explanation ?? "",
      correct_index: initial?.correct_index ?? 0,
      options:
        initial && initial.options.length > 0
          ? initial.options.map((value) => ({ value }))
          : [{ value: "" }, { value: "" }],
    }),
    [initial],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<QFormValues>({ resolver: zodResolver(schema), defaultValues: defaults });

  const { fields, append, remove } = useFieldArray({ control, name: "options" });
  const type = watch("type");

  useEffect(() => {
    if (open) reset(defaults);
  }, [open, defaults, reset]);

  const submit = handleSubmit((values) => {
    let input: QuestionInput;
    if (values.type === "true_false") {
      input = {
        type: "true_false",
        prompt: values.prompt,
        options: [tq("true"), tq("false")],
        correct_index: values.correct_index,
        explanation: values.explanation || null,
      };
    } else if (values.type === "fill_blank") {
      input = {
        type: "fill_blank",
        prompt: values.prompt,
        options: [],
        correct_index: null,
        explanation: values.explanation || null,
      };
    } else {
      input = {
        type: "multiple_choice",
        prompt: values.prompt,
        options: values.options.map((o) => o.value),
        correct_index: values.correct_index,
        explanation: values.explanation || null,
      };
    }
    onSave(input);
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("addQuestion")}
          </Dialog.Title>

          <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("questionText")}
              </label>
              <textarea
                rows={2}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
                {...register("prompt")}
              />
              {errors.prompt && <p className="text-sm text-red-600">{errors.prompt.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="q-type" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t("questionType")}
              </label>
              <select id="q-type" className={selectClass} {...register("type")}>
                <option value="multiple_choice">multiple_choice</option>
                <option value="true_false">true_false</option>
                <option value="fill_blank">fill_blank</option>
              </select>
            </div>

            {type === "multiple_choice" && (
              <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={index}
                      className="h-4 w-4 accent-blue-600"
                      aria-label={t("markCorrect")}
                      {...register("correct_index", { valueAsNumber: true })}
                    />
                    <div className="flex-1">
                      <Input
                        placeholder={t("mcOption", { n: index + 1 })}
                        {...register(`options.${index}.value` as const)}
                      />
                    </div>
                    {fields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded p-1 text-gray-400 hover:text-red-600"
                        aria-label="remove"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {fields.length < 4 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => append({ value: "" })}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    {t("addOption")}
                  </Button>
                )}
              </div>
            )}

            {type === "true_false" && (
              <div className="flex flex-col gap-2">
                {[tq("true"), tq("false")].map((label, index) => (
                  <label key={label} className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
                    <input
                      type="radio"
                      value={index}
                      className="h-4 w-4 accent-blue-600"
                      {...register("correct_index", { valueAsNumber: true })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}

            <Input label={t("explanation")} {...register("explanation")} />

            <div className="flex justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <Button type="button" variant="outline" size="sm">
                  {tq("cancel")}
                </Button>
              </Dialog.Close>
              <Button type="submit" size="sm" isLoading={isSaving}>
                {t("saveQuestion")}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
