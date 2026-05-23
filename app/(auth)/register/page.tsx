import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerAuth } from "@/lib/auth/server";
import { dashboardPathForRole } from "@/lib/auth/shared";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  // SSR guard: an already-authenticated visitor is sent to their dashboard.
  const auth = getServerAuth();
  if (auth?.user) {
    redirect(dashboardPathForRole(auth.user.role));
  }

  const t = await getTranslations("auth");
  return (
    <AuthLayout title={t("registerTitle")} subtitle={t("registerSubtitle")}>
      <RegisterForm />
    </AuthLayout>
  );
}
