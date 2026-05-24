"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Award, BookOpen, CheckCircle2, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Progress } from "@/components/ui/Progress";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { StatsCard } from "@/components/courses/StatsCard";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  useActivateStudent,
  useAdminStudent,
  useSuspendStudent,
} from "@/lib/hooks/useAdmin";
import { DEFAULT_CURRENCY, formatDate } from "@/lib/utils/format";
import type { Locale } from "@/lib/types";

export default function AdminStudentDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const t = useTranslations("admin");
  const locale = useLocale() as Locale;

  const student = useAdminStudent(id);
  const suspend = useSuspendStudent();
  const activate = useActivateStudent();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const money = (n: number) =>
    new Intl.NumberFormat(locale === "ar" ? "ar" : "en-US", {
      style: "currency",
      currency: DEFAULT_CURRENCY,
      maximumFractionDigits: 0,
    }).format(n);

  if (student.isLoading) {
    return (
      <div className="mx-auto max-w-5xl">
        <Skeleton className="mb-6 h-24 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (student.isError || !student.data) {
    return (
      <div className="mx-auto max-w-5xl">
        <Alert variant="error">{t("loadError")}</Alert>
      </div>
    );
  }

  const s = student.data;
  const isActive = s.status === "active";

  function confirmToggle() {
    const mutation = isActive ? suspend : activate;
    mutation.mutate(s.id, { onSettled: () => setConfirmOpen(false) });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title={s.name} />

      {/* Header card */}
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 p-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={s.name} src={s.avatar_url} size="lg" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-50">{s.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.email}</p>
              <p className="mt-1 text-xs text-gray-400">
                {s.role} · {t("studentJoined", { date: formatDate(s.created_at, locale) })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isActive ? "success" : "danger"}>
              {isActive ? t("studentStatusActive") : t("studentStatusSuspended")}
            </Badge>
            <Button
              variant={isActive ? "danger" : "primary"}
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              {isActive ? t("suspend") : t("activate")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard icon={BookOpen} label={t("tabEnrollments")} value={s.enrollments_count} />
        <StatsCard icon={CheckCircle2} label={t("statCompleted")} value={s.completed_count} />
        <StatsCard icon={Award} label={t("tabCertificates")} value={s.certificates_count} />
        <StatsCard icon={Wallet} label={t("statSpent")} value={money(s.total_spent)} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="enrollments">
        <TabsList>
          <TabsTrigger value="enrollments">{t("tabEnrollments")}</TabsTrigger>
          <TabsTrigger value="payments">{t("tabPayments")}</TabsTrigger>
          <TabsTrigger value="certificates">{t("tabCertificates")}</TabsTrigger>
        </TabsList>

        <TabsContent value="enrollments">
          {s.enrollments.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">{t("noEnrollments")}</p>
          ) : (
            <Card>
              <CardContent className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
                {s.enrollments.map((e) => (
                  <div key={e.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-50">
                      {e.course?.title ?? `#${e.course_id}`}
                    </span>
                    <div className="flex w-40 items-center gap-2">
                      <Progress value={e.progress} />
                      <span className="shrink-0 text-xs text-gray-500">{e.progress}%</span>
                    </div>
                    <Badge variant={e.completed ? "success" : "info"}>
                      {e.completed ? t("enrollStatusCompleted") : t("enrollStatusActive")}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments">
          {s.payments.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">{t("noPayments")}</p>
          ) : (
            <Card>
              <CardContent className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
                {s.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="min-w-0 flex-1 truncate text-gray-900 dark:text-gray-50">
                      {p.course?.title ?? `#${p.course_id}`}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {money(p.amount)}
                    </span>
                    <span className="text-gray-500">{formatDate(p.created_at, locale)}</span>
                    <Badge variant={p.status === "succeeded" ? "success" : p.status === "refunded" ? "default" : "warning"}>
                      {t(`payStatus${p.status.charAt(0).toUpperCase()}${p.status.slice(1)}`)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="certificates">
          {s.certificates.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">{t("noCertificates")}</p>
          ) : (
            <Card>
              <CardContent className="divide-y divide-gray-100 p-0 dark:divide-gray-800">
                {s.certificates.map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="min-w-0 flex-1 truncate text-gray-900 dark:text-gray-50">
                      {c.course_title}
                    </span>
                    <span className="text-gray-500">{formatDate(c.issued_at, locale)}</span>
                    <a
                      href={c.share_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {t("verify")}
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isActive ? t("suspendTitle") : t("activateTitle")}
        description={isActive ? t("suspendBody") : t("activateBody")}
        confirmLabel={isActive ? t("suspend") : t("activate")}
        variant={isActive ? "danger" : "warning"}
        isLoading={suspend.isPending || activate.isPending}
        onConfirm={confirmToggle}
      />
    </div>
  );
}
