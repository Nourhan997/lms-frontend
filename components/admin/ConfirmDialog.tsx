"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "danger" | "warning";
  isLoading?: boolean;
}

/** Reusable confirmation modal for destructive/important actions. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  const t = useTranslations("admin");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </Dialog.Description>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" size="sm">
                {cancelLabel ?? t("cancel")}
              </Button>
            </Dialog.Close>
            <Button
              variant={variant === "danger" ? "danger" : "primary"}
              size="sm"
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
