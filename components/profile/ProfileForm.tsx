"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/use-toast";
import { useUpdateProfile } from "@/lib/hooks/useProfile";
import type { Locale, User } from "@/lib/types";

interface ProfileValues {
  name: string;
  bio: string;
  preferred_language: Locale;
}

export function ProfileForm({ user }: { user: User }) {
  const t = useTranslations("profile");
  const tv = useTranslations("validation");
  const mutation = useUpdateProfile();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, tv("nameMin")),
        bio: z.string().max(500),
        preferred_language: z.enum(["en", "ar"]),
      }),
    [tv],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      bio: user.bio ?? "",
      preferred_language: user.preferred_language,
    },
  });

  const onSubmit = handleSubmit((values) =>
    mutation.mutate(values, {
      onSuccess: () => toast({ title: t("updated"), variant: "success" }),
      onError: () => toast({ title: t("updateError"), variant: "destructive" }),
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {mutation.isError && <Alert variant="error">{t("updateError")}</Alert>}

      <Input
        label={t("name")}
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="bio"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {t("bio")}
        </label>
        <textarea
          id="bio"
          rows={4}
          placeholder={t("bioPlaceholder")}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
          {...register("bio")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="preferred_language"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {t("language")}
        </label>
        <select
          id="preferred_language"
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
          {...register("preferred_language")}
        >
          <option value="en">{t("languageEnglish")}</option>
          <option value="ar">{t("languageArabic")}</option>
        </select>
      </div>

      <div>
        <Button type="submit" isLoading={mutation.isPending}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
