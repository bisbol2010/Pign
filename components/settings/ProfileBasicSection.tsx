"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFileActionsContext } from "@/components/file-actions";
import { SettingsFieldRow } from "./SettingsFieldRow";
import { SettingsTextAction } from "./SettingsTextAction";
import { ProfileAvatarRow } from "./ProfileAvatarRow";

type ProfileBasicSectionProps = {
  displayName: string;
  displayEmail: string;
  pignHandle?: string;
  avatarUrl: string | null;
};

export function ProfileBasicSection({
  displayName,
  displayEmail,
  pignHandle,
  avatarUrl,
}: ProfileBasicSectionProps) {
  const router = useRouter();
  const { showToast } = useFileActionsContext();
  const updateName = useMutation(api.users.updateName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(displayName);
  const [savingName, setSavingName] = useState(false);

  const handleSaveName = async () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed === displayName) {
      setIsEditingName(false);
      setNameValue(displayName);
      return;
    }
    setSavingName(true);
    try {
      await updateName({ name: trimmed });
      setIsEditingName(false);
      showToast({ message: "Name updated", type: "success" });
    } catch {
      showToast({ message: "Failed to update name.", type: "error" });
    } finally {
      setSavingName(false);
    }
  };

  return (
    <section>
      <h2 className="mb-1 text-[18px] font-medium text-pign-black">Basic</h2>
      <div className="mt-4 border-t border-grey-6">
        <ProfileAvatarRow displayName={displayName} avatarUrl={avatarUrl} />

        <SettingsFieldRow
          label="Name:"
          actions={
            <>
              {isEditingName ? (
                <>
                  <SettingsTextAction
                    muted={savingName}
                    disabled={savingName}
                    onClick={handleSaveName}
                  >
                    Save
                  </SettingsTextAction>
                  <SettingsTextAction
                    disabled={savingName}
                    onClick={() => {
                      setIsEditingName(false);
                      setNameValue(displayName);
                    }}
                  >
                    Cancel
                  </SettingsTextAction>
                </>
              ) : (
                <SettingsTextAction
                  onClick={() => {
                    setNameValue(displayName);
                    setIsEditingName(true);
                  }}
                >
                  Edit
                </SettingsTextAction>
              )}
            </>
          }
        >
          {isEditingName ? (
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              disabled={savingName}
              className="w-full max-w-md rounded border border-grey-5 px-2 py-1 text-[16px] font-medium text-pign-black focus:border-pign-black focus:outline-none"
              autoFocus
            />
          ) : (
            <span>{displayName}</span>
          )}
        </SettingsFieldRow>

        <SettingsFieldRow
          label="Email:"
          actions={
            <SettingsTextAction
              onClick={() => router.push("/settings?billing=open")}
            >
              Upgrade plan
            </SettingsTextAction>
          }
        >
          <span>{displayEmail}</span>
        </SettingsFieldRow>

        {pignHandle ? (
          <SettingsFieldRow label="Pign handle:">
            <span className="font-normal text-grey-2">@{pignHandle}</span>
          </SettingsFieldRow>
        ) : null}
      </div>
    </section>
  );
}
