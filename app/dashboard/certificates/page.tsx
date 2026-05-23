"use client";

import { Award, Copy, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Card, CardContent } from "@/components/ui/Card";
import { toast } from "@/components/ui/use-toast";
import { useMyCertificates } from "@/lib/hooks/useCertificates";
import { formatDate } from "@/lib/utils/format";
import type { Certificate, Locale } from "@/lib/types";

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const t = useTranslations("certificates");
  const locale = useLocale() as Locale;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(certificate.share_url);
      toast({ title: t("copied"), variant: "success" });
    } catch {
      toast({ title: t("loadError"), variant: "destructive" });
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 pt-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
            <Award className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-medium text-gray-900 dark:text-gray-50">
              {certificate.course_title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("issuedOn", { date: formatDate(certificate.issued_at, locale) })}
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          {t("idLabel")}: <span className="font-mono">{certificate.serial}</span>
        </p>

        <div className="flex flex-wrap gap-2">
          {certificate.pdf_url && (
            <a
              href={certificate.pdf_url}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("download")}
              </Button>
            </a>
          )}
          <Button size="sm" variant="ghost" onClick={copyLink}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            {t("copyLink")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CertificatesPage() {
  const t = useTranslations("certificates");
  const certificates = useMyCertificates();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {certificates.isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} variant="stat" />
          ))}
        </div>
      ) : certificates.isError ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : !certificates.data || certificates.data.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-sm text-gray-500 dark:text-gray-400">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.data.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
}
