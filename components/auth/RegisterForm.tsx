"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useRegister } from "@/lib/hooks/useAuth";
import type { Locale } from "@/lib/types";

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  preferred_language: Locale;
}

export function RegisterForm() {
  const t = useTranslations();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().min(2, t("validation.nameMin")),
          email: z
            .string()
            .min(1, t("validation.required"))
            .email(t("validation.emailInvalid")),
          password: z.string().min(8, t("validation.passwordMin")),
          confirmPassword: z.string().min(1, t("validation.required")),
          preferred_language: z.enum(["en", "ar"]),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("validation.passwordsNoMatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      preferred_language: "en",
    },
  });

  // Redirect on success is handled inside useRegister().
  // confirmPassword is validation-only and intentionally not sent to the API.
  const onSubmit = handleSubmit((values) =>
    registerMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      preferred_language: values.preferred_language,
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {registerMutation.isError && (
        <Alert variant="error">{registerMutation.error.message}</Alert>
      )}

      <Input
        autoComplete="name"
        label={t("auth.name")}
        placeholder={t("auth.namePlaceholder")}
        error={errors.name?.message}
        {...register("name")}
      />

      <Input
        type="email"
        autoComplete="email"
        label={t("auth.email")}
        placeholder={t("auth.emailPlaceholder")}
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        label={t("auth.password")}
        placeholder={t("auth.passwordPlaceholder")}
        error={errors.password?.message}
        endAdornment={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword ? t("auth.hidePassword") : t("auth.showPassword")
            }
            className="rounded p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        }
        {...register("password")}
      />

      <Input
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        label={t("auth.confirmPassword")}
        placeholder={t("auth.passwordPlaceholder")}
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="preferred_language"
          className="text-sm font-medium text-gray-900 dark:text-gray-100"
        >
          {t("auth.language")}
        </label>
        <select
          id="preferred_language"
          className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
          {...register("preferred_language")}
        >
          <option value="en">{t("auth.languageEnglish")}</option>
          <option value="ar">{t("auth.languageArabic")}</option>
        </select>
      </div>

      <Button type="submit" fullWidth isLoading={registerMutation.isPending}>
        {t("auth.registerButton")}
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {t("auth.haveAccountQuestion")}{" "}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          {t("auth.signInLink")}
        </Link>
      </p>
    </form>
  );
}
