import type { Metadata } from "next";
import { CheckCircle2, XCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/Card";
import { PrintButton } from "@/components/ui/PrintButton";
import { verifyCertificate } from "@/lib/api/certificates";
import { formatDate } from "@/lib/utils/format";
import type { Locale } from "@/lib/types";

export const metadata: Metadata = {
  title: "Certificate Verification",
};

export default async function CertificateVerifyPage({
  params,
}: {
  params: { uid: string };
}) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("verify");

  const certificate = await verifyCertificate(params.uid).catch(() => null);

  if (!certificate) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <XCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
            <p className="text-gray-700 dark:text-gray-300">{t("notFound")}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  const valid = certificate.valid;

  const rows: { label: string; value: string }[] = [
    { label: t("student"), value: certificate.student_name },
    { label: t("course"), value: certificate.course_title },
    ...(certificate.instructor_name
      ? [{ label: t("instructor"), value: certificate.instructor_name }]
      : []),
    { label: t("issued"), value: formatDate(certificate.issued_at, locale) },
    { label: t("certificateId"), value: certificate.serial },
  ];

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          {valid ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" aria-hidden="true" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500" aria-hidden="true" />
          )}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {t("title")}
          </h1>
          <span
            className={
              valid
                ? "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300"
                : "rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
            }
          >
            {valid ? t("valid") : t("invalid")}
          </span>

          <dl className="mt-4 w-full divide-y divide-gray-100 text-start dark:divide-gray-800">
            {rows.map((row) => (
              <div key={row.label} className="flex justify-between gap-4 py-2">
                <dt className="text-sm text-gray-500 dark:text-gray-400">{row.label}</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-2">
            <PrintButton label={t("print")} />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
