"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Plus, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsCard } from "@/components/courses/StatsCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { useInstructorDashboard } from "@/lib/hooks/useInstructor";
import { useAuthStore } from "@/lib/store/authStore";
import { useHasMounted } from "@/lib/hooks/useHasMounted";

export default function InstructorDashboardPage() {
  const t = useTranslations("instructor");
  const dashboard = useInstructorDashboard();
  const mounted = useHasMounted();
  const user = useAuthStore((s) => s.user);

  const d = dashboard.data;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={
          mounted && user ? t("welcome", { name: user.name }) : t("dashboardTitle")
        }
        action={
          <Link href="/instructor/courses/create">
            <Button size="sm">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t("createCourse")}
            </Button>
          </Link>
        }
      />

      {dashboard.isError ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : (
        <>
          <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatsCard icon={BookOpen} label={t("statCourses")} value={d?.courses_count ?? 0} isLoading={dashboard.isLoading} />
            <StatsCard icon={Users} label={t("statStudents")} value={d?.students_count ?? 0} isLoading={dashboard.isLoading} />
            <StatsCard icon={CheckCircle2} label={t("statCompletions")} value={d?.completions_count ?? 0} isLoading={dashboard.isLoading} />
          </section>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("myCourses")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {dashboard.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : !d || d.recent_courses.length === 0 ? (
                <p className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  {t("empty")}
                </p>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {d.recent_courses.map((course) => (
                    <li key={course.id}>
                      <Link
                        href={`/instructor/courses/${course.id}/builder`}
                        className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {course.title}
                        </span>
                        <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                          {t("colEnrollments")}: {course.enrollments_count}
                        </span>
                        <Badge variant={course.status === "published" ? "success" : "default"}>
                          {course.status === "published"
                            ? t("statusPublished")
                            : course.status === "archived"
                              ? t("statusArchived")
                              : t("statusDraft")}
                        </Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
