"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { BlogForm } from "@/components/admin/BlogForm";
import { toast } from "@/components/ui/use-toast";
import { useCreateBlogPost } from "@/lib/hooks/useAdmin";

export default function CreateBlogPostPage() {
  const t = useTranslations("admin");
  const router = useRouter();
  const create = useCreateBlogPost();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t("blogCreateTitle")} />
      <Card>
        <CardContent className="p-6 pt-6">
          <BlogForm
            isSubmitting={create.isPending}
            isError={create.isError}
            onSubmit={(values) =>
              create.mutate(values, {
                onSuccess: () => {
                  toast({ title: t("saved"), variant: "success" });
                  router.push("/admin/blog");
                },
              })
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
