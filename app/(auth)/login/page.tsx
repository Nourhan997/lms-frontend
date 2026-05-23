import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServerAuth } from "@/lib/auth/server";
import { dashboardPathForRole } from "@/lib/auth/shared";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage() {
  // SSR guard: an already-authenticated visitor is sent to their dashboard.
  const auth = getServerAuth();
  if (auth?.user) {
    redirect(dashboardPathForRole(auth.user.role));
  }

  const t = await getTranslations("auth");
  return (
    <AuthLayout title={t("loginTitle")} subtitle={t("loginSubtitle")}>
      <LoginForm />
    </AuthLayout>
  );
}
