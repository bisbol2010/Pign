"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useFileActionsContext } from "@/components/file-actions";
import {
  DATE_FORMAT_OPTIONS,
  DEFAULT_DATE_FORMAT,
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  dateFormatLabel,
  detectBrowserTimezone,
  formatTimezoneLabel,
  formatTimezoneLocation,
  formatTimezoneOffset,
  languageLabel,
} from "@/lib/settings";
import { SettingsFieldRow } from "./SettingsFieldRow";
import { SettingsTextAction } from "./SettingsTextAction";
import { SettingsToggle } from "./SettingsToggle";

type ProfilePreferenceSectionProps = {
  language?: string;
  dateFormat?: string;
  timezone?: string;
  timezoneAuto?: boolean;
};

export function ProfilePreferenceSection({
  language,
  dateFormat,
  timezone,
  timezoneAuto,
}: ProfilePreferenceSectionProps) {
  const { showToast } = useFileActionsContext();
  const updatePreferences = useMutation(api.users.updatePreferences);
  const updateTimezone = useMutation(api.users.updateTimezone);

  const resolvedLanguage = language ?? DEFAULT_LANGUAGE;
  const resolvedDateFormat = dateFormat ?? DEFAULT_DATE_FORMAT;
  const resolvedTimezone = timezone ?? detectBrowserTimezone();
  const autoTimezone = timezoneAuto ?? true;

  const [editingLanguage, setEditingLanguage] = useState(false);
  const [editingDateFormat, setEditingDateFormat] = useState(false);
  const [editingTimezone, setEditingTimezone] = useState(false);
  const [saving, setSaving] = useState(false);

  const timezoneDisplay = autoTimezone
    ? `${formatTimezoneOffset(resolvedTimezone)} (${formatTimezoneLocation(resolvedTimezone)})`
    : formatTimezoneLabel(resolvedTimezone);

  const persistTimezone = async (
    nextTimezone: string,
    nextAuto: boolean
  ) => {
    setSaving(true);
    try {
      await updateTimezone({
        timezone: nextTimezone,
        timezoneAuto: nextAuto,
      });
      showToast({ message: "Time zone updated", type: "success" });
    } catch {
      showToast({ message: "Failed to update timezone.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-1 text-[18px] font-medium text-pign-black">
        Preference
      </h2>
      <div className="mt-4 border-t border-grey-6">
        <SettingsFieldRow
          label="Language"
          actions={
            editingLanguage ? (
              <SettingsTextAction onClick={() => setEditingLanguage(false)}>
                Done
              </SettingsTextAction>
            ) : (
              <SettingsTextAction onClick={() => setEditingLanguage(true)}>
                Change
              </SettingsTextAction>
            )
          }
        >
          {editingLanguage ? (
            <select
              value={resolvedLanguage}
              disabled={saving}
              className="max-w-md rounded border border-grey-5 bg-white px-2 py-1 text-[16px] font-medium text-pign-black focus:border-pign-black focus:outline-none"
              onChange={async (e) => {
                setSaving(true);
                try {
                  await updatePreferences({ language: e.target.value });
                  showToast({ message: "Language updated", type: "success" });
                } catch {
                  showToast({
                    message: "Failed to update language.",
                    type: "error",
                  });
                } finally {
                  setSaving(false);
                }
              }}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <span>{languageLabel(resolvedLanguage)}</span>
          )}
        </SettingsFieldRow>

        <SettingsFieldRow
          label="Date format"
          actions={
            editingDateFormat ? (
              <SettingsTextAction onClick={() => setEditingDateFormat(false)}>
                Done
              </SettingsTextAction>
            ) : (
              <SettingsTextAction onClick={() => setEditingDateFormat(true)}>
                Change
              </SettingsTextAction>
            )
          }
        >
          {editingDateFormat ? (
            <select
              value={resolvedDateFormat}
              disabled={saving}
              className="max-w-md rounded border border-grey-5 bg-white px-2 py-1 text-[16px] font-medium text-pign-black focus:border-pign-black focus:outline-none"
              onChange={async (e) => {
                setSaving(true);
                try {
                  await updatePreferences({ dateFormat: e.target.value });
                  showToast({
                    message: "Date format updated",
                    type: "success",
                  });
                } catch {
                  showToast({
                    message: "Failed to update date format.",
                    type: "error",
                  });
                } finally {
                  setSaving(false);
                }
              }}
            >
              {DATE_FORMAT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <span>{dateFormatLabel(resolvedDateFormat)}</span>
          )}
        </SettingsFieldRow>

        <SettingsFieldRow
          label="Automatic time zone"
          actions={
            <div className="flex items-center gap-2">
              {!autoTimezone ? (
                editingTimezone ? (
                  <SettingsTextAction onClick={() => setEditingTimezone(false)}>
                    Done
                  </SettingsTextAction>
                ) : (
                  <SettingsTextAction onClick={() => setEditingTimezone(true)}>
                    Change
                  </SettingsTextAction>
                )
              ) : null}
              <SettingsToggle
                checked={autoTimezone}
                disabled={saving}
                label="Toggle automatic time zone"
                onChange={async (checked) => {
                  const nextTz = checked
                    ? detectBrowserTimezone()
                    : resolvedTimezone;
                  await persistTimezone(nextTz, checked);
                }}
              />
              <span className="text-[16px] text-grey-2">
                {autoTimezone ? "On" : "Off"}
              </span>
            </div>
          }
        >
          {editingTimezone && !autoTimezone ? (
            <select
              value={resolvedTimezone}
              disabled={saving}
              className="max-w-md rounded border border-grey-5 bg-white px-2 py-1 text-[16px] font-medium text-pign-black focus:border-pign-black focus:outline-none"
              onChange={async (e) => {
                await persistTimezone(e.target.value, false);
              }}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz} value={tz}>
                  {formatTimezoneLabel(tz)}
                </option>
              ))}
            </select>
          ) : (
            <span>{timezoneDisplay}</span>
          )}
        </SettingsFieldRow>
      </div>
    </section>
  );
}
