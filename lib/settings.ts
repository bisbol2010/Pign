/** User preference defaults aligned with Figma Profile tab (537:1084). */

export const DEFAULT_LANGUAGE = "en-GB";
export const DEFAULT_DATE_FORMAT = "DD/MM/YYYY";

export const LANGUAGE_OPTIONS = [
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "en-US", label: "English (United States)" },
] as const;

export const DATE_FORMAT_OPTIONS = [
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
] as const;

export type DateFormatValue = (typeof DATE_FORMAT_OPTIONS)[number]["value"];

/** Common IANA zones for manual selection when auto timezone is off. */
export const TIMEZONE_OPTIONS = [
  "Africa/Lagos",
  "Africa/Johannesburg",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "UTC",
] as const;

export function detectBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** e.g. "GMT+01:00" */
export function formatTimezoneOffset(timeZone: string, date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value;
    return offset ?? "GMT";
  } catch {
    return "GMT";
  }
}

/** e.g. "Lagos Nigeria" from IANA id */
export function formatTimezoneLocation(timeZone: string): string {
  const segment = timeZone.split("/").pop() ?? timeZone;
  return segment.replace(/_/g, " ");
}

export function formatTimezoneLabel(timeZone: string): string {
  const offset = formatTimezoneOffset(timeZone);
  const location = formatTimezoneLocation(timeZone);
  return `${offset} (${location})`;
}

export function languageLabel(code: string | undefined): string {
  const match = LANGUAGE_OPTIONS.find((o) => o.value === code);
  return match?.label ?? LANGUAGE_OPTIONS[0].label;
}

export function dateFormatLabel(format: string | undefined): string {
  const match = DATE_FORMAT_OPTIONS.find((o) => o.value === format);
  return match?.label ?? DEFAULT_DATE_FORMAT;
}
