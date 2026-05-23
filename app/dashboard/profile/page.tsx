"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Alert } from "@/components/ui/Alert";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { AvatarUploader } from "@/components/profile/AvatarUploader";
import { useMe } from "@/lib/hooks/useAuth";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const me = useMe();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {me.isLoading ? (
        <div className="flex flex-col gap-6">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      ) : me.isError || !me.data ? (
        <Alert variant="error">{t("updateError")}</Alert>
      ) : (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("avatarSection")}</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUploader user={me.data} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("profileSection")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm user={me.data} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("passwordSection")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
