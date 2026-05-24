"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { BlogForm } from "@/components/admin/BlogForm";
import { toast } from "@/components/ui/use-toast";
import { useAdminBlogPost, useUpdateBlogPost } from "@/lib/hooks/useAdmin";

export default function EditBlogPostPage() {
  const params = useParams();
  const id = Number(params.id);
  const t = useTranslations("admin");
  const router = useRouter();

  const post = useAdminBlogPost(id);
  const update = useUpdateBlogPost();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t("blogEditTitle")} />
      <Card>
        <CardContent className="p-6 pt-6">
          {post.isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : post.isError || !post.data ? (
            <Alert variant="error">{t("loadError")}</Alert>
          ) : (
            <BlogForm
              isSubmitting={update.isPending}
              isError={update.isError}
              initialValues={{
                title_en: post.data.title_en,
                title_ar: post.data.title_ar,
                body_en: post.data.body_en,
                body_ar: post.data.body_ar,
                thumbnail_url: post.data.thumbnail_url,
                is_published: post.data.is_published,
              }}
              onSubmit={(values) =>
                update.mutate(
                  { id, payload: values },
                  {
                    onSuccess: () => {
                      toast({ title: t("saved"), variant: "success" });
                      router.push("/admin/blog");
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
