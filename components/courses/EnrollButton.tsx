"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button, type ButtonSize } from "@/components/ui/Button";
import { toast } from "@/components/ui/use-toast";
import { useEnrollments } from "@/lib/hooks/useEnrollments";
import { useEnrollFreeCourse } from "@/lib/hooks/usePayments";
import { useAuthStore } from "@/lib/store/authStore";
import { useHasMounted } from "@/lib/hooks/useHasMounted";
import { formatPrice } from "@/lib/utils/format";
import type { Course, Locale } from "@/lib/types";

export interface EnrollButtonProps {
  course: Course;
  fullWidth?: boolean;
  size?: ButtonSize;
}

/**
 * Smart enrollment CTA. Resolves the right action from auth + enrollment state:
 * login → free enroll → premium checkout → continue learning.
 */
export function EnrollButton({
  course,
  fullWidth = true,
  size = "md",
}: EnrollButtonProps) {
  const t = useTranslations("courses");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const mounted = useHasMounted();
  const token = useAuthStore((s) => s.token);
  const enrollments = useEnrollments();
  const freeEnroll = useEnrollFreeCourse();

  const isLoggedIn = mounted && Boolean(token);
  const enrollment = enrollments.data?.find((e) => e.course_id === course.id);
  const isFree = course.price <= 0;
  const detailPath = `/courses/${course.slug}`;

  function handleFreeEnroll() {
    freeEnroll.mutate(course.id, {
      onSuccess: (created) => {
        toast({
          title: t("enrollSuccess"),
          description: t("startLearning"),
          variant: "success",
        });
        router.push(`/dashboard/courses/${created.id}`);
      },
      onError: () => toast({ title: t("enrollError"), variant: "destructive" }),
    });
  }

  // Avoid hydration flicker: wait for mount, and for the enrollment list when
  // the user is authenticated.
  if (!mounted || (isLoggedIn && enrollments.isLoading)) {
    return (
      <Button fullWidth={fullWidth} size={size} isLoading disabled>
        {t("enroll")}
      </Button>
    );
  }

  if (!isLoggedIn) {
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={() =>
          router.push(`/login?redirect=${encodeURIComponent(detailPath)}`)
        }
      >
        {t("loginToEnroll")}
      </Button>
    );
  }

  if (enrollment) {
    return (
      <Button
        variant="secondary"
        fullWidth={fullWidth}
        size={size}
        onClick={() => router.push(`/dashboard/courses/${enrollment.id}`)}
      >
        {t("continueLearning")}
      </Button>
    );
  }

  if (isFree) {
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        isLoading={freeEnroll.isPending}
        onClick={handleFreeEnroll}
      >
        {t("enrollFree")}
      </Button>
    );
  }

  // Premium → go to checkout.
  return (
    <Button
      fullWidth={fullWidth}
      size={size}
      onClick={() => router.push(`${detailPath}/checkout`)}
    >
      {t("enrollWithPrice", { price: formatPrice(course.price, locale) ?? "" })}
    </Button>
  );
}
