import type { EditorTemplateId } from "@/features/cv-editor/types";
import type {
  GalleryTemplate,
  SavedTemplateEntry,
  TemplateCustomization,
} from "@/features/templates/types";
import type { Database } from "@/lib/database/types";
import { createClient } from "@/lib/supabase/client";
import { templateErrorMessage } from "@/lib/templates/errors";
import {
  customizationToJson,
  parseEditorStyle,
  parseTemplateCustomization,
  rowToGalleryTemplate,
  rowToSavedTemplateEntry,
} from "@/lib/templates/mappers";
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
    throw new Error(templateErrorMessage(error, "Not authenticated"));
  }
  if (!user) {
    throw new Error(templateErrorMessage(null, "Not authenticated"));
  }

  return { supabase, user };
}

async function fetchTemplateBySlugOrUuid(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  const bySlug = await supabase
    .from("templates")
    .select("*")
    .eq("slug", id)
    .eq("is_active", true)
    .maybeSingle();

  if (bySlug.error) throw new Error(templateErrorMessage(bySlug.error));
  if (bySlug.data) return bySlug.data;

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(id)) return null;

  const byId = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (byId.error) throw new Error(templateErrorMessage(byId.error));
  return byId.data;
}

export async function listActiveTemplates(): Promise<GalleryTemplate[]> {
  const { supabase } = await requireAuthUser();

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(templateErrorMessage(error));

  return (data ?? []).map(rowToGalleryTemplate);
}

export async function getTemplateBySlugOrId(
  id: string,
): Promise<GalleryTemplate | null> {
  const { supabase } = await requireAuthUser();
  const row = await fetchTemplateBySlugOrUuid(supabase, id);
  return row ? rowToGalleryTemplate(row) : null;
}

export async function getTemplateDbIdBySlug(
  slug: string,
): Promise<string | null> {
  const { supabase } = await requireAuthUser();

  const { data, error } = await supabase
    .from("templates")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(templateErrorMessage(error));
  return data?.id ?? null;
}

export async function resolveEditorStyle(
  templateIdOrSlug: string,
): Promise<EditorTemplateId> {
  const { supabase } = await requireAuthUser();
  const row = await fetchTemplateBySlugOrUuid(supabase, templateIdOrSlug);
  return parseEditorStyle(row?.editor_style);
}

export async function listUserCustomizations(): Promise<SavedTemplateEntry[]> {
  const { supabase, user } = await requireAuthUser();

  const { data, error } = await supabase
    .from("user_template_customizations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(templateErrorMessage(error));

  return (data ?? []).map(rowToSavedTemplateEntry);
}

export async function saveTemplateCustomization(input: {
  templateSlug: string;
  templateId?: string | null;
  name?: string;
  customization: TemplateCustomization;
}): Promise<void> {
  const { supabase, user } = await requireAuthUser();

  const resolvedTemplateId =
    input.templateId ??
    (await getTemplateDbIdBySlug(input.templateSlug));

  const { error } = await supabase.from("user_template_customizations").upsert(
    {
      user_id: user.id,
      template_slug: input.templateSlug,
      template_id: resolvedTemplateId,
      name: input.name?.trim() || "Saved customization",
      customization: customizationToJson(input.customization),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,template_slug" },
  );

  if (error) throw new Error(templateErrorMessage(error));
}

export async function getTemplateCustomization(
  templateSlug: string,
): Promise<TemplateCustomization | null> {
  const { supabase, user } = await requireAuthUser();

  const { data, error } = await supabase
    .from("user_template_customizations")
    .select("customization")
    .eq("user_id", user.id)
    .eq("template_slug", templateSlug)
    .maybeSingle();

  if (error) throw new Error(templateErrorMessage(error));
  if (!data) return null;

  return parseTemplateCustomization(data.customization, templateSlug);
}

/** Resolve saved customization using gallery slug (from cvs.template_id) then editor style key. */
export async function resolveCvTemplateCustomization(
  cvId: string,
  templateStyleKey: string,
): Promise<TemplateCustomization | null> {
  const { supabase, user } = await requireAuthUser();

  const { data: cvRow, error: cvError } = await supabase
    .from("cvs")
    .select("template_id")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (cvError) throw new Error(templateErrorMessage(cvError));

  if (cvRow?.template_id) {
    const { data: templateRow, error: templateError } = await supabase
      .from("templates")
      .select("slug")
      .eq("id", cvRow.template_id)
      .maybeSingle();

    if (templateError) throw new Error(templateErrorMessage(templateError));
    if (templateRow?.slug) {
      const bySlug = await getTemplateCustomization(templateRow.slug);
      if (bySlug) return bySlug;
    }
  }

  return getTemplateCustomization(templateStyleKey);
}

export async function setUserDefaultTemplate(
  templateUuid: string,
): Promise<void> {
  const { supabase, user } = await requireAuthUser();

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      default_template_id: templateUuid,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw new Error(templateErrorMessage(error));
}

export async function getUserDefaultTemplateId(): Promise<string | null> {
  const { supabase, user } = await requireAuthUser();

  const { data, error } = await supabase
    .from("user_preferences")
    .select("default_template_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(templateErrorMessage(error));
  return data?.default_template_id ?? null;
}

export async function applyGalleryTemplateToCv(
  cvId: string,
  templateSlug: string,
): Promise<void> {
  const { supabase } = await requireAuthUser();

  const row = await fetchTemplateBySlugOrUuid(supabase, templateSlug);
  if (!row) {
    throw new Error(templateErrorMessage(null, "We couldn't find that template."));
  }

  const rendererKey =
    typeof row.metadata === "object" &&
    row.metadata !== null &&
    !Array.isArray(row.metadata) &&
    typeof (row.metadata as Record<string, unknown>).renderer_key === "string"
      ? String((row.metadata as Record<string, unknown>).renderer_key)
      : row.slug;

  const { error } = await supabase
    .from("cvs")
    .update({
      template_id: row.id,
      template_key: rendererKey,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cvId);

  if (error) throw new Error(templateErrorMessage(error));
}
