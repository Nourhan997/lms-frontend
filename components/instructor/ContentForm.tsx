"use client";

import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/use-toast";
import { uploadFile } from "@/lib/api/instructor";
import { cn } from "@/lib/utils/cn";
import type { ContentInput, LessonContentType } from "@/lib/types";

const TYPES: { value: LessonContentType; labelKey: string }[] = [
  { value: "video", labelKey: "typeVideo" },
  { value: "audio", labelKey: "typeAudio" },
  { value: "pdf", labelKey: "typePdf" },
  { value: "text", labelKey: "typeText" },
];

export interface ContentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: ContentInput) => void;
  isSaving: boolean;
}

export function ContentForm({ open, onOpenChange, onSave, isSaving }: ContentFormProps) {
  const t = useTranslations("instructor");
  const tc = useTranslations("common");
  const fileRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<LessonContentType>("video");
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [uploading, setUploading] = useState(false);

  // Reset fields each time the dialog opens.
  useEffect(() => {
    if (open) {
      setType("video");
      setUrl("");
      setHtml("");
    }
  }, [open]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setUrl(result.url);
    } catch {
      toast({ title: t("loadError"), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    const input: ContentInput = {
      type,
      url: type === "text" ? null : url || null,
      html: type === "text" ? html : null,
    };
    onSave(input);
  }

  const accept = type === "audio" ? "audio/*" : "application/pdf";

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("addContent")}
          </Dialog.Title>

          <div className="mt-4 flex flex-col gap-4">
            {/* Type selector */}
            <div className="inline-flex flex-wrap gap-1 rounded-md border border-gray-200 p-0.5 dark:border-gray-700">
              {TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setType(item.value)}
                  className={cn(
                    "rounded px-3 py-1.5 text-sm font-medium transition-colors",
                    type === item.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  )}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>

            {type === "video" && (
              <Input
                label={t("videoUrl")}
                placeholder="https://"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            )}

            {(type === "audio" || type === "pdf") && (
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {type === "audio" ? t("uploadAudio") : t("uploadPdf")}
                </span>
                <input ref={fileRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>
                    {type === "audio" ? t("uploadAudio") : t("uploadPdf")}
                  </Button>
                  {url && <span className="truncate text-xs text-gray-500">{url}</span>}
                </div>
              </div>
            )}

            {type === "text" && (
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t("textBody")}
                </span>
                <textarea
                  rows={6}
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" size="sm">
                {tc("cancel")}
              </Button>
            </Dialog.Close>
            <Button size="sm" isLoading={isSaving} onClick={handleSave}>
              {t("saveContent")}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
