"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import type { QuizAttempt } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const CONFETTI_PIECES = Array.from({ length: 12 });

export interface QuizResultProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onContinue?: () => void;
}

export function QuizResult({ attempt, onRetake, onContinue }: QuizResultProps) {
  const t = useTranslations("quiz");
  const { passed, score, results } = attempt;

  return (
    <div className="flex flex-col gap-6">
      {/* Score banner */}
      <Card
        className={cn(
          "relative overflow-hidden border-2",
          passed
            ? "border-green-500 bg-green-50 dark:bg-green-950"
            : "border-red-500 bg-red-50 dark:bg-red-950",
        )}
      >
        {passed && (
          <div className="confetti" aria-hidden="true">
            {CONFETTI_PIECES.map((_, i) => (
              <span key={i} className="confetti-piece" />
            ))}
          </div>
        )}
        <CardContent className="relative flex flex-col items-center gap-2 p-8 pt-8 text-center">
          <span
            className={cn(
              "text-5xl font-bold",
              passed ? "text-green-600" : "text-red-600",
            )}
          >
            {score}%
          </span>
          <span
            className={cn(
              "text-lg font-semibold",
              passed ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300",
            )}
          >
            {passed ? t("passed") : t("failed")}
          </span>
        </CardContent>
      </Card>

      {/* Per-question breakdown */}
      <div>
        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-50">
          {t("review")}
        </h3>
        <ul className="flex flex-col gap-3">
          {results.map((result) => (
            <li
              key={result.question_id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white",
                    result.correct ? "bg-green-600" : "bg-red-600",
                  )}
                  aria-hidden="true"
                >
                  {result.correct ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {result.prompt}
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {t("yourAnswer")}:{" "}
                    <span
                      className={cn(
                        result.correct ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300",
                      )}
                    >
                      {result.your_answer || t("noAnswer")}
                    </span>
                  </p>
                  {!result.correct && (
                    <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
                      {t("correctAnswer")}:{" "}
                      <span className="text-green-700 dark:text-green-300">
                        {result.correct_answer}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        {passed ? (
          onContinue && <Button onClick={onContinue}>{t("continue")}</Button>
        ) : (
          <Button variant="outline" onClick={onRetake}>
            {t("retake")}
          </Button>
        )}
      </div>
    </div>
  );
}
