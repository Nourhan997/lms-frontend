"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { CourseForm } from "@/components/admin/CourseForm";
import { toast } from "@/components/ui/use-toast";
import { useCreateInstructorCourse } from "@/lib/hooks/useInstructor";

export default function InstructorCreateCoursePage() {
  const t = useTranslations("instructor");
  const router = useRouter();
  const create = useCreateInstructorCourse();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t("courseCreateTitle")} />
      <Card>
        <CardContent className="p-6 pt-6">
          <CourseForm
            isSubmitting={create.isPending}
            isError={create.isError}
            onSubmit={(values) =>
              create.mutate(values, {
                onSuccess: (course) => {
                  toast({ title: t("saved"), variant: "success" });
                  router.push(`/instructor/courses/${course.id}/builder`);
                },
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
