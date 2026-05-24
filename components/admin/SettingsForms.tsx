"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { toast } from "@/components/ui/use-toast";
import { useUpdateSettings, useUploadLogo } from "@/lib/hooks/useAdmin";
import type { AdminSettings } from "@/lib/types";

const selectClass =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50";

/** Shared submit helper for each settings section. */
function useSectionSave() {
  const t = useTranslations("admin");
  const mutation = useUpdateSettings();
  function save(payload: Partial<AdminSettings>) {
    mutation.mutate(payload, {
      onSuccess: () => toast({ title: t("settingsSaved"), variant: "success" }),
      onError: () => toast({ title: t("settingsError"), variant: "destructive" }),
    });
  }
  return { save, isPending: mutation.isPending };
}

function SaveButton({ isPending }: { isPending: boolean }) {
  const t = useTranslations("admin");
  return (
    <div className="flex justify-end pt-2">
      <Button type="submit" isLoading={isPending}>
        {t("save")}
      </Button>
    </div>
  );
}

export function GeneralSettingsForm({ settings }: { settings: AdminSettings }) {
  const t = useTranslations("admin");
  const { save, isPending } = useSectionSave();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      platform_name: settings.platform_name,
      platform_tagline: settings.platform_tagline,
      support_email: settings.support_email,
    },
  });
  return (
    <form onSubmit={handleSubmit(save)} className="flex flex-col gap-4">
      <Input label={t("platformName")} {...register("platform_name")} />
      <Input label={t("platformTagline")} {...register("platform_tagline")} />
      <Input type="email" label={t("supportEmail")} {...register("support_email")} />
      <SaveButton isPending={isPending} />
    </form>
  );
}

export function BrandingSettingsForm({ settings }: { settings: AdminSettings }) {
  const t = useTranslations("admin");
  const { save, isPending } = useSectionSave();
  const uploadLogo = useUploadLogo();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      logo_url: settings.logo_url,
      primary_color: settings.primary_color || "#2563eb",
      secondary_color: settings.secondary_color || "#4f46e5",
    },
  });
  return (
    <form onSubmit={handleSubmit(save)} className="flex flex-col gap-4">
      <ImageUpload
        label={t("logo")}
        value={settings.logo_url}
        onChange={() => undefined}
        uploadFn={(file) => uploadLogo.mutateAsync(file).then((r) => r.logo_url)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="primary_color" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("primaryColor")}
          </label>
          <input
            id="primary_color"
            type="color"
            className="h-10 w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-700"
            {...register("primary_color")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="secondary_color" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("secondaryColor")}
          </label>
          <input
            id="secondary_color"
            type="color"
            className="h-10 w-full cursor-pointer rounded-md border border-gray-300 dark:border-gray-700"
            {...register("secondary_color")}
          />
        </div>
      </div>
      <SaveButton isPending={isPending} />
    </form>
  );
}

export function EmailSettingsForm({ settings }: { settings: AdminSettings }) {
  const t = useTranslations("admin");
  const { save, isPending } = useSectionSave();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      from_name: settings.from_name,
      from_address: settings.from_address,
      footer_text: settings.footer_text,
    },
  });
  return (
    <form onSubmit={handleSubmit(save)} className="flex flex-col gap-4">
      <Input label={t("fromName")} {...register("from_name")} />
      <Input type="email" label={t("fromAddress")} {...register("from_address")} />
      <Input label={t("footerText")} {...register("footer_text")} />
      <SaveButton isPending={isPending} />
    </form>
  );
}

export function LocalizationSettingsForm({ settings }: { settings: AdminSettings }) {
  const t = useTranslations("admin");
  const { save, isPending } = useSectionSave();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      default_language: settings.default_language,
      default_currency: settings.default_currency,
    },
  });
  return (
    <form onSubmit={handleSubmit(save)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="default_language" className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t("defaultLanguage")}
        </label>
        <select id="default_language" className={selectClass} {...register("default_language")}>
          <option value="en">{t("langEn")}</option>
          <option value="ar">{t("langAr")}</option>
        </select>
      </div>
      <Input label={t("defaultCurrency")} {...register("default_currency")} />
      <SaveButton isPending={isPending} />
    </form>
  );
}

export function EnrollmentSettingsForm({ settings }: { settings: AdminSettings }) {
  const t = useTranslations("admin");
  const { save, isPending } = useSectionSave();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      allow_self_registration: settings.allow_self_registration,
      placement_test_required: settings.placement_test_required,
    },
  });
  return (
    <form onSubmit={handleSubmit(save)} className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
        <input
          type="checkbox"
          className="h-4 w-4 accent-blue-600"
          {...register("allow_self_registration")}
        />
        {t("allowSelfRegistration")}
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
        <input
          type="checkbox"
          className="h-4 w-4 accent-blue-600"
          {...register("placement_test_required")}
        />
        {t("placementTestRequired")}
      </label>
      <SaveButton isPending={isPending} />
    </form>
  );
}
