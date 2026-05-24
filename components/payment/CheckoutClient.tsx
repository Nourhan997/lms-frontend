"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { CheckoutSummary } from "@/components/payment/CheckoutSummary";
import { toast } from "@/components/ui/use-toast";
import { useCourse } from "@/lib/hooks/useCourses";
import { useEnrollments } from "@/lib/hooks/useEnrollments";
import { useCheckout } from "@/lib/hooks/usePayments";

export function CheckoutClient({ slug }: { slug: string }) {
  const t = useTranslations("checkout");
  const router = useRouter();
  const course = useCourse(slug);
  const enrollments = useEnrollments();
  const checkout = useCheckout();

  const detailPath = `/courses/${slug}`;

  // Already enrolled? Skip checkout and go straight to the player.
  const existing = course.data
    ? enrollments.data?.find((e) => e.course_id === course.data!.id)
    : undefined;
  useEffect(() => {
    if (existing) router.replace(`/dashboard/courses/${existing.id}`);
  }, [existing, router]);

  function handleConfirm() {
    if (!course.data) return;
    checkout.mutate(course.data.id, {
      onSuccess: (enrollment) => {
        toast({
          title: t("successTitle"),
          description: t("successBody"),
          variant: "success",
        });
        router.push(`/dashboard/courses/${enrollment.id}`);
      },
    });
  }

  const backLink = (
    <Link href={detailPath}>
      <Button variant="ghost" size="sm">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t("backToCourse")}
      </Button>
    </Link>
  );

  if (course.isLoading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <Skeleton className="mb-4 h-8 w-1/2" />
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }

  if (course.isError || !course.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <Alert variant="error">{t("error")}</Alert>
        <div className="mt-4">{backLink}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <PageHeader title={t("title")} action={backLink} />

      <div className="flex flex-col gap-4">
        <CheckoutSummary course={course.data} />

        {checkout.isError && <Alert variant="error">{t("error")}</Alert>}

        <Button
          fullWidth
          size="lg"
          isLoading={checkout.isPending}
          onClick={handleConfirm}
        >
          {checkout.isPending ? t("confirming") : t("confirm")}
        </Button>
      </div>
    </div>
  );
}
