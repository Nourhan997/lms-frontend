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
import { useCategories, useUploadImage } from "@/lib/hooks/useAdmin";
import type { AdminCourseInput, CourseStatus } from "@/lib/types";

type CourseFormValues = Omit<AdminCourseInput, "status">;

const selectClass =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50";

export interface CourseFormProps {
  initialValues?: Partial<CourseFormValues>;
  onSubmit: (values: AdminCourseInput) => void;
  isSubmitting: boolean;
  isError?: boolean;
}

export function CourseForm({
  initialValues,
  onSubmit,
  isSubmitting,
  isError,
}: CourseFormProps) {
  const t = useTranslations("admin");
  const tc = useTranslations("courses");
  const tv = useTranslations("validation");
  const categories = useCategories();
  const upload = useUploadImage();

  const schema = useMemo(
    () =>
      z.object({
        title_en: z.string().min(1, tv("required")),
        title_ar: z.string().min(1, tv("required")),
        description_en: z.string().min(1, tv("required")),
        description_ar: z.string().min(1, tv("required")),
        category_id: z.number().int().positive(tv("required")),
        level: z.enum(["beginner", "intermediate", "advanced"]),
        language: z.enum(["en", "ar", "fr"]),
        price: z.number().min(0),
        thumbnail_url: z.string().nullable(),
      }),
    [tv],
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      category_id: 0,
      level: "beginner",
      language: "en",
      price: 0,
      thumbnail_url: null,
      ...initialValues,
    },
  });

  const submitWith = (status: CourseStatus) =>
    handleSubmit((values) => onSubmit({ ...values, status }));

  return (
    <form className="flex flex-col gap-5">
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
            {t("descEn")}
          </label>
          <textarea
            rows={4}
            className={selectClass + " h-auto py-2"}
            {...register("description_en")}
          />
          {errors.description_en && (
            <p className="text-sm text-red-600">{errors.description_en.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("descAr")}
          </label>
          <textarea
            rows={4}
            dir="rtl"
            className={selectClass + " h-auto py-2"}
            {...register("description_ar")}
          />
          {errors.description_ar && (
            <p className="text-sm text-red-600">{errors.description_ar.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category_id" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("category")}
          </label>
          <select
            id="category_id"
            className={selectClass}
            {...register("category_id", { valueAsNumber: true })}
          >
            <option value="0">{t("selectCategory")}</option>
            {categories.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-sm text-red-600">{errors.category_id.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="level" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("level")}
          </label>
          <select id="level" className={selectClass} {...register("level")}>
            <option value="beginner">{tc("levelBeginner")}</option>
            <option value="intermediate">{tc("levelIntermediate")}</option>
            <option value="advanced">{tc("levelAdvanced")}</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="language" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("language")}
          </label>
          <select id="language" className={selectClass} {...register("language")}>
            <option value="en">{t("langEn")}</option>
            <option value="ar">{t("langAr")}</option>
            <option value="fr">{t("langFr")}</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="number"
          min={0}
          step="0.001"
          label={t("price")}
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
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
      </div>

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <Button
          type="button"
          variant="outline"
          isLoading={isSubmitting}
          onClick={submitWith("draft")}
        >
          {t("saveDraft")}
        </Button>
        <Button type="button" isLoading={isSubmitting} onClick={submitWith("published")}>
          {t("publish")}
        </Button>
      </div>
    </form>
  );
}
