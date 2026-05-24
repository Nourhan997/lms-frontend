"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Progress } from "@/components/ui/Progress";
import type { Quiz, QuizAnswer, QuizQuestion } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

type FormValues = Record<string, string>;

const fieldName = (questionId: number) => `q${questionId}`;

export interface QuizFormProps {
  quiz: Quiz;
  isSubmitting: boolean;
  onSubmit: (answers: Record<number, QuizAnswer>) => void;
}

export function QuizForm({ quiz, isSubmitting, onSubmit }: QuizFormProps) {
  const t = useTranslations("quiz");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodString> = {};
    for (const q of quiz.questions) {
      shape[fieldName(q.id)] = z.string().min(1);
    }
    return z.object(shape);
  }, [quiz.questions]);

  const defaultValues = useMemo<FormValues>(() => {
    const values: FormValues = {};
    for (const q of quiz.questions) values[fieldName(q.id)] = "";
    return values;
  }, [quiz.questions]);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  const watched = watch();
  const answered = quiz.questions.filter(
    (q) => watched[fieldName(q.id)],
  ).length;
  const total = quiz.questions.length;

  function buildAnswers(values: FormValues): Record<number, QuizAnswer> {
    const answers: Record<number, QuizAnswer> = {};
    for (const q of quiz.questions) {
      const raw = values[fieldName(q.id)];
      answers[q.id] = q.type === "fill_blank" ? raw : Number(raw);
    }
    return answers;
  }

  // Valid submit opens the confirmation dialog; confirming sends the answers.
  const openConfirm = handleSubmit(() => setConfirmOpen(true));
  function confirmSubmit() {
    setConfirmOpen(false);
    onSubmit(buildAnswers(getValues()));
  }

  return (
    <form onSubmit={openConfirm} noValidate className="flex flex-col gap-6">
      {/* Progress */}
      <div className="sticky top-16 z-10 flex flex-col gap-1.5 bg-gray-50 py-2 dark:bg-gray-900">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {t("answeredProgress", { answered, total })}
        </span>
        <Progress value={total ? (answered / total) * 100 : 0} />
      </div>

      {quiz.questions.map((question, index) => (
        <QuestionField
          key={question.id}
          question={question}
          index={index}
          register={register}
        />
      ))}

      <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
        <Button type="submit" disabled={!isValid} isLoading={isSubmitting}>
          {t("submit")}
        </Button>
      </div>

      {/* Confirm dialog */}
      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {t("confirmTitle")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t("confirmBody")}
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="outline" size="sm">
                  {t("cancel")}
                </Button>
              </Dialog.Close>
              <Button size="sm" onClick={confirmSubmit} isLoading={isSubmitting}>
                {t("confirmSubmit")}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </form>
  );
}

interface QuestionFieldProps {
  question: QuizQuestion;
  index: number;
  register: ReturnType<typeof useForm<FormValues>>["register"];
}

function QuestionField({ question, index, register }: QuestionFieldProps) {
  const t = useTranslations("quiz");
  const name = fieldName(question.id);

  const radioOptions =
    question.type === "true_false"
      ? [
          { value: "0", label: t("true") },
          { value: "1", label: t("false") },
        ]
      : question.options.map((label, i) => ({ value: String(i), label }));

  return (
    <fieldset className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
      <legend className="px-1 text-sm font-medium text-gray-900 dark:text-gray-50">
        {index + 1}. {question.prompt}
      </legend>

      {question.type === "fill_blank" ? (
        <div className="mt-3">
          <Input placeholder={t("fillPlaceholder")} {...register(name)} />
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2">
          {radioOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 px-3 py-2 text-sm",
                "hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50",
                "dark:border-gray-700 dark:hover:bg-gray-900 dark:has-[:checked]:bg-blue-950",
              )}
            >
              <input
                type="radio"
                value={option.value}
                className="h-4 w-4 accent-blue-600"
                {...register(name)}
              />
              <span className="text-gray-900 dark:text-gray-50">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}
