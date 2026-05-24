"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { QuizForm } from "@/components/quiz/QuizForm";
import { QuizResult } from "@/components/quiz/QuizResult";
import { useQuiz, useSubmitQuiz } from "@/lib/hooks/useQuiz";
import type { QuizAnswer, QuizAttempt } from "@/lib/types";

export default function SectionQuizPage() {
  const params = useParams();
  const router = useRouter();
  const enrollmentId = Number(params.enrollmentId);
  const sectionId = Number(params.sectionId);
  const t = useTranslations("quiz");

  const quiz = useQuiz(sectionId);
  const submit = useSubmitQuiz();

  const [started, setStarted] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);

  const coursePath = `/dashboard/courses/${enrollmentId}`;

  function handleSubmit(answers: Record<number, QuizAnswer>) {
    if (!quiz.data) return;
    submit.mutate(
      { quizId: quiz.data.id, payload: { answers } },
      { onSuccess: (result) => setAttempt(result) },
    );
  }

  function retake() {
    setAttempt(null);
    setStarted(true);
  }

  const backLink = (
    <Link href={coursePath}>
      <Button variant="ghost" size="sm">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("backToCourse")}
      </Button>
    </Link>
  );

  if (quiz.isLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <Skeleton className="mb-4 h-8 w-1/2" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (quiz.isError || !quiz.data) {
    return (
      <div className="mx-auto max-w-3xl">
        <Alert variant="error">{t("notFound")}</Alert>
        <div className="mt-4">{backLink}</div>
      </div>
    );
  }

  const data = quiz.data;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={data.title} action={backLink} />

      {attempt ? (
        <QuizResult
          attempt={attempt}
          onRetake={retake}
          onContinue={() => router.push(coursePath)}
        />
      ) : started ? (
        <QuizForm
          quiz={data}
          isSubmitting={submit.isPending}
          onSubmit={handleSubmit}
        />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 p-6 pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("questionCount", { count: data.questions.length })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t("passScore", { score: data.pass_score })}
            </p>
            {submit.isError && (
              <Alert variant="error" className="w-full">
                {t("loadError")}
              </Alert>
            )}
            <Button onClick={() => setStarted(true)}>{t("start")}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
