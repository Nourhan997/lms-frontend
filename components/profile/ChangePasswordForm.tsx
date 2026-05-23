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
import { useChangePassword } from "@/lib/hooks/useProfile";

interface PasswordValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export function ChangePasswordForm() {
  const t = useTranslations("profile");
  const tv = useTranslations("validation");
  const mutation = useChangePassword();

  const schema = useMemo(
    () =>
      z
        .object({
          current_password: z.string().min(1, tv("required")),
          new_password: z.string().min(8, tv("passwordMin")),
          confirm_password: z.string().min(1, tv("required")),
        })
        .refine((data) => data.new_password === data.confirm_password, {
          message: tv("passwordsNoMatch"),
          path: ["confirm_password"],
        }),
    [tv],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = handleSubmit((values) =>
    mutation.mutate(
      {
        current_password: values.current_password,
        new_password: values.new_password,
      },
      {
        onSuccess: () => {
          toast({ title: t("passwordChanged"), variant: "success" });
          reset();
        },
        onError: () =>
          toast({ title: t("passwordError"), variant: "destructive" }),
      },
    ),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {mutation.isError && <Alert variant="error">{t("passwordError")}</Alert>}

      <Input
        type="password"
        autoComplete="current-password"
        label={t("currentPassword")}
        error={errors.current_password?.message}
        {...register("current_password")}
      />
      <Input
        type="password"
        autoComplete="new-password"
        label={t("newPassword")}
        error={errors.new_password?.message}
        {...register("new_password")}
      />
      <Input
        type="password"
        autoComplete="new-password"
        label={t("confirmPassword")}
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />

      <div>
        <Button type="submit" isLoading={mutation.isPending}>
          {t("changePassword")}
        </Button>
      </div>
    </form>
  );
}
