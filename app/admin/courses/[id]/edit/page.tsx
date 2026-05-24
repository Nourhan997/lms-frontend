"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { CourseForm } from "@/components/admin/CourseForm";
import { toast } from "@/components/ui/use-toast";
import { useAdminCourse, useUpdateCourse } from "@/lib/hooks/useAdmin";
import type { CourseLanguage } from "@/lib/types";

export default function EditCoursePage() {
  const params = useParams();
  const id = Number(params.id);
  const t = useTranslations("admin");
  const router = useRouter();

  const course = useAdminCourse(id);
  const update = useUpdateCourse();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t("courseEditTitle")} />
      <Card>
        <CardContent className="p-6 pt-6">
          {course.isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : course.isError || !course.data ? (
            <Alert variant="error">{t("loadError")}</Alert>
          ) : (
            <CourseForm
              isSubmitting={update.isPending}
              isError={update.isError}
              initialValues={{
                title_en: course.data.title_en ?? course.data.title,
                title_ar: course.data.title_ar ?? "",
                description_en:
                  course.data.description_en ?? course.data.description,
                description_ar: course.data.description_ar ?? "",
                category_id: course.data.category_id ?? 0,
                level: course.data.level,
                language: course.data.language as CourseLanguage,
                price: course.data.price,
                thumbnail_url: course.data.thumbnail_url,
              }}
              onSubmit={(values) =>
                update.mutate(
                  { id, payload: values },
                  {
                    onSuccess: () => {
                      toast({ title: t("saved"), variant: "success" });
                      router.push("/admin/courses");
                    },
                  },
                )
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
