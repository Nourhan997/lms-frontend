"use client";

import Link from "next/link";
import { Award, BookOpen, CheckCircle2, Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsCard } from "@/components/courses/StatsCard";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useMe } from "@/lib/hooks/useAuth";
import { useEnrollments } from "@/lib/hooks/useEnrollments";
import { useNotifications } from "@/lib/hooks/useNotifications";

function greetingKey(): "greetingMorning" | "greetingAfternoon" | "greetingEvening" {
  const hour = new Date().getHours();
  if (hour < 12) return "greetingMorning";
  if (hour < 18) return "greetingAfternoon";
  return "greetingEvening";
}

export default function StudentDashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const me = useMe();
  const enrollments = useEnrollments();
  const notifications = useNotifications();

  const enrolledCount = enrollments.data?.length ?? 0;
  const completedCount =
    enrollments.data?.filter((e) => e.completed).length ?? 0;
  // A certificate is earned when a course is completed.
  const certificatesCount = completedCount;

  const continueLearning = (enrollments.data ?? [])
    .filter((e) => !e.completed)
    .slice(0, 3);
  const recentNotifications = (notifications.data ?? []).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl">
      {/* Welcome */}
      {me.isLoading || !me.data ? (
        <Skeleton className="mb-6 h-9 w-72" />
      ) : (
        <PageHeader title={t(greetingKey(), { name: me.data.name })} />
      )}

      {/* Placement prompt */}
      {me.data && !me.data.placement_completed && (
        <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-900 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="flex flex-col gap-4 p-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Compass className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  {t("placementTitle")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("placementBody")}
                </p>
              </div>
            </div>
            <Link href="/placement" className="shrink-0">
              <Button>{t("placementCta")}</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {enrollments.isLoading ? (
          <>
            <SkeletonCard variant="stat" />
            <SkeletonCard variant="stat" />
            <SkeletonCard variant="stat" />
          </>
        ) : enrollments.isError ? (
          <Alert variant="error" className="sm:col-span-3">
            {t("loadError")}
          </Alert>
        ) : (
          <>
            <StatsCard
              icon={BookOpen}
              label={t("statEnrolled")}
              value={enrolledCount}
            />
            <StatsCard
              icon={CheckCircle2}
              label={t("statCompleted")}
              value={completedCount}
            />
            <StatsCard
              icon={Award}
              label={t("statCertificates")}
              value={certificatesCount}
            />
          </>
        )}
      </section>

      {/* Continue learning */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("continueLearning")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {enrollments.isLoading ? (
              <>
                <SkeletonCard variant="list-item" />
                <SkeletonCard variant="list-item" />
                <SkeletonCard variant="list-item" />
              </>
            ) : enrollments.isError ? (
              <Alert variant="error">{t("loadError")}</Alert>
            ) : continueLearning.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("continueLearningEmpty")}
              </p>
            ) : (
              continueLearning.map((enrollment) => (
                <div key={enrollment.id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                      {enrollment.course?.title ??
                        `#${enrollment.course_id}`}
                    </span>
                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {t("progressLabel", { progress: enrollment.progress })}
                    </span>
                  </div>
                  <Progress value={enrollment.progress} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* Recent notifications */}
      <section>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">
              {t("recentNotifications")}
            </CardTitle>
            <Link
              href="/dashboard/notifications"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              {tCommon("viewAll")}
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {notifications.isLoading ? (
              <>
                <SkeletonCard variant="list-item" />
                <SkeletonCard variant="list-item" />
              </>
            ) : notifications.isError ? (
              <Alert variant="error">{t("loadError")}</Alert>
            ) : recentNotifications.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("notificationsEmpty")}
              </p>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      notification.read ? "bg-gray-300" : "bg-blue-600"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                      {notification.title}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {notification.body}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
