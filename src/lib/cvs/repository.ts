import type { CvDocument, EditorTemplateId } from "@/features/cv-editor/types";
import { calculateCvCompletion } from "@/lib/cvs/completion";
import { suggestCvTitle } from "@/lib/cvs/suggest-title";
import {
  buildDefaultSections,
  buildEmptyPersonalFromProfile,
  editorTemplateLabel,
  ensureDocumentSections,
  newEmptyDocument,
} from "@/lib/cvs/defaults";
import { cvErrorMessage } from "@/lib/cvs/errors";
import { remapDocumentIds } from "@/lib/cvs/ids";
import {
  assembleCvDocument,
  documentToPersistPayload,
  type CvDocumentParts,
} from "@/lib/cvs/mappers";
import type { TablesInsert } from "@/lib/database/types";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/types";

export type CvListItem = {
  id: string;
  title: string;
  templateKey: EditorTemplateId;
  templateName: string;
  score: number | null;
  completion: number | null;
  updatedAt: string;
  status: "draft" | "completed" | "archived";
  isDefault: boolean;
  targetRole: string | null;
};

type AuthContext = {
  supabase: SupabaseClient<Database>;
  user: User;
};

const EXTENDED_PERSONAL_COLUMNS = [
  "given_name",
  "family_name",
  "address",
  "post_code",
  "city",
  "drivers_license",
  "use_as_headline",
  "date_of_birth",
  "place_of_birth",
  "gender",
  "nationality",
  "civil_status",
  "custom_fields",
  "field_visibility",
] as const;

function isMissingPersonalColumnError(error: { message?: string; code?: string }): boolean {
  const message = error.message ?? "";
  return (
    /column .* does not exist/i.test(message) ||
    /Could not find the '.+' column/i.test(message) ||
    /schema cache/i.test(message) ||
    EXTENDED_PERSONAL_COLUMNS.some((column) => message.includes(column))
  );
}

function toLegacyPersonalPayload(
  personal: TablesInsert<"cv_personal_info">,
): TablesInsert<"cv_personal_info"> {
  return {
    cv_id: personal.cv_id,
    photo_url: personal.photo_url ?? null,
    full_name: personal.full_name ?? null,
    professional_title: personal.professional_title ?? null,
    email: personal.email ?? null,
    phone: personal.phone ?? null,
    location: personal.location ?? null,
    linkedin: personal.linkedin ?? null,
    portfolio: personal.portfolio ?? null,
    social_links: personal.social_links ?? [],
  };
}

async function requireAuthUser(): Promise<AuthContext> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(cvErrorMessage(error, "Not authenticated"));
  }
  if (!user) {
    throw new Error(cvErrorMessage(null, "Not authenticated"));
  }

  return { supabase, user };
}

function parseTemplateKey(value: string | null | undefined): EditorTemplateId {
  const allowed: EditorTemplateId[] = [
    "modern",
    "professional",
    "executive",
    "minimal",
    "creative",
  ];
  if (value && allowed.includes(value as EditorTemplateId)) {
    return value as EditorTemplateId;
  }
  return "modern";
}

function parseCvStatus(value: string): CvListItem["status"] {
  if (value === "completed" || value === "archived") return value;
  return "draft";
}

export async function loadCvParts(
  supabase: SupabaseClient<Database>,
  cvId: string,
): Promise<CvDocumentParts | null> {
  const { data: cv, error: cvError } = await supabase
    .from("cvs")
    .select("*")
    .eq("id", cvId)
    .maybeSingle();

  if (cvError) throw new Error(cvErrorMessage(cvError));
  if (!cv) return null;

  const [
    sectionsResult,
    personalResult,
    summaryResult,
    experiencesResult,
    educationsResult,
    skillsResult,
    projectsResult,
    certificationsResult,
    languagesResult,
    achievementsResult,
    referencesResult,
  ] = await Promise.all([
    supabase.from("cv_sections").select("*").eq("cv_id", cvId),
    supabase.from("cv_personal_info").select("*").eq("cv_id", cvId).maybeSingle(),
    supabase.from("cv_summaries").select("*").eq("cv_id", cvId).maybeSingle(),
    supabase.from("work_experiences").select("*").eq("cv_id", cvId),
    supabase.from("educations").select("*").eq("cv_id", cvId),
    supabase.from("skills").select("*").eq("cv_id", cvId),
    supabase.from("projects").select("*").eq("cv_id", cvId),
    supabase.from("certifications").select("*").eq("cv_id", cvId),
    supabase.from("languages").select("*").eq("cv_id", cvId),
    supabase.from("achievements").select("*").eq("cv_id", cvId),
    supabase.from("cv_references").select("*").eq("cv_id", cvId),
  ]);

  const firstError =
    sectionsResult.error ??
    personalResult.error ??
    summaryResult.error ??
    experiencesResult.error ??
    educationsResult.error ??
    skillsResult.error ??
    projectsResult.error ??
    certificationsResult.error ??
    languagesResult.error ??
    achievementsResult.error ??
    referencesResult.error;

  if (firstError) throw new Error(cvErrorMessage(firstError));

  const experienceIds = (experiencesResult.data ?? []).map((row) => row.id);
  let bullets: CvDocumentParts["bullets"] = [];

  if (experienceIds.length > 0) {
    const { data: bulletRows, error: bulletError } = await supabase
      .from("experience_bullets")
      .select("*")
      .in("experience_id", experienceIds);

    if (bulletError) throw new Error(cvErrorMessage(bulletError));
    bullets = bulletRows ?? [];
  }

  const educationIds = (educationsResult.data ?? []).map((row) => row.id);
  let subjects: CvDocumentParts["subjects"] = [];

  if (educationIds.length > 0) {
    const { data: subjectRows, error: subjectError } = await supabase
      .from("education_subjects")
      .select("*")
      .in("education_id", educationIds);

    if (subjectError) throw new Error(cvErrorMessage(subjectError));
    subjects = subjectRows ?? [];
  }

  return {
    cv,
    sections: sectionsResult.data ?? [],
    personal: personalResult.data,
    summary: summaryResult.data,
    experiences: experiencesResult.data ?? [],
    bullets,
    educations: educationsResult.data ?? [],
    subjects,
    skills: skillsResult.data ?? [],
    projects: projectsResult.data ?? [],
    certifications: certificationsResult.data ?? [],
    languages: languagesResult.data ?? [],
    achievements: achievementsResult.data ?? [],
    references: referencesResult.data ?? [],
  };
}

async function deleteCvChildren(
  supabase: SupabaseClient<Database>,
  cvId: string,
): Promise<void> {
  const tables = [
    "cv_sections",
    "work_experiences",
    "educations",
    "skills",
    "projects",
    "certifications",
    "languages",
    "achievements",
    "cv_references",
  ] as const;

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("cv_id", cvId);
    if (error) throw new Error(cvErrorMessage(error));
  }
}

async function upsertCvHeader(
  supabase: SupabaseClient<Database>,
  payload: ReturnType<typeof documentToPersistPayload>,
  options?: { includeCvRow?: boolean },
): Promise<void> {
  if (options?.includeCvRow) {
    const { error: cvError } = await supabase
      .from("cvs")
      .insert(payload.cvUpdate);
    if (cvError) throw new Error(cvErrorMessage(cvError, "We couldn't create your CV."));
  } else {
    const { id, user_id: _userId, ...updateFields } = payload.cvUpdate;
    const { error: cvError } = await supabase
      .from("cvs")
      .update(updateFields)
      .eq("id", id!);
    if (cvError) throw new Error(cvErrorMessage(cvError, "We couldn't save your CV."));
  }

  const { error: personalError } = await supabase
    .from("cv_personal_info")
    .upsert(payload.personal, { onConflict: "cv_id" });
  if (personalError) {
    // Migration 20260812160000 may not be applied yet — retry with legacy columns only.
    if (isMissingPersonalColumnError(personalError)) {
      const { error: legacyError } = await supabase
        .from("cv_personal_info")
        .upsert(toLegacyPersonalPayload(payload.personal), {
          onConflict: "cv_id",
        });
      if (legacyError) throw new Error(cvErrorMessage(legacyError));
    } else {
      throw new Error(cvErrorMessage(personalError));
    }
  }

  const { error: summaryError } = await supabase
    .from("cv_summaries")
    .upsert(payload.summary, { onConflict: "cv_id" });
  if (summaryError) throw new Error(cvErrorMessage(summaryError));
}

async function insertCvChildren(
  supabase: SupabaseClient<Database>,
  payload: ReturnType<typeof documentToPersistPayload>,
): Promise<void> {
  if (payload.sections.length > 0) {
    const { error } = await supabase.from("cv_sections").insert(payload.sections);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.experiences.length > 0) {
    const { error } = await supabase.from("work_experiences").insert(payload.experiences);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.bullets.length > 0) {
    const { error } = await supabase
      .from("experience_bullets")
      .insert(payload.bullets);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.educations.length > 0) {
    const { error } = await supabase.from("educations").insert(payload.educations);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.subjects.length > 0) {
    const { error } = await supabase
      .from("education_subjects")
      .insert(payload.subjects);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.skills.length > 0) {
    const { error } = await supabase.from("skills").insert(payload.skills);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.projects.length > 0) {
    const { error } = await supabase.from("projects").insert(payload.projects);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.certifications.length > 0) {
    const { error } = await supabase
      .from("certifications")
      .insert(payload.certifications);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.languages.length > 0) {
    const { error } = await supabase.from("languages").insert(payload.languages);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.achievements.length > 0) {
    const { error } = await supabase.from("achievements").insert(payload.achievements);
    if (error) throw new Error(cvErrorMessage(error));
  }
  if (payload.references.length > 0) {
    const { error } = await supabase.from("cv_references").insert(payload.references);
    if (error) throw new Error(cvErrorMessage(error));
  }
}

async function insertCvContent(
  supabase: SupabaseClient<Database>,
  payload: ReturnType<typeof documentToPersistPayload>,
  options?: { includeCvRow?: boolean },
): Promise<void> {
  await upsertCvHeader(supabase, payload, options);
  await insertCvChildren(supabase, payload);
}

async function createFromDocument(
  supabase: SupabaseClient<Database>,
  userId: string,
  doc: CvDocument,
  cvMeta?: Partial<TablesInsert<"cvs">>,
): Promise<string> {
  const remapped = ensureDocumentSections(remapDocumentIds(doc));
  const completion = calculateCvCompletion(remapped);
  const payload = documentToPersistPayload(remapped, userId, completion);

  payload.cvUpdate = {
    ...payload.cvUpdate,
    status: cvMeta?.status ?? "draft",
    is_default: cvMeta?.is_default ?? false,
    target_role: cvMeta?.target_role ?? null,
    target_industry: cvMeta?.target_industry ?? null,
    score: cvMeta?.score ?? null,
    language: cvMeta?.language ?? "en",
  };

  await insertCvContent(supabase, payload, { includeCvRow: true });
  return remapped.id;
}

export async function listUserCvs(options?: {
  includeArchived?: boolean;
}): Promise<CvListItem[]> {
  const { supabase, user } = await requireAuthUser();

  let query = supabase
    .from("cvs")
    .select(
      "id, title, template_key, score, completion, updated_at, status, is_default, target_role",
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (!options?.includeArchived) {
    query = query.neq("status", "archived");
  }

  const { data, error } = await query;
  if (error) throw new Error(cvErrorMessage(error));

  return (data ?? []).map((row) => {
    const templateKey = parseTemplateKey(row.template_key);
    return {
      id: row.id,
      title: row.title,
      templateKey,
      templateName: editorTemplateLabel(templateKey),
      score: row.score,
      completion: row.completion,
      updatedAt: row.updated_at,
      status: parseCvStatus(row.status),
      isDefault: row.is_default,
      targetRole: row.target_role,
    };
  });
}

export async function getCvWithContent(cvId: string): Promise<CvDocument> {
  const { supabase, user } = await requireAuthUser();
  const parts = await loadCvParts(supabase, cvId);

  if (!parts) {
    throw new Error(cvErrorMessage(null, "We couldn't find that CV."));
  }

  const assembled = assembleCvDocument(parts);
  // A failed save used to delete cv_sections before upserting personal info.
  // Heal empty rails so the editor/preview are usable again.
  if (assembled.sections.length > 0) {
    return assembled;
  }

  const healed = ensureDocumentSections(assembled);
  const payload = documentToPersistPayload(
    healed,
    user.id,
    calculateCvCompletion(healed),
  );
  if (payload.sections.length > 0) {
    const { error } = await supabase.from("cv_sections").insert(payload.sections);
    if (error) throw new Error(cvErrorMessage(error));
  }
  return healed;
}

export async function createCv(options?: {
  templateKey?: EditorTemplateId;
  targetRole?: string | null;
  targetIndustry?: string | null;
  title?: string;
}): Promise<{ id: string }> {
  const { supabase, user } = await requireAuthUser();

  const [{ data: profile, error: profileError }, { count, error: countError }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("cvs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

  if (profileError) throw new Error(cvErrorMessage(profileError));
  if (countError) throw new Error(cvErrorMessage(countError));

  const templateKey = options?.templateKey ?? "modern";
  const title =
    options?.title?.trim() ||
    suggestCvTitle({
      profile,
      email: user.email,
      targetRole: options?.targetRole,
      isGraduate:
        profile?.career_level === "graduate" ||
        profile?.career_level === "student",
    });

  const doc = newEmptyDocument({
    id: crypto.randomUUID(),
    title,
    templateId: templateKey,
    personal: buildEmptyPersonalFromProfile(profile, user.email),
    sections: buildDefaultSections(),
    summary: "",
  });

  if (options?.targetRole?.trim()) {
    doc.personal.title = doc.personal.title || options.targetRole.trim();
  }

  const id = await createFromDocument(supabase, user.id, doc, {
    is_default: (count ?? 0) === 0,
    template_key: templateKey,
    target_role: options?.targetRole?.trim() || null,
    target_industry: options?.targetIndustry?.trim() || null,
  });

  return { id };
}

export async function saveCvDocument(doc: CvDocument): Promise<CvDocument> {
  const { supabase, user } = await requireAuthUser();

  // Never persist an empty section rail — that blanks the editor on reload.
  const remapped = ensureDocumentSections(remapDocumentIds(doc));
  const completion = calculateCvCompletion(remapped);
  const payload = documentToPersistPayload(remapped, user.id, completion);

  // Upsert header first so a personal/summary failure cannot wipe children.
  await upsertCvHeader(supabase, payload);
  await deleteCvChildren(supabase, remapped.id);
  await insertCvChildren(supabase, payload);

  return remapped;
}

export async function deleteCv(cvId: string): Promise<void> {
  const { supabase } = await requireAuthUser();

  const { error } = await supabase.from("cvs").delete().eq("id", cvId);
  if (error) throw new Error(cvErrorMessage(error));
}

export async function duplicateCv(cvId: string): Promise<{ id: string }> {
  const { supabase, user } = await requireAuthUser();
  const parts = await loadCvParts(supabase, cvId);

  if (!parts) {
    throw new Error(cvErrorMessage(null, "We couldn't find that CV."));
  }

  const source = ensureDocumentSections(assembleCvDocument(parts));
  const clone = remapDocumentIds({
    ...source,
    id: crypto.randomUUID(),
    title: `${source.title} — Copy`,
    updatedAt: new Date().toISOString(),
  });

  const id = await createFromDocument(supabase, user.id, clone, {
    is_default: false,
    status: parts.cv.status,
    target_role: parts.cv.target_role,
  });

  return { id };
}

export async function duplicateCvAsTailored(
  cvId: string,
  options: {
    jobTitle: string;
    companyName?: string;
    jobDescription?: string;
  },
): Promise<{ id: string }> {
  const { supabase, user } = await requireAuthUser();
  const parts = await loadCvParts(supabase, cvId);

  if (!parts) {
    throw new Error(cvErrorMessage(null, "We couldn't find that CV."));
  }

  const source = ensureDocumentSections(assembleCvDocument(parts));
  const jobTitle = options.jobTitle.trim();
  const company = options.companyName?.trim();
  const tailoredTitle = company
    ? `${source.title.replace(/\s*—\s*Copy$/i, "")} — ${company}`
    : `${source.title.replace(/\s*—\s*Copy$/i, "")} — ${jobTitle}`;

  const clone = remapDocumentIds({
    ...source,
    id: crypto.randomUUID(),
    title: tailoredTitle,
    updatedAt: new Date().toISOString(),
  });

  const id = await createFromDocument(supabase, user.id, clone, {
    is_default: false,
    status: "draft",
    target_role: jobTitle || parts.cv.target_role,
    target_industry: parts.cv.target_industry,
  });

  return { id };
}

export async function setDefaultCv(cvId: string): Promise<void> {
  const { supabase, user } = await requireAuthUser();

  const { error: clearError } = await supabase
    .from("cvs")
    .update({ is_default: false })
    .eq("user_id", user.id)
    .eq("is_default", true);

  if (clearError) throw new Error(cvErrorMessage(clearError));

  const { error: setError } = await supabase
    .from("cvs")
    .update({ is_default: true })
    .eq("id", cvId);

  if (setError) throw new Error(cvErrorMessage(setError));
}

export async function archiveCv(cvId: string): Promise<void> {
  const { supabase } = await requireAuthUser();

  const { error } = await supabase
    .from("cvs")
    .update({ status: "archived", is_default: false })
    .eq("id", cvId);

  if (error) throw new Error(cvErrorMessage(error));
}

export async function unarchiveCv(cvId: string): Promise<void> {
  const { supabase } = await requireAuthUser();

  const { error } = await supabase
    .from("cvs")
    .update({ status: "draft" })
    .eq("id", cvId);

  if (error) throw new Error(cvErrorMessage(error));
}

export async function renameCv(cvId: string, title: string): Promise<void> {
  const { supabase } = await requireAuthUser();
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Please enter a CV title.");
  }

  const { error } = await supabase
    .from("cvs")
    .update({ title: trimmed, updated_at: new Date().toISOString() })
    .eq("id", cvId);

  if (error) throw new Error(cvErrorMessage(error));
}
