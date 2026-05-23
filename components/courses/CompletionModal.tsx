"use client";

import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { PartyPopper } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

const CONFETTI_PIECES = Array.from({ length: 12 });

export interface CompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateHref?: string;
}

/** Celebratory modal shown when a course is completed. CSS-only confetti. */
export function CompletionModal({
  open,
  onOpenChange,
  certificateHref = "/dashboard/certificates",
}: CompletionModalProps) {
  const t = useTranslations("learn");

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          {/* Confetti rains over the whole overlay. */}
          <div className="confetti" aria-hidden="true">
            {CONFETTI_PIECES.map((_, i) => (
              <span key={i} className="confetti-piece" />
            ))}
          </div>
        </Dialog.Overlay>

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 text-center shadow-xl dark:border-gray-800 dark:bg-gray-950">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-300">
            <PartyPopper className="h-7 w-7" aria-hidden="true" />
          </div>

          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-50">
            {t("completionTitle")}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {t("completionBody")}
          </Dialog.Description>

          <div className="mt-6 flex flex-col gap-2">
            <Link href={certificateHref}>
              <Button fullWidth>{t("viewCertificate")}</Button>
            </Link>
            <Dialog.Close asChild>
              <Button variant="ghost" fullWidth>
                {t("close")}
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
