"use client";

import { useState } from "react";
import Link from "next/link";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { PlacementResult } from "@/components/quiz/PlacementResult";
import { useMyPlacementResult } from "@/lib/hooks/useQuiz";
import type { PlacementSubject } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const SUBJECTS: { value: PlacementSubject; labelKey: string }[] = [
  { value: "english", labelKey: "subjectEnglish" },
  { value: "french", labelKey: "subjectFrench" },
];

export function PlacementIntro() {
  const t = useTranslations("placement");
  const result = useMyPlacementResult();
  const [subject, setSubject] = useState<PlacementSubject | null>(null);

  if (result.isLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Skeleton className="mb-4 h-8 w-1/2" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  // Already completed → show the stored result.
  if (result.data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <PageHeader title={t("title")} subtitle={t("alreadyCompleted")} />
        <PlacementResult result={result.data} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {result.isError && (
        <Alert variant="warning" className="mb-4">
          {t("loadError")}
        </Alert>
      )}

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-medium text-gray-900 dark:text-gray-50">
          {t("chooseSubject")}
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {SUBJECTS.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={subject === s.value}
              onClick={() => setSubject(s.value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border-2 p-6 transition-colors",
                subject === s.value
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                  : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900",
              )}
            >
              <Languages
                className={cn(
                  "h-6 w-6",
                  subject === s.value ? "text-blue-600" : "text-gray-400",
                )}
                aria-hidden="true"
              />
              <span className="font-medium text-gray-900 dark:text-gray-50">
                {t(s.labelKey)}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      {subject ? (
        <Link href={`/placement/${subject}`}>
          <Button fullWidth>{t("start")}</Button>
        </Link>
      ) : (
        <Button fullWidth disabled>
          {t("start")}
        </Button>
      )}
    </div>
  );
}
