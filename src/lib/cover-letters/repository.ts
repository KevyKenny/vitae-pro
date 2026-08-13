import type { CoverLetterDocument } from "@/features/cover-letter/types";
import type { EditorTemplateId } from "@/features/cv-editor/types";
import {
  buildCandidateFromProfile,
  buildDefaultTitle,
  buildEmptyBodyFromCandidate,
  letterTemplateLabel,
  newEmptyCoverLetterDocument,
  parseApplicationStatus,
  parseLetterTemplateKey,
  remapCoverLetterIds,
} from "@/lib/cover-letters/defaults";
import { coverLetterErrorMessage } from "@/lib/cover-letters/errors";
import {
  documentToRowUpdate,
  rowToCoverLetterDocument,
  type CoverLetterListItem,
  type CoverLetterListRow,
} from "@/lib/cover-letters/mappers";
import type { Database } from "@/lib/database/types";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient, User } from "@supabase/supabase-js";

type AuthContext = {
  supabase: SupabaseClient<Database>;
  user: User;
};

async function requireAuthUser(): Promise<AuthContext> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(coverLetterErrorMessage(error, "Not authenticated"));
  }
  if (!user) {
    throw new Error(coverLetterErrorMessage(null, "Not authenticated"));
  }

  return { supabase, user };
}

function parseLetterStatus(value: string): CoverLetterListItem["status"] {
  if (value === "completed" || value === "archived") return value;
  return "draft";
}

function mapListRow(
  row: CoverLetterListRow,
  cvTitles: Map<string, string>,
): CoverLetterListItem {
  const templateKey = parseLetterTemplateKey(row.template_key);
  return {
    id: row.id,
    title: row.title,
    company: row.company_name ?? "",
    role: row.job_title ?? "",
    cvId: row.cv_id,
    cvTitle: row.cv_id ? (cvTitles.get(row.cv_id) ?? null) : null,
    templateKey,
    templateName: letterTemplateLabel(templateKey),
    applicationStatus: parseApplicationStatus(row.application_status),
    status: parseLetterStatus(row.status),
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

async function resolveTemplateUuidByEditorStyle(
  supabase: SupabaseClient<Database>,
  editorStyle: EditorTemplateId,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("templates")
    .select("id")
    .eq("editor_style", editorStyle)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(coverLetterErrorMessage(error));
  return data?.id ?? null;
}

async function resolveDefaultTemplateKey(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<EditorTemplateId> {
  const { data: prefs, error: prefError } = await supabase
    .from("user_preferences")
    .select("default_template_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (prefError) throw new Error(coverLetterErrorMessage(prefError));

  if (!prefs?.default_template_id) {
    return "professional";
  }

  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("editor_style")
    .eq("id", prefs.default_template_id)
    .maybeSingle();

  if (templateError) throw new Error(coverLetterErrorMessage(templateError));

  const style = template?.editor_style;
  const allowed: EditorTemplateId[] = [
    "modern",
    "professional",
    "executive",
    "minimal",
    "creative",
  ];
  if (style && allowed.includes(style as EditorTemplateId)) {
    return style as EditorTemplateId;
  }
  return "professional";
}

async function loadCoverLetterRow(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const { data, error } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(coverLetterErrorMessage(error));
  return data;
}

export async function listUserCoverLetters(): Promise<CoverLetterListItem[]> {
  const { supabase, user } = await requireAuthUser();

  const { data, error } = await supabase
    .from("cover_letters")
    .select(
      "id, title, company_name, job_title, cv_id, template_key, application_status, status, updated_at, created_at",
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(coverLetterErrorMessage(error));

  const rows = (data ?? []) as CoverLetterListRow[];
  const cvIds = [...new Set(rows.map((row) => row.cv_id).filter(Boolean))] as string[];
  const cvTitles = new Map<string, string>();

  if (cvIds.length > 0) {
    const { data: cvs, error: cvError } = await supabase
      .from("cvs")
      .select("id, title")
      .in("id", cvIds);

    if (cvError) throw new Error(coverLetterErrorMessage(cvError));
    for (const cv of cvs ?? []) {
      cvTitles.set(cv.id, cv.title);
    }
  }

  return rows.map((row) => mapListRow(row, cvTitles));
}

export async function getCoverLetter(
  id: string,
): Promise<CoverLetterDocument & { cvId: string | null }> {
  const { supabase } = await requireAuthUser();
  const row = await loadCoverLetterRow(supabase, id);

  if (!row) {
    throw new Error(
      coverLetterErrorMessage(null, "We couldn't find that cover letter."),
    );
  }

  const doc = rowToCoverLetterDocument(row);
  return { ...doc, cvId: row.cv_id };
}

export async function createCoverLetter(options?: {
  cvId?: string;
  templateKey?: EditorTemplateId;
  title?: string;
}): Promise<{ id: string }> {
  const { supabase, user } = await requireAuthUser();

  const [{ data: profile, error: profileError }, templateKey] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      options?.templateKey
        ? Promise.resolve(options.templateKey)
        : resolveDefaultTemplateKey(supabase, user.id),
    ]);

  if (profileError) throw new Error(coverLetterErrorMessage(profileError));

  const candidate = buildCandidateFromProfile(profile, user.email);
  const body = buildEmptyBodyFromCandidate(candidate, user.email);
  const title =
    options?.title?.trim() ||
    buildDefaultTitle({
      professionalTitle: profile?.professional_title,
    });

  const doc = newEmptyCoverLetterDocument({
    id: crypto.randomUUID(),
    title,
    templateId: templateKey,
    candidate,
    body,
    cvId: options?.cvId ?? null,
  });

  const remapped = remapCoverLetterIds(doc);
  const templateId = await resolveTemplateUuidByEditorStyle(
    supabase,
    remapped.templateId,
  );
  const row = documentToRowUpdate(remapped, user.id, {
    cvId: options?.cvId ?? null,
    templateId,
    includeStatus: true,
  });

  const { error } = await supabase.from("cover_letters").insert(row);
  if (error) {
    throw new Error(
      coverLetterErrorMessage(error, "We couldn't create your cover letter."),
    );
  }

  return { id: remapped.id };
}

export async function saveCoverLetterDocument(
  doc: CoverLetterDocument,
  options?: { cvId?: string | null },
): Promise<CoverLetterDocument> {
  const { supabase, user } = await requireAuthUser();

  const remapped = remapCoverLetterIds(doc);
  const templateId = await resolveTemplateUuidByEditorStyle(
    supabase,
    remapped.templateId,
  );
  const row = documentToRowUpdate(remapped, user.id, {
    cvId: options?.cvId,
    templateId,
    includeStatus: false,
  });

  const { id: _id, user_id: _userId, status: _status, ...updateFields } = row;

  const { error } = await supabase
    .from("cover_letters")
    .update(updateFields)
    .eq("id", remapped.id);

  if (error) {
    throw new Error(
      coverLetterErrorMessage(error, "We couldn't save your cover letter."),
    );
  }

  return { ...remapped, cvId: row.cv_id ?? null };
}

export async function deleteCoverLetter(id: string): Promise<void> {
  const { supabase } = await requireAuthUser();

  const { error } = await supabase.from("cover_letters").delete().eq("id", id);
  if (error) throw new Error(coverLetterErrorMessage(error));
}

export async function duplicateCoverLetter(id: string): Promise<{ id: string }> {
  const { supabase, user } = await requireAuthUser();
  const row = await loadCoverLetterRow(supabase, id);

  if (!row) {
    throw new Error(
      coverLetterErrorMessage(null, "We couldn't find that cover letter."),
    );
  }

  const source = rowToCoverLetterDocument(row);
  const clone = remapCoverLetterIds({
    ...source,
    id: crypto.randomUUID(),
    title: `${source.title} — Copy`,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  const templateId = await resolveTemplateUuidByEditorStyle(
    supabase,
    clone.templateId,
  );
  const insertRow = documentToRowUpdate(clone, user.id, {
    cvId: row.cv_id,
    templateId,
    includeStatus: false,
  });
  insertRow.status = row.status;

  const { error } = await supabase.from("cover_letters").insert(insertRow);
  if (error) {
    throw new Error(
      coverLetterErrorMessage(error, "We couldn't duplicate that cover letter."),
    );
  }

  return { id: clone.id };
}

export async function renameCoverLetter(
  id: string,
  title: string,
): Promise<void> {
  const { supabase } = await requireAuthUser();
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Please enter a cover letter title.");
  }

  const { error } = await supabase
    .from("cover_letters")
    .update({ title: trimmed, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(coverLetterErrorMessage(error));
}

export async function associateCoverLetterWithCv(
  letterId: string,
  cvId: string | null,
): Promise<void> {
  const { supabase } = await requireAuthUser();

  const { error } = await supabase
    .from("cover_letters")
    .update({ cv_id: cvId, updated_at: new Date().toISOString() })
    .eq("id", letterId);

  if (error) throw new Error(coverLetterErrorMessage(error));
}

export type { CoverLetterListItem };
