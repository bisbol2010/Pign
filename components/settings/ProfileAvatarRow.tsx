"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFileActionsContext } from "@/components/file-actions";
import { SettingsFieldRow } from "./SettingsFieldRow";
import { SettingsTextAction } from "./SettingsTextAction";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

type ProfileAvatarRowProps = {
  displayName: string;
  avatarUrl: string | null;
};

export function ProfileAvatarRow({
  displayName,
  avatarUrl,
}: ProfileAvatarRowProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useFileActionsContext();
  const generateUploadUrl = useMutation(api.users.generateAvatarUploadUrl);
  const updateAvatar = useMutation(api.users.updateAvatar);
  const removeAvatar = useMutation(api.users.removeAvatar);

  const initial = displayName.charAt(0).toUpperCase() || "?";

  const handleChoose = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast({ message: "Please choose an image file.", type: "error" });
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      showToast({ message: "Image must be 2 MB or smaller.", type: "error" });
      return;
    }

    setUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!result.ok) throw new Error("Upload failed");
      const { storageId } = await result.json();
      await updateAvatar({
        storageId,
        contentType: file.type,
        size: file.size,
      });
      showToast({ message: "Profile picture updated", type: "success" });
    } catch {
      showToast({
        message: "Failed to update profile picture.",
        type: "error",
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    try {
      await removeAvatar();
      showToast({ message: "Profile picture removed", type: "success" });
    } catch {
      showToast({
        message: "Failed to remove profile picture.",
        type: "error",
      });
    }
  };

  return (
    <SettingsFieldRow
      label="Picture:"
      actions={
        <>
          <SettingsTextAction
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Choose"}
          </SettingsTextAction>
          <SettingsTextAction
            disabled={uploading || !avatarUrl}
            onClick={handleDelete}
          >
            Delete
          </SettingsTextAction>
        </>
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleChoose(e.target.files)}
      />
      <div className="flex items-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={64}
            height={64}
            className="size-[64px] rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex size-[64px] items-center justify-center rounded-full bg-grey-6">
            <span className="text-[24px] font-medium text-grey-3">{initial}</span>
          </div>
        )}
      </div>
    </SettingsFieldRow>
  );
}
