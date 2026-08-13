import type {
  CvDocument,
  EducationEntry,
  PersonalCustomField,
  PersonalFieldVisibility,
  PersonalInfo,
  PersonalOptionalFieldKey,
} from "@/features/cv-editor/types";
import { splitFullName } from "@/lib/auth/names";
import { normalizeTertiaryEntry } from "@/lib/cvs/education-dates";

export function composeFullName(
  givenName: string | null | undefined,
  familyName: string | null | undefined,
): string {
  return [givenName?.trim() ?? "", familyName?.trim() ?? ""]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function composeLocation(
  address: string | null | undefined,
  postCode: string | null | undefined,
  city: string | null | undefined,
  fallback = "",
): string {
  const street = address?.trim() ?? "";
  const postal = postCode?.trim() ?? "";
  const cityName = city?.trim() ?? "";

  const parts: string[] = [];
  if (street) parts.push(street);

  if (cityName && postal) {
    parts.push(`${cityName} ${postal}`);
  } else if (cityName) {
    parts.push(cityName);
  } else if (postal) {
    parts.push(postal);
  }

  if (parts.length === 0) return fallback.trim();
  return parts.join(", ");
}

export function emptyPersonalInfo(): PersonalInfo {
  return normalizePersonalInfo({});
}

export const OPTIONAL_FIELD_VALUE_KEYS: Record<
  PersonalOptionalFieldKey,
  keyof PersonalInfo
> = {
  driversLicense: "driversLicense",
  website: "portfolio",
  linkedin: "linkedin",
  dateOfBirth: "dateOfBirth",
  placeOfBirth: "placeOfBirth",
  gender: "gender",
  nationality: "nationality",
  civilStatus: "civilStatus",
};

export const OPTIONAL_FIELD_LABELS: Record<PersonalOptionalFieldKey, string> =
  {
    driversLicense: "Driver's license",
    website: "Website",
    linkedin: "LinkedIn",
    dateOfBirth: "Date of birth",
    placeOfBirth: "Place of birth",
    gender: "Gender",
    nationality: "Nationality",
    civilStatus: "Civil status",
  };

export const ADDABLE_OPTIONAL_FIELDS: PersonalOptionalFieldKey[] = [
  "dateOfBirth",
  "placeOfBirth",
  "gender",
  "nationality",
  "civilStatus",
];

export const DEFAULT_VISIBLE_OPTIONAL_FIELDS = new Set<PersonalOptionalFieldKey>([
  "driversLicense",
  "website",
  "linkedin",
]);

export function isOptionalFieldVisible(
  personal: PersonalInfo,
  key: PersonalOptionalFieldKey,
): boolean {
  const visibility = personal.fieldVisibility ?? {};
  if (visibility[key] === true) return true;
  if (visibility[key] === false) return false;
  if (DEFAULT_VISIBLE_OPTIONAL_FIELDS.has(key)) return true;
  const valueKey = OPTIONAL_FIELD_VALUE_KEYS[key];
  const value = personal[valueKey];
  return typeof value === "string" && value.trim().length > 0;
}

export function inferFieldVisibility(
  personal: Partial<PersonalInfo>,
): PersonalFieldVisibility {
  const visibility: PersonalFieldVisibility = {
    ...(personal.fieldVisibility ?? {}),
  };

  for (const key of Object.keys(
    OPTIONAL_FIELD_LABELS,
  ) as PersonalOptionalFieldKey[]) {
    if (visibility[key] !== undefined) continue;
    const valueKey = OPTIONAL_FIELD_VALUE_KEYS[key];
    const value = personal[valueKey];
    if (typeof value === "string" && value.trim()) {
      visibility[key] = true;
    }
  }

  return visibility;
}

export function normalizePersonalInfo(
  raw: Partial<PersonalInfo>,
): PersonalInfo {
  let givenName = raw.givenName?.trim() ?? "";
  let familyName = raw.familyName?.trim() ?? "";
  const legacyFullName = raw.fullName?.trim() ?? "";

  if (!givenName && !familyName && legacyFullName) {
    const split = splitFullName(legacyFullName);
    givenName = split.firstName;
    familyName = split.lastName;
  }

  const address = raw.address?.trim() ?? raw.location?.trim() ?? "";
  const postCode = raw.postCode?.trim() ?? "";
  const city = raw.city?.trim() ?? "";
  const legacyLocation = raw.location?.trim() ?? "";

  const personal: PersonalInfo = {
    photoUrl: raw.photoUrl,
    givenName,
    familyName,
    fullName: legacyFullName,
    title: raw.title?.trim() ?? "",
    useAsHeadline: raw.useAsHeadline ?? true,
    email: raw.email?.trim() ?? "",
    phone: raw.phone?.trim() ?? "",
    address,
    postCode,
    city,
    location: legacyLocation,
    driversLicense: raw.driversLicense?.trim() ?? "",
    linkedin: raw.linkedin?.trim() ?? "",
    portfolio: raw.portfolio?.trim() ?? "",
    socialLinks: raw.socialLinks ?? [],
    dateOfBirth: raw.dateOfBirth?.trim() ?? "",
    placeOfBirth: raw.placeOfBirth?.trim() ?? "",
    gender: raw.gender?.trim() ?? "",
    nationality: raw.nationality?.trim() ?? "",
    civilStatus: raw.civilStatus?.trim() ?? "",
    customFields: Array.isArray(raw.customFields)
      ? raw.customFields.filter(
          (field): field is PersonalCustomField =>
            Boolean(field && typeof field.id === "string"),
        )
      : [],
    fieldVisibility: inferFieldVisibility(raw),
  };

  return syncPersonalLegacyFields(personal);
}

export function syncPersonalLegacyFields(personal: PersonalInfo): PersonalInfo {
  const fullName =
    composeFullName(personal.givenName, personal.familyName) ||
    (personal.fullName?.trim() ?? "");
  const location = composeLocation(
    personal.address,
    personal.postCode,
    personal.city,
    personal.location,
  );

  return {
    ...personal,
    fullName,
    location,
  };
}

export function formatPersonalContactLine(personal: PersonalInfo): string[] {
  const lines: string[] = [];
  const location = composeLocation(
    personal.address ?? "",
    personal.postCode ?? "",
    personal.city ?? "",
    personal.location ?? "",
  );
  if (location) lines.push(location);
  if (personal.driversLicense?.trim()) {
    lines.push(personal.driversLicense.trim());
  }
  return lines;
}

export function visibleOptionalPersonalDetails(
  personal: PersonalInfo,
): Array<{ label: string; value: string }> {
  const items: Array<{ label: string; value: string }> = [];

  for (const key of Object.keys(
    OPTIONAL_FIELD_LABELS,
  ) as PersonalOptionalFieldKey[]) {
    if (!isOptionalFieldVisible(personal, key)) continue;
    if (key === "website" || key === "linkedin" || key === "driversLicense") {
      continue;
    }
    const valueKey = OPTIONAL_FIELD_VALUE_KEYS[key];
    const value = personal[valueKey];
    if (typeof value === "string" && value.trim()) {
      items.push({ label: OPTIONAL_FIELD_LABELS[key], value: value.trim() });
    }
  }

  for (const field of personal.customFields ?? []) {
    if (field.label?.trim() && field.value?.trim()) {
      items.push({ label: field.label.trim(), value: field.value.trim() });
    }
  }

  return items;
}

function isTertiaryEducation(
  entry: EducationEntry,
): entry is Extract<
  EducationEntry,
  {
    qualificationType:
      | "diploma"
      | "hnd"
      | "bachelors"
      | "honours"
      | "masters"
      | "doctorate"
      | "other";
  }
> {
  return (
    entry.qualificationType === "diploma" ||
    entry.qualificationType === "hnd" ||
    entry.qualificationType === "bachelors" ||
    entry.qualificationType === "honours" ||
    entry.qualificationType === "masters" ||
    entry.qualificationType === "doctorate" ||
    entry.qualificationType === "other"
  );
}

/** Ensure older CV payloads match the current editor document shape. */
export function normalizeCvDocument(doc: CvDocument): CvDocument {
  return {
    ...doc,
    personal: normalizePersonalInfo(doc.personal ?? {}),
    education: (doc.education ?? []).map((entry) =>
      isTertiaryEducation(entry) ? normalizeTertiaryEntry(entry) : entry,
    ),
    experience: doc.experience ?? [],
    skills: doc.skills ?? [],
    projects: doc.projects ?? [],
    certifications: doc.certifications ?? [],
    languages: doc.languages ?? [],
    achievements: doc.achievements ?? [],
    references: doc.references ?? [],
    sections: doc.sections ?? [],
    summary: doc.summary ?? "",
  };
}
