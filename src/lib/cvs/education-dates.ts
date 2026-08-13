import { MONTH_OPTIONS } from "@/lib/cvs/date-options";
import type { TertiaryEducation } from "@/features/cv-editor/types";

export function parseEducationDateParts(value: string | null | undefined): {
  month: string;
  year: string;
} {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return { month: "", year: "" };

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})/);
  if (isoMatch) {
    return { year: isoMatch[1], month: isoMatch[2] };
  }

  if (/^\d{4}$/.test(trimmed)) {
    return { year: trimmed, month: "" };
  }

  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    const date = new Date(parsed);
    return {
      year: String(date.getUTCFullYear()),
      month: String(date.getUTCMonth() + 1).padStart(2, "0"),
    };
  }

  return { month: "", year: "" };
}

export function composeEducationDate(month: string, year: string): string {
  const yearValue = year?.trim() ?? "";
  if (!yearValue) return "";
  const monthValue = month?.trim() || "01";
  return `${yearValue}-${monthValue.padStart(2, "0")}-01`;
}

export function formatEducationDateLabel(
  month: string | null | undefined,
  year: string | null | undefined,
  fallback = "",
): string {
  const yearValue = year?.trim() ?? "";
  if (!yearValue) return fallback?.trim() ?? "";
  const monthLabel = MONTH_OPTIONS.find((m) => m.id === month)?.label;
  if (monthLabel) return `${monthLabel} ${yearValue}`;
  return yearValue;
}

export function formatEducationDateRange(
  entry: Pick<
    TertiaryEducation,
    | "startMonth"
    | "startYear"
    | "endMonth"
    | "endYear"
    | "startDate"
    | "endDate"
    | "current"
  >,
): string {
  const start = formatEducationDateLabel(
    entry.startMonth,
    entry.startYear,
    entry.startDate,
  );
  const end = entry.current
    ? "Present"
    : formatEducationDateLabel(entry.endMonth, entry.endYear, entry.endDate);

  if (start && end) return `${start} – ${end}`;
  return start || end || "";
}

export function syncTertiaryDates(entry: TertiaryEducation): TertiaryEducation {
  const startDate =
    composeEducationDate(entry.startMonth ?? "", entry.startYear ?? "") ||
    (entry.startDate?.trim() ?? "");
  const endDate = entry.current
    ? ""
    : composeEducationDate(entry.endMonth ?? "", entry.endYear ?? "") ||
      (entry.endDate?.trim() ?? "");

  return {
    ...entry,
    startDate,
    endDate,
  };
}

export function normalizeTertiaryEntry(
  entry: TertiaryEducation,
): TertiaryEducation {
  const startDate = entry.startDate ?? "";
  const endDate = entry.endDate ?? "";
  const startParts = parseEducationDateParts(startDate);
  const endParts = parseEducationDateParts(endDate);

  const normalized: TertiaryEducation = {
    ...entry,
    city: entry.city?.trim() ?? "",
    startMonth: entry.startMonth || startParts.month,
    startYear: entry.startYear || startParts.year,
    endMonth: entry.endMonth || endParts.month,
    endYear: entry.endYear || endParts.year,
    startDate,
    endDate,
    current:
      entry.current ??
      Boolean(startDate.trim() && !endDate.trim()),
  };

  return syncTertiaryDates(normalized);
}
