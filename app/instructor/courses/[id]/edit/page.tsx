"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { CourseForm } from "@/components/admin/CourseForm";
import { toast } from "@/components/ui/use-toast";
import {
  useInstructorCourse,
  useUpdateInstructorCourse,
} from "@/lib/hooks/useInstructor";
import type { CourseLanguage } from "@/lib/types";

export default function InstructorEditCoursePage() {
  const params = useParams();
  const id = Number(params.id);
  const t = useTranslations("instructor");
  const router = useRouter();

  const course = useInstructorCourse(id);
  const update = useUpdateInstructorCourse();

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
                      router.push("/instructor/courses");
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
