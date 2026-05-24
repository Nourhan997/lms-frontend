"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/use-toast";
import { useCreateInstructor } from "@/lib/hooks/useAdmin";

interface FormValues {
  name: string;
  email: string;
  password: string;
  bio: string;
}

export interface CreateInstructorModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateInstructorModal({ open, onClose }: CreateInstructorModalProps) {
  const t = useTranslations("admin");
  const tv = useTranslations("validation");
  const create = useCreateInstructor();

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, tv("nameMin")),
        email: z.string().min(1, tv("required")).email(tv("emailInvalid")),
        password: z.string().min(8, tv("passwordMin")),
        bio: z.string(),
      }),
    [tv],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", bio: "" },
  });

  // Reset fields whenever the modal opens.
  useEffect(() => {
    if (open) reset({ name: "", email: "", password: "", bio: "" });
  }, [open, reset]);

  const onSubmit = handleSubmit((values) =>
    create.mutate(values, {
      onSuccess: () => {
        toast({ title: t("instructorCreated"), variant: "success" });
        onClose();
      },
    }),
  );

  return (
    <Modal open={open} onClose={onClose} title={t("createInstructorTitle")}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {create.isError && <Alert variant="error">{t("createInstructorError")}</Alert>}

        <Input label={t("instructorName")} error={errors.name?.message} {...register("name")} />
        <Input
          type="email"
          autoComplete="email"
          label={t("instructorEmail")}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          type="password"
          autoComplete="new-password"
          label={t("instructorPassword")}
          error={errors.password?.message}
          {...register("password")}
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="instructor-bio" className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {t("instructorBio")}
          </label>
          <textarea
            id="instructor-bio"
            rows={3}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
            {...register("bio")}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={create.isPending}>
            {t("addInstructor")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
