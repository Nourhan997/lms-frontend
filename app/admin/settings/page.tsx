"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/layout/PageHeader";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  BrandingSettingsForm,
  EmailSettingsForm,
  EnrollmentSettingsForm,
  GeneralSettingsForm,
  LocalizationSettingsForm,
} from "@/components/admin/SettingsForms";
import { useSettings } from "@/lib/hooks/useAdmin";

export default function AdminSettingsPage() {
  const t = useTranslations("admin");
  const settings = useSettings();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t("settingsTitle")} />

      {settings.isLoading ? (
        <Skeleton className="h-96 w-full rounded-lg" />
      ) : settings.isError || !settings.data ? (
        <Alert variant="error">{t("loadError")}</Alert>
      ) : (
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">{t("tabGeneral")}</TabsTrigger>
            <TabsTrigger value="branding">{t("tabBranding")}</TabsTrigger>
            <TabsTrigger value="email">{t("tabEmail")}</TabsTrigger>
            <TabsTrigger value="localization">{t("tabLocalization")}</TabsTrigger>
            <TabsTrigger value="enrollment">{t("tabEnrollment")}</TabsTrigger>
          </TabsList>

          <Card className="mt-4">
            <CardContent className="p-6 pt-6">
              <TabsContent value="general" className="pt-0">
                <GeneralSettingsForm settings={settings.data} />
              </TabsContent>
              <TabsContent value="branding" className="pt-0">
                <BrandingSettingsForm settings={settings.data} />
              </TabsContent>
              <TabsContent value="email" className="pt-0">
                <EmailSettingsForm settings={settings.data} />
              </TabsContent>
              <TabsContent value="localization" className="pt-0">
                <LocalizationSettingsForm settings={settings.data} />
              </TabsContent>
              <TabsContent value="enrollment" className="pt-0">
                <EnrollmentSettingsForm settings={settings.data} />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      )}
    </div>
  );
}
