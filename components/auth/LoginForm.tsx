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
import { useLogin } from "@/lib/hooks/useAuth";

interface LoginValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const t = useTranslations();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t("validation.required"))
          .email(t("validation.emailInvalid")),
        password: z.string().min(1, t("validation.required")),
      }),
    [t],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  // Redirect on success is handled inside useLogin().
  const onSubmit = handleSubmit((values) => login.mutate(values));

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {login.isError && (
        <Alert variant="error">{login.error.message}</Alert>
      )}

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
        autoComplete="current-password"
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

      <Button type="submit" fullWidth isLoading={login.isPending}>
        {t("auth.loginButton")}
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        {t("auth.noAccountQuestion")}{" "}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:underline"
        >
          {t("auth.signUpLink")}
        </Link>
      </p>
    </form>
  );
}
