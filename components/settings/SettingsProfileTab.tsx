"use client";

import { ProfileBasicSection } from "./ProfileBasicSection";
import { ProfilePreferenceSection } from "./ProfilePreferenceSection";

type SettingsProfileTabProps = {
  displayName: string;
  displayEmail: string;
  pignHandle?: string;
  avatarUrl: string | null;
  language?: string;
  dateFormat?: string;
  timezone?: string;
  timezoneAuto?: boolean;
};

export function SettingsProfileTab(props: SettingsProfileTabProps) {
  return (
    <div className="space-y-0">
      <ProfileBasicSection
        displayName={props.displayName}
        displayEmail={props.displayEmail}
        pignHandle={props.pignHandle}
        avatarUrl={props.avatarUrl}
      />
      <ProfilePreferenceSection
        language={props.language}
        dateFormat={props.dateFormat}
        timezone={props.timezone}
        timezoneAuto={props.timezoneAuto}
      />
    </div>
  );
}
