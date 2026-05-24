import Link from "next/link";
import { Compass } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

/** Global 404 page. */
export default async function NotFound() {
  const t = await getTranslations("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <Compass className="h-12 w-12 text-blue-600" aria-hidden="true" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">404</h1>
      <p className="text-lg font-medium text-gray-900 dark:text-gray-50">
        {t("notFoundTitle")}
      </p>
      <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
        {t("notFoundBody")}
      </p>
      <Link href="/">
        <Button>{t("backHome")}</Button>
      </Link>
    </div>
  );
}
