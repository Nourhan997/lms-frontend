"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/use-toast";

export interface ImageUploadProps {
  /** Current stored image URL. */
  value: string | null;
  /** Called with the uploaded URL once the upload resolves. */
  onChange: (url: string) => void;
  /** Performs the upload and resolves to the stored URL. */
  uploadFn: (file: File) => Promise<string>;
  label?: string;
}

/** Image picker with local preview that uploads on selection. */
export function ImageUpload({ value, onChange, uploadFn, label }: ImageUploadProps) {
  const t = useTranslations("admin");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadFn(file);
      onChange(url);
    } catch {
      toast({ title: t("saveError"), variant: "destructive" });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  const shown = preview ?? value;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className="relative flex h-20 w-32 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
          {shown ? (
            <Image
              src={shown}
              alt=""
              fill
              unoptimized
              sizes="128px"
              className="object-contain"
            />
          ) : (
            <ImagePlus className="h-6 w-6 text-gray-300 dark:text-gray-600" aria-hidden="true" />
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handlePick}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          isLoading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {t("thumbnail")}
        </Button>
      </div>
    </div>
  );
}
