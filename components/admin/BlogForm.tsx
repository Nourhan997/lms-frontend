"use client";

import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useUploadImage } from "@/lib/hooks/useAdmin";
import type { AdminBlogInput } from "@/lib/types";

const textareaClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50";

export interface BlogFormProps {
  initialValues?: Partial<AdminBlogInput>;
  onSubmit: (values: AdminBlogInput) => void;
  isSubmitting: boolean;
  isError?: boolean;
}

export function BlogForm({
  initialValues,
  onSubmit,
  isSubmitting,
  isError,
}: BlogFormProps) {
  const t = useTranslations("admin");
  const tv = useTranslations("validation");
  const upload = useUploadImage();

  const schema = useMemo(
    () =>
      z.object({
        title_en: z.string().min(1, tv("required")),
        title_ar: z.string().min(1, tv("required")),
        body_en: z.string().min(1, tv("required")),
        body_ar: z.string().min(1, tv("required")),
        thumbnail_url: z.string().nullable(),
        is_published: z.boolean(),
      }),
    [tv],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdminBlogInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_en: "",
      title_ar: "",
      body_en: "",
      body_ar: "",
      thumbnail_url: null,
      is_published: false,
      ...initialValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="flex flex-col gap-5"
    >
      {isError && <Alert variant="error">{t("saveError")}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("titleEn")}
          error={errors.title_en?.message}
          {...register("title_en")}
        />
        <Input
          label={t("titleAr")}
          dir="rtl"
          error={errors.title_ar?.message}
          {...register("title_ar")}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("bodyEn")}
          </label>
          <textarea rows={8} className={textareaClass} {...register("body_en")} />
          {errors.body_en && (
            <p className="text-sm text-red-600">{errors.body_en.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("bodyAr")}
          </label>
          <textarea rows={8} dir="rtl" className={textareaClass} {...register("body_ar")} />
          {errors.body_ar && (
            <p className="text-sm text-red-600">{errors.body_ar.message}</p>
          )}
        </div>
      </div>

      <Controller
        control={control}
        name="thumbnail_url"
        render={({ field }) => (
          <ImageUpload
            label={t("thumbnail")}
            value={field.value}
            onChange={field.onChange}
            uploadFn={(file) => upload.mutateAsync(file).then((r) => r.url)}
          />
        )}
      />

      <label className="flex items-center gap-2 text-sm text-gray-900 dark:text-gray-100">
        <input
          type="checkbox"
          className="h-4 w-4 accent-blue-600"
          {...register("is_published")}
        />
        {t("isPublished")}
      </label>

      <div className="flex justify-end border-t border-gray-100 pt-4 dark:border-gray-800">
        <Button type="submit" isLoading={isSubmitting}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
