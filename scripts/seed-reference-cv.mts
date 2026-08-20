/**
 * One-off: seed kennedy-sithole reference fixture into a user's CV.
 * Usage: npx tsx --env-file=.env.local scripts/seed-reference-cv.mts [email]
 */
import { createClient } from "@supabase/supabase-js";
import { calculateCvCompletion } from "../src/lib/cvs/completion";
import { ensureDocumentSections } from "../src/lib/cvs/defaults";
import { remapDocumentIds } from "../src/lib/cvs/ids";
import { documentToPersistPayload } from "../src/lib/cvs/mappers";
import type { Database } from "../src/lib/database/types";
import { kennedySitholeReferenceFixture } from "../src/lib/templates/reference/kennedy-sithole.fixture";

const TARGET_EMAIL =
  process.argv[2]?.trim() ||
  kennedySitholeReferenceFixture.personal.email ||
  "kevykenny29@gmail.com";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const admin = createClient<Database>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listed, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  if (listError) throw listError;

  const user =
    listed.users.find(
      (u) => u.email?.toLowerCase() === TARGET_EMAIL.toLowerCase(),
    ) ??
    listed.users.find((u) =>
      (u.user_metadata?.full_name as string | undefined)
        ?.toLowerCase()
        .includes("kennedy"),
    );

  if (!user) {
    throw new Error(
      `No auth user found for ${TARGET_EMAIL}. Pass the signed-in email as argv.`,
    );
  }

  const { data: existingCvs, error: cvsError } = await admin
    .from("cvs")
    .select("id, is_default, title")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (cvsError) throw cvsError;

  const defaultCv =
    existingCvs?.find((c) => c.is_default) ?? existingCvs?.[0] ?? null;
  const cvId = defaultCv?.id ?? crypto.randomUUID();
  const isNew = !defaultCv;

  const remapped = ensureDocumentSections(
    remapDocumentIds({
      ...kennedySitholeReferenceFixture,
      id: cvId,
      title: "Software Engineer",
      templateId: "modern",
      templateSlug: "tpl_default",
      rendererKey: "tpl_default",
      updatedAt: new Date().toISOString(),
    }),
  );
  const completion = calculateCvCompletion(remapped);
  const payload = documentToPersistPayload(remapped, user.id, completion);
  payload.cvUpdate = {
    ...payload.cvUpdate,
    status: "draft",
    is_default: true,
    target_role: "Software Engineer",
    language: "en",
  };

  if (isNew) {
    const { error } = await admin.from("cvs").insert(payload.cvUpdate);
    if (error) throw error;
  } else {
    const { id, user_id: _uid, ...fields } = payload.cvUpdate;
    await admin
      .from("cvs")
      .update({ is_default: false })
      .eq("user_id", user.id)
      .eq("is_default", true);
    const { error } = await admin
      .from("cvs")
      .update({ ...fields, is_default: true })
      .eq("id", id!);
    if (error) throw error;

    for (const table of [
      "cv_sections",
      "work_experiences",
      "educations",
      "skills",
      "projects",
      "certifications",
      "languages",
      "achievements",
      "cv_references",
    ] as const) {
      const { error: delError } = await admin
        .from(table)
        .delete()
        .eq("cv_id", cvId);
      if (delError) throw delError;
    }
  }

  const { error: personalError } = await admin
    .from("cv_personal_info")
    .upsert(payload.personal, { onConflict: "cv_id" });
  if (personalError) throw personalError;

  const { error: summaryError } = await admin
    .from("cv_summaries")
    .upsert(payload.summary, { onConflict: "cv_id" });
  if (summaryError) throw summaryError;

  const inserts: Array<[string, unknown[]]> = [
    ["cv_sections", payload.sections],
    ["work_experiences", payload.experiences],
    ["experience_bullets", payload.bullets],
    ["educations", payload.educations],
    ["education_subjects", payload.subjects],
    ["skills", payload.skills],
    ["projects", payload.projects],
    ["certifications", payload.certifications],
    ["languages", payload.languages],
    ["achievements", payload.achievements],
    ["cv_references", payload.references],
  ];

  for (const [table, rows] of inserts) {
    if (!rows.length) continue;
    const { error } = await admin.from(table as "cv_sections").insert(rows as never);
    if (error) throw new Error(`${table}: ${error.message}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        userId: user.id,
        email: user.email,
        cvId,
        created: isNew,
        counts: {
          experience: remapped.experience.length,
          education: remapped.education.length,
          skills: remapped.skills.length,
          projects: remapped.projects.length,
          certifications: remapped.certifications.length,
          achievements: remapped.achievements.length,
          references: remapped.references.length,
        },
        completion,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
