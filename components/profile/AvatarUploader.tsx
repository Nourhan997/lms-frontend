"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/use-toast";
import { useUploadAvatar } from "@/lib/hooks/useProfile";
import type { User } from "@/lib/types";

export function AvatarUploader({ user }: { user: User }) {
  const t = useTranslations("profile");
  const upload = useUploadAvatar();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Release the object URL when it changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  function handleUpload() {
    if (!file) return;
    upload.mutate(file, {
      onSuccess: () => {
        toast({ title: t("avatarUpdated"), variant: "success" });
        setFile(null);
        setPreview(null);
      },
      onError: () => toast({ title: t("avatarError"), variant: "destructive" }),
    });
  }

  return (
    <div className="flex items-center gap-4">
      {preview ? (
        <Image
          src={preview}
          alt=""
          width={64}
          height={64}
          unoptimized
          className="h-16 w-16 rounded-full object-cover"
        />
      ) : (
        <Avatar name={user.name} src={user.avatar_url} size="lg" className="h-16 w-16 text-lg" />
      )}

      <div className="flex flex-col gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handlePick}
          className="hidden"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            {t("changePhoto")}
          </Button>
          {file && (
            <Button
              type="button"
              size="sm"
              isLoading={upload.isPending}
              onClick={handleUpload}
            >
              {t("uploadPhoto")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
