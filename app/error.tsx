"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

/** Global error boundary with a retry action. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    // Surface the error for diagnostics.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500" aria-hidden="true" />
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
        {t("errorTitle")}
      </h1>
      <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
        {t("errorBody")}
      </p>
      <Button onClick={reset}>{t("retry")}</Button>
    </div>
  );
}
