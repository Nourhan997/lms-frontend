"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { CourseForm } from "@/components/admin/CourseForm";
import { toast } from "@/components/ui/use-toast";
import { useCreateCourse } from "@/lib/hooks/useAdmin";

export default function CreateCoursePage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const create = useCreateCourse();

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
                onSuccess: () => {
                  toast({ title: t("saved"), variant: "success" });
                  router.push("/admin/courses");
                },
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
