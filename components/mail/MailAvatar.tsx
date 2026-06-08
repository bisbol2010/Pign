"use client";

import { useState } from "react";
import { FileGlyphIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type MailAvatarProps = {
  label: string;
  previewUrl?: string | null;
  unread?: boolean;
};

export function MailAvatar({ label, previewUrl, unread }: MailAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const initial = (label || "?").charAt(0).toUpperCase();

  if (previewUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={previewUrl}
        alt=""
        onError={() => setHasError(true)}
        className="size-[31px] shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div
      className={cn(
        "flex size-[31px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-grey-6",
        unread && "ring-1 ring-grey-5"
      )}
    >
      {unread ? (
        <FileGlyphIcon size={24} className="text-grey-4" />
      ) : (
        <span className="text-[12px] font-medium text-grey-3">{initial}</span>
      )}
    </div>
  );
}
