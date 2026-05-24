"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { QuizForm } from "@/components/quiz/QuizForm";
import { PlacementResult } from "@/components/quiz/PlacementResult";
import { usePlacementQuiz, useSubmitPlacement } from "@/lib/hooks/useQuiz";
import type {
  PlacementResult as PlacementResultType,
  PlacementSubject,
  QuizAnswer,
} from "@/lib/types";

export function PlacementQuizClient({ subject }: { subject: PlacementSubject }) {
  const t = useTranslations("placement");
  const quiz = usePlacementQuiz(subject);
  const submit = useSubmitPlacement();
  const [result, setResult] = useState<PlacementResultType | null>(null);

  function handleSubmit(answers: Record<number, QuizAnswer>) {
    submit.mutate(
      { subject, payload: { answers } },
      { onSuccess: (placement) => setResult(placement) },
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHeader title={t("title")} />

      {result ? (
        <PlacementResult result={result} />
      ) : quiz.isLoading ? (
        <Skeleton className="h-64 w-full rounded-lg" />
      ) : quiz.isError || !quiz.data ? (
        <Alert variant="error">{t("notFound")}</Alert>
      ) : (
        <>
          {submit.isError && (
            <Alert variant="error" className="mb-4">
              {t("loadError")}
            </Alert>
          )}
          <QuizForm
            quiz={quiz.data}
            isSubmitting={submit.isPending}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </div>
  );
}
